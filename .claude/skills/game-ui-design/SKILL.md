---
name: game-ui-design
description: Sistem desain visual "Dark Space & Tactical Gold" untuk JS Arena. Gunakan setiap kali membuat atau mengubah UI — halaman, komponen React, styling Tailwind, warna, tipografi, kartu modul, tombol, XP bar, badge rank, atau toast notification.
---

# Game UI Design — Dark Space & Tactical Gold

JS Arena harus terasa seperti **markas taktis / game RPG**, bukan panel admin. Tidak boleh ada tampilan CRUD standar (tabel polos + tombol biru default).

## 1. Palet Warna (Design Tokens)

Proyek memakai **Tailwind v4**: token didaftarkan di blok `@theme` pada `resources/css/app.css` (`--color-arena-bg: #0b0f19;` → class `bg-arena-bg`). Tidak ada `tailwind.config.js`. Gunakan nama token, **bukan** hex mentah di JSX.

| Token | Hex | Penggunaan |
|---|---|---|
| `arena-bg` | `#0B0F19` | Background utama halaman |
| `arena-panel` | `#131A2B` | Panel, card, sidebar, modal |
| `arena-line` | `#1F2A44` | Border default, divider |
| `gold-500` | `#F59E0B` | Aksen utama, CTA, highlight aktif |
| `gold-400` | `#EAB308` | Hover/gradien emas, ikon rank |
| `xp` | `#10B981` | Sukses, XP, jawaban benar, progres |
| `cyber` | `#38BDF8` | Info, link, hint, elemen terminal |
| `danger` | `#F43F5E` | Error, jawaban salah (dipakai hemat) |
| `ink` | `#E5E7EB` | Teks utama |
| `ink-muted` | `#94A3B8` | Teks sekunder |

Aturan:
- Emas adalah aksen, bukan background luas. Maksimal 1 CTA emas dominan per layar.
- Kontras teks minimal WCAG AA terhadap `arena-bg` / `arena-panel`.
- Boleh menambah latar halus: grid tipis / noise / radial glow emas samar di belakang hero — jangan sampai mengganggu keterbacaan.

## 2. Bentuk: Cut-Corner (Sudut Terpotong)

Kartu modul dan tombol utama memakai `clip-path` polygon. Sudah tersedia sebagai utility Tailwind v4 (`@utility cut-corner` / `cut-corner-sm`) di `resources/css/app.css`. Komponen siap pakai: `Components/UI/CutCard.jsx` (dengan prop `glow`) dan `CutButton.jsx`.

**Cut-corner & glow hanya untuk elemen "game"**: tombol CTA, kartu bab di Peta Materi, badge, podium, toast, panel admin. **Jangan** dipakai pada kartu bacaan materi, blok kode, atau panel lab — area belajar harus tenang (lihat §6).

- `clip-path` memotong `border` dan `box-shadow`. Untuk border bercahaya, gunakan teknik **wrapper**: elemen luar ber-`cut-corner` dengan background gradien tipis (berperan sebagai border 1px), elemen dalam ber-`cut-corner` dengan `bg-arena-panel`.
- Elemen kecil (chip, input, badge) cukup `rounded-sm` atau `cut-corner-sm`.

## 3. Glow & Border

- Border tipis 1px `arena-line`; saat hover/aktif berubah ke `gold-500/60` dengan glow halus:
  `shadow-[0_0_12px_rgba(245,158,11,0.25)]` (pada wrapper, bukan elemen yang di-clip).
- Glow `xp` untuk status selesai, glow `cyber` untuk fokus/info.
- Transisi 150–250ms. Hormati `prefers-reduced-motion` (matikan animasi dekoratif).

## 4. Komponen Khas

### XP Bar (progress bar RPG)
- Track `arena-line`, isi gradien `xp` → `emerald-300`, tinggi 8–10px, segmen/tick tipis tiap 10%.
- Label kiri: `LV 7`; label kanan monospace: `1.240 / 2.000 XP`.
- Saat XP bertambah: animasi isi + teks `+50 XP` melayang lalu memudar.
- Progres modul memakai komponen yang sama dengan warna `gold`.

### Badge Level / Rank
- Bentuk heksagon atau shield (`clip-path`), ikon + nama rank.
- Tier (sumber kebenaran: `resources/js/Lib/rank.js`): `Rookie` 0 XP (abu) → `Tactician` 150 (cyber) → `Code Striker` 350 (xp) → `LKS Champion` 600 (gold + glow animasi).
- Selalu tampil di header/profil bersama XP bar.

### Kartu Modul
- `cut-corner`, nomor modul besar monospace (`01`), judul, estimasi waktu, mini XP bar progres.
- Status: terkunci (redup + ikon gembok), aktif (border emas glow), selesai (cap `CLEARED` warna `xp`).

### Tombol
- Primary: `cut-corner`, bg `gold-500`, teks `arena-bg` bold uppercase tracking lebar; hover `gold-400`.
- Secondary: transparan, border `arena-line`, teks `ink`; hover border emas.
- Ghost/terminal: teks `cyber` monospace dengan prefix `>`.

