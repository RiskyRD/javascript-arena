const HEAD = `const form = document.querySelector('#form-belanja');
const input = document.querySelector('#input-barang');
const daftar = document.querySelector('#daftar');
const jumlah = document.querySelector('#jumlah');

// STATE: satu-satunya tempat data disimpan
const state = { barang: [] };
`;

const CHECK_LABELS = [
    'Menambah "Telur" → muncul 1 item di daftar & teks "1 barang"',
    'Menambah "Susu" → daftar berisi Telur, Susu & teks "2 barang"',
    'Input kosong (hanya spasi) diabaikan',
    "Data tersimpan di localStorage dengan kunci 'belanja' sebagai teks JSON",
    'Setelah halaman di-refresh, daftar belanja muncul kembali',
];

// Dijalankan DI DALAM iframe; menerima { reload, storage } dari harness.
const TESTS = `({ reload, storage }) => {
  const L = ${JSON.stringify(CHECK_LABELS)};
  const $ = (s) => document.querySelector(s);
  const add = (text) => {
    $('#input-barang').value = text;
    $('#form-belanja').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  };
  const items = () => [...$('#daftar').querySelectorAll('li')].map((li) => li.textContent.trim()).join(',');
  const count = () => $('#jumlah').textContent.trim();
  const out = [];
  const check = (i, fn) => { let pass = false; try { pass = !!fn(); } catch (e) {} out.push({ label: L[i], pass }); };

  add('Telur');
  check(0, () => items() === 'Telur' && count() === '1 barang');
  add('Susu');
  check(1, () => items() === 'Telur,Susu' && count() === '2 barang');
  add('   ');
  check(2, () => out[1].pass && items() === 'Telur,Susu');
  check(3, () => storage.getItem('belanja') === '["Telur","Susu"]');
  reload();
  check(4, () => out[3].pass && items() === 'Telur,Susu' && count() === '2 barang');
  return out;
}`;

export default {
    title: 'Latihan: Daftar Belanja yang Tidak Hilang',
    tasks: [
        '`render()`: kosongkan `#daftar`, buat `<li>` untuk setiap barang, tulis jumlahnya (mis. `2 barang`)',
        'Saat form dikirim: abaikan input kosong, tambahkan ke `state.barang`, kosongkan input, lalu `simpan()` dan `render()`',
        "`simpan()`: simpan `state.barang` ke localStorage dengan kunci `'belanja'` (pakai `JSON.stringify`)",
        'Saat halaman dibuka: muat data dari localStorage ke `state.barang` (pakai `JSON.parse`)',
    ],
    html: `<form id="form-belanja">
  <input id="input-barang" placeholder="Nama barang..." autocomplete="off">
  <button>Tambah</button>
</form>
<ul id="daftar"></ul>
<p id="jumlah">0 barang</p>`,
    css: `body{margin:0;padding:16px;background:#0B0F19;color:#E5E7EB;font:14px system-ui,sans-serif}
form{display:flex;gap:8px}
input{flex:1;padding:8px 10px;border:1px solid #1F2A44;border-radius:6px;background:#131A2B;color:#E5E7EB;font:inherit}
button{padding:8px 14px;border:0;border-radius:6px;background:#F59E0B;color:#0B0F19;font-weight:700;cursor:pointer}
ul{margin:12px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}
li{padding:4px 10px;border:1px solid #1F2A44;border-radius:999px;background:#131A2B}
#jumlah{margin:10px 0 0;color:#38BDF8;font-family:ui-monospace,monospace}`,
    starter: `${HEAD}
function render() {
  // TODO 1: kosongkan isi daftar, buat <li> untuk setiap barang di state.barang,
  //         lalu tulis jumlahnya ke elemen jumlah, contoh: "2 barang"
}

function simpan() {
  // TODO 3: simpan state.barang ke localStorage dengan kunci 'belanja'
  //         (ubah dulu menjadi teks dengan JSON.stringify)
}

form.addEventListener('submit', (e) => {
  e.preventDefault(); // cegah halaman memuat ulang
  const nama = input.value.trim();

  // TODO 2: kalau nama kosong, berhenti di sini.
  //         Kalau tidak: tambahkan ke state.barang, kosongkan input,
  //         lalu panggil simpan() dan render()
});

// TODO 4: saat halaman dibuka, ambil data 'belanja' dari localStorage.
//         Kalau ada, ubah kembali dengan JSON.parse lalu masukkan ke state.barang

render();`,
    solution: `${HEAD}
function render() {
  daftar.innerHTML = '';
  state.barang.forEach((nama) => {
    const li = document.createElement('li');
    li.textContent = nama;
    daftar.append(li);
  });
  jumlah.textContent = state.barang.length + ' barang';
}

function simpan() {
  localStorage.setItem('belanja', JSON.stringify(state.barang));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nama = input.value.trim();
  if (nama === '') return;

  state.barang.push(nama);
  input.value = '';
  simpan();
  render();
});

const tersimpan = localStorage.getItem('belanja');
if (tersimpan) {
  state.barang = JSON.parse(tersimpan);
}

render();`,
    hints: [
        "Mulai `render()` dengan `daftar.innerHTML = '';`, lalu `state.barang.forEach(...)` yang membuat `document.createElement('li')`, mengisi `textContent`, dan `daftar.append(li)`.",
        "Di listener: `if (nama === '') return;` lalu `state.barang.push(nama);`, `input.value = '';`, `simpan();`, `render();`",
        "`localStorage.setItem('belanja', JSON.stringify(state.barang));`",
        "`const tersimpan = localStorage.getItem('belanja');` lalu `if (tersimpan) { state.barang = JSON.parse(tersimpan); }` — letakkan sebelum `render()` paling bawah.",
    ],
    tests: TESTS,
    checkLabels: CHECK_LABELS,
};
