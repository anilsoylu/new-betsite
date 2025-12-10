# Soccer Offices – Tüm Site Metadata ve İç SEO Geliştirme Planı

## 1. Genel SEO Stratejisi ve Hedefler

- **Hedef pazar**: İngilizce içerik, global kullanıcı (özellikle canlı skor ve istatistik arayan futbolseverler).
- **Ana hedefler**:
- **Organik trafik**: "live football scores", "today football matches", "team stats", "player stats" vb. arama terimlerinde görünürlük.
- **Dönüşüm**: Kullanıcıların lig/maç/team/player sayfalarında daha uzun vakit geçirmesi, favorilere ekleme ve tekrar ziyaret oranlarının artması.
- **Otorite**: Lig, takım ve oyuncu sayfalarında derin istatistik & açıklamalarla "uzman skor & istatistik platformu" algısı.
- **Strateji yaklaşımı**:
- Next.js `metadata` API’sini her route için sistematik kullanmak.
- Template bazlı dinamik title/description yapıları (lig, takım, oyuncu, maç).
- İç link ağı (leagu→team→player→match) ile otorite dağıtmak.
- Schema.org structured data ile zengin sonuç (rich snippet) ve futbol spesifik işaretleme.

## 2. Teknik SEO Temeli (Site Genelinde)

- **2.1. robots ve dizinlenebilirlik**
- `src/app/layout.tsx` içindeki `metadata.robots` şu an:
  - `index: false`, `follow: false` – **tüm siteyi fiilen noindex yapıyor**.
- Plan:

  - Globalde `index: true`, `follow: true` olarak güncelle.
  - Sadece istenmeyen URL’leri (örn. `/api/*`, gelecekte /admin veya A/B test sayfaları) `robots.ts` üzerinden kısıtla.
  - Gerekirse kişisel / düşük değerli sayfalar (`/favorites`, muhtemel /privacy, /terms) için sayfa bazında `robots: { index: false }` kullan.

- **2.2. Next.js `robots.ts` ve `sitemap.ts` iyileştirmesi**
- `robots.ts` şu anda tüm botlara `allow: "/"`, `disallow: ["/api/*"] `veriyor – bu kısım iyi, fakat layout’taki `noindex` ile çakışıyor.
- `sitemap.ts` sadece statik sayfaları (home, `/matches`, `/teams`, `/players`) içeriyor.
- Plan:

  - Layout’taki `noindex` kaldırıldıktan sonra, `robots.ts` ayarlarını koru; gerekirse ek `disallow` alanları ekle (örn. `/favorites`, test yolları).
  - `sitemap.ts`’i 3 seviyeli hale getir:
  - **Statik çekirdek sayfalar**: `/`, `/matches`, `/teams`, `/players`, `/leagues`, varsa `/privacy`, `/terms`.
  - **Popüler ligler**: `TOP_LEAGUES` ve/veya `POPULAR_LEAGUES` üzerinden; her lig için `/leagues/[slug]` ana sayfasını ekle.
  - **Popüler dinamik varlıklar**: son X günün maçları, en çok ziyaret edilen takımlar/oyuncular gibi (örneğin `getTopLeaguesStandings` veya özel bir "popular entities" query’si ile). Bunları `/matches/[slug]`, `/teams/[slug]`, `/players/[slug]` URL’leriyle sitemap’e ekle.
  - Çok büyük sitemap hacmini önlemek için:
  - Gerekirse `/sitemap-matches.xml`, `/sitemap-teams.xml`, `/sitemap-players.xml` gibi segmentli sitemap yapısı planla.

- **2.3. Canonical URL ve parametre yönetimi**
- Şu anda canonical tanımlı değil, dinamik slug’lar (örn. `galatasaray-123`) ve query parametreleri (örn. `/matches?date=...`) için risk var.
- Plan:

  - Tüm önemli sayfalarda `alternates: { canonical: ... }` kullan:
  - Home: `SITE.url`.
  - `/matches`: canonical olarak `SITE.url/matches` (date parametresi olsa bile; ya da her tarih için canonical aynı kalsın, "takvim sayfası" mantığıyla).
  - `/leagues/[slug] `ve alt sekmeler: canonical = tam path (örn. `.../leagues/premier-league-8`, `.../leagues/premier-league-8/standings` vs.).
  - `/teams/[slug] `ve sekmeler (`/matches`, `/stats`, `/squad`, `/transfers`, `/history`) için benzer.
  - `/players/[slug]`: canonical = tam player URL’si.
  - UTM ve takip parametreleri için (ileride): canonical oluştururken bu parametreleri filtreleyen küçük bir yardımcı fonksiyon tanımla.

