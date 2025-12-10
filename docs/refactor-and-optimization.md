## Betsite için Kapsamlı Optimizasyon ve Refactor Planı

### 1. Genel Mimari Değerlendirme ve Hedefler

- **Mevcut Durum Özeti**
- **Next.js 16 + React 19 + React Compiler** kullanılıyor (`next.config.ts`), server component ağırlıklı bir yapı var.
- Domain bazlı klasörleme mevcut: `app` altında `matches`, `players`, `teams`, `leagues`; `components` altında feature bazlı alt klasörler; veri katmanı `lib/api` (`football-api`, `sportmonks-client`, `sportmonks-mappers`).
- UI kit `components/ui` ile merkezi; Contentful ve Sportmonks için ayrı client/queries katmanı var.
- **Ana Hedefler**
- **Performans**: Server-side data fetching’i ve caching’i optimize etmek, client JS yükünü azaltmak, tekrarlı render ve network çağrılarını düşürmek.
- **Clean Code & Pattern**: DRY, KISS, YAGNI ilkelerine göre tekrar eden UI ve iş mantığını ortaklaştırmak, tipleri ve fonksiyon imzalarını sadeleştirmek.
- **Güvenlik & Kalite**: Tüm girişleri Zod ile doğrulamak, API katmanında sağlam error handling ve loglama, dependency injection ile test edilebilirlik.

### 2. Katmanlı Mimari ve Modülerlik Refactor’u

- **Katman Tanımı (Domain-Driven yaklaşım)**
- **Presentation (UI)**: `app/*` route’ları ve `components/*` (yalnızca UI + hafif view-logic).
- **Application/Service Layer**: `lib/api/football-api.ts`, `lib/queries.ts`, `lib/contentful/queries.ts` – domain odaklı fonksiyonlar (`getPlayerById`, `getLeaguePageData`, `getHomePageData` vb.).
- **Infrastructure**: `lib/api/sportmonks-client.ts`, `lib/contentful/client.ts`, `lib/env.ts` – HTTP client, auth headers, env yönetimi, logging.
- **Yapısal İyileştirmeler**
- **Service fonksiyonlarını netleştir**: `football-api.ts` içinde
  - Her Sportmonks endpoint’i için küçük, odaklı fonksiyonlar + bunları birleştiren composer fonksiyonlar (ör. `getLeagueStatsData`, `getLeaguePageData`).
  - Tüm public fonksiyonlarda input tiplerini **Zod schema** ile doğrulayıp TypeScript tipi ile senkron tut.
- **Route’ları zayıf bağlı yap**:
  - `app/api/*/route.ts` dosyaları yalnızca query/path params okuyup, ilgili service fonksiyonunu çağıran **ince controller** gibi kalsın.
  - Örn. `[...]/players/search/route.ts `şu an direkt `searchPlayers` çağırıyor; buraya `z.object({ q: z.string().min(2) })` ile schema eklenip validasyon service’e girmeden önce yapılabilir.
- **Env & Config tek kaynaktan**: `lib/env.ts` + `lib/constants.ts` zaten var; Sportmonks base URL’leri vs. `constants` üzerinden kullanılıyor, plan: yeni endpoint/config eklemeleri **sadece config katmanında** tanımlansın.

### 3. Veritabanı / API Erişim ve N+1 Önleme Stratejisi

- **Sportmonks Client İyileştirmeleri** (`lib/api/sportmonks-client.ts`)
- `sportmonksRequest` ve `sportmonksPaginatedRequest` üzerine
  - **Ortak retry ve rate-limit aware** wrapper ekle (ör. 429 için exponential backoff planı).
  - `revalidate` alanının daha sistematik kullanımı: single source of truth olacak `CACHE_PROFILES` (örn. `live`, `short`, `long`) objesi tanımla ve tüm çağrılarda buradan kullan.
- **Logging & Metrics**: Zaten `performance.now()` ile süre ölçümü var; plan:
  - Tek bir `logSportmonksError(config, duration, errorBody)` helper’ı ile hem request hem paginated fonksiyonlarda tekrar eden log kodunu ortadan kaldır.
