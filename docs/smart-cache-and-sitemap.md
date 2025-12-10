# Kapsamlı Sitemap ve Smart Cache Mimarisi

### Genel Hedef

- **Amaç**: Next.js App Router üzerinde Fotmob benzeri, ölçeklenebilir bir sitemap mimarisi kurmak:
- Statik sayfalar + dinamik entity’ler (lig, takım, oyuncu, maç) için ayrı sitemap index’leri ve parçalanmış XML dosyaları.
- Sportmonks rate limitlerine (≈3k/saat _entity başına_) takılmadan, arama motorlarına çok geniş URL kapsamı sunmak.
- **Temel prensip**: Sportmonks çağrılarını sitemap’tan **tamamen izole etmek**; sitemap’ler sadece SQLite’taki **kalıcı cache** üzerinden beslenecek. Sportmonks API’si dolsa bile sitemap’ler (ve büyük ölçüde site) eski ama sağlam veriden çalışmaya devam edebilecek.

### 1) Sitemap Route Yapısının Tasarımı

- **Mevcut `src/app/sitemap.ts` rolü**:
- Çekirdek statik sayfalar için kullanılmaya devam edecek:
  - `/` ana sayfa, `/matches`, `/leagues`, `/teams`, `/players`, `/privacy`, `/terms` vb.
- Ek olarak, yeni XML sitemap index endpoint’lerine (altta üreteceğimiz route’lar) link veren bir üst seviye **özet sitemap** gibi davranabilir.

- **Yeni XML sitemap hiyerarşisi** (şimdilik tek dil varsayımıyla `en`):
- Ana index (ya metadata, ya custom route):
  - `/sitemap.xml`
- Bölümsel index’ler (XML `sitemapindex`):
  - `/sitemap/en/leagues.xml`
  - `/sitemap/en/teams.xml`
  - `/sitemap/en/players.xml`
  - `/sitemap/en/matches.xml`
- Sayfalı sitemap’ler (XML `urlset`):
  - `/sitemap/en/leagues/[page].xml`
  - `/sitemap/en/teams/[page].xml`
  - `/sitemap/en/players/[page].xml`
  - `/sitemap/en/matches/[page].xml`
- **Next.js dosya yapısı (özet)**:
  - `src/app/sitemap/[lang]/leagues/route.ts` → index (sitemapindex)
  - `src/app/sitemap/[lang]/leagues/[page]/route.ts` → urlset
  - Aynı pattern `teams`, `players`, `matches` için.
- Bu route’lar `Response` ile manuel XML dönecek (Content-Type: `application/xml`), böylece `sitemapindex` ve `urlset` yapısını birebir kontrol edeceğiz.

- **Fotmob tarzı bölme stratejisi**:
- Her `[page].xml` için bir **PAGE_SIZE** belirleyeceğiz (örn. 10k–50k URL).
- Index endpoint’i (örn. `/sitemap/en/players.xml`), SQLite tablosundan toplam kayıt sayısını okuyup, page sayısını hesaplayarak:
  - `<sitemap><loc>https://.../sitemap/en/players/1.xml</loc></sitemap>`
  - `<sitemap><loc>https://.../sitemap/en/players/2.xml</loc></sitemap>`
  - ... şeklinde çıktıyı üretecek.

### 2) URL Pattern’lerinin Mevcut Routelar ile Uyumlandırılması

- **Slug helper’ları mutlaka kullanılacak** (`src/lib/utils.ts`):
- Oyuncu: `getPlayerUrl(name, id)` → `/players/${slugify(name)}-${id}`
- Takım: `getTeamUrl(name, id)` → `/teams/${slugify(name)}-${id}`
- Lig: `getLeagueUrl(name, id)` → `/leagues/${slugify(name)}-${id}`
- Maç: `getFixtureUrl(fixture)` → `/matches/${home-slug}-vs-${away-slug}-${fixture.id}`
- Sitemap üretimi sırasında URL’ler **asla elle string birleştirerek** üretilmeyecek; hep bu helper’lar çağrılacak ki:
- `extractFixtureId`, `extractTeamId`, `extractPlayerId`, `extractLeagueId` fonksiyonları ile
- Var olan dinamik sayfalar (`/players/[slug]`, `/teams/[slug]`, `/matches/[slug]`, `/leagues/[slug]`) %100 uyumlu kalsın.

