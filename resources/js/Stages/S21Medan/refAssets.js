/** Aset referensi soal yang disalin ke public/ref-assets (lihat .claude/ref-summary.md). */
const BASE = '/ref-assets';

const screen = (n, caption) => ({ src: `${BASE}/client/screens/screen-${String(n).padStart(2, '0')}.png`, caption });
const wire = (n, caption) => ({ src: `${BASE}/mobile/wireframes/wireframe-0${n}.png`, caption });

export const MODULES = [
    {
        id: 'client',
        name: 'Client Module',
        product: 'Matchboard – Tactical Whiteboard',
        meta: [
            ['Durasi', '3 jam'],
            ['Teknologi', 'HTML, CSS, JavaScript murni'],
            ['Dinilai di', 'Chrome / Firefox Developer Edition'],
            ['Total nilai', '35'],
        ],
        pdf: `${BASE}/client/client-module.pdf`,
        iconTile: 'bg-arena-bg',
        video: `${BASE}/client/demo-matchboard.mp4`,
        gallery: [
            screen(1, 'Papan kosong, belum ada alat aktif'),
            screen(3, 'Memilih formasi dari dropdown'),
            screen(4, 'Formasi HOME & AWAY terpasang'),
            screen(5, 'Pemain dipilih → panel Selection'),
            screen(6, 'Straight & Run Arrow'),
            screen(7, 'Passing Path (BFS): 4 umpan'),
            screen(8, 'Cone & catatan teks'),
            screen(10, 'Tema terang'),
            screen(11, 'Responsif 760px'),
            screen(12, 'Responsif 510px (HP)'),
        ],
        icons: ['move', 'eraser', 'cone', 'text', 'arrow', 'arrow-run', 'arrow-pass', 'arrow-press', 'line', 'link', 'path-find', 'zoom-in', 'zoom-out', 'theme', 'undo', 'redo'].map(
            (n) => ({ name: n, src: `${BASE}/client/icons/${n}.svg` }),
        ),
        marks: [
            ['Pitch loading, toolbar, dan formasi', 10.5],
            ['Penempatan marker, perpindahan, kustomisasi tim/pemain', 6.5],
            ['Arrows, Link Teammates, Passing Path (BFS)', 10],
            ['Undo/redo, pan/zoom, tema, export, responsif', 8],
        ],
    },
    {
        id: 'mobile',
        name: 'Mobile Web Service Module',
        product: 'International Scholarship Discovery Platform',
        meta: [
            ['Layar', 'Mobile-first, lebar maks 480px'],
            ['Teknologi', 'React / Vue / Vanilla JS + API'],
            ['Bahasa', 'Indonesia, English, 한국어'],
            ['Total nilai', 'tidak dicantumkan di dokumen'],
        ],
        pdf: `${BASE}/mobile/mobile-module.pdf`,
        video: null,
        gallery: [
            wire(1, 'Home: pencarian + kartu beasiswa ♥'),
            wire(2, 'Detail: syarat per jenjang'),
            wire(3, 'Discover: filter multi-parameter'),
            wire(4, 'Settings: My Profile'),
        ],
        icons: ['material-symbols--home-rounded', 'iconamoon--discover-bold', 'iconoir--double-check', 'icon-park-solid--like', 'material-symbols--settings-rounded', 'uil--language', 'id', 'en', 'kr'].map(
            (n) => ({ name: n.replace(/^.*--/, ''), src: `${BASE}/mobile/icons/${n}.svg` }),
        ),
        marks: null,
        iconTile: 'bg-ink',
        extra: { label: 'Halaman offline (game.html)', href: `${BASE}/mobile/game.html` },
    },
];
