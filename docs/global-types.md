# Sportmonks Global Types + Servis ve Smart Cache Katmanı

## Amaç

Sportmonks Football API için kullanılan **ham (raw)** ve **domain/UI** tiplerini tek bir merkezî tip katmanında toplamak, anonim tipleri ortadan kaldırmak ve tüm veri akışının bu tipler üzerinden güvenli ve tutarlı ilerlemesini sağlamak. Bunun üzerine, her sayfadan doğrudan API çağırmak yerine **ortak servis katmanı** kurup, ileride bu servislere yazılacak **smart cache sistemi** ile performans ve bakım kolaylığı elde etmek.

## Yüksek Seviye Yaklaşım

- Mevcut yapıda `sportmonks-client.ts` içinde tanımlı ham tipler ve `types/football.ts` içindeki domain tipleri zaten bir temel oluşturuyor.
- Önce bu yapıyı genişleterek **kullanılan tüm Sportmonks endpointleri** için ham tipleri merkezîleştiriyoruz ve API fonksiyonlarının hepsini bu tipleri kullanır hâle getiriyoruz.
- Ardından, sayfaların direkt `sportmonksRequest` veya `football-api` fonksiyonları yerine kullanacağı **ortak servis fonksiyonları** tanımlıyoruz (ör: `getMatchDetailData`, `getHomePageData`, `getLeaguePageData`).
- Smart cache sistemi bu servis katmanının altına / etrafına konumlanacak; böylece cache politikaları sayfa kodlarından tamamen ayrılmış olacak.

## Adımlar

### 1. Mevcut Sportmonks kullanımını envanterleme

- `src/lib/api/football-api.ts`, `src/lib/api/smart-fixture.ts`, `src/lib/api/sportmonks-mappers.ts`, `src/lib/api/sportmonks-client.ts` dosyalarında kullanılan **tüm endpointleri** ve generik tipleri çıkar.
- Nerede **anonim inline tip** (ör: `sportmonksRequest<Array<{ ... }>>`) kullanıldığını listele.
- `docs/sportmonks/endpoints` altındaki dökümantasyon ile eşleştirip her endpoint için beklenen response yapısını not et.

### 2. Global Sportmonks tip yapısını tasarlama

- `src/types` altında, örneğin `src/types/sportmonks/` klasörünü oluşturup iki katman tanımla:
- `raw` katmanı: Sportmonks API’den gelen response’ların birebir tipleri (endpoint bazlı veya entity bazlı).
- `domain` katmanı: Halihazırda `src/types/football.ts` içinde olan ve UI’nin tükettiği normalize tipler (fixture, team, league, odds, prediction, standings, vs.).
- `src/lib/api/sportmonks-client.ts` içindeki mevcut `Sportmonks*Raw` tiplerini bu yeni `raw` katmanına taşıyıp **tek kaynaktan** export edilecek hâle getir.

### 3. Kullanılan endpointler için ham (raw) tipleri tanımlama

- Öncelikli olarak projede aktif kullanılan endpointler için tipleri çıkar:
- Odds, predictions, fixtures, standings, top scorers / top assists, leagues, countries, injuries, squad vb.
- Her endpoint için:
- `docs/sportmonks/endpoints/...` içindeki örnek response’ları referans al.
- Uygun `SportmonksXxxRaw` interface’lerini `src/types/sportmonks/raw` içine ekle.
- Gerekirse ortak entity tiplerini (ör: `SportmonksTeamRaw`, `SportmonksLeagueRaw`, `SportmonksPlayerRaw`) yeniden kullanacak şekilde tasarla.

### 4. API fonksiyonlarını global ham tiplere geçirip mappers’ı güncelleme

