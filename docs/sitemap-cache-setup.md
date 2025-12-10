# Sitemap Cache Setup Guide

Bu rehber, SQLite tabanlı sitemap cache sisteminin kurulumu ve kullanımını açıklar.

## Genel Bakış

Sitemap cache sistemi, Sportmonks API'sinden bağımsız olarak sitemap'lerin oluşturulmasını sağlar. Bu sayede:

- Rate limit veya API kesintilerinde sitemap'ler çalışmaya devam eder
- Sitemap route'ları hiçbir zaman doğrudan API'yi çağırmaz
- Site trafiği cache'i otomatik olarak doldurur
- Sync script ile toplu veri çekimi yapılabilir

## Ön Gereksinimler

- Node.js 18+ veya Bun 1.0+
- 100MB+ disk alanı (veritabanı için)
- `API_SPORTMONKS_KEY` environment variable

## İlk Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
bun install
# veya
npm install
```

### 2. Veritabanını Başlatın

Veritabanı ilk kullanımda otomatik oluşturulur. Manuel test için:

```bash
# Cache istatistiklerini göster (veritabanı yoksa oluşturur)
bun sync:sitemap -- --stats
```

### 3. İlk Sync'i Çalıştırın

```bash
# Tüm entity'leri sync et (varsayılan 20 sayfa)
bun sync:sitemap

# Veya entity bazlı sync
bun sync:leagues      # Sadece ligler
bun sync:teams        # Sadece takımlar
bun sync:players      # Sadece oyuncular
bun sync:matches      # Sadece maçlar
```

## Manuel Sync Komutları

```bash
# Tüm entity'leri sync et
bun sync:sitemap

# Belirli entity'yi sync et
bun sync:sitemap -e leagues
bun sync:sitemap -e teams
bun sync:sitemap -e players
bun sync:sitemap -e matches

# Max sayfa sayısını belirle
bun sync:sitemap -e players -m 50    # Max 50 sayfa

# Cache istatistiklerini göster
bun sync:sitemap --stats

# Yardım mesajı
bun sync:sitemap --help
```

## Cron Job Kurulumu (Self-Hosted)

### Linux/macOS - Crontab

```bash
# Crontab'ı düzenle
crontab -e

# Her 6 saatte bir tüm entity'leri sync et
0 */6 * * * cd /path/to/project && /usr/local/bin/bun sync:sitemap >> /var/log/sitemap-sync.log 2>&1

# Veya entity bazlı farklı zamanlarda
0 0 * * * cd /path/to/project && /usr/local/bin/bun sync:leagues >> /var/log/sitemap-sync.log 2>&1
0 2 * * * cd /path/to/project && /usr/local/bin/bun sync:teams >> /var/log/sitemap-sync.log 2>&1
0 4 * * * cd /path/to/project && /usr/local/bin/bun sync:players >> /var/log/sitemap-sync.log 2>&1
0 */3 * * * cd /path/to/project && /usr/local/bin/bun sync:matches >> /var/log/sitemap-sync.log 2>&1
```

### systemd Timer (Önerilen)

`/etc/systemd/system/sitemap-sync.service`:

```ini
[Unit]
Description=Sitemap Cache Sync
After=network.target

[Service]
Type=oneshot
User=www-data
WorkingDirectory=/path/to/project
Environment=API_SPORTMONKS_KEY=your_api_key_here
ExecStart=/usr/local/bin/bun sync:sitemap
StandardOutput=journal
StandardError=journal
```

`/etc/systemd/system/sitemap-sync.timer`:

```ini
[Unit]
Description=Run sitemap sync every 6 hours

[Timer]
OnBootSec=15min
OnUnitActiveSec=6h
RandomizedDelaySec=5min

[Install]
WantedBy=timers.target
```

Timer'ı etkinleştir:

```bash
sudo systemctl daemon-reload
sudo systemctl enable sitemap-sync.timer
sudo systemctl start sitemap-sync.timer

# Durumu kontrol et
sudo systemctl status sitemap-sync.timer
sudo journalctl -u sitemap-sync.service -f
```

### PM2 ile Cron

```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sitemap-sync',
    script: 'bun',
    args: 'sync:sitemap',
    cwd: '/path/to/project',
    cron_restart: '0 */6 * * *',  // Her 6 saatte
    autorestart: false,
    watch: false,
    env: {
      API_SPORTMONKS_KEY: 'your_api_key'
    }
  }]
}
```

## Monitoring

### Cache İstatistikleri

```bash
bun sync:sitemap --stats
```

Çıktı:
```
📊 Sitemap Cache Statistics
────────────────────────────────────────
  Leagues:  1,234
  Teams:    45,678
  Players:  123,456
  Matches:  9,876