- **2.4. `next.config.ts` ve bot davranışı**
- `htmlLimitedBots: /.*/` tüm botlara "limited HTML" göndermek anlamına geliyor; bu, bazı arama motorları için içerik kaybı yaratabilir.
- Plan:

  - `htmlLimitedBots` kullanımını gözden geçir:
  - Ya tamamen kaldır (`undefined`) ya da sadece problemli botlara (scraper, pahalı crawler) özel bir regex kullan.
  - Googlebot, Bingbot gibi ana arama motorlarının tam HTML almasını sağla.

- **2.5. Performans & Core Web Vitals (SEO etkisi)**
- Görseller zaten `next/image` ile optimize, ancak LCP/CLS tarafında ekstra inceleme yapılmalı.
- Plan (yüksek seviyede):
  - Ana sayfadaki büyük içerik bloklarını (örn. ilk fixture listesi) LCP için optimize et (kritik veriyi önden fetch, gerekirse skeleton ile).
  - Reklam bileşenlerini (`AdSpace`) lazy-load / düşük öncelikle yükle.
  - Lighthouse / PageSpeed raporlarına göre CSS/JS boyutlarını gözden geçir (özellikle büyük bileşenler: global search, match detail tabs).

## 3. Global Metadata Mimarisi

- **3.1. `SITE` ve `SEO` sabitlerini netleştirme**
- Şu an `SITE.name = "SoccerName"`, URL `https://socceroffices.com` – marka adı ve domain uyumsuz.
- Plan:

  - Nihai marka ismini seç (muhtemelen **Soccer Offices**). `SITE.name`, `SITE.url`, `SITE.twitter`, `SITE.description` alanlarını bu karara göre senkronize et.
  - `SITE.description`’ı hedef anahtar kelimeleri barındıracak şekilde genişlet:
  - Örn: "Live football scores, fixtures, standings, statistics and odds from leagues worldwide." gibi daha zengin bir açıklama.
  - `SEO` altında eksik olan sayfalar için şablonlar ekle:
  - `leaguesList`, `teamsList`, `playersList`, `favorites`, `teamSection` (fixtures/stats/history), `leagueSection` (fixtures/standings/stats) vb.

- **3.2. Root layout metadata standardı**
- Mevcut `metadata` (layout): title template, description, OpenGraph, Twitter – iyi bir başlangıç.
- Plan:

  - `robots`’u index/follow’a çevir.
  - `metadataBase` ve `openGraph.url` değerlerini güncel `SITE.url` ile hizala.
  - Ek alanlar:
  - `applicationName`, `category: "sports"` (uygun olduğu ölçüde).
  - `alternates: { types: { "application/rss+xml": ... } }` – ileride RSS eklersen.
  - `verification` alanları (Search Console, Bing Webmaster Tools) için hazır key’ler.

- **3.3. OG/Twitter görselleri stratejisi**
- Root için `opengraph-image.tsx` ve `twitter-image.tsx` zaten var, marka uyumlu güzel bir görsel üretiyor.
- Plan:
  - **Maç detay OG**: `/matches/[slug]/opengraph-image.tsx `zaten dinamik görsel üretiyor – bunu `generateMetadata`’ta `openGraph.images` alanıyla bağla (URL pattern’i: `/matches/[slug]/opengraph-image`).
  - **Takım ve oyuncu sayfaları**: OG görseli için şunları yap:
  - Eğer entity logosu/fotoğrafı varsa `openGraph.images`’e ekle (zaten `generateMetadata`’ta kısmen yapılıyor; bunu tutarlı hale getir).
  - Yoksa default OG görselini kullan (`SITE.defaultImage`).
  - **Lig sayfaları**: `TOP_LEAGUES`/API’den gelen lig logolarını OG görseli olarak kullan; fallback olarak default OG.

