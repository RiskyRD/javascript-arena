const HEAD = `// Contoh: mengambil elemen lampu dari HTML
const lampu = document.querySelector('#lampu');
`;

const CHECK_LABELS = [
    'Klik sakelar → lampu mendapat class "nyala"',
    'Teks status menjadi "Lampu menyala"',
    'Klik sakelar lagi → lampu mati (class "nyala" hilang)',
    'Teks status kembali "Lampu mati"',
    'Klik titik warna di tombol Biru → warna lampu jadi biru & hanya Biru yang aktif',
    'Klik Merah → warna merah & hanya Merah yang aktif',
    'Klik celah kosong di pilihan warna tidak error & tidak mengubah warna',
];

// Dijalankan DI DALAM iframe setelah kode siswa.
const TESTS = `() => {
  const L = ${JSON.stringify(CHECK_LABELS)};
  const $ = (s) => document.querySelector(s);
  const click = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  const lampu = $('#lampu'), status = $('#status'), saklar = $('#saklar'), pilihan = $('#pilihan-warna');
  const tombol = (w) => pilihan.querySelector('[data-warna="' + w + '"]');
  const aktif = () => [...pilihan.querySelectorAll('[data-warna].aktif')].map((b) => b.dataset.warna).join(',');
  const text = () => status.textContent.trim();
  const out = [];
  const check = (i, fn) => { let pass = false; try { pass = !!fn(); } catch (e) {} out.push({ label: L[i], pass }); };

  click(saklar);
  check(0, () => lampu.classList.contains('nyala'));
  check(1, () => text() === 'Lampu menyala');
  click(saklar);
  // Hanya bermakna jika lampu sempat menyala (hindari lulus tanpa dikerjakan).
  check(2, () => out[0].pass && !lampu.classList.contains('nyala'));
  check(3, () => out[1].pass && text() === 'Lampu mati');

  click(tombol('biru').querySelector('.titik'));
  check(4, () => lampu.dataset.warna === 'biru' && aktif() === 'biru');
  click(tombol('merah'));
  check(5, () => lampu.dataset.warna === 'merah' && aktif() === 'merah');
  let crashed = false;
  const onErr = () => { crashed = true; };
  window.addEventListener('error', onErr);
  click(pilihan);
  window.removeEventListener('error', onErr);
  check(6, () => !crashed && lampu.dataset.warna === 'merah');
  return out;
}`;

export default {
    title: 'Latihan: Lampu Kamar Pintar',
    tasks: [
        'Ambil elemen `#status`, `#saklar`, dan `#pilihan-warna` dengan `querySelector`',
        'Klik sakelar → `classList.toggle` class `nyala` pada lampu, lalu ubah teks status',
        'SATU listener di `#pilihan-warna` (event delegation): simpan warna ke `lampu.dataset.warna`',
        'Class `aktif` hanya menyala di tombol warna yang terakhir diklik',
    ],
    html: `<div class="kamar">
  <div id="lampu" class="lampu"></div>
  <p id="status">Lampu mati</p>
  <button id="saklar">Tekan Sakelar</button>
  <div id="pilihan-warna" class="pilihan">
    <button data-warna="kuning"><span class="titik"></span> Kuning</button>
    <button data-warna="biru"><span class="titik"></span> Biru</button>
    <button data-warna="merah"><span class="titik"></span> Merah</button>
  </div>
</div>`,
    css: `body{margin:0;padding:16px;background:#0B0F19;color:#E5E7EB;font:14px system-ui,sans-serif}
.kamar{display:flex;flex-wrap:wrap;align-items:center;gap:14px}
.lampu{width:44px;height:44px;border-radius:50%;background:#1F2A44;border:2px solid #334155;transition:.25s}
.lampu.nyala{background:#FDE68A;box-shadow:0 0 24px #FDE68A}
.lampu.nyala[data-warna="biru"]{background:#7DD3FC;box-shadow:0 0 24px #7DD3FC}
.lampu.nyala[data-warna="merah"]{background:#FCA5A5;box-shadow:0 0 24px #FCA5A5}
#status{margin:0;min-width:110px;color:#38BDF8;font-family:ui-monospace,monospace}
button{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:1px solid #1F2A44;border-radius:6px;background:#131A2B;color:#CBD5E1;cursor:pointer;font:inherit}
button:hover{color:#fff}
.pilihan{display:flex;gap:6px;padding:6px;border:1px dashed #334155;border-radius:8px}
.pilihan button.aktif{border-color:#F59E0B;color:#F59E0B}
.titik{width:10px;height:10px;border-radius:50%;background:currentColor}`,
    starter: `${HEAD}
// TODO 1: ambil elemen #status, #saklar, dan #pilihan-warna
const statusText = null;
const saklar = null;
const pilihanWarna = null;

// TODO 2: saat sakelar diklik → toggle class 'nyala' pada lampu,
//         lalu ubah teks status: 'Lampu menyala' atau 'Lampu mati'
if (saklar) {
  // tulis addEventListener di sini
}

// TODO 3 & 4: SATU listener di pilihanWarna (event delegation)
//   - cari tombol terdekat yang punya atribut data-warna
//   - simpan warnanya: lampu.dataset.warna = ...
//   - class 'aktif' hanya di tombol yang diklik
if (pilihanWarna) {
  // tulis addEventListener di sini
}`,
    solution: `${HEAD}
const statusText = document.querySelector('#status');
const saklar = document.querySelector('#saklar');
const pilihanWarna = document.querySelector('#pilihan-warna');

saklar.addEventListener('click', () => {
  lampu.classList.toggle('nyala');
  const menyala = lampu.classList.contains('nyala');
  statusText.textContent = menyala ? 'Lampu menyala' : 'Lampu mati';
});

pilihanWarna.addEventListener('click', (e) => {
  const tombol = e.target.closest('[data-warna]');
  if (!tombol) return;
  lampu.dataset.warna = tombol.dataset.warna;
  pilihanWarna.querySelectorAll('[data-warna]').forEach((b) => {
    b.classList.toggle('aktif', b === tombol);
  });
});`,
    hints: [
        "Sama seperti contoh lampu di baris pertama: `const saklar = document.querySelector('#saklar');`",
        "Di dalam listener: `lampu.classList.toggle('nyala');` lalu cek dengan `lampu.classList.contains('nyala')` untuk menentukan teks status.",
        "Yang diklik bisa saja titik warna di dalam tombol. Naik ke tombolnya: `const tombol = e.target.closest('[data-warna]');` dan jangan lupa `if (!tombol) return;`",
        "Loop semua tombol warna lalu `b.classList.toggle('aktif', b === tombol);` — true untuk tombol yang diklik, false untuk yang lain.",
    ],
    tests: TESTS,
    checkLabels: CHECK_LABELS,
};
