import { exportVars } from '../../Lib/sandbox/runWorker.js';

const DATA = `// Hasil bedah tabel nilai Client Module (Matchboard), total 35
const kriteria = [
  { nama: 'Pitch, toolbar & formasi',        bobot: 10.5, fitur: ['pitch SVG', 'toolbar', '6 formasi'] },
  { nama: 'Marker & kustomisasi tim',        bobot: 6.5,  fitur: ['drag marker', 'eraser', 'roster', 'warna'] },
  { nama: 'Arrows, link & passing path',     bobot: 10,   fitur: ['5 jenis garis', 'link teammates', 'BFS'] },
  { nama: 'Undo/redo, zoom, tema & export',  bobot: 8,    fitur: ['undo/redo', 'pan/zoom', 'tema', 'export', 'responsif'] },
];
`;

const LOGS = `
console.log('Total bobot:', totalBobot);
console.log('Urutan prioritas:', urutanPrioritas);
console.log('Kriteria besar:', kriteriaBesar);
console.log('Jumlah fitur:', jumlahFitur);
`;

export default {
    title: 'Latihan: Menyusun Prioritas dari Tabel Nilai',
    tasks: [
        '`totalBobot` → jumlah seluruh bobot (pakai `reduce`), hasilnya harus 35',
        '`kriteriaBesar` → kriteria dengan bobot minimal 10 (pakai `filter`)',
        '`urutanPrioritas` → nama kriteria diurutkan dari bobot terbesar (salin array, `sort`, lalu `map`)',
        '`jumlahFitur` → total semua fitur dari seluruh kriteria',
    ],
    starter: `${DATA}
// TODO 1 (reduce): jumlahkan semua bobot
const totalBobot = 0;

// TODO 2 (filter): kriteria yang bobotnya >= 10
const kriteriaBesar = [];

// TODO 3: urutkan dari bobot terbesar, lalu ambil namanya saja
//         petunjuk: [...kriteria] membuat salinan agar array asli tidak berubah
const urutanPrioritas = [];

// TODO 4: hitung total fitur (jumlahkan panjang setiap array fitur)
const jumlahFitur = 0;
${LOGS}`,
    solution: `${DATA}
const totalBobot = kriteria.reduce((total, k) => total + k.bobot, 0);

const kriteriaBesar = kriteria.filter((k) => k.bobot >= 10);

const urutanPrioritas = [...kriteria]
  .sort((a, b) => b.bobot - a.bobot)
  .map((k) => k.nama);

const jumlahFitur = kriteria.reduce((total, k) => total + k.fitur.length, 0);
${LOGS}`,
    hints: [
        '`kriteria.reduce((total, k) => total + k.bobot, 0)` — sama seperti menjumlahkan gol atau harga di Bab 1.',
        '`kriteria.filter((k) => k.bobot >= 10)`',
        '`sort((a, b) => b.bobot - a.bobot)` mengurutkan dari besar ke kecil. Rangkai: `[...kriteria].sort(...).map((k) => k.nama)`.',
        'Mirip TODO 1, tapi yang dijumlahkan `k.fitur.length`.',
    ],
    epilogue: exportVars(['totalBobot', 'kriteriaBesar', 'urutanPrioritas', 'jumlahFitur', 'kriteria']),
    checks: [
        { label: 'totalBobot bernilai 35', test: (v) => v.totalBobot === 35 },
        {
            label: 'kriteriaBesar berisi 2 kriteria (10,5 dan 10)',
            test: (v) => Array.isArray(v.kriteriaBesar) && v.kriteriaBesar.map((k) => k.bobot).join() === '10.5,10',
        },
        {
            label: 'urutanPrioritas dimulai dari "Pitch, toolbar & formasi" dan diakhiri "Marker & kustomisasi tim"',
            test: (v) =>
                JSON.stringify(v.urutanPrioritas) ===
                JSON.stringify(['Pitch, toolbar & formasi', 'Arrows, link & passing path', 'Undo/redo, zoom, tema & export', 'Marker & kustomisasi tim']),
        },
        {
            label: 'Setelah diurutkan, array kriteria asli tidak ikut berubah urutannya',
            test: (v) => v.urutanPrioritas?.[0] === 'Pitch, toolbar & formasi' && v.kriteria?.[1]?.bobot === 6.5,
        },
        { label: 'jumlahFitur bernilai 15', test: (v) => v.jumlahFitur === 15 },
    ],
};