## 4. Route Bazlı Metadata Planı (Sayfa Sayfa)

### 4.1. Ana Sayfa `/`

- **Mevcut durum**: `metadata` `SEO.home` üzerinden; içerik olarak fixture listeleri + Contentful rich text + FAQ.
- **Plan**:
- `SEO.home.title` ve `description` içinde ana hedef kelimeleri daha net yerleştir:
  - Örn: "Live Football Scores, Fixtures & Standings | {SITE.name}".
- `HomePage` içinde:
  - Tek bir **H1** başlık olduğundan emin ol ("Football Matches" veya benzeri – şu an büyük ihtimalle `HomeContent` içinde tanımlı, gerekirse netleştir).
  - Alt bölümler için H2/H3 hiyerarşisini takip et ("Live Matches", "Today’s Matches", "Top Leagues", "FAQ" vb.).
- Structured data:
  - Root’da bir `WebSite` + `SearchAction` JSON-LD ekle (site içi arama için `GlobalSearch` URL kalıbını kullanarak).

### 4.2. Maç Listesi Sayfası `/matches`

- **Mevcut durum**: `metadata` sabit; H1 şu an bileşen içinde implicit.
- **Plan**:
- Title/description’ı tarihe duyarlı hale getir (opsiyonel ileri seviye):
  - Varsayılan: "Football Matches by Date | Live Scores & Results".
  - Eğer `searchParams.date` bugünün tarihi ise description’da "today" vurgusu yap.
- `MatchesPage` bileşenine görünür bir **H1** ekle (örn. "All Football Matches"), altına seçili tarihi gösteren bir H2/H3.
- Structured data:
  - Bu sayfayı bir tür "event listing" olarak işaretlemek için gelecekte `ItemList` JSON-LD eklenebilir (her match için `SportsEvent` linki ile).

### 4.3. Lig Liste Sayfası `/leagues`

- **Mevcut durum**: Basit `metadata`; H1 = "Football Leagues".
- **Plan**:
- Title/description’ı `SEO.leagues` şablonuna çevirerek merkezileştir.
- İçerikte:
  - Hero bölümde kısa bir tanıtım paragrafı eklenmiş – bunu hafifçe anahtar kelime odaklı hale getir ("league tables", "standings", "fixtures").
  - "Top European Leagues" ve "International Competitions" bloklarında, hover dışında da lig detay sayfalarına tıklanabilir alanları koru.
- Breadcrumb şeması (ileride): Home → Leagues için `BreadcrumbList` JSON-LD planla.

### 4.4. Dinamik Lig Sayfaları `/leagues/[slug]` ve Sekmeleri

- **Mevcut durum**:
- ` /leagues/[slug] ``generateMetadata ` içinde `TOP_LEAGUES` ile bilinen ligler için iyi bir title/description üretiyor; bilinmeyen ligler için generic metin.
- Alt sekmeler: `/fixtures`, `/standings`, `/stats` – metadata yok (layout üzerinden sadece template title var).
- İçerik tarafında `LeagueAboutSection` zaten oldukça zengin SEO metni + FAQ schema içeriyor.
- **Plan – Metadata**:
- `generateMetadata`’ı genişlet:
  - Bilinmeyen ligler için de API’den lig adını çekip "{LeagueName} standings, fixtures, stats" şeklinde daha spesifik description üret.
  - `openGraph` ve `twitter` alanlarını doldur (title/description + lig logosu varsa image).
- Alt sekmeler için ayrı `generateMetadata` fonksiyonları ekle:
  - `/fixtures`: "{LeagueName} Fixtures & Results | {SITE.name}".
  - `/standings`: "{LeagueName} Table & Standings | {SITE.name}".
  - `/stats`: "{LeagueName} Top Scorers & Player Stats | {SITE.name}".
- Canonical’ları sekme bazında ayarla (örn. `/leagues/premier-league-8/stats`).

