## Gelişmiş UI/UX Yeniden Tasarım Planı

### 1. Genel Layout ve Grid Yapısı

- **Root layout’u genişlet**: `src/app/layout.tsx` içinde mevcut yapıyı koruyarak, içerik alanını grid tabanlı bir container’a dönüştür (örn. `max-w-6xl/7xl`, responsive padding, üst kısımda header altında global arama alanı için yer ayır).
- **Sidebar mimarisini entegre et**: `src/components/ui/sidebar.tsx`’deki `SidebarProvider`, `Sidebar`, `SidebarInset` gibi bileşenleri kullanarak, anasayfa (`src/app/page.tsx`), `players` (`src/app/players/page.tsx`) ve `teams` (`src/app/teams/page.tsx`) için iki kolonlu (sidebar + ana içerik) layout oluştur.
- **FotMob/Sofascore benzeri yoğunluk**: Liste alanlarında (maç listesi, arama sonuçları) daha kompakt satır yükseklikleri, grid aralıkları ve tipografi ayarları ile bilgi yoğun ama okunabilir bir yapı kur.

### 2. Global Header ve Arama Deneyimi

- **Header’a global arama ekle**: `src/components/layout/header.tsx` içine, sağ tarafta (tema toggle yanına) bir arama alanı ekle; `Command`/`Dialog` tabanlı veya kompakt input tabanlı bir global arama komponenti tasarla (örn. `GlobalSearch` bileşeni).
- **Oyuncu & takım aramasını buraya taşı**: `PlayerSearch` ve `TeamSearch`’teki mantığı yeniden kullanarak, global arama içinde sekmeli bir yapı (Players / Teams tab’leri) veya tek input + sonuç gruplama ("Players", "Teams" başlıkları altında) uygula.
- **/players ve /teams’ten lokal search’ü kaldır**: `src/app/players/page.tsx` ve `src/app/teams/page.tsx` içindeki arama inputlarını ve açıklama metnini sadeleştir; bu sayfaları artık daha çok "keşif" (örn. popüler oyuncular/takımlar, lig bazlı filtreler, kısa istatistik kartları) sayfaları haline getir.

### 3. Sidebar İçeriği (Popüler Ligler, Reklam Alanları vb.)

- **Sidebar iskelet bileşeni**: `src/components/layout` altında örneğin `main-sidebar.tsx` gibi bir bileşen oluştur; burada `Sidebar`, `SidebarGroup`, `SidebarMenu` vb. kullanarak yeniden kullanılabilir bir sidebar yapısı kur.
- **Popüler ligler bölümü**: Şimdilik statik veya kolay güncellenebilir bir konfig’den (örn. `POPULAR_LEAGUES` sabiti `src/lib/constants.ts` içinde) beslenen "Top Leagues" listesi; her lig için logo/icon, isim ve kısa etiket (ENG, ESP vb.). Gerekirse ileride Sportmonks’tan dinamik veri ile güncellenebilir bırak.
- **Reklam ve promosyon alanları**: Sidebar’da "Sponsored" veya promosyon kartları için alan ayır; tasarım olarak nötr card + badge/küçük başlık yapısı kullan (FotMob/Sofascore’daki yan reklam/promo alanlarına benzer).

### 4. Sayfa Bazlı Gelişmiş UI/UX (FotMob/Sofascore Seviyesi)

- **Anasayfa (`page.tsx`) – Kişiselleştirilebilir maç akışı**:
- Maç listesini lig başlıklarıyla grupla; her grup için sticky lig header (mobilde de çalışacak şekilde) kullan.
- Her maç satırında: lig logosu/etiketi, saat veya canlı skor, hızlı durum badge’i (LIVE / FT / HT vb.), favori takımlar için ikon, oran/olay sayısı gibi mikro bilgiler göster.
- Filtre çubuğu ekle (bugün / yarın / tüm maçlar, sadece favori ligler, canlı maçlar vb.) ve bu filtreyi header altına sabitle.
- **Players sayfası – Oyuncu keşif hub’ı**:
- Üstte, global aramaya yönlendiren bir "hero" alanı (kısa açıklama + "Search players" call-to-action butonu) tasarla.
- Altında "Trending Players", "Top Rated" (varsa), "Most searched" gibi bölümler için yatay scroll kart stripleri veya grid’ler kullan.
- Oyuncu kartlarında fotoğraf, isim, pozisyon, takım, ülke bayrağı ve basit istatistikler (ör. maç sayısı, gol/asist) için mini layout hazırla.
- **Teams sayfası – Lig bazlı takım keşfi**:
- Lig seçimi veya popüler ligler için üstte filtremeler ekle (dropdown veya yatay lig chip’leri).
- Takımları lig bazlı section’larda göster; her takım kartında logo, isim, ülke, mevcut lig sırası (varsa) ve son form (W/D/L mini strip) gibi veriler sun.
- Hem masaüstü hem mobilde okunabilir, kompakt ama zengin kart/grid yapısı kur.

### 5. Maç Detay, Oyuncu ve Takım Sayfalarında İleri Seviye UX

