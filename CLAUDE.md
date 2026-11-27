# JS Arena: LKS Tactical Lab

Platform web pembelajaran interaktif JavaScript untuk persiapan lomba **LKS Web Technologies**. Materi bergaya game (XP, level, rank) dengan sandbox kode langsung dan quiz di setiap sub-materi.

## Stack

| Lapisan | Teknologi |
|---|---|
| Backend | Laravel 13 (PHP 8.4) |
| Bridge | Inertia.js v3 |
| Frontend | React 19 (JSX) + Vite |
| Styling | Tailwind CSS v4 (token di `@theme`, tanpa `tailwind.config.js`) |
| Database | MySQL (produksi/lomba) · SQLite (development lokal & testing — lihat skill `token-saver`) |

## Struktur Folder Utama

```
app/
  Actions/              # Logika bisnis: EnterArena, CompleteModule, SyncProgress, BuildLeaderboard
  Http/Controllers/     # ArenaController (siswa, JSON), Admin/MonitorController, Admin/PinController
  Http/Requests/        # EnterArenaRequest, CompleteModuleRequest
  Http/Middleware/      # HandleInertiaRequests, EnsureAdminPin
  Models/               # Student, ModuleProgress
  Support/              # ModuleRegistry (baca config/arena.php)
config/arena.php        # ADMIN_PIN, zona waktu streak, kurikulum Bagian → Bab → Sub-materi (slug, title, max_xp)
database/migrations/    # Harus portabel SQLite ↔ MySQL
resources/
  css/app.css           # Tailwind v4: @theme (token warna/font/animasi) + @utility cut-corner
  js/
    app.jsx             # Entry Inertia: ToastProvider > ArenaSessionProvider > App
    Layouts/AppLayout.jsx  # HUD siswa: TopBar + StageNavigator (persistent layout)
    Pages/
      Arena/            # Enter (/), Map (/arena), Lesson (/arena/{slug}), Leaderboard (/leaderboard)
      Admin/            # Login, Monitor (/admin/monitor)
    Components/
      UI/               # CutCard, CutButton, XpBar, RankBadge, Toast, StatTile, HudFrame
      Arena/            # ArenaSessionProvider (useArena), TopBar, StageNavigator, LessonNavItem,
                        # ChapterCard, Podium, RankingList
      Admin/            # LeaderboardTable, ModuleMatrix, ResetPanel
      Lesson/           # StageShell, Blocks (LessonSection/CodeBlock/Callout), CodeSandbox (Worker),
                        # DomLab (iframe), CodeEditor, ConsolePanel, MiniQuiz, StageCompleteBar
    Stages/             # Konten per chapter: index.js (slug → komponen), S11…/ { index.jsx, Materi.jsx, lab.js, quiz.js, visualizer }
    Hooks/              # useStageState (draft kode + status lab/quiz per siswa di localStorage)
    Lib/                # arenaApi, curriculum, rank, time, highlight (tokenizer warna kode)
      sandbox/          # runWorker (kode murni, timeout 2 dtk), labDocument (iframe lab DOM + localStorage tiruan + reload())
public/ref-assets/      # Salinan aset soal LKS (PDF, video demo, screenshot, wireframe, ikon) — lihat .claude/ref-summary.md
routes/web.php          # Semua route (siswa + admin)
tests/Feature/          # ArenaApiTest, ArenaPagesTest, AdminMonitorTest
```

## Alur Sesi & Progres

- Tanpa password: `POST /enter-arena` mengembalikan `session_token` → disimpan di `localStorage` (`jsarena.session_token` + `jsarena.student_name`) → dikirim ulang saat refresh untuk memuat profil yang sama.
- State sesi global ada di `ArenaSessionProvider`; komponen membaca via `useArena()` (student, bySlug, complete, ...). Halaman siswa hanya kerangka — data profil dimuat client, bukan props Inertia.
- "Module" di backend (`module_slug`) = satu **sub-materi**. `/leaderboard` melayani halaman Inertia untuk browser dan JSON untuk `Accept: application/json`.
- Prop bersama: `curriculum` (struktur bersarang dari `config/arena.php`).

## Kurikulum Saat Ini

