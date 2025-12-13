# Coaches / Leagues / Matches / Players / Teams / Live – Validation & Metadata Plan

## Kapsam ve hedef
- Kapsanan rotalar: `src/app/{coaches,leagues,matches,players,teams,live}/page.tsx` ve slug sayfaları (`[slug]/page.tsx`).
- Sorun: Parametre ve query doğrulaması zayıf (slug/date vb.), schema.org çıktıları parçalı, metadata alanları tutarsız ve OG/Twitter görselleri/fallback’leri her sayfada aynı güçte değil.
- Hedef: Zod tabanlı doğrulama + hafif metadata fetch katmanı + eksiksiz JSON-LD’ler ile Google Rich Results ve OG/Twitter kalite standartlarına uyum sağlamak.

## Mevcut durumdan notlar
- Parametreler `Promise` olarak tiplenmiş ve `extract*Id` ile sadece ID çekiliyor; `slugSchema` doğrulaması veya searchParams doğrulaması (özellikle `/matches?date`) yok.
- Metadata üretimi bazı sayfalarda ağır veri çağırıyor (`matches/[slug]` → `getMatchDetailData`), OG görselleri ve canonical alanları sayfa bazında tutarlı değil.
- JSON-LD:
  - Liste sayfalarında (coaches/players/teams/matches/live) ItemList yok.
  - Profil sayfalarında breadcrumb + person/team/league schema var; FAQ/Article/Offer sadece bazı sayfalarda.
  - Live sayfasında yalnızca genel `WebPage` ItemList mevcut, maç detay listesi yok.
- Veri kaynakları: Sportmonks endpoint notları `docs/sportmonks/endpoints/*.md` (fixtures, livescores, leagues, teams, players, coaches, standings, odds/markets) üzerinde hazır.

## Adım adım plan

### 1) Doğrulama altyapısı
- `src/lib/validation/schemas.ts`:
  - `slugSchema`/`extractIdFromSlug` için helper fonksiyon ekle: `{ slug: slugSchema }` parse eden `validateSlugParams` (her entity için tekrar kullan).
  - `dateSchema` ile `validateSearchParams` kullanacak `matchesDateSchema` (opsiyonel date) oluştur; geçersiz tarih için today fallback döndür.
- Sayfa entegrasyonu:
  - `matches/page.tsx`: `searchParams`’ı `matchesDateSchema` ile doğrula, geçersiz durumda `redirect` veya güvenli fallback uygula.
  - Tüm `[slug]/page.tsx` dosyalarında `params` tipini düz nesneye çevir, `validateSlugParams` → `extract*Id` akışını uygula; hata için `notFound`.

### 2) Metadata standardizasyonu (Next metadata API)
- Ortak helper:
  - `src/lib/seo/metadata.ts` (yeni): canonical builder (param filtreleme), default OG/Twitter image fallback, keyword şablonları.
  - Metadata fetch’i hafiflet: `matches/[slug]` için `getFixtureById` + minimal include; `teams/[slug]`/`players/[slug]` için sadece isim/logo çekip ağır listeleri `Page` bileşenine bırak.
- Liste sayfaları:
  - `coaches/leagues/matches/players/teams/live/page.tsx`: metadata title/description’ı `SEO` şablonlarına bağla, `keywords` alanlarını güncelle (örn. live scores, fixtures, standings).
  - Canonical’ları sabitle (`SITE.url/<path>`), OG/Twitter image fallback ekle.
- Profil sayfaları:
  - `coaches/[slug]`: canonical, OG/Twitter image fallback (`coach.image ?? SITE.defaultImage`), keywords (coach name + team + league).
  - `players/[slug]`: benzer fallback + pozisyon/takım bazlı keywords; description’ı standardize (`stats, goals, assists, trophies`).
  - `teams/[slug]`: tab parametresi için canonical varyantları; country/league bilgisiyle keywords.
  - `matches/[slug]`: metadata fetch’i hafiflet + OG image (league logo veya dynamic `/matches/[slug]/opengraph-image`).
  - `leagues/[slug]`: bilinmeyen ligler için API’den isim/ülke çekip şablon üret; OG image fallback.