- **Plan – İç SEO ve içerik**:
- `LeagueAboutSection` içindeki güçlü metni koru, fakat şu eklemeleri planla:
  - Lig adı geçen yerlerde, uygun yerlerde **link** ver (örn. ilk paragrafta geçen `leagueName` kelimesini `/leagues/[slug]` ana URL’sine bağla – reuse yapılacağı için dikkatli tasarla).
  - Top scorers bölümünde, oyuncu isimlerine `/players/[slug]` linkleri eklemeyi değerlendiril.
- İç linkler:
  - Lig sayfasında görünen takımları tablo veya kartlarda `/teams/[slug] `sayfalarına bağla (zaten `StandingsTable` muhtemelen link veriyor; doğrulanıp tutarlı hale getirilmeli).

### 4.5. Takım Sayfaları `/teams` ve `/teams/[slug]` + Sekmeleri

- **Liste sayfası `/teams`**:
- Mevcut metadata iyi; description’a "team squads", "fixtures", "results" gibi ek keyword’ler eklenebilir.
- H1 = "Football Teams"; alt açıklama doğru.
- Plan: `SEO.teamsList` şablonu üzerinden centralize edip, canonical ve OG’yi netleştir.

- **Takım ana sayfası `/teams/[slug]` (TeamOverviewPage)**:
- `generateMetadata`:
  - Title/description mevcut, fakat `openGraph` içinde canonical image ve daha iyi description (ülke, lig, founded) eklenebilir.
  - Canonical URL ekle.
- İçerik (`TeamAbout`, `TeamFixtures`, standings widget’ları, vs.):
  - `TeamAbout`’ta geçen `SITE.name` ve takım adı zaten SEO açısından güzel; buradaki takım adını ve lig isimlerini uygun yerlerde linke dönüştürmeyi planla:
  - Takım adı → `/teams/[slug]` (self-link çok gerekli değil ama breadcrumbs ile birleştirilebilir).
  - Lig adı → ilgili `/leagues/[slug]` sayfası.
  - "Next Match" ve "Previous Match" bölümlerinde geçen maç isimlerini `/matches/[slug]` sayfalarına linkle (zaten Link bileşenleriyle kısmen var; metinsel paragraflarda da anchor olarak kullanılabilir).
- Sekmeler:
  - `/matches`: title/description ekle ("{TeamName} Fixtures & Results | {SITE.name}").
  - `/stats`: title/description ("{TeamName} Statistics & Form").
  - `/squad`: title/description ("{TeamName} Squad List").
  - `/transfers`: title/description ("{TeamName} Transfers In & Out").
  - `/history`: title/description ("{TeamName} History, Trophies & Achievements").

### 4.6. Oyuncu Sayfaları `/players` ve `/players/[slug]`

- **Liste sayfası `/players`**:
- `PlayersPage` metadata mevcut; description’ı biraz daha "player stats", "top goalscorers" gibi kelimelerle güçlendir.
- Top scorers listesinde oyuncu isimleri zaten `/players/[slug]` linklerine gidiyor – bu iç link ağı güçlü, korunacak.

- **Dinamik `/players/[slug]`**:
- `generateMetadata`’ta title, description, OG image kullanımı doğru; plan:
  - Description metnini daha standardize et: `"{Name} stats, goals, assists, career history and trophies."` gibi.
  - Canonical URL ekle.
- İçerik (`PlayerAboutSection`, `PlayerCurrentSeason`, `PlayerCareer`, `PlayerMatches`, `PlayerTrophies`):
  - PlayerAbout şu an zengin ve FAQ schema içeriyor – bu büyük avantaj.
  - Plan:
  - Paragraflar içinde geçen takım ve lig isimlerini (örneğin son maç bilgisi, current team) uygun durumlarda linkleyerek daha güçlü iç link oluştur.
  - `PlayerMatches` bileşeninde her maç satırının text açıklamaları `MatchDetail` sayfasına giden Link’lerle zaten sağlanıyorsa, başlık/hücrelerde bu yapıyı pekiştir.

### 4.7. Maç Detay Sayfası `/matches/[slug]`

- **Mevcut durum**:
- `generateMetadata` maç datasına göre dinamik title/description üretiyor (SEO.matchDetail templates).
- `MatchArticle` bileşeni çok geniş SEO odaklı içerik üretiyor (preview, form, standings, H2/H3 başlıklar, key facts).
- **Plan – Metadata**:
- Description’ı biraz kısaltarak en kritik anahtar kelimeleri vurgula ("live score", "lineups", "H2H stats", "odds" vb.).
- `openGraph.images`’i dinamik OG görseliyle senkronize et (mevcut OG route kullanılarak).
- Canonical URL ekle (slug’a göre).