- **Bab 1 · JavaScript Dasar** (1.1–1.4): JS murni dengan analogi sehari-hari, tanpa konteks LKS.
- **Bab 2 · Bedah Kasus & Koneksi ke Soal LKS** (2.1–2.3): viewer dokumen soal asli, Matchboard (Client Module), Scholarship Platform (Mobile Web Service Module).
- Referensi soal asli ada di `.ref/` (jangan dibaca ulang utuh — pakai ringkasan `.claude/ref-summary.md`).

## Menambah Chapter Baru

1. Tambah sub-materi di `config/arena.php` (slug, title, max_xp).
2. Buat folder `resources/js/Stages/SXX…/` berisi `index.jsx` (pakai `StageShell` dengan `materi` + `practiceIntro`), `Materi.jsx`, `lab.js`, `quiz.js` — ikuti skill `pedagogy-lks` (Bab 1 tanpa konteks LKS).
3. Daftarkan slug di `resources/js/Stages/index.js`.
4. Lab worker: `checks: [{ label, test(value, code) }]` + `epilogue` (pakai `exportVars`). Lab DOM: `html`, `css`, `tests` (string fungsi, boleh async, menerima `{ reload, storage, fetchLog, wait }`), `checkLabels`, opsional `api: { scholarships }` untuk `fetch` tiruan offline.
5. Pastikan `solution` lulus semua pengujian dan `starter` tidak (jangan ada pengujian yang lulus tanpa dikerjakan).
- DB hanya menyimpan hash SHA-256 token. Nama kembar (case-insensitive) dibedakan dengan tag 4 karakter (`Budi #K7Q2`).
- `/enter-arena`, `/progress/complete`, `/progress/skip` dikecualikan dari CSRF karena auth-nya via token, bukan cookie.
- XP per modul dibatasi `max_xp` di `config/arena.php` dan hanya diberikan sekali per modul.
- **Navigasi bebas**: semua stage bisa dibuka & diselesaikan dalam urutan apa pun. Status: `locked` (= belum dimulai, nama lama dipertahankan), `in_progress` (rekomendasi berikutnya), `completed` (+XP), `skipped` (0 XP, via `POST /progress/skip`; tetap bisa diselesaikan nanti untuk klaim XP).
- Warna kode: token `text-code*` di `@theme` + tokenizer `Lib/highlight.js` (komponen `Components/Lesson/Code.jsx`). Editor sandbox memakai lapisan highlight di belakang textarea transparan.
- Leaderboard: `total_xp` tertinggi, lalu siapa yang lebih dulu mencapai XP tsb.
- Admin: `/admin/monitor` dilindungi `ADMIN_PIN` (session), data di-poll tiap 10 detik, reset butuh ketik `RESET`.

## Aturan Wajib — Selalu Patuhi Ketiga Skill

Sebelum mengerjakan tugas apa pun, terapkan skill di `.claude/skills/`:

1. **`token-saver`** — selalu berlaku. Abaikan `vendor/`, `node_modules/`, `storage/`, `bootstrap/cache/`, dan lock file; cari dengan Grep/Glob sebelum membaca; file maksimal 250 baris; edit bagian spesifik saja; SQLite untuk dev/test.
2. **`game-ui-design`** — untuk semua pekerjaan UI. Tema Dark Space & Tactical Gold, cut-corner, glow halus, XP bar, rank badge, toast kustom, font sans + mono, responsif penuh, tanpa tampilan CRUD standar.
3. **`pedagogy-lks`** — untuk semua konten materi. Praktis & berorientasi soal lomba; setiap sub-materi wajib punya Penjelasan Inti, Analogi Kasus Lomba (Papan Taktik / Beasiswa), Live Sandbox/Visualizer, dan Mini Quiz.

Jika ada konflik antar-instruksi: permintaan eksplisit user > `CLAUDE.md` > skill.

## Konvensi Singkat

- Komponen React: PascalCase, satu komponen per file, function component + hooks.
- Controller hanya mengatur alur; logika di `app/Actions/`, validasi di Form Request.
- Gunakan token warna Tailwind (`arena-bg`, `gold-500`, `xp`, `cyber`), bukan hex mentah.
- Perintah umum: `composer run dev` (server + Vite), `php artisan test`, `npm run build`.
- Abaikan `AGENTS.md` bawaan skeleton Laravel (instruksi setup Laravel Boost generik); `CLAUDE.md` ini yang berlaku.
