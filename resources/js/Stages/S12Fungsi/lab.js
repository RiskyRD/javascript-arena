const DATA = `// Isi keranjang belanja
const keranjang = [
  { nama: 'Roti',  harga: 12000, jumlah: 2 },
  { nama: 'Susu',  harga: 18000, jumlah: 1 },
  { nama: 'Telur', harga: 2000,  jumlah: 10 },
  { nama: 'Apel',  harga: 5000,  jumlah: 4 },
];
`;

const LOGS = `
console.log('Barang murah:', barangMurah);
console.log('Susu:', susu);
console.log('Daftar nama:', daftarNama);
console.log('Total belanja:', totalBelanja);
`;

// Panggil fungsi siswa dengan input uji + ekspor variabel (aman jika belum dibuat).
const EPILOGUE = `return {
  sub: typeof hitungSubtotal === 'function' ? hitungSubtotal({ nama: 'Uji', harga: 1500, jumlah: 3 }) : null,
  kat: typeof kategoriHarga === 'function' ? [kategoriHarga(5000), kategoriHarga(18000), kategoriHarga(10000)] : null,
  barangMurah: typeof barangMurah === 'undefined' ? null : barangMurah,
  susu: typeof susu === 'undefined' ? null : susu,
  daftarNama: typeof daftarNama === 'undefined' ? null : daftarNama,
  totalBelanja: typeof totalBelanja === 'undefined' ? null : totalBelanja,
};`;

const uses = (code, method) => new RegExp(`\\.${method}\\s*\\(`).test(code);

export default {
    title: 'Latihan: Kasir Keranjang Belanja',
    tasks: [
        'Fungsi `hitungSubtotal(barang)` mengembalikan `harga × jumlah`',
        "Fungsi `kategoriHarga(harga)` mengembalikan `'murah'` jika di bawah 10000, selain itu `'mahal'`",
        '`barangMurah` → barang dengan harga di bawah 10000 (pakai `filter`)',
        "`susu` → barang bernama `'Susu'` (pakai `find`)",
        '`daftarNama` → array berisi nama-nama barang (pakai `map`)',
        '`totalBelanja` → jumlah semua subtotal (pakai `forEach` + `hitungSubtotal`)',
    ],
    starter: `${DATA}
// TODO 1: kembalikan harga dikali jumlah
function hitungSubtotal(barang) {
  return 0;
}

// TODO 2: jika harga < 10000 kembalikan 'murah', selain itu 'mahal'
function kategoriHarga(harga) {
  return '';
}

// TODO 3 (filter): barang yang harganya di bawah 10000
const barangMurah = [];

// TODO 4 (find): barang yang namanya 'Susu'
const susu = null;

// TODO 5 (map): ambil nama setiap barang → ['Roti', 'Susu', ...]
const daftarNama = [];

// TODO 6 (forEach): jumlahkan subtotal setiap barang ke totalBelanja
let totalBelanja = 0;

${LOGS}`,
    solution: `${DATA}
function hitungSubtotal(barang) {
  return barang.harga * barang.jumlah;
}

function kategoriHarga(harga) {
  if (harga < 10000) {
    return 'murah';
  } else {
    return 'mahal';
  }
}

const barangMurah = keranjang.filter((b) => b.harga < 10000);
const susu = keranjang.find((b) => b.nama === 'Susu');
const daftarNama = keranjang.map((b) => b.nama);

let totalBelanja = 0;
keranjang.forEach((b) => {
  totalBelanja = totalBelanja + hitungSubtotal(b);
});
${LOGS}`,
    hints: [
        'Ambil properti dari parameter: `return barang.harga * barang.jumlah;`',
        "Pakai `if (harga < 10000) { return 'murah'; } else { return 'mahal'; }`. Perhatikan: harga tepat 10000 termasuk mahal.",
        '`keranjang.filter((b) => b.harga < 10000)` — hanya barang yang syaratnya bernilai true yang ikut.',
        "`keranjang.find((b) => b.nama === 'Susu')` — pakai tiga tanda sama dengan untuk membandingkan.",
        '`keranjang.map((b) => b.nama)` mengubah setiap object menjadi teks namanya saja.',
        'Di bawah `let totalBelanja = 0;` tulis `keranjang.forEach((b) => { totalBelanja = totalBelanja + hitungSubtotal(b); });`',
    ],
    epilogue: EPILOGUE,
    checks: [
        { label: 'hitungSubtotal({ harga: 1500, jumlah: 3 }) mengembalikan 4500', test: (v) => v.sub === 4500 },
        {
            label: "kategoriHarga: 5000 → 'murah', 18000 → 'mahal', 10000 → 'mahal'",
            test: (v) => JSON.stringify(v.kat) === '["murah","mahal","mahal"]',
        },
        {
            label: 'barangMurah berisi Telur dan Apel',
            test: (v) => Array.isArray(v.barangMurah) && v.barangMurah.map((b) => b.nama).join() === 'Telur,Apel',
        },
        { label: 'susu adalah object barang Susu (harga 18000)', test: (v) => v.susu?.nama === 'Susu' && v.susu?.harga === 18000 },
        { label: "daftarNama = ['Roti', 'Susu', 'Telur', 'Apel']", test: (v) => JSON.stringify(v.daftarNama) === '["Roti","Susu","Telur","Apel"]' },
        { label: 'totalBelanja bernilai 82000', test: (v) => v.totalBelanja === 82000 },
        { label: 'Memakai forEach, filter, find, dan map', test: (_, code) => ['forEach', 'filter', 'find', 'map'].every((m) => uses(code, m)) },
    ],
};
