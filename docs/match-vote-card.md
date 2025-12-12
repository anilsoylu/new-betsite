# Incognito vote spam bypass fix (Cloudflare + Nginx + SQLite) — Master Plan

### Amaç (1 cümle)

Gizli sekmeden sınırsız oy spam’ini, **hCaptcha kullanmadan**, Cloudflare+Nginx arkasında **doğru gerçek IP tespiti + fixture başına IP limiti + sağlam rate-limit** ile kesin olarak engellemek.

---

## 1) Problem özeti (neden oluyor?)

- **Cookie tabanlı `voter_id`** gizli sekmede resetlenir → saldırgan her gizli sekmede yeni `voter_id` alıp “ilk oy”u tekrar atar.
- **Fingerprint** gizli modda boş/kararsız olabilir → tek başına güvenilemez.
- Cloudflare arkasında **yanlış IP okunuyorsa** (edge IP / proxy chain) IP bazlı rate-limit etkisiz kalır.

Bu yüzden çözümün “çekirdeği”: **IP bazlı enforcement** (özellikle “fixture başına IP limiti”). Cookie+localStorage sadece UX’dir.

---

## 2) Hedef davranış (Acceptance Criteria)

- Aynı IP’den aynı fixture için:
  - Normal sekme + gizli sekme + farklı `voter_id` ile toplam **en fazla N oy** (öneri: **5**) kabul.
  - N+1 denemede API **429** döner.
- `CF-Connecting-IP`/`X-Forwarded-For` zinciri doğru ise, rate-limit Cloudflare arkasında stabil çalışır.
- Kickoff sonrası oy **kapalı** (403).
- Kullanıcı oy değişikliği limiti: **toplam 3 değişiklik** + **10 sn cooldown** (zaten var).
- Performans:
  - Yüzdeler `match_vote_totals` üzerinden O(1) okunur.
  - POST tek transaction ve O(1) upsert’ler.

---

## 3) Kodda mevcut yerler (repo referansı)

- API: [`src/app/api/fixtures/[id]/votes/route.ts`](/Users/anil/Documents/github/new-betsite/src/app/api/fixtures/[id]/votes/route.ts)
- DB schema: [`src/lib/vote-db/connection.ts`](/Users/anil/Documents/github/new-betsite/src/lib/vote-db/connection.ts)
- Rate-limit + submitVote: [`src/lib/vote-db/queries.ts`](/Users/anil/Documents/github/new-betsite/src/lib/vote-db/queries.ts)
- Client: [`src/components/match-detail/match-vote-card.tsx`](/Users/anil/Documents/github/new-betsite/src/components/match-detail/match-vote-card.tsx)

---

## 4) Çözüm mimarisi (katmanlar)

### Katman A — Gerçek IP tespiti (kritik)

Dosya: `src/app/api/fixtures/[id]/votes/route.ts`

**Mevcut:**

- `getClientIp()` şu an `cf-connecting-ip > x-real-ip > x-forwarded-for`.

**Sorun:**

- Nginx `X-Real-IP`’yi çoğu zaman Cloudflare edge IP olarak set edebilir.
- Bu durumda `X-Real-IP` yanlış tercih edilip gerçek client IP kaçırılabilir.

**Yapılacak:**

- `getClientIp()` önceliğini değiştir:
  1. `cf-connecting-ip`
  2. `x-forwarded-for` **ilk IP**
  3. `true-client-ip` (varsa)
  4. `x-real-ip` (en sonda)
  5. fallback: `unknown`

**Not:** `x-forwarded-for` formatı `client, proxy1, proxy2` olabilir; **ilk** olan client’tır.

### Katman B — Fixture başına IP limiti (kesin bypass fix)

Amaç: cookie/fingerprint bypass edilse bile **tek IP aynı maça sınırsız oy atamasın**.

**Yeni tablo:** `fixture_ip_votes`

- `fixture_id INTEGER NOT NULL`
- `ip TEXT NOT NULL`
- `vote_count INTEGER NOT NULL DEFAULT 1`
- `updated_at INTEGER NOT NULL`
- `PRIMARY KEY (fixture_id, ip)`

**Limit önerisi:** `MAX_VOTES_PER_IP_PER_FIXTURE = 5`

**Enforcement yeri:** POST handler içinde, oy DB transaction’ına girmeden önce veya transaction’ın başında:

