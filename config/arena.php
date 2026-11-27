<?php

return [

    /*
    | PIN halaman pemantauan guru (/admin/monitor). Kosong = admin dinonaktifkan.
    */
    'admin_pin' => env('ADMIN_PIN', ''),

    /*
    | Zona waktu untuk menghitung batas hari pada streak harian siswa.
    */
    'timezone' => env('ARENA_TIMEZONE', 'Asia/Jakarta'),

    /*
    | Kurikulum: Bagian → Bab → Sub-materi. Progres & XP dilacak per sub-materi
    | (kolom module_progress.module_slug = slug sub-materi). Urutan = urutan unlock.
    | `max_xp` = batas XP yang boleh diklaim client untuk sub-materi tsb.
    */
    'parts' => [
        [
            'slug' => 'bagian-1',
            'title' => 'Fondasi & Bedah Soal',
            'chapters' => [
                ['slug' => 'bab-1', 'title' => 'JavaScript Dasar', 'lessons' => [
                    ['slug' => 'variabel-tipe-data-objek', 'title' => 'Variabel, Tipe Data, & Objek', 'max_xp' => 100],
                    ['slug' => 'percabangan-fungsi', 'title' => 'Logika Percabangan & Fungsi', 'max_xp' => 100],
                    ['slug' => 'dom-event', 'title' => 'Menggerakkan Halaman Web dengan DOM & Event', 'max_xp' => 100],
                    ['slug' => 'state-render-storage', 'title' => 'Pola State → Render & localStorage', 'max_xp' => 100],
                ]],
                ['slug' => 'bab-2', 'title' => 'Bedah Kasus & Koneksi ke Soal LKS', 'lessons' => [
                    ['slug' => 'medan-tempur', 'title' => 'Mengenal Medan Tempur: Dokumen Soal & Demo', 'max_xp' => 100],
                    ['slug' => 'koneksi-matchboard', 'title' => 'Menghubungkan JS Dasar ke Client Module (Matchboard)', 'max_xp' => 100],
                    ['slug' => 'koneksi-mobile-web', 'title' => 'Menghubungkan JS Dasar ke Mobile Web Service Module', 'max_xp' => 100],
                ]],
            ],
        ],
    ],

];