- **Maç detay sayfası (`src/app/matches/[slug]/page.tsx`)**:
- Tabs yapısını (Match info / Live / Lineups / Stats / H2H vb.) Sofascore benzeri net ikonlar ve sticky tab bar ile güçlendir.
- Timeline: Gol, kart, değişiklik ve önemli olayları dakika bazlı zaman çizelgesi olarak göster; home/away hizalaması ve ikonlar kullan.
- İstatistik sekmesinde: bar chart, possession donut, şut/iskelet grafikleri gibi temel veri görselleştirmelerini (varsa mevcut chart bileşenleriyle) uygula.
- Oyuncu reytingi (şimdilik basit bir skor veya placeholder) için uygun UI yeri ayır; ileride veri gelince doldurulabilecek şekilde tasarla.
- **Oyuncu detay sayfası (`src/app/players/[slug]/page.tsx`)**:
- Üstte büyük oyuncu header: fotoğraf, isim, yaş, ülke, pozisyon, takım, forma numarası; altında kısa özet satırı.
- Sekmeli içerik: Overview (temel bilgiler + sezon istatistikleri), Matches (son maç performansı tablosu), Stats (detaylı sezon istatistikleri), Career (zaten var olan kariyer komponentini zenginleştirerek).
- Kart ve tablo kombinasyonlarıyla, hem mobil hem masaüstü için okunabilir yoğun istatistik alanları tasarla.
- **Takım detay sayfası (`src/app/teams/[slug]/page.tsx`)**:
- Üst header: logo, takım adı, lig/ülke bilgisi, mevcut sıralama, form sayacı (W/W/D/L strip).
- Sekmeler: Overview (özet + kritik istatistikler), Squad, Fixtures, Standings (ilgili lig tablosuna anchor veya embed), Stats.
- Squad görünümünde kart + tablo karması; filtrelenebilir (pozisyona göre) ve mobilde iyi çalışan bir layout.

### 6. Kişiselleştirme ve Favoriler (MVP)

- **Favori lig/takım/oyuncu işaretleme**:
- Maç ve kart bileşenlerine küçük "star" veya benzeri ikonlar ekleyip, tıklanınca favorilere ekle/çıkar işlevi tanımla.
- Favoriler durumunu en azından `localStorage` bazlı sakla; ileride user auth gelirse API tarafına taşınabilecek şekilde soyutla.
- **Anasayfayı kişiselleştirme**:
- "Your favorites" başlıklı bir üst section ekleyip, kullanıcının favori lig ve takımlarına dair yakında oynanacak maçları öne çıkar.
- Favori yokken boş state için yönlendirici bir UI ("Favori takım ekle" çağrısı) göster.

### 7. Veri Görselleştirme ve Skeleton/Loading Durumları

- **Grafik altyapısı**:
- `src/components/ui/chart.tsx` ve ilgili bileşenleri kullanarak basit bar/donut chart şablonları tanımla (şutlar, isabet, topa sahip olma vb.).
- **Heatmap/advanced görünümler (ileriye dönük)**:
- Şimdilik oyuncu/takım detaylarında heatmap gibi gelişmiş görünümler için UI placeholder alanları tasarla; veri hazır olduğunda doldurulacak şekilde komponent sınırlarını belirle.
- **Skeleton ve boş durumlar**:
- Tüm kritik sayfalarda (anasayfa, maç detay, oyuncu, takım) yükleme sırasında skeleton ve shimmer efektlerini kullan; boş state’lerde anlamlı ikon + açıklama + CTA kombinasyonu uygula.

(Devamındaki başlık numaralarını birer artır: Cookie dialog artık 8, Terms/Privacy 9, Görsel İnce Ayarlar 10 olacak.)

### 5. Cookie Accept Dialog

- **UI bileşeni tasarla**: `src/components/ui` altında veya `src/components/layout` içinde `cookie-consent.tsx` gibi bir bileşen oluştur; mevcut `Dialog`/`AlertDialog` veya `Sheet` komponentlerini kullanarak alt taraftan kayan, minimal fakat belirgin bir cookie banner tasarla.
- **Davranış ve depolama**: Kullanıcının kabul/ret durumunu `localStorage` veya cookie ile sakla; bir kez yanıt verildikten sonra dialog tekrar gösterilmesin. Gizlilik/şartlar sayfalarına linkler ekle.
- **Layout’a entegre et**: `RootLayout` içinde (örneğin `ThemeProvider` altında) bu bileşeni render ederek tüm sayfalarda göster.

### 6. Terms ve Privacy Sayfaları

- **Rota ve sayfa yapısı**: `src/app/terms/page.tsx` ve `src/app/privacy/page.tsx` dosyalarını oluştur; `Metadata` ile temel SEO başlık/açıklamaları ekle.
- **Tasarım**: Tailwind Typography plugin’ine uygun, okunabilir, tek kolonlu bir içerik düzeni kullan (örneğin `prose prose-sm md:prose-base max-w-3xl mx-auto py-10` gibi bir yapı) ve temaya uygun başlık/alt başlık hiyerarşisi kur.
- **Footer linkleri ile hizalama**: `Footer` içinde zaten var olan Terms ve Privacy linklerinin bu yeni sayfalarla uyumlu olduğundan ve çalıştığından emin ol.

### 7. Görsel İnce Ayarlar ve UX Detayları

- **Tipografi & spacing**: `globals.css`’teki tema değişkenlerine sadık kalarak, başlıklar, gövde metni, etiketler için FotMob/Sofascore benzeri hiyerarşi (H1/H2 boyutları, satır aralıkları, tracking) uygula; match list ve kartlarda daha sıkı vertical rhythm sağla.
- **Animasyonlar**: `tw-animate-css` kullanarak, canlı maçlar, hover durumları ve modallerde hafif animasyonlar ekle (fade, slide-up, scale-in). Aşırı dikkat dağıtıcı olmayan, performans dostu animasyonlar tercih et.
- **Responsive ve mobile UX**: Sidebar’ın mobilde `Sheet` moduna geçtiğinden emin ol; header aramasını mobile’da tam ekran veya geniş bir overlay input’a dönüştür; kart ve liste yapılarının 1 kolonlu mobil layout’ta da rahat okunabilir olmasına dikkat et.