### 3) SQLite Tabanlı Kalıcı Cache Katmanı

- **Yeni modül** (örnek): `src/lib/sitemap-cache/sqlite-cache.ts`
- **SQLite dosyası**: Proje altında örn. `data/sitemap-cache.sqlite` (konum .env veya küçük bir config ile yönetilebilir).
- **Temel tablolar (sitemap odaklı minimal kolonlar)**:
- `leagues`: `id`, `name`, `slug`, `country`, `last_modified`, `updated_at`, `include_in_sitemap` (bool)
- `teams`: `id`, `name`, `slug`, `league_id`, `country`, `last_modified`, `updated_at`, `include_in_sitemap`
- `players`: `id`, `name`, `slug`, `team_id` (opsiyonel), `country`, `last_modified`, `updated_at`, `include_in_sitemap`
- `matches`: `id`, `home_team_name`, `away_team_name`, `slug`, `kickoff_at`, `league_id`, `last_modified`, `updated_at`, `include_in_sitemap`
- **Önemli noktalar**:
- **Veri silmeye gerek yok**: Normal çalışma modunda bu tablolar **kalıcı** davranır; sadece `updated_at` ve `include_in_sitemap` alanları güncellenir.
- Eski/verimsiz kayıtları sitemap’ten çıkarmak istersek:
  - Fiziksel silmek yerine sadece `include_in_sitemap = 0` yaparız.
  - Disk 50GB olduğu için, temizleme tamamen opsiyonel/ileriye dönük bir “maintenance” işi olarak kalır.
- Böylece sitemap her zaman SQLite üzerinden beslenir, Sportmonks tamamen arka plandaki “data kaynağı” haline gelir.

### 4) Sportmonks’tan Veri Çekme ve Cache’i Besleme Stratejisi

- **Veri kaynakları (docs/sportmonks/endpoints bazlı)**:
- Ligler: `leagues/get-all-leagues.md` → `/leagues` (paginated)
- Takımlar: `teams/get-all-teams.md` veya `teams/seasons/{id}` (sezona göre)
- Oyuncular:
  - Küçük/orta kapsam için: takım kadroları (`/teams/{id}` + `players.player` includes) üzerinden oyuncu set’ini oluşturmak.
  - Global kapsam için: `players/get-all-players.md` endpoint’i ile sayfalı tam liste.
- Maçlar:

  - `fixtures/get-all-fixtures.md` veya tarih aralıklı `fixtures/get-fixtures-by-date-range.md` (örn. son 30 / gelecek 30 gün penceresi).

- **Her normal API çağrısında cache besleme**:
- Zaten kullandığınız sayfa-level fonksiyonlar (`getLeaguePageData`, `getTeamById`, `getPlayerById`, `getMatchDetailData` vb.) Sportmonks’tan dönen entity’leri mape ediyor.
- Bu fonksiyonların çıktıları, uygun bir noktada **sitemap cache’e upsert** edilebilir (örn. `upsertLeague`, `upsertTeam`, `upsertPlayer`, `upsertMatch`).
- Böylece siteye trafik geldikçe, sitemap cache’i de “organik” olarak dolar; özel sync script’i sadece kapsamı genişletir/hızlandırır.

- **Opsiyonel: Arka plan senkron script’i** (önerilen ama zorunlu değil):
- Örnek: `scripts/sync-sitemap-cache.ts` (Node/ts-node ile çalıştırılabilir).
- Parametreler: `--entity=players|teams|leagues|matches`, `--max-pages`, `--since-days` vb.
- Çalıştığında:
  - İlgili Sportmonks endpoint’ini paginated olarak dolaşır (`sportmonksPaginatedRequest` + `API.sportmonks.defaultPerPage`, `maxPaginationPages`).
  - Her response’taki ID/isim bilgilerini SQLite’a **upsert** eder; var olan kaydı günceller, olmayanı ekler.
  - İstersen, çok çok eski ve değersiz bulduğumuz kayıtlar için `include_in_sitemap = 0` veya soft-delete flag’i kullanabiliriz; yine fiziksel silme zorunlu değil.

