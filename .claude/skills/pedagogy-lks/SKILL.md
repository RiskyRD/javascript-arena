---
name: pedagogy-lks
description: Pedoman penulisan materi pembelajaran JavaScript untuk JS Arena berorientasi lomba LKS Web Technologies. Gunakan setiap kali menulis, menyusun, atau mengubah konten materi, stage, sub-materi, contoh kode, sandbox, atau quiz.
---

# Pedagogy LKS — Cara Mengajar di JS Arena

Peserta adalah siswa SMK yang menyiapkan diri untuk **LKS Web Technologies**. Banyak yang masih pemula. Mereka butuh kemampuan memecahkan soal dengan cepat di bawah tekanan waktu, tapi itu hanya bisa dibangun kalau mereka benar-benar **paham alasannya**, bukan sekadar menyalin pola.

## 1. Suara Penulis: Guru Pendamping

Tulis seperti guru pembina lomba yang duduk di samping siswa dan menjelaskan pelan-pelan — bukan seperti ringkasan AI atau buku teks.

- **Paragraf yang mengalir.** Gunakan kalimat lengkap yang saling menyambung ("Nah, karena…", "Masalahnya…", "Coba perhatikan…"). Poin-poin hanya untuk daftar yang memang berupa daftar (misalnya 3 kategori), bukan untuk memotong penjelasan menjadi fragmen.
- **Bahasa sehari-hari dulu, istilah teknis kemudian.** Jelaskan idenya dengan perumpamaan yang akrab, baru beri namanya: "event 'naik' dari tombol ke kotak pembungkusnya — inilah yang disebut *bubbling*."
- **Sapaan "kamu"**, nada hangat dan tegas, tanpa basa-basi panjang. Setiap kalimat harus membantu siswa paham atau bertindak.
- **Istilah Inggris tetap dipakai** (`array`, `callback`, `event`) karena itu yang muncul di soal dan dokumentasi, tapi selalu dijelaskan saat pertama kali muncul.
- **Jangan menganggap siswa sudah tahu.** Kalau sebuah baris kode memakai konsep baru (arrow function, ternary, template literal), sebutkan dan jelaskan singkat di tempat.
- Hindari: sejarah bahasa, definisi formal yang kaku, kalimat super pendek beruntun tanpa penghubung, dan klaim "mudah kok" yang meremehkan.

## 2. Konteks per Bab — Dasar Dulu, Lomba Kemudian

| Bab | Konteks contoh & analogi | Boleh menyebut LKS? |
|---|---|---|
| **Bab 1 · JavaScript Dasar** | Kehidupan sehari-hari pemula: daftar belanja, keranjang belanja, kontak di HP, nilai rapor, sakelar lampu, catatan di kulkas | **Tidak sama sekali.** Ajarkan JavaScript sebagai bahasa pemrograman umum. Jangan menyebut juri, soal, poin, Papan Taktik, atau Beasiswa. |
| **Bab 2+ (hands-on / strategi)** | Studi kasus lomba: **Papan Taktik Sepak Bola** & **Aplikasi Beasiswa** | Ya — tunjukkan kenapa konsep dari Bab 1 dibutuhkan di soal nyata. |

Prinsipnya: siswa harus nyaman dengan bahasa JavaScript dulu tanpa beban istilah lomba. Konteks LKS baru masuk setelah fondasinya kuat.

## 3. Alur Cerita WAJIB Setiap Chapter

Setiap chapter (unit progres; dulu disebut "stage") disusun sebagai satu alur baca **vertikal** dari atas ke bawah. Gunakan `LessonSection` dengan `kind` sesuai urutan berikut. Layout halaman: **Zona Baca** (a–c) → **Zona Praktik** (d + lab) → Mini Check (e) → tombol Selesaikan / Lewati.

### a. Latar Belakang: Kenapa Konsep Ini Ada (`kind="story"`)
- Buka dengan **situasi yang akrab** dan pertanyaan yang membuat penasaran. Bab 1 contoh: *"HP-mu bisa menyimpan ratusan kontak lengkap dengan nama dan nomornya. Bagaimana sebuah program 'mengingat' semua itu?"* Bab 2+ boleh memakai situasi lomba, mis. *"Bayangkan pelatih mengklik tombol ganti formasi 4-3-3…"*
- Jelaskan **masalah apa yang muncul tanpa konsep ini**, supaya siswa merasa butuh.
- 2–4 paragraf.