- **N+1 ve Batch Stratejisi**
- League/team/player sayfalarında aynı endpoint’e tekrar tekrar giden çağrıları `football-api` seviyesinde birleştir:
  - Örn. bir sayfa birden fazla takım/fixture’i ID listesi ile istiyorsa, tek bir `filters=id:1,2,3` gibi request ile çöz.
- `getLeaguePageData`, `getMatchDetailData` gibi composer fonksiyonlarda **Promise.all** kullanımı zaten var; tüm yeni/var olan multi-call fonksiyonlarda da standart hale getir.

### 4. Server-Side Data Fetching, Caching ve Next.js 16 Özellikleri

- **Data Fetching Konsolidasyonu**
- `app/page.tsx`, `app/matches/[slug]/page.tsx`, `app/players/[slug]/page.tsx`, `app/leagues/[slug]/*/page.tsx` gibi route’larda
  - Tüm data fetching’i `lib/queries.ts` veya `lib/api/football-api.ts` fonksiyonlarına taşı (route içi raw fetch/iş mantarı kalmasın).
- **Cache Components / React 19 uyumu**: Şu an `reactCompiler: true` açık; plan:
  - Orta vadede Next’in Cache Components moduna geçiş için data yükü yüksek bileşenleri (örn. `LeagueContent`, `MatchesContent`, `HomeContent`) cache-component olarak tasarlamak.
- **Caching Profilleri ve Revalidation**
- `足球` benzeri canlı veriler için üç profil öner:
  - **`live`**: 15–30 saniye revalidate (live skor, minute gibi veriler – `useLiveFixture` ile uyumlu).
  - **`short`**: 5–15 dakika (günlük fikstürler, yakın zamanlı istatistikler).
  - **`long`**: 1–24 saat (lig bilgisi, takım bazlı statik bilgiler, Contentful SEO içerikleri).
- Bu profilleri `constants.ts` içinde `CACHE` objesi ile tanımlayıp `sportmonksRequest` config’te kullan.
- **Static vs Dynamic Route Stratejisi**
- Çok trafik alan sayfalar için
  aşırı dinamik davranmak yerine mümkün olduğunca **static generation + revalidate** kullan:
  - Örn. home page (`app/page.tsx`) için: gün içi tarih bazlı fixture’ları `revalidate` ile statik servir; canlı skorlar client-side polling ile güncelle.
  - League/Team/Player detay sayfalarında: ID/slug sayısı çok fazla ise full SSG değil ama **segment-based caching** (ör. istatistikler ayrı, fixtures ayrı) planla.

### 5. Frontend Performans Optimizasyonu (Rendering, State, Hooks)

- **Client/Server Component Ayrımı**
- `"use client"` kullanan component’lerin listesini çıkarıp üç kategoriye ayır:
  - **Gerçekten client olması gerekenler**: Search, favoriler (Zustand), live dakika, interaktif tablar.
  - **Sadece görsel ama yanlışlıkla client yapılmış olanlar**: Sadece props render eden kartlar, tablolar – bunları server component’e çevir.
  - **Hibrit**: Büyükçe container + içte küçük client widget (örn. favori butonu, tooltip).
- Böylece gönderilen JS bundle boyutu azalacak.
- **State & Effect Temizliği**
- `PlayerSearch`, `GlobalSearch`, `TeamSearch` gibi bileşenlerde benzer debounce + fetch pattern’i var:
  - Ortak bir `useDebouncedSearch(fetcher, delay)` veya `useDebouncedValue` hook’u çıkar.
  - Fetch iptali (`AbortController`) ve race condition guard’ları ekle (özellikle input hızlı değişirken eski response’un yenisini ezmemesi için).
- `useLiveFixture` ve `useLiveMinute` için:
  - Interval / timer yönetimini merkezi bir helper’a çek, interval süresi ve aktiflik durumu props ile yönetilsin.