### 5) Rate Limit (3k/saat, entity başına) ve Panic-Mode Tasarımı

- **Entity-bazlı limit yönetimi**:
- Sportmonks’in saatlik limitinin entity başına olduğunu bildiğimiz için, script’te ve olası on-demand bootstrap’te;
  - `players`, `teams`, `leagues`, `fixtures` için ayrı sayaçlar/konfigler kullanacağız.
- Örnek konfig:
  - `MAX_REQUESTS_PER_HOUR_PLAYERS = 2500`
  - `MAX_REQUESTS_PER_HOUR_TEAMS = 2500`
  - vs. gibi; bilinçli bir buffer bırakılır.
- Bu kısıt, **sync script’te** ve olası “fallback bootstrap” akışında uygulanır; sitemap endpoint’leri zaten sadece SQLite’tan okuma yapacağı için rate limit’i etkilemez.

- **Panic-mode davranışı**:
- Sportmonks tarafında şu durumlar panic-mode tetikleyici olarak kabul edilir:
  - 429 (rate limit) veya ardışık 5xx hataları.
  - Dahili sayaçların `MAX_REQUESTS_PER_HOUR_*` limitlerine yaklaşması.
- Panic-mode aktif olduğunda:
  - Sync script’i ve olası on-demand bootstrap yeni Sportmonks çağrılarını **durdurur / erteler**.
  - Site ve sitemap’ler, **SQLite’taki son başarılı verilerle** çalışmaya devam eder.
  - Fiziksel veri silinmez, sadece güncelleme akışı geçici olarak durur.
- Panic-mode’dan çıkış için basit bir strateji:
  - Zaman bazlı unlock (örn. 30–60 dk sonra retry) + istersen log/metric üretimi.

### 6) Sitemap Route’larının SQLite Üzerinden Çalışması

- **Index endpoint’ler (`/sitemap/en/*.xml`)**:
- Örneğin `/sitemap/en/players.xml` handler’ı:
  - `SELECT COUNT(*) FROM players WHERE include_in_sitemap = 1` ile toplam sayıyı çeker.
  - `PAGE_SIZE_PLAYERS` değerine göre `pageCount = ceil(total / PAGE_SIZE_PLAYERS)`.
  - 1..pageCount arasında döngü ile `<sitemap><loc>${SITE.url}/sitemap/en/players/${page}.xml</loc></sitemap>` üretir.
- Aynı yapı ligler, takımlar, maçlar için uygulanır.

- **Sayfalı endpoint’ler (`/sitemap/en/players/[page].xml`)**:
- `page` parametresini alır, `offset = (page - 1) * PAGE_SIZE_PLAYERS` hesaplar.
- `SELECT ... FROM players WHERE include_in_sitemap = 1 ORDER BY id LIMIT PAGE_SIZE OFFSET offset` gibi bir sorgu ile ilgili aralık çekilir.
- Her satır için:
  - `loc` = `SITE.url + getPlayerUrl(name, id)`
  - `lastmod` = `last_modified || updated_at`.
- Çıktı XML: `<urlset>` içinde `<url><loc>...</loc><lastmod>...</lastmod></url>`.
- Maçlar için:

  - `loc` = `SITE.url + getFixtureUrl(...)`
  - `lastmod` = `kickoff_at` veya `updated_at`.

- **Ana `/sitemap.xml` davranışı**:
- İki seçenek var; hangisini tercih edeceğimiz implementasyon aşamasında netleştirilebilir:

  1. **Metadata tabanlı (şu anki gibi)**: `src/app/sitemap.ts` içinde, hem statik sayfaları hem de `/sitemap/en/...` index URL’lerini `MetadataRoute.Sitemap` çıktısına eklemek.
  2. **Tam XML kontrolü**: `/sitemap.xml` için de custom route handler yazıp doğrudan `<sitemapindex>` döndürmek ve `src/app/sitemap.ts`’i minimal hale getirmek.

- Her iki durumda da arama motorları; ana sitemap’ten bölüm sitemap index’lerine, oradan da sayfalı sitemap’lere zincir halinde ulaşabilecek.

### 7) Güncelleme Politikası (Cache Süreleri ve Tazelik)