### b. Penjelasan Konsep Bertahap (`kind="concept"`)
- Pecah menjadi beberapa **langkah** dengan sub-judul `<Step n={1} title="…" />`. Mulai dari nol, naik pelan-pelan.
- Setiap langkah: paragraf penjelasan dengan bahasa sehari-hari → **contoh kode utuh** → penjelasan **baris demi baris** memakai `CodeWalkthrough` (`steps: [{ code, note }]`). Note menjelaskan *apa* yang dilakukan baris itu dan *kenapa* ditulis begitu.
- Tutup dengan `Callout` berisi 1–2 kesalahan yang paling sering dialami pemula (Bab 1: judul "Kesalahan yang sering terjadi"; Bab 2+: "Jebakan lomba"), ditulis sebagai kalimat penjelasan, bukan sekadar larangan.
- Contoh kode statis berwarna biru (`CodeBlock` / `CodeWalkthrough`), pendek, dan bisa dijalankan.
- Bab 2+ boleh menyelipkan paragraf "pola yang sama di soal Beasiswa" beserta contoh kode singkat.

### c. Coba Langsung (`kind="visual"`, opsional tapi dianjurkan)
- Visualizer interaktif di dalam materi (mis. jalur bubbling, kalkulator koordinat klik). Letakkan tepat setelah langkah konsep yang ia ilustrasikan.

### d. Jembatan ke Latihan (`kind="bridge"`, pembuka Zona Praktik)
- Diletakkan tepat di atas editor latihan. Hubungkan penjelasan dengan **misi latihan di bawahnya**: sebutkan nomor TODO, langkah materi mana yang menjawabnya, dan **urutan pengerjaan** yang disarankan.
- Beri tahu cara membaca umpan balik: tombol *Jalankan Kode*, isi konsol, daftar *Pengujian* yang berubah hijau, tombol *Petunjuk* dan *Lihat Solusi*.
- Tujuannya: pemula tidak bingung harus mulai mengetik dari mana.

### e. Mini Check (otomatis dari `quiz.js`, ditampilkan `StageShell`)
- 2–4 soal (checkpoint akhir bab boleh 3+). Variasi: "apa output kode ini?", lengkapi kode, cari bug, pilih pendekatan yang tepat.
- **Setiap opsi** punya pembahasan (`explain`) yang menjelaskan *kenapa* benar atau salah; opsi benar diawali kata "Tepat".

## 4. Latihan / Live Code (Zona Praktik)

- Kode awal (`starter`) sudah berisi data contoh (Bab 1: data sehari-hari) dan komentar `// TODO n` yang nomornya sama dengan yang disebut di blok *Jembatan ke lab*.
- `tasks` (daftar misi di atas editor) ringkas, satu baris per TODO.
- `hints` bertahap: dari arah umum → hampir jawaban. `solution` lengkap.
- **Solusi wajib lulus semua pengujian dan starter wajib gagal semua** (jangan ada pengujian yang lulus tanpa dikerjakan). Verifikasi sebelum rilis.
- Eksekusi terisolasi: kode murni → Web Worker (timeout 2 detik); kode DOM → iframe `sandbox="allow-scripts"`.

## 5. Navigasi & Penyelesaian

- **Semua chapter bebas dibuka** — tidak ada kunci urutan. Status `in_progress` hanya penanda rekomendasi berikutnya.
- Tombol **"Selesaikan Chapter & Klaim +XP"** aktif setelah lab lulus dan Mini Check benar semua (chapter tanpa lab: cukup Mini Check).
- Tombol **"Lewati Chapter (0 XP) →"** selalu tersedia (bawah chapter + header). Status `skipped` tanpa XP; chapter tetap bisa diselesaikan kapan saja untuk klaim XP-nya.

## 6. Struktur File Konten

```
resources/js/Stages/SXXNama/
  index.jsx   # komponen chapter → <StageShell materi={<Materi/>} quiz renderLab />
  Materi.jsx  # alur story → concept → visual → bridge (≤ 250 baris; pecah jika lebih)
  lab.js      # { title, tasks, starter, solution, hints, epilogue|tests, checks|checkLabels }
  quiz.js     # [{ id, type: 'mcq'|'fill', prompt, code?, options|accept, answer, explain, hint? }]
```

## 7. Checklist Sebelum Chapter Dianggap Selesai

- [ ] Ada blok Latar Belakang yang dibuka dengan situasi akrab (Bab 1: tanpa menyebut LKS)
- [ ] Konsep dipecah per langkah, setiap kode baru dijelaskan baris demi baris
- [ ] Ada Jembatan ke latihan yang menyebut nomor TODO & urutan pengerjaan
- [ ] Bahasa mengalir seperti guru pendamping (bukan poin-poin fragmen)
- [ ] Mini Check punya pembahasan per opsi
- [ ] Solusi lab lulus semua pengujian, starter gagal semua
