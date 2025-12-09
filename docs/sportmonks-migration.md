## Sportmonks Özellik Odaklı Entegrasyon Planı

## Genel yaklaşım

- **Hedef**: Eski futbol API ve cache/DB katmanını kullanmadan, sadece Sportmonks Football API 3.0 ile tüm dinamik sayfaları (canlı skor, maçlar, ligler, takımlar, oyuncular, oranlar, predictions) tekrar çalışır hale getirmek.
- **Strateji**: Mevcut UI ve sayfa yapısını mümkün olduğunca koruyup, eksik hale gelen `football-api`, `smart-fixture`, `queries` ve `types` katmanlarını Sportmonks tabanlı, cache’siz hafif bir katman olarak yeniden oluşturmak.
- **Kaynaklar**: Resmi dokümanlar olan [Endpoints](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints) ve [Entities](https://docs.sportmonks.com/football/endpoints-and-entities/entities) sayfaları ile `/docs/sportmonks/*.md` altındaki fixture, standings, xG, odds vb. için hazırladığın endpoint notları temel alınacak.

## Adım 1 – Sportmonks HTTP client ve altyapı

- **Yeni client**: `src/lib/api/sportmonks-client.ts` (veya benzer bir isimle) tek bir helper fonksiyon tanımla:
- Taban URL: `https://api.sportmonks.com/v3/football`.
- Kimlik doğrulama: `.env` içindeki `API_SPORTMONKS_KEY` değerini kullanarak `api_token` query parametresi veya `Authorization: Bearer` header’ı üzerinden auth (Sportmonks auth dokümanına göre).
- Ortak parametreler: `include`, `filters`, `tz`, `page` vb. parametreleri alabilen esnek bir interface tanımla.
- Hata yönetimi: HTTP hata kodlarını, Sportmonks error body’lerini ve rate limit durumlarını anlamlı JS hatalarına çevir.
- **Server-only kullanım**: Tüm çağrıları sadece server component’ler ve API route’ları içinden yaparak API anahtarını güvenli tut; client tarafında doğrudan Sportmonks’a istek atma.

## Adım 2 – Eski `football-api` katmanını Sportmonks ile yeniden kurma

- **Facade dosyası**: Eksik olan `src/lib/api/football-api.ts` dosyasını yeniden oluştur ve sadece sitede kullanılan fonksiyonları export et:
- `getCountries`, `getPopularLeagues` (sidebar ve lig/ülke seçimleri için).
- `getOdds`, `getH2H`, `getStandings`, `getPredictions`, `getInjuriesByFixture` (maç detayı ve odds sayfaları için).
- Gerekirse `getTopScorers`, `getTopAssists`, lig/oyuncu listeleri vb. fonksiyonlar.
- **Sportmonks eşlemesi**:
- Ülke & lig listeleri için `Leagues`, `Teams` ve ilgili Entities’ten yararlan, `/docs/sportmonks/calendar.md`, `standings.md` gibi notlardaki `include` setlerine göre çağrı kombinasyonlarını kur.
- Oranlar için `Standard Odds Feed` veya `Premium Odds Feed` endpoint’lerini (ve `Markets`, `Bookmakers` endpoint’lerini) kullan; ilk etapta 1X2 marketine odaklan.
- Predictions için `Predictions` endpoint’ini, H2H için ilgili fixtures/teams sorgularını kullan.
- Tüm bu fonksiyonlar, Sportmonks cevabını UI’nin beklediği basitleştirilmiş domain modeline dönüştüren mapper’larla sarılacak.

## Adım 3 – `smart-fixture` katmanını cache’siz, Sportmonks tabanlı yeniden yazma

- **Dosya**: Eksik olan `src/lib/api/smart-fixture.ts` dosyasını yeniden ekle.
- **Fonksiyonlar**:
- `getLiveMatchesSmart`, `getTodayMatchesSmart`, `getMatchByIdSmart`, `getEventsSmart`, `getStatisticsSmart`, `getLineupsSmart` gibi sayfalarda kullanılan fonksiyonları koru.
- **Sportmonks mapping**:
- Canlı ve bugün oynanacak maçlar için: `Livescores` ve/veya `Fixtures` endpoint’lerini, `/docs/sportmonks/calendar.md` ve `live-score.md`, `events-timeline.md`, `lineup.md` dosyalarındaki `include` kombinasyonlarıyla kullan.
- Maç detayı için: tek bir `fixtures/{FIXTURE_ID}` çağrısını, `participants;league;venue;state;scores;events;statistics;lineups` gibi zengin `include` setleriyle kullanarak eski çoklu çağrı desenini sadeleştir.
- **Basit cache stratejisi**:
- Şimdilik sadece `fetch` üzerinde `cache: "no-store"` veya kısa `revalidate` süreleri kullan; plan gereği ek cache katmanı kurma.

## Adım 4 – `queries` katmanı ile takım / oyuncu profillerini yeniden bağlama

- **Dosya**: Eksik olan `src/lib/queries.ts` dosyasını yeniden oluştur.
- **Takım profili (`getTeamProfile`)**:
- `teams/{team_id}` + `squads/teams/{team_id}` + `teams/seasons/{season_id}` ve gerekirse `fixtures` endpoint’lerini kullan.
- `/docs/sportmonks/team-squad.md`, `team-season-statics.md`, `team-recent-form.md`, `team-schedule.md` dosyalarındaki örnek `include` ve `filters` parametrelerini doğrudan uygula.
- Bu çağrıları birleştirip TeamPage ve OG image’ın beklediği `team`, `venue`, `fixtures`, `statistics`, `squad` alanlarını dolduran bir `TeamProfile` nesnesi dön.
- **Oyuncu profili (`getPlayerProfileCached`)**:
- `players/{ID}` endpoint’ini, `/docs/sportmonks/player-profile.md` ve `xg-player-efficiency.md` dosyalarındaki `include` ve `filters` kombinasyonlarıyla çağır.
- Sonucu PlayerPage’in kullandığı `player`, `statistics`, `teams`, xG ve kariyer bilgilerini içeren domain modeline dönüştür.
- **Cache davranışı**: Fonksiyon isimlerinde “Cached” kalsa bile ilk aşamada gerçek cache kullanma; sadece React `cache()` ve Next.js RSC tekrar kullanımını kullan.

## Adım 5 – Tipler (`@/types/football`) ve mapper’lar

- **Yeni tip dosyası**: Eksik olan `src/types/football.ts` dosyasını yeniden oluştur.
- **Domain model**:
- UI’de halihazırda kullanılan alanları koddan çıkar (örn. `fixture.date`, `fixture.timestamp`, `teams.home.name`, `goals.home`, `league.name`, standings satırlarındaki `points`, `goalsDiff` vb.).
- Bu alanları kapsayan sade domain tipleri (`Fixture`, `Team`, `Player`, `OddsResponse`, `StandingsResponse`, `Prediction`, `Injury` vb.) tanımla.
- **Sportmonks -> domain mapper’lar**:
- Entities dokümanındaki (`Fixture`, `Team`, `Player`, `Standing`, `Odd`, `Prediction` vb.) alanları bu domain modellere çeviren küçük helper fonksiyonlar yaz.
- Örnek: Sportmonks `participants` listesinden home/away takımı ve skorları çıkartıp `teams.home`, `teams.away`, `goals.home`, `goals.away` olacak şekilde normalize et.
- Böylece UI bileşenleri ve sayfalar minimum değişiklikle çalışmaya devam eder.

## Adım 6 – Sayfa bazlı entegrasyon (canlı, maçlar, odds)

- **Ana sayfa (`src/app/page.tsx`)**:
- `getLiveMatches` ve `getTodayMatches` fonksiyonlarını yeni Sportmonks tabanlı servislerle çalışır hale getir.
- Bu fonksiyonlar içerde `getLiveMatchesSmart` / `getTodayMatchesSmart` veya doğrudan `sportmonksClient` çağrıları kullanabilir, ama UI arayüzü (return shape) korunur.
- **Canlı sayfa (`src/app/live/page.tsx`)**:
- `getLiveMatchesSmart` fonksiyonunu `Livescores` + `Fixtures` endpoint’leriyle besle; canlı filtrelemesini Sportmonks `state` alanına göre yap.
- **Maç listesi (`src/app/matches/page.tsx`)**:
- `getTodayMatchesSmart` fonksiyonunu `leagues/date/{date}` veya `fixtures` by date endpoint’leriyle bağla; `/docs/sportmonks/calendar.md`’deki `include` setlerini kullan.
- **Oranlar sayfası (`src/app/odds/page.tsx` ve alt route’lar)**:
- `Odds` endpoints (Standard/Premium feed) ve `Bookmakers`, `Markets` endpoint’leri ile `getOdds` fonksiyonunu çalışır hale getir.
- İlk aşamada yalnızca temel marketler (örn. fulltime result 1X2) için mapping yap; UI bu marketleri beklediği formatta almaya devam eder.

## Adım 7 – Maç detayı, H2H, standings, predictions

- **Maç detayı (`src/app/match/[id]/page.tsx`)**:
- `getMatchByIdSmart`, `getEventsSmart`, `getStatisticsSmart`, `getLineupsSmart` fonksiyonlarının tümünü tek bir veya az sayıda Sportmonks `fixtures/{FIXTURE_ID}` çağrısı ve güçlü `include` parametreleriyle destekle.
- `/docs/sportmonks/match-centre.md`, `events-timeline.md`, `lineup.md`, `xg-match.md`, `commentaries.md`, `injures-suspensions.md`, `pressure-index.md` dokümanlarındaki önerilen `include` ve `filters` kombinasyonlarını kullan.
- **H2H**, **standings** ve **predictions**:
- H2H için: ilgili iki takımın geçmiş `fixtures`’larını `participants` filtreleriyle çek ve domain modelde H2H listesi olarak sun.
- Standings için: `/docs/sportmonks/standings.md`’deki `standings/seasons/{season_id}` endpoint’ini kullan; MatchPage ve lig sayfalarının kullandığı standings tipine map et.
- Predictions için: `Predictions` endpoint’ini kullanarak maç bazlı prediction verisini MatchPage ve `/predictions` sayfasının beklediği yapıya dönüştür.

## Adım 8 – Ligler, takımlar, oyuncular ve top-scorers sayfaları

- **Lig & ülke listeleri, sidebar widget’ları**:
- `CountriesLeaguesWidget`, `leagues` ve `teams` sayfaları için `Leagues`, `Teams`, `Standings` ve `Schedules` endpoint’lerinden gelen veriyi kullan.
- **Takım sayfası (`src/app/teams/[slug]/page.tsx`)**:
- `getTeamProfile` üzerinden Sportmonks `Team`, `Squad`, `Team Statistics`, `Schedule` endpoint’lerini birleştir; `/docs/sportmonks/team-squad.md` ve `team-season-statics.md`’ye göre `include`/`filters` ayarla.
- **Oyuncu sayfası (`src/app/players/[slug]/page.tsx`)**:
- `getPlayerProfileCached` fonksiyonunu `players/{ID}` endpoint’i ve `xG` + kariyer istatistikleri ile doldur; `/docs/sportmonks/player-profile.md` ve `xg-player-efficiency.md`’yi referans al.
- **Top-scorers / assists sayfaları**:
- `/docs/sportmonks/top-scorers.md`’deki `topscorers/seasons/{season_id}` endpoint’ini kullanarak gol kralı ve asist krallığı listelerini getir.

## Adım 9 – Hata yönetimi, rate limit ve basit gözlemleme

- **Hata mesajları**: Sportmonks error kodlarını UI’de kullanıcı dostu mesajlara çevir (örn. rate limit aşımı, bakım, veri bulunamadı).
- **Rate limit farkındalığı**: Şimdilik yalnızca basit loglama ve minimal tekrar deneme (retry) stratejisi uygula; daha ileri rate-limit ve cache mikro tasarımlarını sonraya bırak.
- **Logging**: `sportmonksClient` içinde endpoint, süre, hata kodu vb. için konsol log veya basit structured log ekleyerek, erken entegrasyon aşamasında nelerin çalışmadığını hızlıca görebilmeyi sağla.

## Adım 10 – Doğrulama ve kademeli genişletme

- **Sayfa sayfa kontrol**: `/`, `/live`, `/matches`, `/odds`, `/match/[id]`, `/leagues/[slug]`, `/teams/[slug]`, `/players/[slug]`, `/predictions` gibi tüm ana rotaları tek tek çalıştırıp veri akışını kontrol et.
- **Eksik veri alanları**: UI’nin ihtiyaç duyduğu ama ilk etapta doldurmadığımız alanları tespit edip, ilgili Sportmonks `Entities` dokümanına bakarak mapper’ları genişlet.
- **İleri seviye veri**: xG, trends, pressure index gibi advanced verileri, temel akış stabil olduktan sonra aşama aşama ekle (her biri için `/docs/sportmonks/*.md`’deki spesifik endpoint planını uygula).