- `football-api.ts` ve `smart-fixture.ts` içindeki tüm `sportmonksRequest<...>` çağrılarını yeni `raw` tipleri ile güncelle.
- Örneğin inline anonim tipler yerine `SportmonksPredictionProbabilityRaw[]` gibi isimlendirilmiş tipler kullan.
- `sportmonks-mappers.ts` içindeki mapper fonksiyonlarını yeni tip import yoluna göre güncelle (`src/types/sportmonks/raw` üzerinden).
- Domain tipleri tarafında (`types/football.ts`) mümkün olduğunca değişiklik yapmadan, sadece mapper’ların çıktılarının bu domain tiplerle uyumlu olduğunu garanti et.

### 5. Ortak servis katmanını tasarlama

- `src/lib/services/` altında domain bazlı servis dosyaları oluştur:
- Örneğin: `matches-service.ts`, `leagues-service.ts`, `players-service.ts`, `odds-service.ts` gibi.
- Her servis dosyasında, sayfaların ihtiyacına göre **yüksek seviyeli fonksiyonlar** tanımla:
- Ör: `getMatchDetailData(slug)`, `getLivePageData()`, `getLeaguePageData(leagueSlug)`, `getPlayerProfileData(slug)`.
- Bu servis fonksiyonları, altta `football-api.ts` / `smart-fixture.ts` fonksiyonlarını ve gerekirse DB/dosya okuma işlemlerini orkestre eden tek katman olacak.
- Kural: `app/` altındaki sayfa ve route dosyaları doğrudan `sportmonksRequest` veya ham endpoint çağrısı yapmayacak, sadece servis fonksiyonlarını kullanacak.

### 6. Servis katmanı ile cache entegrasyonu için altyapı hazırlığı

- Servis fonksiyonlarının imzasını cache dostu olacak şekilde tasarla (saf fonksiyon, parametre -> veri; side-effect içermesin).
- Cache politikasını soyutlayan bir yardımcı modül planla, örneğin `src/lib/cache/smart-cache.ts`:
- Ana API: `smartCache(key, options, fetcher)` veya benzeri bir wrapper.
- İçeride Next.js `fetch` revalidate, `react` `cache()` veya ileride Redis / KV store gibi mekanizmalara geçiş yapabilecek esneklik bırak.
- İlk aşamada sadece interface’i tasarlayıp servis fonksiyonlarının bu wrapper üzerinden çalışacağı noktaları işaretle (şu an no-op veya basit `cache()` kullanımı bile olabilir).

### 7. Artımlı genişletme & bakım kuralları

- Yeni bir Sportmonks endpointi entegre edilirken takip edilecek süreç:

1. `docs/sportmonks/endpoints/...`’ten response yapısını incele.
2. İlgili entity/endpoint için `raw` tip(ler)i ekle veya genişlet.
3. Gerekliyse yeni domain tip(ler)i `types/football.ts` veya `types/sportmonks-domain.ts` içine ekle.
4. `sportmonks-client` + API fonksiyonu + mapper’ı bu tipleri kullanacak şekilde yaz.
5. İlgili sayfa için doğrudan API fonksiyonu kullanmak yerine ilgili servis fonksiyonuna çağrı ekle; cache ihtiyacı varsa servis içinden smart cache wrapper’ı kullan.

- Kod review kuralı:
- Sportmonks çağrılarında **anonim response tipi** kullanılmasına izin verme (hepsi global tiplerden gelmeli).
- `app/` altındaki sayfalar doğrudan `sportmonksRequest`, `football-api` veya `sportmonks-client` kullanmayacak; sadece `src/lib/services` altındaki servis fonksiyonlarını kullanacak.

### 8. Tip güvenliği ve regresyon kontrolleri

- Derleme ve type-check aşamasında `football-api.ts`, `smart-fixture.ts`, `sportmonks-mappers.ts`, yeni servis dosyaları ve bu fonksiyonları kullanan kritik UI bileşenlerinin hata vermediğini doğrula.
- Gerekirse birkaç kritik akış (örneğin: canlı maçlar, maç detayı, oranlar, tahminler, sıralamalar) için basit runtime smoke test’leri (ör: sayfaları açıp veri render’ını kontrol etme) planla.
