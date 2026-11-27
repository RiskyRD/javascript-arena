---
name: token-saver
description: Aturan hemat token & konteks untuk JS Arena. Gunakan SELALU sebelum membaca, mencari, membuat, atau mengedit file apa pun di proyek ini — mengatur folder yang diabaikan, cara pencarian, batas ukuran file, dan database default (SQLite).
---

# Token Saver — Aturan Hemat Konteks

Tujuan: setiap token dipakai untuk logika yang relevan, bukan untuk membaca file yang tidak perlu.

## 1. Folder & File yang WAJIB Diabaikan

Jangan pernah membaca, mencari ke dalam, atau me-list isi path berikut kecuali user meminta secara eksplisit:

| Path | Alasan |
|---|---|
| `vendor/` | Dependensi Composer |
| `node_modules/` | Dependensi npm |
| `storage/` | Log, cache, session, file upload |
| `bootstrap/cache/` | Cache konfigurasi Laravel |
| `public/build/` | Hasil build Vite |
| `package-lock.json` | Lock file npm |
| `composer.lock` | Lock file Composer |
| `*.sqlite`, `*.log`, `*.map` | Biner / log / source map |

- Saat memakai Grep, batasi dengan `glob`/`path` (mis. `resources/js/**/*.jsx`, `app/**/*.php`) agar folder di atas tidak ikut terpindai.
- Untuk cek versi paket, baca `package.json` / `composer.json` — **bukan** lock file.

## 2. Cari Dulu, Baca Belakangan

1. **Glob** untuk menemukan file berdasarkan nama/pola (`resources/js/Components/**/XpBar*.jsx`).
2. **Grep** untuk menemukan simbol, route, atau class (`Route::`, `function ModuleCard`, `className=`).
3. **Read** hanya pada rentang baris yang relevan (`offset` + `limit`) jika file > 150 baris.
4. Jangan membaca ulang file yang baru saja diedit untuk "memastikan" — tool Edit sudah gagal jika edit tidak masuk.
5. Jangan membaca seluruh direktori satu per satu untuk "memahami proyek". Mulai dari `CLAUDE.md`, lalu cari yang spesifik.

## 3. File Kecil & Modular (< 250 baris)

- Setiap file (komponen React, controller, service, test) **maksimal 250 baris**. Target ideal 80–150 baris.
- Jika sebuah file mendekati 250 baris, pecah sebelum menambah fitur:
  - Komponen React → sub-komponen di folder yang sama (`ModuleCard/ModuleCardHeader.jsx`).
  - Logika berulang → custom hook (`resources/js/Hooks/useXp.js`) atau util (`resources/js/Lib/`).
  - Controller gemuk → Form Request (validasi) + Service/Action class (`app/Actions/`).
  - Data materi/quiz panjang → file data terpisah (`resources/js/Data/modules/*.js`) atau seeder.
- Satu komponen = satu tanggung jawab.

## 4. Edit Bagian Spesifik Saja

- Gunakan **Edit** (string replacement) untuk perubahan — jangan menulis ulang seluruh file dengan Write jika hanya mengubah beberapa baris.
- Write hanya untuk file baru atau penulisan ulang total yang memang disengaja.
- Jangan reformat / merapikan kode yang tidak terkait dengan tugas.
- Saat menjawab user, rujuk lokasi kode (`path:baris`) alih-alih menempelkan ulang blok kode panjang.

## 5. Database Default: SQLite

- Untuk development lokal dan testing, gunakan **SQLite** — tanpa server, tanpa setup:
  ```env
  DB_CONNECTION=sqlite
  # DB_DATABASE dikosongkan → memakai database/database.sqlite
  ```
- Test (`phpunit.xml`) memakai `DB_CONNECTION=sqlite` + `DB_DATABASE=:memory:`.
- Migration wajib portabel antara SQLite dan MySQL (target produksi/lomba): hindari raw SQL khusus MySQL, `ENUM` native, dan fungsi spesifik vendor. Gunakan Schema Builder Laravel.
- Pindah ke MySQL cukup dengan mengubah `.env` — tidak boleh ada perubahan kode.

## 6. Hemat Output

- Jawaban ringkas; jangan menjelaskan ulang hal yang sudah jelas dari diff.
- Jangan menjalankan `npm install` / `composer install` berulang kali tanpa alasan.
- Batasi output perintah panjang (`| head`, `--quiet`, filter test spesifik `php artisan test --filter=NamaTest`).