- **Memoization & List Rendering**
- Büyük listeleri (`fixtures`, `standings`, `stat leader` listeleri, `match events`) için
  - `key` seçimleri stabil olsun (ID bazlı, index değil).
  - Sık yeniden render olan kart/tabela satırlarına gerekirse `React.memo` veya derived data için `useMemo` kullan.
- Çok büyük tablolar için (özellikle mobile): ileride **virtualization** (ör. `react-virtualized` muadili küçük bir kütüphane) eklenmesi için alt yapı hazırlığı (tek bir `VirtualizedList` component’i) planla.

### 6. Tekrarlanan UI Pattern’lerini Ortaklaştırma (DRY)

- **Fixture / Match Kartları**
- `components/fixtures/fixture-card.tsx`, `components/home/match-row.tsx`, `components/teams/team-fixtures.tsx` içinde benzer layout/alanlar var.
- Plan:
  - Ortak bir **`FixtureRow`/`FixtureSummary`** atomu çıkarıp tüm bu bileşenler onu compose etsin (ör. skor gösterimi, zaman, lig ismi, favori butonu).
- **Standings Tabloları**
- `components/leagues/standings-table.tsx` ile `components/match-detail/standings-tab.tsx` içinde benzer tablo yapıları var.
- Ortak tablo yapısını **`StandingsTable`** etrafında standardize et; `StandingsTab` sadece `props` hazırlasın.
- **Arama Bileşenleri**
- `GlobalSearch`, `PlayerSearch`, `TeamSearch` aynı debounce + result render pattern’ini kullanıyor.
- `SearchResultList`, `SearchInput`, `SearchSkeleton` gibi küçük bileşenler ve `useSearch` hook’u ile ortaklaştır.
- **Kart ve Layout Primitifleri**
- `PlayerCard`, `TeamCard`, `StatLeaderCard`, `FixtureCard` gibi kartların spacing/typography’sini `ui/card`, `ui/field` gibi primitive’ler üstünden tek bir tasarım diliyle hizala.

### 7. Kod Stili, TypeScript ve Pattern Standartları

- **Fonksiyon Bildirimleri ve Tipler**
- Component ve util fonksiyonlarında **function declaration** tercih et (örn. `export function PlayerCard(...)` zaten çoğunda kullanılıyor; `components/ui` içindeki bazı küçük fonksiyonel component’ler arrow fonksiyon ise bunları zamanla `function` formuna çevir).
- Dizi tiplerini **`Array<T>`** formatına normalize et (ör. `Fixture[]` yerine `Array<Fixture>`); özellikle public API’lerde ve type tanımlarında.
- **Schema ve Validasyon**
- Halihazırda Zod kullanımı var (`env.ts`, `football-api.ts` içinde `dateSchema`, `idSchema`).
- Plan:
  - Tüm API route input’ları (`searchParams`, route params, request body) için ilgili route dosyasında veya ortak `validation` modülünde **Zod schema** tanımla.
  - Örn. `players/search/route.ts` için `playerSearchSchema = z.object({ q: z.string().min(2).max(100) })`.
- Form tabanlı (gelecekteki) endpoint’ler için `react-hook-form + zodResolver` standardını zorunlu hale getir.
- **Error Handling & Logging Standardı**
- API ve service fonksiyonları için
  - Ortak bir `AppError` tipi ve `mapToHttpError` helper’ı tanımla.
  - Loglama konusunda tek bir util (`logError(context, error)`) ile hem server loglarını hem gerektiğinde Sentry/benzeri integrasyonu besle.

### 8. Güvenlik ve XSS / Injection Önlemleri

- **Input Validasyonu**
- Tüm `search` endpoint’lerinde (oyuncu, takım, lig, fixtures by date) Zod şemaları ile
  - Uzunluk sınırı,
  - Pattern (örn. sadece harf/rakam + boşluk),
  - Gerekirse whitelist/blacklist (örn. wildcard karakterler kısıtlı) uygula.
