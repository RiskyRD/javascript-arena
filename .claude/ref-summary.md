# Ringkasan Referensi Soal (`.ref/`)

Sumber: folder `.ref/` (tidak di-commit, hanya referensi). Aset publik yang dipakai UI disalin ke `public/ref-assets/`.
Teks PDF diekstrak dengan `pdftotext`; video tidak dibaca isinya.

## Daftar File

### `.ref/CLIENT_MODULE/`
| File | Ukuran | Disalin ke `public/ref-assets/` |
|---|---|---|
| `CLIENT_MODULE.pdf` (7 halaman) | 2,5 MB | `client/client-module.pdf` |
| `CLIENT_MODULE.docx` | 2,8 MB | 12 screenshot → `client/screens/screen-01..12.png` (urutan sesuai dokumen) |
| `Media Files/Demo LKS Matchboard.mp4` | 22 MB | `client/demo-matchboard.mp4` |
| `Media Files/icons/*.svg` (22 ikon toolbar, stroke `#eef1ea`) | <1 KB/ikon | `client/icons/` |

Ikon: `move, eraser, cone, text, arrow, arrow-run, arrow-pass, arrow-press, line, link, path-find, zoom-in, zoom-out, theme, undo, redo, plus, minus, frame, download, export-image, logo`.

**Tidak tersedia:** SVG garis lapangan (soal menyebut `CLIENT_MODULE_MEDIA.zip` berisi pitch SVG, tetapi berkas itu tidak ada di `.ref`). Latihan Chapter 2.2 memakai SVG lapangan buatan sendiri + ikon asli.

### `.ref/MOBILE WEB SERVICE MODULE/MOBILE WEB SERVICE MODULE/`
| File | Ukuran | Disalin ke `public/ref-assets/` |
|---|---|---|
| `TP_LKSN26_WEBTECH_MOBILE WEB SERVICE MODULE.pdf` (9 halaman) | 550 KB | `mobile/mobile-module.pdf` |
| `…docx` | 7,2 MB | 4 wireframe → `mobile/wireframes/wireframe-01..04.png` |
| `…zip` → 16 SVG ikon + `game.html` (halaman offline, game "Block Dodger" canvas) | 22 KB | `mobile/icons/`, `mobile/game.html` |
| `.DS_Store`, `__MACOSX/` | — | diabaikan (metadata macOS) |

Ikon mobile: home, discover, settings, like (heart), double-check, language, chevron-left, globe Africa/Europe/Oceania/Antarctica/Asia, earth-America, bendera `en`, `id`, `kr`.

### Keterangan gambar
| File | Isi |
|---|---|
| `screen-01` | Papan kosong, belum ada alat aktif (footer: "Tool: none") |
| `screen-02` | Alat Move Player aktif |
| `screen-03` | Dropdown formasi dibuka, pemain HOME tersusun |
| `screen-04` | Formasi HOME & AWAY terpasang |
| `screen-05` | Pemain dipilih → panel Selection di sidebar |
| `screen-06` | Straight Arrow & Run Arrow digambar |
| `screen-07` | Passing Path (BFS): "Shortest path: 4 passes" |
| `screen-08` | Cone & catatan teks di lapangan |
| `screen-09` | Run / Curved Arrow (amber) |
| `screen-10` | Tema terang (light paper) |
| `screen-11` | Responsif lebar 760px (sidebar turun ke bawah) |
| `screen-12` | Responsif lebar 510px (tampilan HP) |
| `wireframe-01` | Home: search + kartu beasiswa dengan ikon hati |
| `wireframe-02` | Detail beasiswa (bahasa Korea), blok syarat per jenjang |
| `wireframe-03` | Discover: filter keyword, pendidikan, region, IPK, sertifikasi bahasa |
| `wireframe-04` | Settings: My Profile (nama, pendidikan, gender, region, IPK, bahasa) |

## Modul 1 — Client Module: Matchboard (Tactical Whiteboard)

- **Durasi 3 jam**, hanya HTML + CSS + JavaScript (tanpa framework). Dinilai di Firefox Developer Edition / Chrome; harus jalan dengan membuka `index.html` langsung. Folder `XX_CLIENT_MODULE`.
- **Fitur:** pitch SVG penuh + shadow/border · toolbar vertikal (Move/Eraser, Cone/Note, keluarga arrow, Zoom/Theme), satu alat aktif, klik ulang mematikan, label footer · badge formasi HOME/AWAY dengan 6 formasi (4-4-2, 4-3-3, 3-5-2, 4-5-1, 3-4-3, 5-3-2), ganti formasi hanya mengganti tim itu, nomor punggung otomatis mulai 1 (kiper) · sidebar warna lapangan/kostum + Team Roster (tab Home/Away, edit nomor & nama langsung) · bola, cone, catatan; hanya Move yang bisa drag; Eraser tidak boleh menghapus pemain (peringatan di footer) · 5 jenis garis, drag terlalu pendek dibuang · Link Teammates + Passing Path (BFS jalur umpan terpendek) · panel Selection + Delete/Backspace · Board Stats live (Home, Away, cone, arrow) · pan (Space+drag), zoom, tema gelap/terang · Undo/Redo maks 60 state (Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z), Clear · Export SVG & PNG 2100×1360 · responsif di 1100px / 860px / 560px.
- **Bobot nilai (total 35):**
  | Sub-kriteria | Nilai |
  |---|---|
  | Pitch loading, toolbar, dan formasi | 10,5 |
  | Penempatan marker, perpindahan, kustomisasi tim/pemain | 6,5 |
  | Arrows, Link Teammates, Passing Path (BFS) | 10 |
  | Undo/redo, pan/zoom, tema, export, responsif | 8 |

## Modul 2 — Mobile Web Service Module: International Scholarship Discovery Platform

- **Mobile-first**, lebar maks 480px. Boleh React/Vue atau Vanilla JS. API disediakan. Trilingual (id, en, ko).
- **Layout:** Header (fixed top) · Main content (scroll) · Navigation bar (fixed bottom): Home, Discover, Eligibility, Wishlist, Settings.
- **API:** `GET https://web.lksn26.id/api/scholarships`, `/scholarships/:slug`, `/regions`. Query: `page`, `per_page` (default 20), `order_by` (latest/ascending/descending), `search`, `regions` (dipisah koma), `educations`, `language_certification` (ielst/toefl), `language_score`. Bahasa konten lewat header `Accept-Language: id|en|ko`. Base URL wajib di satu tempat (`VITE_API_URL` atau konstanta).
- **Halaman:** Home (beasiswa yang mendekati deadline, infinite scroll tanpa duplikat/terlewat, hati → wishlist, search **debounce 0,5–1 detik** tanpa tombol) · Discover (filter multi-parameter, region dari API) · Detail (footer disembunyikan, hati, syarat per jenjang terpisah) · Eligibility (filter dari profil) · Wishlist (hapus dengan transisi, empty state) · Settings (profil + tema Light/Dark/System + urutan default).
- **Offline:** tampilkan `game.html` saat koneksi putus.
- **Persistensi (localStorage):** profil, wishlist, dan bahasa aktif harus bertahan setelah refresh/tutup browser.
- **Lain-lain:** `manifest.json` + meta Android/iOS, viewport mobile, skor aksesibilitas Lighthouse dinilai, kode mudah dirawat. Folder `XX_MOBILE_WEB_SERVICE_MODULE` (build di `/build` jika pakai framework).
- **Bobot nilai:** tidak dicantumkan di dokumen.
- **Catatan:** bentuk JSON respons API tidak dijelaskan di dokumen — latihan di JS Arena memakai API tiruan `{ data: [...] }`.