- `(fixture_id, ip)` satırını oku
- `vote_count >= 5` ise `429`
- değilse `vote_count + 1` upsert

**Not (iş mantığı):** Bu sayaç “vote attempt” sayacı gibi davranır. İstersen sadece “başarılı vote insert/change” durumunda increment et.

### Katman C — IP-only rate limit bugfix

Dosya: `src/lib/vote-db/queries.ts`

**Mevcut:**

- `checkRateLimit()` iki katmanlı: IP-only SUM + IP+FP row.
- Strict limitler tanımlı (`unknownFiveMinute`, `unknownDaily`) ama IP-only compare kısmında her zaman `RATE_LIMITS.fiveMinute.max` / `RATE_LIMITS.daily.max` kullanılıyor.

**Yapılacak:**

- IP-only compare:
  - `useStrictLimits` true ise **strict max** kullan.
  - false ise normal max.

Böylece fingerprint boş (gizli mod) olsa bile IP-only katman gerçekten “strict” olur.

### Katman D — Observability (debugging)

Hedef: Cloudflare+Nginx zincirini sahada doğrulamak.

- Rate-limit veya fixture-ip-limit tetiklenince log’a (maskeli) yaz:
  - `cf-connecting-ip`, `x-forwarded-for`, `x-real-ip`, `user-agent`, `fixtureId`
- Masking: IP’yi tam basma; örn `212.253.xxx.xxx` gibi.

---

## 5) Nginx + Cloudflare kontrol listesi (kod dışı ama şart)

Senin dokümanda Nginx’de header’lar eklenmiş.

**Minimum hedef:**

- Next.js tarafında `cf-connecting-ip` header gerçekten dolu gelsin.

**Önerilen Nginx iyileştirmesi:**

- `proxy_set_header X-Real-IP $http_cf_connecting_ip;` (edge IP yerine gerçek client IP)

**Daha doğru yöntem (opsiyonel):**

- `real_ip_header CF-Connecting-IP;`
- `set_real_ip_from <Cloudflare IP ranges>` (Cloudflare’in güncel IP listesi)

Bu opsiyonel ama en sağlam yöntemdir.

---

## 6) Test Planı (mid-level için adım adım)

### A) DB kontrol

- `sqlite3 data/match-votes.sqlite ".schema"` ile yeni tablo oluşmuş mu bak.

### B) IP doğrulama

- API loglarında bir vote denemesinde:
  - `cf-connecting-ip` gerçek client IP mi?
  - `x-forwarded-for` zinciri doğru mu?

### C) Incognito spam testi

- Aynı cihaz/IP’den:
  1. Normal sekmeden 3 oy dene
  2. Gizli sekmeden 10 oy dene
- Beklenen:
  - 5’ten sonra `429`
  - DB’de `fixture_ip_votes.vote_count` artmış olmalı

### D) Regression

- Kickoff sonrası: `403 VOTING_CLOSED`
- Change limit: 3 değişiklik sonrası `403 MAX_CHANGES`
- Cooldown: 10s içinde change → `429 COOLDOWN`

---

## 7) Kapsam dışı / bilinçli trade-off

- Aynı IP’yi paylaşan gerçek kullanıcılar (kafe/okul) aynı maçta limit’e takılabilir. Bu istenmiyorsa:
  - Limit’i yükselt veya
  - `fixture_ip_votes` yalnızca “yeni voter_id” denemelerinde artacak şekilde tasarla.

---

## 8) Uygulama adımları (dosya bazlı görev listesi)

Aşağıdaki adımlar **sıralı** uygulanmalı. Her adımın sonunda bir “Verify” kontrolü var.

### 8.1 Gerçek IP çıkarımı (Cloudflare + Nginx)

Dosya: [`src/app/api/fixtures/[id]/votes/route.ts`](/Users/anil/Documents/github/new-betsite/src/app/api/fixtures/[id]/votes/route.ts)

- **Hedef**: Cloudflare arkasında gerçek client IP’yi tutarlı şekilde yakalamak.
- **Yapılacak**: `getClientIp()` fonksiyonunu şu öncelikle düzenle:
  1. `cf-connecting-ip`
  2. `x-forwarded-for` → `split(',')[0].trim()`
  3. `true-client-ip`
  4. `x-real-ip`
  5. `"unknown"`

**Verify**

- Üretimde (veya stage’de) aynı kullanıcıdan 2-3 oy denemesinde `ip` stabil mi?