- `football-api` tarafında env’den gelen API key zaten `envSchema` ile doğrulanıyor; bunu bozmayıp yeni env’ler için de aynı pattern’i kullan.
- **XSS ve Output Sanitization**
- Contentful’dan gelen rich text için
  - Rich-text renderer zaten kullanılıyor; HTML string render edeceğin yerlerde mutlaka sanitize eden helper kullanılması planlanmalı.
- Kullanıcıdan gelebilecek string’ler (search query, yorum vs. ileride eklenirse) UI’de render edilirken **escape edilmiş** string olarak gösterilsin (React default’u güvenli ama `dangerouslySetInnerHTML` varsa sıkı kontrol et).

### 9. State Management, Favoriler ve Test Edilebilirlik

- **Zustand Store İyileştirmeleri** (`stores/favorites-store.ts`)
- Store’u pure fonksiyonlara böl:
  - Selector ve action’ları ayrı modüllere çıkararak unit test yazılabilir hale getir.
- Favori verisinin disk (localStorage) ile senkronizasyonu varsa onu yan-effect fonksiyonuna ayır (örn. `syncFavoritesToStorage(store)` gibi).
- **Dependency Injection Deseni**
- `football-api` ve `sportmonks-client` fonksiyonlarını test ederken gerçek HTTP yerine mock kullanılabilmesi için
  - Export’ları interface’ler üzerinden (veya factory fonksiyonları üzerinden) tüketen modüller tasarla.
  - Örn. `createFootballApi(client: SportmonksClient)` gibi factory; production’da gerçek client, testte mock.

### 10. Test Stratejisi ve Kalite Güvencesi

- **Birim Testleri (Kritik Fonksiyonlar)**
- Öncelik verilecek alanlar:
  - `sportmonks-mappers` (özellikle `mapFixture`, `mapPlayerDetail`, `mapStandingsToTables`).
  - `football-api` içindeki Zod validasyonlu fonksiyonlar (`getFixturesByDate`, `searchPlayers` vs.).
  - `lib/utils` içindeki slug ve formatlama fonksiyonları (`generatePlayerSlug`, tarih/puan formatlayıcıları).
- **Entegrasyon Testleri (API Route + Service)**
- `app/api/*/route.ts` + ilgili service fonksiyonlarını kapsayan basit `fetch` tabanlı testler (ör. `players/search` için valid/invalid query senaryoları).
- **UI/Interaction Testleri**
- Kritik kullanıcı akışları: home fixtures listesi, match detail tabs, search & navigation.
- React Testing Library ile minimal ama yüksek değerli testler (örn. tablar arası geçiş, loading state’leri, boş state’ler).

### 11. Uygulama Yol Haritası (Fazlara Bölünmüş)

- **Faz 1 – Altyapı ve Kod Stili Temeli**
- Ortak logging & error-handling util’lerini ekle.
- Zod ile env + temel API input validasyonlarını tamamla.
- TypeScript stilini (function declaration, `Array<T>`) ve dosya isimlendirmesini konsolide et (kebab-case korunuyor).
- **Faz 2 – Data Fetching & Caching Optimizasyonu**
- `sportmonks-client` ve `football-api` üzerinde cache profilleri, revalidate değerleri ve N+1 azaltma refactor’ünü yap.
- `lib/queries.ts` ve ana sayfa / detay sayfalarında data fetching’i tek elde topla.
- **Faz 3 – Frontend Performans ve DRY UI Refactor’u**
- Client/server component ayrımını netleştir, gereksiz client component’leri server’a taşı.
- Search, fixtures, standings gibi tekrar eden UI pattern’lerini ortaklaştır.
- `useDebouncedSearch`, `useLiveInterval` benzeri ortak hook’lar çıkar.
- **Faz 4 – Güvenlik, Testler ve Gelişmiş Pattern’ler**
- Tüm API route’larda Zod tabanlı validasyon tamamlansın.
- Mapper’lar, service’ler ve kritik flow’lar için unit + integration testleri ekle.
- Gerekirse Cache Components/ileri seviye caching desenlerine geçiş.