### 3) JSON-LD / schema.org genişletmesi
- Ortak generator’lar (`src/lib/seo/json-ld.ts`):
  - Yeni helpers: `generateItemListSchema` (liste sayfaları için), `generateLiveMatchListSchema` (live sayfası), `generateTeamListSchema`, `generateCoachListSchema`, `generatePlayerListSchema`.
  - `generateSportsEventSchema` ve `generateSportsTeamSchema` için eksik alanlar: `sameAs` (team/player official links varsa), `address/geo` (venue), `identifier` (Sportmonks ID).
  - FAQ generator’ları: `generatePlayerFAQSchema`, `generateTeamFAQSchema` (basit 3 soru) ekle.
- Sayfa entegrasyonu:
  - `matches/page.tsx`: JsonLdScript ile ItemList (7 günlük liste) ve her maç için `SportsEvent` linkleri.
  - `live/page.tsx`: mevcut WebPage schema’yı ItemList + minimal SportsEvent array ile zenginleştir (endpoint: `livescores` bkz. `docs/sportmonks/endpoints/livescores.md`).
  - `coaches/players/teams` liste sayfaları: ItemList; slug linklerini kullan.
  - `coaches/[slug]`: mevcut Person + FAQ + breadcrumb koru, yeni FAQ generator’a geç.
  - `players/[slug]`: Person + breadcrumb + yeni FAQ; sezon istatistiklerinden `mainEntity` bağları.
  - `teams/[slug]`: SportsTeam + breadcrumb + Team FAQ (founded year, stadium, last trophy); standings tablosundan kısa ItemList (rakip linkleri).
  - `leagues/page.tsx`: mevcut ItemList’i `generateItemListSchema` ile standardize et.
  - `leagues/[slug]`: SportsOrganization schema’ya sezon/yearFounded/country ekle; standings varsa top 3 takım için `member` alanı.

### 4) Veri kaynakları ve mapping (Sportmonks)
- Fixture/meta hafif fetch: `fixtures/{id}` includes = `participants,state,league,venue` (bkz. `docs/sportmonks/endpoints/fixtures.md`).
- Team meta: `teams/{id}` includes = `country,venue,coaches` (bkz. `endpoints/teams.md`).
- Player meta: `players/{id}` includes = `country,nationality,position` (bkz. `endpoints/players.md`).
- Coach meta: `coaches/{id}` includes = `country,nationality,teams.team` (bkz. `endpoints/coaches.md`).
- Live list: `livescores/inplay` (bkz. `endpoints/livescores.md`), sonuçları ItemList + SportsEvent için kullan.
- Standings/topscorers: `standings/seasons/{id}`, `topscorers/seasons/{id}` (bkz. `endpoints/standings.md`, `endpoints/topscorers.md`) — league/team schema enrichment için.

### 5) QA ve doğrulama
- Structured data doğrulama: Rich Results Test / Schema Markup Validator ile `/live`, `/matches`, `/matches/[slug]`, `/players/[slug]`, `/teams/[slug]`, `/coaches/[slug]`, `/leagues/[slug]` çıktıları kontrol et.
- Metadata check: OG/Twitter tag’leri (title/description/image/url) Lighthouse → SEO audit; canonical ve robots doğrulaması.
- Parametre güvenliği: Hatalı slug/date için `notFound` veya güvenli redirect çalıştığını manüel test et (örn. `/matches/abc`, `/matches?date=bad`).
- Revalidation: Liste sayfalarında `revalidate` değerlerini (live=30s, matches short cache) koru; metadata fetch’lerini kısa revalidate ile sınırla.

## Beklenen çıktı
- Her sayfada tutarlı canonical + OG/Twitter + keyword seti.
- JSON-LD’ler Rich Results’ta hatasız; liste sayfaları ItemList ile, profil sayfaları Person/SportsTeam/SportsOrganization + FAQ ile işaretlenmiş.
- Parametre/search doğrulaması sayesinde 404 ve metadata fetch hataları minimize edilmiş.
