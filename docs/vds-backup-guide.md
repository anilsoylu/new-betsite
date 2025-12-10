# VDS Database Backup Rehberi

## Mevcut Durum

- rclone v1.72.0 kurulu
- Config dosyası henuz oluşturulmamış

---

## Adım 1: Local Bilgisayarında rclone Kur (Token Almak İçin)

VDS headless olduğu için tarayıcı yok. Bu yüzden token'ı local bilgisayarında oluşturup VDS'e aktaracaksın.

### macOS'ta rclone Kurulumu:

```bash
brew install rclone
```

### Windows'ta:

https://rclone.org/downloads/ adresinden indir

---

## Adım 2: Local Bilgisayarında Google Drive Bağlantısı Yap

Terminal'de şunu çalıştır:

```bash
rclone config
```

Aşağıdaki adımları takip et:

```
n/s/q> n                          # Yeni remote oluştur
name> gdrive                      # İsim: gdrive
Storage> drive                    # Google Drive seç (veya numara gir)
client_id>                        # Boş bırak, Enter
client_secret>                    # Boş bırak, Enter
scope> 1                          # Full access
service_account_file>             # Boş bırak, Enter
Edit advanced config> n           # Hayır
Use auto config> y                # Evet (tarayıcı açılacak)
```

**Tarayıcıda:**

1. Google hesabına giriş yap
2. "Allow" butonuna tıkla
3. "Success!" mesajını gör

Devam:

```
Configure as team drive> n        # Hayır
y/e/d> y                          # Kaydet
q                                 # Çık
```

---

## Adım 3: Config Dosyasını Görüntüle

Local bilgisayarında:

```bash
cat ~/.config/rclone/rclone.conf
```

Çıktı şuna benzer olacak:

```ini
[gdrive]
type = drive
scope = drive
token = {"access_token":"ya29.xxx...","token_type":"Bearer","refresh_token":"1//xxx...","expiry":"2025-12-05T..."}
```

**Bu içeriği kopyala!**

---

## Adım 4: VDS'e Config'i Aktar

VDS'te şu komutları çalıştır:

```bash
# Config klasörü oluştur
mkdir -p ~/.config/rclone

# Config dosyasını oluştur
nano ~/.config/rclone/rclone.conf
```

Nano açıldığında:

1. Local'den kopyaladığın içeriği yapıştır
2. `Ctrl + X` → `Y` → `Enter` ile kaydet

---

## Adım 5: Bağlantıyı Test Et

VDS'te:

```bash
rclone lsd gdrive:
```

Google Drive klasörlerini görüyorsan bağlantı başarılı!

---

## Adım 6: Backup Klasörü Oluştur

```bash
rclone mkdir gdrive:betsite-backups
```

---

## Adım 7: Backup Script'i Oluştur

```bash
# Scripts klasörü oluştur
mkdir -p /root/scripts
mkdir -p /root/logs

# Script'i oluştur
nano /root/scripts/backup-db.sh
```

Aşağıdaki içeriği yapıştır:

```bash
#!/bin/bash

# Log dosyası
LOG_FILE="/root/logs/backup.log"

# Değişkenler (DATA_DIR'i kendi klasörüne göre güncelle)
DATA_DIR="/var/www/socceroffices.com/data"
DB_PATH="$DATA_DIR/sitemap-cache.sqlite"
BACKUP_DIR="/tmp/db-backups"
DATE=$(date +%Y-%m-%d_%H-%M)
DB_BACKUP_NAME="sitemap_cache_${DATE}.db.gz"
DATA_BACKUP_NAME="data_folder_${DATE}.tar.gz"
GDRIVE_FOLDER="betsite-backups"

# Log başlat
echo "[$(date)] Backup başlatılıyor..." >> "$LOG_FILE"

# Backup klasörü oluştur
mkdir -p "$BACKUP_DIR"

# SQLite'ı güvenli şekilde yedekle (WAL mode için)
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/sitemap_cache_backup.db'"

# DB'yi sıkıştır
gzip -c "$BACKUP_DIR/sitemap_cache_backup.db" > "$BACKUP_DIR/$DB_BACKUP_NAME"

# Data klasörünü arşivle (WAL/shm dahil)
tar -czf "$BACKUP_DIR/$DATA_BACKUP_NAME" -C "$DATA_DIR" .

# Google Drive'a yükle (DB + data arşivi) — log seviyesini INFO yap
rclone copy "$BACKUP_DIR/$DB_BACKUP_NAME" "gdrive:$GDRIVE_FOLDER/" --log-level INFO --log-file="$LOG_FILE"
rclone copy "$BACKUP_DIR/$DATA_BACKUP_NAME" "gdrive:$GDRIVE_FOLDER/" --log-level INFO --log-file="$LOG_FILE"

# Temp dosyalarını isteğe bağlı sil (otomatik silmek istersen yorumları kaldır)
# rm -f "$BACKUP_DIR/sitemap_cache_backup.db"
# rm -f "$BACKUP_DIR/$DB_BACKUP_NAME"
# rm -f "$BACKUP_DIR/$DATA_BACKUP_NAME"

# 7 günden eski yedekleri sil (opsiyonel)
rclone delete "gdrive:$GDRIVE_FOLDER/" --min-age 7d --log-file="$LOG_FILE"

echo "[$(date)] Backup tamamlandı: $DB_BACKUP_NAME ve $DATA_BACKUP_NAME" >> "$LOG_FILE"
```

Kaydet: `Ctrl + X` → `Y` → `Enter`

---

## Adım 8: Script'i Çalıştırılabilir Yap

```bash
chmod +x /root/scripts/backup-db.sh
```

---

## Adım 9: Manuel Test

```bash
/root/scripts/backup-db.sh
```

Sonra kontrol et:

```bash
# Log'a bak
cat /root/logs/backup.log

# Google Drive'da kontrol et
rclone ls gdrive:betsite-backups/
```

---

## Adım 10: Cron Job Ekle (Her Gece 03:00)

```bash
crontab -e
```

En alta şu satırı ekle:

```
0 3 * * * /root/scripts/backup-db.sh >> /root/logs/backup.log 2>&1
```

Kaydet ve çık.

Cron'u kontrol et:

```bash
crontab -l
```

---

## Özet

| Dosya         | Konum                             |
| ------------- | --------------------------------- |
| rclone config | `~/.config/rclone/rclone.conf`    |
| Backup script | `/root/scripts/backup-db.sh`      |
| Log dosyası   | `/root/logs/backup.log`           |
| Yedekler      | Google Drive → `betsite-backups/` |

---

## Sorun Giderme

### "sqlite3 command not found"

```bash
apt install sqlite3
```

### Google Drive bağlantı hatası

```bash
rclone config reconnect gdrive:
```

### Yedekleri manuel listele

```bash
rclone ls gdrive:betsite-backups/
```

### Log'ları izle

```bash
tail -f /root/logs/backup.log
```
