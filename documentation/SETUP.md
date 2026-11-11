# Panduan Setup Google Spreadsheet sebagai Database MOKAS

Dokumen ini menjelaskan langkah demi langkah untuk menghubungkan website MOKAS ke **Google Spreadsheet** menggunakan **Google Apps Script**.

---

## 1. Buat Spreadsheet Baru di Google Drive
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet tersebut, misalnya: **`Database MOKAS Official`**.

---

## 2. Buka Editor Apps Script
1. Di menu atas Spreadsheet, klik menu **Extensions (Ekstensi)** > **Apps Script**.
2. Anda akan diarahkan ke halaman editor kode Google Apps Script.
3. Beri nama proyek Apps Script di kiri atas, misalnya: **`MOKAS Backend API`**.

---

## 3. Salin Kode `code.gs` dan `setup.gs`
1. Di panel kiri editor Apps Script (bagian *Files / File*):
   - Klik file `Code.gs` yang sudah ada, hapus isinya, lalu salin seluruh isi file **`code.gs`** dari proyek ini ke dalamnya.
   - Klik tombol **`+`** (Add a file) > pilih **Script**, beri nama **`setup`** (akan menjadi `setup.gs`).
   - Salin seluruh isi file **`setup.gs`** dari proyek ini ke dalam file `setup.gs` di editor.
2. Klik ikon disket **Save project (Simpan proyek)** di bagian atas (atau tekan `Ctrl + S`).

---

## 4. Jalankan Fungsi Inisiasi `initTables()`
1. Di bagian atas editor Apps Script, pada menu dropdown fungsi, pilih **`initTables`**.
2. Klik tombol **Run (Jalankan)**.
3. Google akan meminta izin akses (*Authorization Required*):
   - Klik **Review permissions (Tinjau izin)**.
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik **Advanced (Lanjutan)** di kiri bawah > klik **Go to MOKAS Backend API (unsafe)**.
   - Klik **Allow (Izinkan)**.
4. Periksa panel *Execution log* di bawah editor:
   - Anda akan melihat log seperti:
     - `🔑 APPS_SCRIPT_SECRET berhasil dibuat: mokas_secret_xxxx`
     - `✅ Sheet Roles dibuat.`
     - `✅ Sheet Users dibuat.`
     - `✅ Sheet News dibuat.`
     - `👑 Akun Admin awal dibuat: admin@gmail.com`
5. Buka kembali tab Google Spreadsheet Anda: Anda akan melihat sheet **Roles**, **Users**, dan **News** sudah terisi header dan data awal secara otomatis!

---

## 5. Dapatkan Secret Token (Script Properties)
1. Di panel kiri Apps Script, klik ikon gerigi **Project Settings (Setelan Proyek)**.
2. Gulir ke bawah ke bagian **Script Properties (Properti Skrip)**.
3. Anda akan melihat properti bernama **`APPS_SCRIPT_SECRET`**.
4. Catat nilai properti ini (misalnya `mokas_secret_xxxx`). Nilai ini akan dimasukkan ke `.env.local` dan Vercel.

---

## 6. Lakukan Deploy Web App
1. Di kanan atas editor Apps Script, klik tombol biru **Deploy** > pilih **New deployment (Penerapan baru)**.
2. Klik ikon gerigi di samping *Select type*, pilih **Web app**.
3. Isi konfigurasi berikut:
   - **Description**: `MOKAS Production API v1`
   - **Execute as (Jalankan sebagai)**: **`Me (email anda)`** *(PENTING! Jangan pilih "User accessing the web app")*
   - **Who has access (Siapa yang memiliki akses)**: **`Anyone (Siapa saja)`** *(PENTING! Agar server Next.js bisa berkomunikasi dengan aman menggunakan token)*
4. Klik **Deploy**.
5. Salin **Web app URL** yang muncul (bentuknya mirip: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## 7. Pasang URL & Secret ke Website (.env.local & Vercel)
1. Buka file `.env.local` di folder proyek laptop Anda:
   ```env
   APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbx.../exec
   APPS_SCRIPT_SECRET=nilai_secret_dari_langkah_5
   AUTH_SECRET=rahasia_jwt_acak_panjang_untuk_sesi
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
2. Simpan file `.env.local`.
3. Restart dev server (`npm run dev`).
4. Saat nanti deploy ke Vercel di Step 4, masukkan variabel yang sama di menu *Project Settings > Environment Variables*.

---

## 8. Cara Memperbarui Kode (Jika Ada Perubahan)
Setiap kali ada perubahan pada file `code.gs` atau `setup.gs`:
1. Salin kode yang baru ke editor Apps Script.
2. Klik **Deploy** > **Manage deployments (Kelola penerapan)**.
3. Klik ikon pensil (Edit) pada deployment aktif Anda.
4. Pada dropdown *Version*, pilih **New version (Versi baru)**.
5. Klik **Deploy**. URL Web App akan tetap sama dan langsung menggunakan versi kode terbaru.