### Toast Notification Kustom
- Background netral gelap (`arena-panel`), border `arena-line`, ikon berwarna sesuai tipe.
- **Progress bar warna di bagian bawah** (tinggi 2–3px) yang menyusut sesuai durasi auto-dismiss: `xp` sukses, `cyber` info, `gold` peringatan/achievement, `danger` error.
- Posisi kanan bawah (desktop) / bawah tengah (mobile); pause saat hover; tumpuk maksimal 3.
- Jangan pakai `alert()` atau toast library dengan tema default.

## 5. Tipografi

- **Materi / UI:** sans-serif modern — `Inter` atau `Space Grotesk` untuk heading.
- **Kode / terminal / angka statistik:** monospace — `JetBrains Mono` atau `Fira Code`.
- Terdaftar di `@theme` sebagai `--font-sans` (Inter), `--font-display` (Space Grotesk), `--font-mono` (JetBrains Mono); di-load via `bunny()` di `vite.config.js`.
### Hierarki teks (wajib dibedakan tegas)

| Level | Kelas acuan | Contoh |
|---|---|---|
| Judul halaman / Stage | `font-display text-3xl sm:text-4xl font-bold text-ink` | "DOM Manipulation & Event Delegation" |
| Sub-judul konsep (h2) | `font-display text-xl font-semibold text-ink` | "Satu listener untuk semua tombol" |
| Label jenis blok | `text-sm font-medium` + ikon berwarna, **sentence case** | "Penjelasan inti" |
| Paragraf | `text-[15.5px] leading-[1.7] text-ink/85 max-w-[65ch]` | isi materi |
| Kode | `font-mono text-[13.5px] leading-6` di surface `arena-bg` | contoh & editor |
| Meta / keterangan | `text-sm text-ink-muted` | breadcrumb, status |

- **Uppercase + tracking lebar + mono kecil** hanya untuk maksimal 1 label "HUD" per layar (mis. status LIVE, label konsol). Jangan dipasang di setiap header kartu.
- Breadcrumb/eyebrow memakai sentence case `text-sm text-ink-muted`, bukan `// UPPERCASE`.

## 6. Layout & Responsif

- Mobile-first. Breakpoint: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.
- Target sentuh minimal 44×44px. Tidak boleh ada scroll horizontal kecuali di blok kode.

### Shell aplikasi (`Layouts/AppLayout.jsx`)
- **Top bar ringkas (h-16)**: tombol toggle sidebar · logo · konteks aktif (judul stage/halaman) · rank badge + XP bar · tombol Leaderboard. Tidak lebih. Nama siswa pindah ke kaki sidebar.
- **Sidebar collapsible**: lebar penuh `w-72` ↔ rail `w-16` (node stage berwarna sesuai status + tooltip). Otomatis menyempit saat masuk halaman Stage; di halaman lain mengikuti preferensi siswa (disimpan di localStorage). Di bawah `lg` menjadi drawer.
- Halaman non-stage: konten `max-w-6xl` di tengah, padding `px-6 lg:px-12 py-10`, jarak antar-section `space-y-10`.

### Ruang belajar (halaman Chapter, `Components/Lesson/StageShell.jsx`)
- **Satu kolom terpusat** `max-w-4xl mx-auto`, padding lega (`px-5 sm:px-8 py-10 lg:py-14`), jarak antar-blok `space-y-10`. **Tidak ada split-screen kiri-kanan** — semua ukuran layar memakai alur yang sama, dibaca dari atas ke bawah.
- Urutan halaman:
  1. **Header** — breadcrumb, judul chapter, XP, tombol "Lewati" kecil, tautan "Langsung ke latihan ↓".
  2. **Zona Baca** — blok materi (latar belakang → konsep bertahap → coba langsung). Kartu bacaan = surface `bg-arena-panel/50`, `rounded-lg`, tanpa clip-path/glow, aksen **garis emas tipis di sisi kiri**.
  3. **Pemisah zona** — garis horizontal dengan label "Zona praktik".
  4. **Zona Praktik** — jembatan ke latihan, lalu kartu Live Code: daftar misi ringkas → editor lebar & tinggi (`h-[28rem]`) → tombol Jalankan / Reset / Petunjuk → pratinjau (lab DOM) → konsol & pengujian.
  5. **Mini Check**, lalu bar **Selesaikan Chapter & Klaim XP** + **Lewati Chapter (0 XP) →** paling bawah, diikuti navigasi sebelumnya/berikutnya.
- Teks kode (editor, blok kode, inline code) berwarna `text-code` = `#38BDF8`; komentar abu-abu redup, keyword ungu muda, string emas, angka oranye. Narasi tetap putih (`text-ink`) agar terpisah jelas.
- Istilah UI: **Chapter** (bukan "Stage").

## 7. Larangan

- Tabel CRUD polos, tombol biru default, card putih, `rounded-xl` generik di mana-mana.
- Warna hex mentah di JSX bila sudah ada token.
- Emoji sebagai pengganti ikon (gunakan set ikon konsisten, mis. `lucide-react`).
- Animasi berlebihan yang mengganggu fokus belajar.
- Kartu bersarang di dalam kartu, atau border + glow + clip-path sekaligus pada konten bacaan.
- Label uppercase kecil pudar di setiap header kartu.