────────────────────────────────────────
  Database: 45.23 MB
```

### Log Dosyası

Cron job'larınızın çıktısını bir log dosyasına yönlendirin:

```bash
# Tarihlı log
0 */6 * * * cd /path/to/project && /usr/local/bin/bun sync:sitemap >> /var/log/sitemap-sync-$(date +\%Y\%m\%d).log 2>&1
```

### Panic Mode İzleme

Sync script rate limit veya API hatası durumunda "panic mode"a girer:
- 429 (rate limit) → 30 dakika bekleme
- 5xx (server error) → 30 dakika bekleme

Log'larda şu mesajları arayın:
```
[leagues] 🚨 PANIC MODE activated until 2024-01-15T14:30:00.000Z
[leagues] ⏸️  Panic mode active, 15 minutes remaining
```

## Troubleshooting

### Veritabanı Dosyası Bulunamıyor

Veritabanı `data/sitemap-cache.sqlite` konumunda oluşturulur. `data/` klasörü yoksa otomatik oluşturulur.

```bash
# Manuel kontrol
ls -la data/
```

### "SQLITE_BUSY" Hatası

Birden fazla process aynı anda veritabanına yazıyorsa bu hata oluşabilir. WAL mode etkin olduğu için nadir görülür. Cron job'ların çakışmamasına dikkat edin.

### API Key Hatası

```bash
# Environment variable kontrol
echo $API_SPORTMONKS_KEY

# Doğrudan belirtme
API_SPORTMONKS_KEY=your_key bun sync:sitemap
```

### Rate Limit Aşıldı

- Sync script otomatik olarak panic mode'a girer
- 30 dakika sonra tekrar deneyin
- `--max-pages` değerini düşürün
- Entity bazlı sync yapın, tamamını aynı anda çalıştırmayın

## Yapılandırma

Konfigürasyon `src/lib/sitemap-cache/config.ts` dosyasındadır:

```typescript
export const SITEMAP_CONFIG = {
  // Veritabanı konumu
  databasePath: './data/sitemap-cache.sqlite',

  // Sitemap sayfa başına URL sayısı
  PAGE_SIZE: {
    leagues: 10_000,
    teams: 25_000,
    players: 50_000,
    matches: 50_000,
  },

  // Saatlik rate limit (entity başına)
  RATE_LIMITS: {
    leagues: 2500,
    teams: 2500,
    players: 2500,
    matches: 2500,
  },

  // Sitemap'te gösterilecek maç penceresi
  MATCH_WINDOW_DAYS: {
    past: 30,
    future: 30,
  },

  // Panic mode süresi (dakika)
  PANIC_MODE_DURATION_MINUTES: 30,
};
```

## Sitemap URL'leri

Cache dolduktan sonra şu URL'ler kullanılabilir:

- `/sitemap.xml` - Ana sitemap (statik + index referansları)
- `/sitemap/en/leagues.xml` - Lig sitemap index
- `/sitemap/en/leagues/1.xml` - Lig URL'leri (sayfalı)
- `/sitemap/en/teams.xml` - Takım sitemap index
- `/sitemap/en/teams/1.xml` - Takım URL'leri (sayfalı)
- `/sitemap/en/players.xml` - Oyuncu sitemap index
- `/sitemap/en/players/1.xml` - Oyuncu URL'leri (sayfalı)
- `/sitemap/en/matches.xml` - Maç sitemap index
- `/sitemap/en/matches/1.xml` - Maç URL'leri (sayfalı)

## Organik Cache Büyümesi

Site trafiği cache'i otomatik doldurur. Sayfa bileşenleri `cached-football-api.ts` kullandığında:

1. Kullanıcı `/players/messi-123` sayfasını ziyaret eder
2. `getPlayerById(123)` çağrılır
3. Sportmonks'tan veri çekilir
4. Oyuncu cache'e eklenir (fire-and-forget)
5. Sonraki sitemap güncellemesinde URL görünür

Sync script bu süreci hızlandırır ama zorunlu değildir.

## Bakım

### Eski Verileri Temizleme (Opsiyonel)

Veriler asla fiziksel olarak silinmez. `include_in_sitemap = 0` ile soft-exclude yapılır.

```sql
-- Örnek: 1 yıldan eski maçları sitemap'ten çıkar
UPDATE matches
SET include_in_sitemap = 0
WHERE kickoff_at < datetime('now', '-1 year');
```

### Veritabanını Sıkıştırma (Opsiyonel)

```bash
sqlite3 data/sitemap-cache.sqlite "VACUUM;"
```
