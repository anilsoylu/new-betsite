# Sportmonks Merkezi Data-Layer ve Altyapı Planı

## 1. Hedef ve Genel Mimari

- **Amaç**: Sportmonks Football API v3.0 ile çalışan, hem server-side hem client-side tarafından kullanılabilen, tek merkezden yönetilen bir data-layer kurmak.
- **Prensipler**: DRY, KISS, YAGNI; Zod ile input doğrulama; API key sadece server tarafında; ileride takılabilir bir "smart cache" katmanı için extensible tasarım.
- **Hibrit erişim**: Public / paylaşılabilir ihtiyaçlar için `app/api/*` REST endpoint’leri, daha spesifik/kompleks işlemler için server actions kullanmak.

## 2. Klasör Yapısı ve İsimlendirme

- **Klasörler** (kebab-case):
  - `src/lib/api/sportmonks-client.ts`
  - `src/lib/api/sportmonks-mappers.ts`
  - `src/lib/api/football-api.ts`
  - `src/lib/queries.ts`
  - `src/types/sportmonks/raw/*.ts`
  - `src/types/football.ts`
  - Gerekirse client yardımcıları için `src/lib/client/*`.
- **Kurallar**: Dosyalar kebab-case, komponent ve tipler PascalCase, şemalar camelCase + `Schema` suffix; `Array<T>` kullanımı; fonksiyonlar `function` deklarasyonu ile yazılacak.

## 3. Ortam Değişkenleri ve Güvenlik

- **Env helper**: `src/lib/env.ts` içinde Zod ile `API_SPORTMONKS_KEY` dahil tüm kritik env değerlerini doğrulayan bir şema tanımla.
- **Kullanım**: `sportmonks-client` ve diğer server-side modüller sadece bu helper üzerinden env okur; client tarafına asla key taşınmaz.
- **Güvenlik notları**: API key sadece server component’ler, server actions ve `app/api/*` route’ları içinde kullanılacak; client data erişimi sadece bu merkezi katman üzerinden yapılacak.

## 4. Sportmonks HTTP Client (Merkezi Erişim Noktası)

- **Dosya**: `src/lib/api/sportmonks-client.ts`.
- **Genel yapı**:
  - Base URL: `https://api.sportmonks.com/v3/football` (ve gerekiyorsa core için `v3/core`).
  - `function sportmonksRequest<TResponse>(config: SportmonksRequestConfig): Promise<TResponse>` şeklinde tipli bir ana fonksiyon.
  - `SportmonksRequestConfig` içinde: `endpoint`, `method`, `query`, `include`, `filters`, `page`, `tz` vb. alanlar.
  - Tüm HTTP çağrıları için tek çıkış noktası; ileride cache / retry / rate-limit mantığı buraya eklenecek.
- **Hata ve loglama**:
  - HTTP status, Sportmonks error body ve timing bilgilerini loglayan hafif bir logging katmanı.
  - Domain katmanına anlamlı hata nesneleri döndürmek için basit bir error map yapısı.

## 5. Raw Tipler ve Dokümantasyonla Uyum

- **Dosyalar**: `src/types/sportmonks/raw/` altında modüler tipler (core, league, match-data, betting, players, team-statistics, match-stats, vb.).
- **Referans**: `docs/sportmonks/types.md` içindeki listeyi baz alarak tip isimlerini (`SportmonksFixtureRaw`, `SportmonksLeagueRaw`, vb.) oluşturmak ve `index.ts` üzerinden re-export etmek.
- **Kullanım**: `sportmonks-client` generik `TResponse` tipini bu raw tiplerden alacak; mapper katmanı bu raw tiplerden domain tiplere dönüşüm yapacak.

## 6. Domain Tipleri ve Mapper Katmanı

- **Domain tipleri**: `src/types/football.ts` içinde UI’nin gerçekten ihtiyaç duyduğu sade tipler tanımlanacak (örn. `Fixture`, `Team`, `Player`, `Odds`, `Standing`, `Prediction` vb.).
- **Mapper dosyası**: `src/lib/api/sportmonks-mappers.ts` içinde `mapSportmonksFixture`, `mapSportmonksLeague`, `mapSportmonksOdds` gibi küçük, saf fonksiyonlar oluşturulacak.
- **Akış**:
  - Sportmonks raw cevap → raw tip (`Sportmonks*Raw`) → mapper fonksiyonu → domain tipi (`Fixture`, `Team`, ...).
  - Bu akış, `docs/sportmonks/types.md` ve `docs/sportmonks/endpoints-used.md` ile birebir uyumlu olacak.

## 7. Servis Katmanı: `football-api.ts` ve `queries.ts`