- **Plan – Structured data (JSON-LD)**:
- Her maç sayfasında **`SportsEvent`** JSON-LD üret:

  - `name`: "{Home} vs {Away}".
  - `startDate`, `location` (venue adı/şehir), `homeTeam`, `awayTeam`, `aggregateRating` (varsa), `offers` (odds bilgisini temel alan basit bir `Offer` listesi).
  - Takım linklerini `SportsTeam` olarak embed et (ID olarak `/teams/[slug]`).

- **Plan – İç SEO**:
- `MatchArticle`’daki takım ve lig isimlerini Link bileşenleriyle `/teams/[slug]` ve `/leagues/[slug]` sayfalarına bağla.
- H2/H3 yapısını koruyarak okunabilirliği geliştir; paragrafları çok uzun bloklar haline gelmeyecek şekilde düzenle (gerektiğinde kısa alt başlıklar ekle).

### 4.8. Favoriler Sayfası `/favorites`

- **Mevcut durum**: Sayfa tamamen client-side, metadata tanımlı değil.
- **Plan**:
- Metadata ekle:
  - Title: "Your Favorite Teams & Matches | {SITE.name}".
  - Description: kısa açıklama; bu sayfanın kişiselleştirilmiş olduğuna vurgu.
- SEO stratejisi karar noktası:
  - Büyük ihtimalle kişisel ve index değeri düşük; bu nedenle `robots: { index: false, follow: true }` kullanılması mantıklı.
- İçerikte zaten Home/Teams/Players linkleri var; bunları koru.

### 4.9. Diğer Statik/Legal Sayfalar

- Footer’da `/privacy` ve `/terms` linkleri var, ancak dosyalar repo’da görünmüyor.
- Plan:
- `/app/privacy/page.tsx` ve `/app/terms/page.tsx` sayfalarını oluşturup metadata ekle.
- Bu sayfaları indekslenebilir bırak ama düşük önemde (`priority` düşük sitemap’te); keyword odaklı olmaları gerekmiyor.

### 4.10. 404 / `not-found.tsx`

- Kullanıcı dostu hata mesajı ve ana sayfaya/önemli sayfalara linkler ekle.
- Metadata için özel bir şey gerekmez, ama sayfa içinde "page not found" vurgusunu netleştir.

## 5. Structured Data (Schema.org) Stratejisi

- **Zaten mevcut**: Lig, takım, oyuncu sayfalarında FAQ şeması için `Question/Answer` microdata kullanılmış – bu büyük artı.
- **Plan – genişletme**:
- `WebSite + SearchAction` (root).
- `BreadcrumbList`:
  - Örnek zincirler: `Home → Leagues → {LeagueName}`, `Home → Teams → {TeamName} → Squad`, `Home → Players → {PlayerName}`.
- `SportsLeague` / `SportsOrganization`:
  - Lig sayfalarında `LeagueAboutSection` verilerini kullanarak `SportsLeague` JSON-LD üret.
- `SportsTeam`:
  - Takım sayfalarında `TeamDetail` verisiyle `SportsTeam` işaretlemesi.
- `Person` (footballer):
  - Oyuncu sayfalarında `PlayerDetail` ile `Person` JSON-LD (ad, doğum tarihi, uyruk, height/weight, currentTeam).
- `SportsEvent` (maçlar):
  - 4.7 bölümünde anlatıldığı gibi.

## 6. İç Linkleme ve Site İçi Navigasyon

- **6.1. Header ve Footer navigasyonu**
- Header’da ana navigasyon (Home, Matches, Teams, Players, Favorites) hazır – SEO açısından iyi.
- Footer’da "Quick Links" ve "Legal" bölümleri var.
- Plan:

  - Footer’a ek linkler: `/leagues`, muhtemel "About" veya "Contact" sayfası.
  - Global olarak "Top Leagues" sidebar’ındaki lig linklerini site genelinde tutarlı kullan.

