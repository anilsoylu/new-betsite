# Vote Rate Limit Bypass Sorunu - Analiz Raporu

## Mevcut Durum

Gizli sekmeden sınırsız oy verilebiliyor. 15 farklı `voter_id` ile aynı maça oy verilmiş.

## Kök Neden Analizi

### 1. Cookie Tabanlı Kimlik Sistemi
- Her tarayıcı oturumu (gizli sekme dahil) yeni bir `voter_id` (UUID) alıyor
- Gizli sekme = yeni cookie context = yeni UUID
- Her yeni UUID ile "ilk oy" verilebiliyor (`change_count=0`)

### 2. Fingerprint Gönderilmiyor (Gizli Sekmede)
Gizli sekmede fingerprint boş geliyor:
- sessionStorage gizli modda izole/engellenmiş
- Canvas/WebGL fingerprinting gizli modda farklı davranabilir

### 3. Rate Limit Tablosu Durumu
```
IP: 212.253.197.189
Fingerprint: NTMwZmRiOW... (dolu - normal sekmeden)
Count: 3
```
Gizli sekmeden gelen oylar rate limit tablosunda **görünmüyor** - bu demek ki ya:
- Farklı IP ile geliyor (Cloudflare edge değişiyor)
- Ya da fingerprint boş olduğu için farklı bucket'a düşüyor

### 4. Match Votes Tablosu
```sql
SELECT voter_id, choice, change_count FROM match_votes WHERE fixture_id = 19433594;
-- 15 farklı voter_id, hepsi change_count=0
```

## Mevcut Koruma Katmanları ve Durumları

| Katman | Durum | Sorun |
|--------|-------|-------|
| Cookie (voter_id) | ❌ Bypass edildi | Her gizli sekme yeni cookie |
| IP Rate Limit | ⚠️ Kısmen çalışıyor | Cloudflare IP değişiyor olabilir |
| Fingerprint | ❌ Çalışmıyor | Gizli sekmede boş geliyor |
| IP+FP Kombine | ❌ Çalışmıyor | Boş FP ayrı bucket oluşturuyor |

## Cloudflare IP Sorunu

Cloudflare her istek için farklı edge sunucu kullanabiliyor:
- `162.158.130.3` (Cloudflare edge 1)
- `162.158.129.180` (Cloudflare edge 2)
- `172.70.216.75` (Cloudflare edge 3)

`CF-Connecting-IP` header'ı eklendi ama Cloudflare proxy chain'i karmaşık.

## Yapılan Nginx Değişiklikleri

**Dosya:** `/etc/nginx/sites-available/socceroffices.com`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name socceroffices.com www.socceroffices.com;

    location /uploads/ {
        alias /var/www/socceroffices.com/public/uploads/;
        autoindex on;
        expires max;
    }

    location /_next/ {
        proxy_pass http://localhost:3000/_next/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;  # Cloudflare
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;  # Cloudflare
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Eklenen Header'lar:**
- `X-Real-IP $remote_addr` - Nginx'in gördüğü IP (Cloudflare edge IP)
- `X-Forwarded-For $proxy_add_x_forwarded_for` - Proxy chain
- `CF-Connecting-IP $http_cf_connecting_ip` - Cloudflare'den gelen gerçek kullanıcı IP

## Önerilen Çözümler

### Çözüm 1: IP Bazlı Sert Limit (Önerilen)
Fingerprint'ten bağımsız, sadece IP bazlı toplam limit:
```typescript
// Tüm fingerprint'lerin toplamı için IP başına limit
SELECT SUM(count) FROM vote_rate_limits WHERE ip = ? AND bucket = ?
```
**Durum:** Implementasyona eklendi ama test edilmedi

### Çözüm 2: Fixture Başına IP Limiti
Her IP'nin her maç için max oy sayısı:
```sql
CREATE TABLE fixture_ip_votes (
  fixture_id INTEGER,
  ip TEXT,
  vote_count INTEGER,
  PRIMARY KEY (fixture_id, ip)
);
-- Max 3 oy/IP/maç
```

### Çözüm 3: hCaptcha Ekleme
Her oy için captcha (UX kötü ama kesin çözüm)

### Çözüm 4: Cloudflare Turnstile
Cloudflare'in kendi bot koruması, daha az müdahaleci

### Çözüm 5: Device/Browser Fingerprint (FingerprintJS)
Profesyonel fingerprinting kütüphanesi (ücretli)

## Tavsiye Edilen Aksiyon Planı

1. **Kısa Vadeli (Hemen):**
   - Fixture başına IP limiti ekle (max 5 oy/IP/maç)
   - Bu gizli sekme bypass'ını tamamen engeller

2. **Orta Vadeli:**
   - Cloudflare Turnstile entegrasyonu
   - Daha iyi UX, bot koruması

3. **Uzun Vadeli:**
   - Kullanıcı kaydı gerektir (opsiyonel)
   - OAuth ile giriş

## Test Senaryoları

```bash
# Rate limit tablosunu temizle
sqlite3 data/match-votes.sqlite 'DELETE FROM vote_rate_limits'

# Gizli sekmeden 5+ oy ver

# Kontrol et
sqlite3 data/match-votes.sqlite 'SELECT ip, fingerprint, count FROM vote_rate_limits'
```

## Dosya Referansları

- `src/app/api/fixtures/[id]/votes/route.ts` - API endpoint
- `src/lib/vote-db/queries.ts` - Rate limit logic
- `src/lib/vote-db/connection.ts` - DB schema
- `src/lib/vote-fingerprint/index.ts` - Fingerprint utility
- `src/components/match-detail/match-vote-card.tsx` - Client component
