# Smart Cache + Performans İyileştirme Planı (Next.js 16 / React 19)

## Mevcut durum (incelemeden çıkan net resim)

- **2 katman cache var**:
- **Next.js fetch cache (TTL/revalidate)**: `src/lib/api/sportmonks-client.ts` tüm SportMonks çağrılarını `next: { revalidate }` ile cache’liyor.
- **Kalıcı SQLite sitemap cache**: `src/lib/sitemap-cache/*` (better-sqlite3 + WAL). Sitemaps sadece SQLite’tan okuyor (`src/app/sitemap.xml/route.ts` ve `src/app/sitemaps/*`).
- **Organik dolum**: Sayfalar `src/lib/api/cached-football-api.ts` üzerinden çağırınca, dönen entity’ler fire-and-forget şekilde SQLite’a yazılıyor.
- **Sync script**: `scripts/sync-sitemap-cache.ts` lig/takım/oyuncu/maç sync ediyor; fakat **coaches** sync’i yok (schema’da tablo var ama script’te yok).

## En kritik performans/risk noktaları (şu anki koda göre)

1. **SQLite write path pahalı**: `cacheFixtures()` gibi fonksiyonlar tek tek upsert yapıyor ve her çağrıda `db.prepare()` çalışıyor (`src/lib/sitemap-cache/hooks.ts` + `upsert.ts`). Trafik artınca CPU + DB contention yaratır.
2. **Schema init gereksiz tekrarlanıyor**: Sitemaps route’larında her request’te `initializeSchema()` çağrılıyor (`src/app/sitemaps/*`).
3. **“none = no-store” semantiği riskli**: `sportmonks-client.ts` dokümanda “0 = no-store” diyor ama implementasyon sadece `revalidate: 0` set ediyor. Bu Next sürümlerinde beklenmedik cache davranışı yaratabilir.
4. **/coaches sayfası çok ağır**: `src/app/coaches/page.tsx` her render’da 16 adet `getTeamById()` çağırıyor (team detail includes çok büyük). Cache olsa bile TTFB ve SportMonks bütçesini gereksiz harcar.

---

## Faz 0 — Görünürlük (1–2 saat)

Amaç: “Ne kadar çağrı yapıyoruz, neresi pahalı?” sorusunu sayılarla görmek.

- `src/lib/api/sportmonks-client.ts`
- **Her request’i** (endpoint, duration, status) tek formatta loglayan küçük bir helper’a taşı.
- Opsiyonel: endpoint bazlı basit sayaç (process içi) + periyodik özet log.
- `scripts/sync-sitemap-cache.ts`
- Kaç sayfa, kaç kayıt, kaç istek yaptığını net raporla (zaten kısmen var).

## Faz 1 — Cache doğruluğu ve rate-limit güvenliği (yarım gün)

- `src/lib/api/sportmonks-client.ts`
- **cache=none** durumunda `cache: "no-store"` kullan (ve `next.revalidate`’ı set etme) — böylece “gerçek dynamic” garanti olur.
- **429 için retry davranışı**: `Retry-After` header varsa onu oku, yoksa exponential backoff uygula; 429’da 3 kez hızlı retry yapıp quota yakma.
- `src/lib/api/cached-football-api.ts`
- Organik sitemap cache dolumu için, **page component’lerin** mümkün olduğunca burayı import etmesini standartlaştır.
- Tespit: `src/app/coaches/page.tsx` şu an `football-api` import ediyor (SQLite cache’i beslemiyor).

## Faz 2 — SQLite sitemap cache write optimizasyonu (yarım gün – 1 gün)

Amaç: Aynı trafiği çok daha az CPU/DB maliyetiyle cache’e yazmak.

- `src/lib/sitemap-cache/upsert.ts`
- **Prepared statement’ları module-scope** olarak cache’le (her call’da `prepare` etme).
- Tekli upsert fonksiyonlarını koru ama “hot path” için batch/transaction kullanımını artır.
- `src/lib/sitemap-cache/hooks.ts`
- `cacheFixtures(fixtures)` içinde:
  - Match’leri `upsertMatchesBatch()` ile **tek transaction**.
  - Team’leri `upsertTeamsBatch()` ile **tek transaction**.
  - (İhtiyaç varsa) oyuncu/coach batch.