### 8.2 `fixture_ip_votes` tablosu (incognito bypass’ı kesin kesen katman)

Dosya: [`src/lib/vote-db/connection.ts`](/Users/anil/Documents/github/new-betsite/src/lib/vote-db/connection.ts)

- `initializeSchema(database)` içine şu tabloyu ekle:
  - `fixture_id INTEGER NOT NULL`
  - `ip TEXT NOT NULL`
  - `vote_count INTEGER NOT NULL DEFAULT 1`
  - `updated_at INTEGER NOT NULL`
  - `PRIMARY KEY (fixture_id, ip)`

**Verify**

- `sqlite3 data/match-votes.sqlite ".schema fixture_ip_votes"` ile tablo görünüyor mu?

### 8.3 Fixture/IP limit query helper

Dosya: [`src/lib/vote-db/queries.ts`](/Users/anil/Documents/github/new-betsite/src/lib/vote-db/queries.ts)

- Config ekle:
  - `const MAX_VOTES_PER_IP_PER_FIXTURE = 5;`

- Yeni fonksiyon ekle:
  - `checkAndIncrementFixtureIpLimit(fixtureId: number, ip: string): void`

**Önerilen SQL akışı (tek upsert + tek select)**

1. `SELECT vote_count FROM fixture_ip_votes WHERE fixture_id=? AND ip=?`
2. Eğer `vote_count >= MAX` → `throw new AppError("Too many votes from this IP for this match", "FIXTURE_IP_LIMIT", 429)`
3. Aksi halde upsert:
   - `INSERT ... ON CONFLICT(fixture_id, ip) DO UPDATE SET vote_count=vote_count+1, updated_at=?`

**Verify**

- Aynı IP ile aynı maça 6. POST denemesinde 429 geliyor mu?

### 8.4 POST akışında enforcement sırası (performans odaklı)

Dosya: [`src/app/api/fixtures/[id]/votes/route.ts`](/Users/anil/Documents/github/new-betsite/src/app/api/fixtures/[id]/votes/route.ts)

**Sıra (öneri):**

1. `fixtureId` parse
2. body parse (`choice`)
3. `ip = getClientIp(request)`
4. kickoff/status kontrolü (erken fail)
5. `checkRateLimit(ip, fingerprint)`
6. `checkAndIncrementFixtureIpLimit(fixtureId, ip)`
7. cookie’den `voterId`
8. `submitVote(...)`
9. `incrementRateLimit(ip, fingerprint)`

**Not (attempt vs success):**

- Daha sert koruma için 6. adım “attempt” sayabilir.
- Daha adil yaklaşım için 6. adımı `submitVote` başarılı olduktan sonra çağır.

**Verify**

- Gizli sekmede cookie sıfırlansa bile aynı IP’den limit aşılıyor mu (429)?

### 8.5 `checkRateLimit()` bugfix (IP-only strict compare)

Dosya: [`src/lib/vote-db/queries.ts`](/Users/anil/Documents/github/new-betsite/src/lib/vote-db/queries.ts)

- `checkRateLimit()` içinde IP-only kıyaslamalarında:
  - `useStrictLimits` true iken **strict limitler** kullanılmalı.
  - Şu an IP-only compare’ın yanlışlıkla her zaman normal limite baktığını düzelt.

**Verify**

- Fingerprint boşken (incognito) 5 dk içinde strict limiti aşınca 429 geliyor mu?

### 8.6 Maskeli debug logging

Dosya: [`src/app/api/fixtures/[id]/votes/route.ts`](/Users/anil/Documents/github/new-betsite/src/app/api/fixtures/[id]/votes/route.ts)

- Limit tetiklenince `logError` metadata’sına ekle (maskeli):
  - `cf-connecting-ip`, `x-forwarded-for`, `x-real-ip`, `user-agent`, `fixtureId`

**Verify**

- Log’larda tam IP/PII sızıntısı yok mu?

### 8.7 Dokümantasyon (mid-level için “tek kaynak”)

Dosya: [`docs/vote-rate-limit-issue.md`](/Users/anil/Documents/github/new-betsite/docs/vote-rate-limit-issue.md)

- “Son çözüm” bölümünü güncelle:
  - IP çıkarım önceliği
  - `fixture_ip_votes` tablosu + limit
  - Test adımları
  - Nginx önerisi: `X-Real-IP`’yi `CF-Connecting-IP` ile set etme opsiyonu