- **6.2. Kontekstüel iç linkler**
- Amaç: her önemli entity sayfasından (lig, takım, oyuncu, maç) diğer entity’lere minimum 3–5 iç link.
- Örnekler:
  - Maç sayfası → her iki takım sayfası + lig sayfası.
  - Takım sayfası → ilgili ligler + oyuncu profilleri.
  - Oyuncu sayfası → current team, önemli eski takımlar, son maç detayları.
  - Lig sayfası → lider takım, top scorers oyuncu profilleri.

## 7. İçerik ve Başlık Hiyerarşisi Standartları

- **7.1. Genel kurallar**
- Her indexlenebilir sayfada **tek bir H1** ve anlamlı H2/H3 hiyerarşisi.
- H1’de ana hedef keyword; H2/H3’lerde ikincil long-tail keyword’ler.
- Başlıklar kısa, açıklayıcı ve kullanıcı odaklı.

- **7.2. Template bazlı kontrol**
- **Home**: H1 = "Live Football Matches" veya benzeri.
- **Matches**: H1 = "All Matches", alt H2 = "Date navigation" / "Today’s Matches".
- **Leagues list**: H1 = "Football Leagues"; H2’ler grup başlıkları.
- **League detail**: H1 = lig adı; H2 = "About", "Standings", "Top Scorers".
- **Team detail**: H1 = takım adı; H2 = "About", "Next Match", "Previous Match", "Current Squad".
- **Player detail**: H1 = oyuncu adı; H2 = "About", "Current Season", "Career Stats", "Honours".

## 8. Ölçümleme ve Sürekli İyileştirme

- **8.1. Search Console & Analytics entegrasyonu**
- Google Search Console için domain doğrulama ve sitemap kayıtlarını yap.
- Analytics (GA4 veya alternatif) ile sayfa bazlı oturum, scroll derinliği, çıkış sayfalarını ölç.

- **8.2. Ana KPI’lar**
- Organik trafik (özellikle dinamik entity sayfalarına: maç, takım, oyuncu, lig).
- Ortalama oturum süresi ve sayfa/oturum.
- Favorilere ekleme oranı (feature adoption → engagement metriği).

- **8.3. Iteratif optimizasyon**
- En çok trafik alan lig/takım/oyuncu sayfalarında:
  - Title/description A/B testleri.
  - H2/H3 ve paragraf kurgularının gözden geçirilmesi.
  - İç link sayısının artırılması.

## 9. Uygulama Fazları (Roadmap)

- **Faz 1 – Kritik teknik SEO**
- Layout’taki `noindex` kaldırma ve `htmlLimitedBots` stratejisini düzeltme.
- `robots.ts` & `sitemap.ts` iyileştirmeleri (çekirdek sayfalar + popüler lig/varlıklar).
- `SITE` ve `SEO` sabitlerinin marka/keyword ile uyumlu hale getirilmesi.

- **Faz 2 – Route bazlı metadata**
- Tüm üst seviye sayfalar: `/`, `/matches`, `/leagues`, `/teams`, `/players`, `/favorites`, `/privacy`, `/terms`.
- Dinamik entity sayfaları: maç, lig, takım, oyuncu detay + takım/lig sekmeleri için `generateMetadata` fonksiyonlarının eklenmesi.

- **Faz 3 – Structured data genişletme**
- `WebSite + SearchAction`, `BreadcrumbList` ve `SportsEvent`/`SportsTeam`/`SportsLeague`/`Person` JSON-LD bloklarının ilgili sayfalara eklenmesi.

- **Faz 4 – İç linkleme ve içerik mikro düzenlemeleri**
- `MatchArticle`, `LeagueAboutSection`, `TeamAbout`, `PlayerAboutSection` gibi bileşenlerde kontekstüel linklerin eklenmesi.
- H1/H2/H3 hiyerarşisinin gözden geçirilip standartlaştırılması.

- **Faz 5 – Ölçüm, test ve iyileştirme**
- Search Console ve Analytics verilerine göre en çok trafik alan sayfalarda düzenli optimizasyon.
- Gerekirse yeni içerik blokları (rehberler, blog/"how to" yazıları) için ek route tasarımı.