- `src/lib/sitemap-cache/schema.ts`
- `initializeSchema()` için cached “once” mekanizması (process içinde bir kez). Sitemaps route’ları `ensureSchema()` gibi hafif bir wrapper kullansın.

## Faz 3 — Sitemap route’ları daha hızlı/sağlam (2–4 saat)

- `src/app/sitemap.xml/route.ts` ve `src/app/sitemaps/*`
- Schema init’i “once”e geçir (Faz 2).
- XML üretiminde `lastmod` parsing hatalarını güvenli yönet (şu an `new Date(lastModified)` her zaman güvenli değil).
- Cache header’ları zaten iyi; sadece hatada dönen XML’lerin de tutarlı olmasını sağla.

## Faz 4 — Coaches stratejisi (en yüksek kazanç) (1 gün)

Amaç: `/coaches` sayfasını SportMonks’a bağımlı olmaktan çıkarıp, hem hızlı hem ucuz hale getirmek.

- **A) En pratik yaklaşım (önerilen)**: `/coaches` sayfasını SQLite cache’ten besle.
- `src/app/coaches/page.tsx` → SportMonks çağırmak yerine `src/lib/sitemap-cache/queries.ts` benzeri bir query ile coach listesi çek.
- İlk dolum için sync script kullanılacak.
- **B) Sync script’e coaches ekle**:
- `scripts/sync-sitemap-cache.ts`:
  - Entity listesine `coaches` ekle.
  - Endpoint: `/coaches` (docs: `docs/sportmonks/endpoints/coaches/get-all-coaches.md`).
  - `upsertCoachesBatch()` ekle/kullan (şu an `upsert.ts` içinde batch var).
  - `package.json` scripts’e `sync:coaches` ekle.

## Faz 5 — “Smart cache” seviyesini yükseltme (opsiyonel ama değerli) (1–2 gün)

- **Cache tag yaklaşımı** (Next tarafı):
- Entity bazlı tag’ler tasarla (örn. `team:123`, `player:456`, `league:8`, `fixture:999`).
- Admin/sync tetikleyince `revalidateTag()` ile seçici invalidation.
- **Sync durumunu kalıcı yap**:
- Schema’da olan `sync_status` tablosunu gerçekten kullan:
  - Son page, last_sync_at, requests_this_hour gibi alanlarla “resume” destekle.

## Faz 6 — Sayfa bazlı “ağır endpoint” temizliği (devamlı iyileştirme)

- `src/lib/api/football-api.ts`
- List sayfaları için minimal include setleri (ağır detail include’lar sadece detay sayfalarında).
- Çok büyük response’larda (player/team detail) gerçekten kullanılmayan include’ları temizle.
- UI tarafı: gereksiz `"use client"` azaltma, büyük listelerde render optimizasyonu (bu fazı istersek ayrı ele alırız).

---

## Uygulama sırası (en basit anlatımla)

1. Ölç → 2) Cache doğruluğunu düzelt → 3) SQLite yazmayı ucuzlat → 4) Coaches sayfasını cache’e bağla → 5) Sync’e coaches ekle → 6) Tag/resume gibi “smart” özellikleri ekle.

## Dokunacağımız ana dosyalar

- SportMonks client: `src/lib/api/sportmonks-client.ts`
- Domain API: `src/lib/api/football-api.ts`, `src/lib/api/cached-football-api.ts`
- SQLite cache: `src/lib/sitemap-cache/{connection.ts,schema.ts,queries.ts,upsert.ts,hooks.ts}`
- Sitemaps: `src/app/sitemap.xml/route.ts`, `src/app/sitemaps/*`
- Sync: `scripts/sync-sitemap-cache.ts`, `package.json`
- Coaches page: `src/app/coaches/page.tsx`
