# Progres Proyek - MOKAS (Motor Bekas Berkualitas)

Terakhir diperbarui: 11 November 2026
Posisi saat ini: **Step 3 - Sistem Pemesanan / Booking & Pembayaran QRIS** ✅ Selesai

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Hero (headline, sub, CTA, showcase card unit unggulan)
  - [x] About (6 keunggulan + banner garansi)
  - [x] Katalog Motor (6 unit dummy, filter brand, search, kartu interaktif)
  - [x] Berita/Tips (3 artikel dummy, modal preview)
  - [x] Contact + Google Maps embed
  - [x] Navbar (desktop + mobile drawer aksesibel)
  - [x] Footer (navigasi, kontak, brand)
  - [x] Halaman 404 kustom
  - [x] Metadata SEO (title, description, Open Graph, Twitter Card)
  - [x] Logo SVG + placeholder gambar SVG (motor & berita)
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (code.gs, setup.gs) + inisiasi tabel di root project
  - [x] Panduan integrasi Apps Script & Spreadsheet di `/documentation/SETUP.md`
  - [x] Login & register (bcrypt hash, JWT session cookie)
  - [x] Role admin & user (RBAC, proteksi middleware server)
  - [x] Akun admin awal (admin@gmail.com / 123456)
  - [x] Dashboard: ringkasan statistik, users, roles, CRUD berita, profil ganti sandi
  - [x] Upload media lokal (`lib/storage.ts`) ke `public/uploads/`
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan (Sistem Booking & QRIS)
  - [x] Form booking unit motor (`/booking`) dengan nominal tanda jadi tetap Rp 200.000
  - [x] Kolom: nama lengkap pemesan, no telp/WA pemesan, alamat pembeli, opsi cek fisik di showroom, catatan rencana kunjungan
  - [x] Nomor WhatsApp admin diperbarui ke `+6281286640201`
  - [x] Alamat showroom diarahkan ke link Google Maps: `https://maps.app.goo.gl/ATsQaVJAGEJxEdFo7`
  - [x] Barcode QRIS resmi MOKAS (`/images/qris-mokas.svg`) dengan nominal Rp 200.000
  - [x] Halaman Tiket & Pembayaran QRIS (`/pesanan/[id]`) dengan instruksi bayar dan tombol konfirmasi WA
  - [x] Menu "Pesanan Anda" (`/pesanan`) di Navbar (hanya muncul saat pengguna sudah login)
  - [x] Dashboard Admin: Menu Kelola Pesanan (`/dashboard/orders`) untuk konfirmasi bayar & batalkan tiket
  - [x] Tombol pintas "Hubungi via WhatsApp" langsung ke nomor pembeli
  - [x] Banner konfirmasi: *"Selamat, pembayaran Anda telah dikonfirmasi! Silakan tunggu informasi selanjutnya dari admin melalui email/WhatsApp."*
  - [x] Build produksi 24 rute lolos 100% tanpa error
  - [ ] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [ ] Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

## Catatan & Keputusan Teknis Step 3
1. **Nominal Tanda Jadi (Booking Fee):**
   - Ditetapkan tetap sebesar **Rp 200.000** sesuai instruksi pengguna.
   - Uang tanda jadi berfungsi mengunci unit motor agar tidak dilepas ke pembeli lain saat jadwal cek fisik berlangsung.
2. **Kontak Resmi & Lokasi:**
   - WhatsApp Admin: `+62 812-8664-0201` (link: `https://wa.me/6281286640201`)
   - Lokasi Google Maps: `https://maps.app.goo.gl/ATsQaVJAGEJxEdFo7`
3. **Penyimpanan Tiket & Keamanan:**
   - Tiket menggunakan kode unik standar MOKAS: `MKS-YYYYMMDD-XXXX`.
   - Pengguna biasa hanya dapat mengakses dan melihat tiket miliknya sendiri (diverifikasi server-side lewat sesi JWT).
   - Hanya akun dengan role `admin` yang dapat mengubah status tiket menjadi `dikonfirmasi` atau `dibatalkan`.

## Cara Menguji Fitur Step 3
1. **Login Akun Pengguna:**
   - Masuk ke `http://localhost:3000/login` menggunakan akun admin atau buat akun baru di `/register`.
2. **Lakukan Booking Unit:**
   - Masuk ke Beranda `http://localhost:3000/#katalog`, klik tombol **"Booking Rp 200rb"** pada unit motor yang disukai.
   - Isi nama lengkap, nomor WhatsApp, alamat domisili, dan jadwal kunjungan cek fisik.
   - Klik **"Lanjutkan ke Pembayaran QRIS"**.
3. **Lihat Tiket & Scan QRIS:**
   - Halaman tiket `/pesanan/[id]` akan tampil dengan nomor tiket, rincian unit motor, dan barcode QRIS MOKAS Rp 200.000.
   - Klik tombol **"Kirim Bukti via WhatsApp Admin"** untuk melihat format chat otomatis.
4. **Cek Menu "Pesanan Anda":**
   - Klik menu **"Pesanan Anda"** di navbar atas (`http://localhost:3000/pesanan`) untuk melihat riwayat tiket booking.
5. **Konfirmasi Pembayaran oleh Admin:**
   - Buka Dashboard menu **Kelola Pesanan** (`http://localhost:3000/dashboard/orders`).
   - Klik tombol **"Konfirmasi"** pada tiket yang baru dibuat.
   - Kembali ke tab pembeli di `/pesanan/[id]`, refresh halaman dan lihat pesan perayaan:
     > *"Selamat, pembayaran Anda telah dikonfirmasi! Silakan tunggu informasi selanjutnya dari admin melalui email/WhatsApp."*