- **`football-api.ts`** (genel football servisleri):
  - Örnek fonksiyonlar: `function getLiveFixtures()`, `function getFixturesByDate(date: string)`, `function getStandingsBySeason(seasonId: number)`, `function getOddsByFixtureId(fixtureId: number)`, `function getTopScorersBySeason(seasonId: number)` vb.
  - Her fonksiyon: input’u Zod ile validate eder, `sportmonksRequest` çağırır, ardından mapper’larla domain tiplerine dönüştürür.
  - Bu katman hem server component’ler hem de API route’ları/server actions tarafından kullanılacak.
- **`queries.ts`** (daha kompleks view-model’ler):
  - Örneğin takım profili, oyuncu profili, maç merkezi gibi birden fazla endpoint’ten data toplayan fonksiyonlar (`function getTeamProfile()`, `function getPlayerProfile()`, vb.).
  - İçeride `football-api.ts` fonksiyonlarını ve gerektiğinde ek mapper’ları kullanarak UI’ye hazır view-model döndürecek.

## 8. Server Components, Server Actions ve API Routes Tasarımı

- **Server components**:
  - Önemli sayfalar (ör. `src/app/page.tsx`, ileride `live`, `matches`, `match/[id]` vb.) doğrudan `football-api.ts` / `queries.ts` fonksiyonlarını çağıracak, böylece SEO + performans avantajı korunacak.
- **Server actions**:
  - Kullanıcının tetiklediği daha spesifik işlemler (filtreleme, pagination, kullanıcı bazlı tercihleri içeren istekler) için server actions tanımlanacak, bu actions içinde yine merkezi servis fonksiyonları kullanılacak.
- **API routes (`app/api/*`)**:
  - Public veya paylaşılabilir endpoint’ler (örneğin live skor JSON feed, basit maç listesi) için `app/api/sportmonks/*` altında route’lar açılacak.
  - Bu route’lar sadece `football-api.ts` veya `queries.ts` fonksiyonlarını kullanacak; Sportmonks’a direkt erişim sadece bu katmanda.

## 9. Validasyon, Güvenlik ve Kalite

- **Zod ile input validasyonu**:
  - Tüm public API route’larında ve server action girişlerinde Zod şemaları (örn. `getFixtureParamsSchema`, `getStandingsSchema`) ile query/body/path parametreleri doğrulanacak.
  - Domain katmanında gerekirse response shape’leri için hafif Zod doğrulamaları eklenecek (kritik akışlar için).
- **Hata yönetimi**:
  - Standart bir `AppError` tipi ve error helper’ları ile; kullanıcıya gösterilen mesajlar ile loglanan teknik detaylar ayrılacak.
  - Kritik bölgelerde anlamlı, kısa yorumlar ile neden belirli kontrollerin yapıldığı açıklanacak.
- **Kod kalitesi**:
  - Fonksiyonlar küçük ve test edilebilir olacak; servis ve mapper fonksiyonları saf fonksiyon olarak yazılacak ki ileride unit test eklemek kolay olsun.

## 10. Smart Cache İçin Genişleyebilirlik

- **Abstraction point**:
  - `sportmonks-client` içinde, isteğe bağlı bir `cacheStrategy` arabirimi tasarlanacak (ör. memory/Redis/Next cache adapter’larına uygun bir interface), fakat ilk aşamada no-op implementasyon kullanılacak.
- **Next.js cache uyumu**:
  - Server component ve `football-api.ts` fonksiyonlarında Next 16/React 19 `cache` ve RSC cache mekanizmalarına uyumlu bir pattern kullanılacak (ör. saf fonksiyonların kolayca `cache()` ile sarılabilmesi).
- **Gelecek adım**:
  - Daha sonra Redis veya benzeri bir store eklendiğinde yalnızca `cacheStrategy` implementasyonu ve belki bazı TTL config’leri değiştirerek tüm sistemi cache’li hale getirebilmek.

## 11. İlk Entegrasyon ve Örnek Akışlar

- **Öncelikli senaryolar** (sofascore/fotmob referansı ile):
  - Ana sayfada canlı ve günün maçları listesi (fixtures + livescores).
  - Bir sezon için standings tablosu.
  - Tek maç detayı + temel odds ve prediction verisi.
- **İlk wiring**:
  - `HomePage` içinde (şu an basit `HomePage` komponenti bulunan `[src/app/page.tsx](/Users/anil/Documents/github/new-betsite/src/app/page.tsx)`) server component pattern’i ile `football-api.ts` fonksiyonlarını kullanarak basic bir listeleme yapılacak.
  - Bu wiring, diğer sayfalar için tekrar edilebilir bir blueprint olacak.

## 12. Dokümantasyon ve İç Notlar

- **Docs güncelleme**:
  - Yeni tipler ve API fonksiyonları eklendikçe `docs/sportmonks/types.md` ve `docs/sportmonks/endpoints-used.md` dosyaları güncellenecek.
  - `README.md` içine kısaca "Sportmonks data-layer nasıl kullanılır" bölümü eklenecek (server component, server action ve API route örnekleriyle).