- **Sportmonks tarafı**:
- Zaten mevcut `CACHE_PROFILES` ile Next.js `revalidate` süreleri ayarlı:
  - `live`: 30s, `short`: 5dk, `medium`: 1saat, `long`: 6saat, `static`: 24saat.
- Bu profiller sync script’te ve sayfa-level veri çekmede aynen kullanılmaya devam edecek.

- **SQLite kayıtlarının tazelenmesi**:
- Lig, takım, oyuncu gibi **yavaş değişen** entity’ler için:
  - Yeni response geldiğinde ilgili kaydın `updated_at` ve `last_modified` alanları güncellenir.
  - Fiziksel silme yapılmaz; sadece `include_in_sitemap` ile kapsama kontrolü.
- Maçlar için:
  - Sitemap’te sadece belirli tarih penceresini göstermek istiyorsak (örn. son 30 / gelecek 30 gün), bu **sorgu seviyesinde** uygulanır:
  - `WHERE include_in_sitemap = 1 AND kickoff_at BETWEEN now()-30d AND now()+30d` gibi.
  - İleri aşamada istersen çok eski maçları da sadece `include_in_sitemap = 0` yaparak dışarı alabiliriz.

### 8) Konfigürasyon ve Genişletilebilirlik

- **Sitemap config** (örnek dosya: `src/lib/sitemap-cache/config.ts`):
- `PAGE_SIZE_LEAGUES`, `PAGE_SIZE_TEAMS`, `PAGE_SIZE_PLAYERS`, `PAGE_SIZE_MATCHES`.
- `MAX_REQUESTS_PER_HOUR_*` değerleri (entity bazında).
- İleride farklı diller eklenirse desteklenecek `LANGS = ["en", "tr", ...]` listesi.
- Hangi liglerin/ülkelerin sitemap’te öncelikli olacağı (örneğin ilk fazda sadece TOP_LEAGUES, sonra genişletme).

- **Geleceğe dönük ekler**:
- İçerik/haber sisteminiz devreye girdikçe `news`, `articles`, `blog` gibi ek sitemap’ler aynı pattern ile entegre edilebilir.
- AMP / alternatif mobil URL’ler eklemek isterseniz `<xhtml:link rel="alternate" ...>` gibi advanced sitemap özellikleri de kolayca eklenebilir.

### 9) Adım Adım Uygulama Sırası

1. **Route iskeletini kur**: Yeni `src/app/sitemap/[lang]/...` handler’larını ve URL yapısını oluştur; şimdilik dummy XML dönsün.
2. **SQLite cache modülünü yaz**: `sqlite-cache.ts` içinde bağlantı, tablo oluşturma, `upsert*` ve `listForSitemap*` fonksiyonlarını hazırla.
3. **Sayfa-level upsert entegrasyonu**: `getLeaguePageData`, `getTeamById`, `getPlayerById`, `getMatchDetailData` vb. fonksiyonların kullanıldığı yerlerde (veya bu fonksiyonların içinde) ilgili entity’leri SQLite’a upsert eden küçük hook/helper’lar ekle.
4. **Opsiyonel sync script**: `scripts/sync-sitemap-cache.ts` ile Sportmonks’u paginated dolaşıp cache’i toplu dolduran script’i yaz; entity-bazlı rate limit kontrolünü buraya koy.
5. **Lig & takım sitemap’lerini gerçek veriye bağla**: League/teams index + `[page].xml `route’larını SQLite okumaları ile besleyip, URL’leri `getLeagueUrl` / `getTeamUrl` üzerinden üret.
6. **Oyuncu & maç sitemap’lerini bağla**: Oyuncu ve maç tablolarını doldur; sayfalı sitemap’leri, tarih penceresi ve `include_in_sitemap` filtresi ile gerçek veriye bağla.
7. **Panic-mode ve hata senaryolarını test et**: Zorla 429/5xx üreterek sync script’in durmasını, sitemap’lerin ise cache’ten sorunsuz dönmesini doğrula.
8. **Ana `sitemap.ts` uyarlaması ve SEO testleri**: `src/app/sitemap.ts` çıktısına yeni bölüm sitemap index URL’lerini ekle veya tamamen XML route’a geçir; Search Console ve canlı testlerle yapıyı doğrula.
