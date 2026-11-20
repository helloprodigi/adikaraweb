# Migrasi Adikara dari Vercel ke VPS Ubuntu (Docker + Caddy)

Target: `https://adikara.helloprodigi.pro` di VPS Ubuntu yang **sudah menjalankan Caddy**
dengan automatic HTTPS. Aplikasi dijalankan sebagai container Docker dan hanya
terdengar di `127.0.0.1:3000`; Caddy yang memegang 80/443.

> **Aturan penting:** jangan mengubah aplikasi atau Blok/route Caddy lain. File Caddy
> Adikara ditambahkan sebagai file site terpisah. Jika perlu menyentuh Caddyfile utama,
> cukup tambahkan satu baris `import` di level paling atas.

---

## 0. Verifikasi DNS dulu (sebelum HTTPS)

Domain saat ini masih mengarah ke Vercel. Pindahkan A/AAAA record
`adikara.helloprodigi.pro` ke IP publik VPS, lalu tunggu propagasi.

```bash
# Di komputer/local atau VPS
dig +short A adikara.helloprodigi.pro
curl -4 https://ifconfig.me
```

Keduanya **harus sama** dengan IP VPS. Jangan lanjut ke langkah Caddy kalau belum
cocok — Caddy akan gagal mengambil sertifikat Let's Encrypt.

---

## 1. Siapkan VPS

```bash
sudo apt update
sudo apt install -y git ca-certificates curl

# Install Docker + Compose plugin kalau belum ada
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker

docker --version
docker compose version
```

Buat direktori deploy (ganti user kalau perlu):

```bash
sudo mkdir -p /srv/adikara
sudo chown -R "$USER":"$USER" /srv/adikara
```

### Deploy key GitHub

Repo bersifat private dan clone memakai SSH. Buat key khusus VPS:

```bash
ssh-keygen -t ed25519 -C "adikara-vps" -f ~/.ssh/adikara_deploy
cat ~/.ssh/adikara_deploy.pub
```

Tambahkan public key tersebut ke **GitHub repo → Settings → Deploy keys → Add deploy key**.
Centang **Allow write access tidak perlu** (read-only cukup untuk `git pull`).

Agar SSH otomatis memakai key itu:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github-adikara
  HostName github.com
  User git
  IdentityFile ~/.ssh/adikara_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

Clone dengan alias host tersebut:

```bash
cd /srv
git clone git@github-adikara:helloprodigi/adikaraweb.git adikara
cd /srv/adikara
git status -sb
```

---

## 2. Environment produksi

File `.env` tidak ikut ter-commit. Buat dari contoh:

```bash
cd /srv/adikara
cp .env.example .env
openssl rand -base64 32
```

Tempel hasil `openssl` ke `ADIKARA_REVEAL_SECRET` di `.env`.

```bash
nano .env
```

> **Penting:** kalau pengguna sudah punya cookie score-check dari Vercel, pakai
> **nilai `ADIKARA_REVEAL_SECRET` yang sama seperti di Vercel** supaya cookie lama
> tidak langsung invalid. Kalau beda, pengguna cukup mengisi NIM lagi karena reveal
> sudah lewat, tetapi akan terasa seperti " logout ".

---

## 3. Build & jalankan container

```bash
cd /srv/adikara
docker compose up -d --build
docker compose ps
docker compose logs -f adikara
```

Cek lokal sebelum Caddy dipasang:

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000
# harus 200
```

Port 3000 **tidak boleh** dibuka ke publik. Compose sudah membatasi ke loopback.
Kalau pakai UFW, cukup izinkan 80/443 (Caddy):

```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 4. Tambahkan route Caddy (aman, tidak menyentuh route lain)

Lihat dulu struktur Caddyfile yang ada:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
grep -n "import" /etc/caddy/Caddyfile || true
```

### Kasus A — sudah ada import directory

Kalau ada baris seperti `import /etc/caddy/sites/*.caddy`, tinggal taruh file:

```bash
sudo mkdir -p /etc/caddy/sites
sudo cp deploy/caddy/adikara.caddy /etc/caddy/sites/adikara.caddy
sudo chown root:root /etc/caddy/sites/adikara.caddy
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### Kasus B — belum ada import

Backup dulu, lalu tambahkan **satu baris** di level paling atas Caddyfile (di luar
blok site mana pun). Ini tidak mengubah route yang sudah ada.

```bash
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak.$(date +%F-%H%M)
sudo mkdir -p /etc/caddy/sites
sudo cp deploy/caddy/adikara.caddy /etc/caddy/sites/adikara.caddy
sudo vim /etc/caddy/Caddyfile
# Tambahkan di baris paling atas:
#   import /etc/caddy/sites/*.caddy

sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo journalctl -u caddy -n 50 --no-pager
```

Kalau Caddy justru berjalan sebagai container di Docker network yang sama,
ganti upstream di `adikara.caddy` menjadi `reverse_proxy adikara:3000`.

---

## 5. Uji produksi

```bash
curl -I https://adikara.helloprodigi.pro
curl -fsS https://adikara.helloprodigi.pro/ | head -c 200
```

Cek juga halaman yang memakai data server:

```bash
curl -I https://adikara.helloprodigi.pro/rankings
curl -I https://adikara.helloprodigi.pro/team-score
```

Setelah semua OK, domain boleh dilepas dari Vercel (opsional, sebagai cleanup).
Vercel bisa dibiarkan aktif sebagai rollback sampai DNS benar-benar stabil.

---

## 6. Update aplikasi berikutnya

```bash
cd /srv/adikara
git pull --ff-only
docker compose up -d --build
docker image prune -f
```

Rollback cepat: arahkan DNS kembali ke Vercel, atau:

```bash
cd /srv/adikara
git checkout <commit-sebelumnya>
docker compose up -d --build
```

---

## Catatan aplikasi

- Node minimal 20.9; image memakai `node:22-bookworm-slim`.
- Next.js memakai `output: "standalone"`, jadi image runtime tidak perlu `npm install`.
- Reveal tetap server-authoritative (18:00 WIB, berdasarkan jam server).
- `ADIKARA_REVEAL_SECRET` hanya dibaca di server, tidak pernah masuk client bundle.
- Data HP tidak ikut response API / bundle client.
