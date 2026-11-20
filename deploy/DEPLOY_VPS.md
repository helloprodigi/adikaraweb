# Migrasi Adikara 2026 → VPS Prodigi (Docker + Caddy)

## Fakta environment VPS (hasil inspeksi)

- VPS: `43.173.39.227`, Ubuntu 24.04.4 LTS, akses `ssh vps-prodigi`.
- Caddy **berjalan sebagai container** `caddy` (`caddy:2`), bukan systemd.
- Config Caddy: `/srv/proxy/Caddyfile`. Reload: `/srv/proxy/reload.sh`.
- Semua app berbagi network Docker `web` (external). Caddy proxy ke **nama container**, bukan `127.0.0.1`.
- Sudah ada app lain — **jangan disentuh**:
  - `/srv/apps/helloprodigi` → `helloprodigi-app`, domain `helloprodigi.pro`
  - `/srv/apps/myprodigi` → `myprodigi-app`, domain `my.helloprodigi.pro`
  - `/srv/apps/adikara` → `adikara-app`, domain `dm.helloprodigi.pro` (**ini app data-mining, bukan repo ini**)
- Karena itu app ini memakai nama berbeda:
  - Path: `/srv/apps/adikara-web`
  - Project compose: `adikaraweb`
  - Container: `adikara-web`
  - Image: `adikara-web:latest`
  - Domain: `adikara.helloprodigi.pro`

> **Aturan:** hanya menambah blok site baru di Caddyfile. Jangan edit blok domain lain.

---

## 0. DNS dulu

Saat ini `adikara.helloprodigi.pro` masih mengarah ke Vercel:

```bash
dig +short CNAME adikara.helloprodigi.pro
dig +short A adikara.helloprodigi.pro
```

Ganti DNS ke A record `43.173.39.227`, lalu tunggu propagasi. Jangan lanjut ke langkah
Caddy sebelum hasil `dig +short A adikara.helloprodigi.pro` = `43.173.39.227`.

---

## 1. Kirim kode ke VPS

Pola deploy VPS ini memakai `git archive` dari laptop (tidak perlu deploy key GitHub di VPS).
Dari folder repo ini di laptop:

```bash
git fetch origin main
git archive --format=tar origin/main | ssh vps-prodigi \
  'mkdir -p /srv/apps/adikara-web/src.new && rm -rf /srv/apps/adikara-web/src.new/* && tar -x -C /srv/apps/adikara-web/src.new && rm -rf /srv/apps/adikara-web/src && mv /srv/apps/adikara-web/src.new /srv/apps/adikara-web/src'
ssh vps-prodigi 'echo $(git rev-parse --short origin/main) > /srv/apps/adikara-web/src/.deployed-commit'
```

Salin compose file dan Caddy snippet:

```bash
scp docker-compose.yml vps-prodigi:/srv/apps/adikara-web/docker-compose.yml
scp deploy/caddy/adikara.caddy vps-prodigi:/srv/proxy/adikara.caddy
```

> Kalau lebih mau pakai deploy key GitHub, itu juga boleh — tapi pola `git archive`
> di atas sudah sesuai README VPS dan tidak mengubah repo lain.

---

## 2. Environment

Buat `.env` di `/srv/apps/adikara-web`. Secret HMAC reveal **harus** diisi; kalau ada
cookie score-check dari Vercel dan ingin tetap valid, pakai nilai `ADIKARA_REVEAL_SECRET`
yang sama dengan di Vercel.

```bash
ssh vps-prodigi
cd /srv/apps/adikara-web
cat > .env <<'EOF'
ADIKARA_REVEAL_SECRET=isi-dengan-secret-yang-sama-seperti-di-vercel
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
EOF
chmod 600 .env
```

Tanpa nilai itu aplikasi masih jalan memakai fallback hard-coded, tetapi sebaiknya
diganti dengan secret produksi.

---

## 3. Build & jalankan

```bash
cd /srv/apps/adikara-web
docker compose up -d --build
docker compose ps
docker logs -f --tail 50 adikara-web
```

Cek internal (dari container Caddy atau container lain di network `web`):

```bash
docker run --rm --network web curlimages/curl:latest -fsS -o /dev/null -w '%{http_code}\n' http://adikara-web:3000
# harus 200
```

Atau cek dari dalam container itu sendiri:

```bash
docker exec adikara-web node -e "fetch('http://127.0.0.1:3000/').then(r=>console.log(r.status))"
```

Container **tidak membuka port ke host**; hanya reachable lewat network `web`.

---

## 4. Pasang route Caddy (setelah DNS sesuai)

Tambahkan blok berikut di akhir `/srv/proxy/Caddyfile` (append, jangan ubah blok lain):

```caddyfile
adikara.helloprodigi.pro {
	encode zstd gzip
	reverse_proxy adikara-web:3000
}
```

Perintah aman:

```bash
sudo cp /srv/proxy/Caddyfile /srv/proxy/Caddyfile.bak.$(date +%F-%H%M)
cat /srv/proxy/adikara.caddy >> /srv/proxy/Caddyfile
docker exec caddy caddy validate --config /etc/caddy/Caddyfile
/srv/proxy/reload.sh
docker logs --tail 50 caddy
```

Caddy akan mengambil sertifikat Let's Encrypt otomatis kalau DNS sudah mengarah ke VPS.

---

## 5. Verifikasi

```bash
dig +short A adikara.helloprodigi.pro   # 43.173.39.227
curl -I https://adikara.helloprodigi.pro
curl -I https://adikara.helloprodigi.pro/rankings
curl -I https://adikara.helloprodigi.pro/team-score
```

Pastikan empat domain lama tetap hidup:

```bash
curl -I https://helloprodigi.pro
curl -I https://my.helloprodigi.pro
curl -I https://dm.helloprodigi.pro
```

Setelah semuanya OK, domain bisa dilepas dari Vercel. Vercel bisa dibiarkan sebagai
rollback sampai DNS stabil.

---

## 6. Update berikutnya

```bash
# dari laptop, arahkan ke commit terbaru
git fetch origin main
git archive --format=tar origin/main | ssh vps-prodigi \
  'cd /srv/apps/adikara-web && rm -rf src.new && mkdir src.new && tar -x -C src.new && rm -rf src && mv src.new src'
ssh vps-prodigi 'cd /srv/apps/adikara-web && docker compose up -d --build && docker image prune -f'
```

Rollback: arahkan DNS kembali ke Vercel, atau deploy commit lama dengan pola `git archive`
di atas.
