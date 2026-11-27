// Data API tiruan (offline). Bentuk respons API asli tidak dijelaskan di dokumen soal.
const SCHOLARSHIPS = [
    { slug: 'kaist-global-scholarship', title: 'KAIST Global Scholarship', country: 'South Korea', region: 'Asia' },
    { slug: 'gks-korea-scholarship', title: 'GKS Korea Government Scholarship', country: 'South Korea', region: 'Asia' },
    { slug: 'nus-asean-scholarship', title: 'NUS ASEAN Undergraduate Scholarship', country: 'Singapore', region: 'Asia' },
    { slug: 'lpdp-indonesia', title: 'LPDP Indonesia', country: 'Indonesia', region: 'Asia' },
    { slug: 'chevening-awards', title: 'Chevening Awards', country: 'United Kingdom', region: 'Europe' },
    { slug: 'erasmus-mundus', title: 'Erasmus Mundus Joint Master', country: 'European Union', region: 'Europe' },
];

const HEAD = `const API_URL = 'https://web.lksn26.id/api'; // base URL di SATU tempat (aturan soal)
const inputCari = document.querySelector('#cari');
const daftarHasil = document.querySelector('#hasil');
const jumlahWishlist = document.querySelector('#jumlah-wishlist');

const state = { hasil: [], wishlist: [] }; // wishlist berisi slug beasiswa
let timer = null;

// Sudah disediakan: menggambar hasil pencarian & jumlah wishlist dari state
function render() {
  daftarHasil.innerHTML = '';
  state.hasil.forEach((b) => {
    const li = document.createElement('li');
    const tersimpan = state.wishlist.includes(b.slug);
    li.innerHTML = \`<span>\${b.title}<small>\${b.country} · \${b.region}</small></span>
      <button data-slug="\${b.slug}" class="\${tersimpan ? 'tersimpan' : ''}" aria-label="Wishlist">♥</button>\`;
    daftarHasil.append(li);
  });
  jumlahWishlist.textContent = 'Wishlist: ' + state.wishlist.length;
}
`;

const CHECK_LABELS = [
    'Tidak ada request selama masih mengetik (debounce bekerja)',
    'Tepat 1 request dikirim setelah berhenti mengetik, berisi kata kunci "scholarship"',
    'Hasil pencarian tampil (3 beasiswa)',
    'Klik ♥ → masuk wishlist ("Wishlist: 1") & tombol bertanda tersimpan',
    'Klik ♥ lagi → keluar dari wishlist ("Wishlist: 0")',
    "Wishlist tersimpan di localStorage dengan kunci 'wishlist'",
    'Setelah halaman di-refresh, jumlah wishlist dimuat kembali',
];

const TESTS = `async ({ reload, storage, fetchLog, wait }) => {
  const L = ${JSON.stringify(CHECK_LABELS)};
  const $ = (s) => document.querySelector(s);
  const type = (t) => { $('#cari').value = t; $('#cari').dispatchEvent(new Event('input', { bubbles: true })); };
  const items = () => $('#hasil').querySelectorAll('li').length;
  const heart = (i) => $('#hasil').querySelectorAll('button[data-slug]')[i];
  const wl = () => $('#jumlah-wishlist').textContent.trim();
  const out = [];
  const check = (i, fn) => { let pass = false; try { pass = !!fn(); } catch (e) {} out.push({ label: L[i], pass }); };

  for (const t of ['s', 'sch', 'schol', 'scholarship']) { type(t); await wait(60); }
  await wait(100);
  const sebelum = fetchLog.length;
  await wait(1200);
  check(0, () => sebelum === 0 && fetchLog.length >= 1);
  check(1, () => fetchLog.length === 1 && fetchLog[0].includes('search=scholarship'));
  check(2, () => items() === 3);

  heart(0)?.click();
  check(3, () => wl() === 'Wishlist: 1' && heart(0).classList.contains('tersimpan'));
  heart(0)?.click();
  check(4, () => out[3].pass && wl() === 'Wishlist: 0');
  heart(1)?.click();
  check(5, () => JSON.parse(storage.getItem('wishlist') || '[]').includes('gks-korea-scholarship'));
  reload();
  check(6, () => out[5].pass && wl() === 'Wishlist: 1');
  return out;
}`;

export default {
    title: 'Latihan: Pencarian Beasiswa + Wishlist',
    tasks: [
        '`cariBeasiswa(kata)`: `fetch` ke `/scholarships?search=...` dengan `await`, simpan `json.data` ke `state.hasil`, lalu `render()`',
        'Debounce: saat mengetik, batalkan timer lama (`clearTimeout`) dan jalankan pencarian 600ms setelah berhenti mengetik',
        'Klik ♥ (event delegation di `#hasil`): tambahkan slug ke wishlist, atau hapus jika sudah ada',
        "`simpanWishlist()` ke localStorage kunci `'wishlist'`, dan muat kembali saat halaman dibuka",
    ],
    api: { scholarships: SCHOLARSHIPS },
    html: `<div class="app">
  <header>Discover <span id="jumlah-wishlist">Wishlist: 0</span></header>
  <input id="cari" type="search" placeholder="Cari beasiswa... (coba: scholarship)" autocomplete="off">
  <ul id="hasil"></ul>
</div>`,
    css: `body{margin:0;padding:12px;background:#0B0F19;color:#E5E7EB;font:14px system-ui,sans-serif}
.app{max-width:480px;margin:auto}
header{display:flex;justify-content:space-between;align-items:center;font-weight:700;margin-bottom:8px}
#jumlah-wishlist{font:12px ui-monospace,monospace;color:#38BDF8}
input{box-sizing:border-box;width:100%;padding:9px 12px;border:1px solid #1F2A44;border-radius:8px;background:#131A2B;color:#E5E7EB;font:inherit}
ul{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:6px}
li{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 10px;border:1px solid #1F2A44;border-radius:8px;background:#131A2B}
small{display:block;color:#94A3B8;font-size:12px}
li button{border:0;background:none;font-size:20px;color:#475569;cursor:pointer}
li button.tersimpan{color:#F43F5E}`,
    starter: `${HEAD}
// TODO 1: ambil data dari API dengan fetch + await, lalu simpan json.data ke state.hasil dan render()
async function cariBeasiswa(kata) {
  // const res = await fetch(...);
}

// TODO 2 (debounce): setiap kali mengetik, batalkan timer lama,
//         lalu jadwalkan cariBeasiswa 600ms kemudian
inputCari.addEventListener('input', () => {
});

// TODO 3: SATU listener di daftarHasil. Cari tombol terdekat yang punya data-slug,
//         lalu tambah/hapus slug-nya di state.wishlist, simpanWishlist(), render()
daftarHasil.addEventListener('click', (e) => {
});

// TODO 4: simpan state.wishlist ke localStorage dengan kunci 'wishlist'
function simpanWishlist() {
}

// TODO 4 (lanjutan): muat wishlist dari localStorage saat halaman dibuka

render();`,
    solution: `${HEAD}
async function cariBeasiswa(kata) {
  const res = await fetch(\`\${API_URL}/scholarships?search=\${encodeURIComponent(kata)}\`);
  const json = await res.json();
  state.hasil = json.data;
  render();
}

inputCari.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(() => cariBeasiswa(inputCari.value.trim()), 600);
});

daftarHasil.addEventListener('click', (e) => {
  const tombol = e.target.closest('[data-slug]');
  if (!tombol) return;
  const slug = tombol.dataset.slug;
  if (state.wishlist.includes(slug)) {
    state.wishlist = state.wishlist.filter((s) => s !== slug);
  } else {
    state.wishlist.push(slug);
  }
  simpanWishlist();
  render();
});

function simpanWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
}

const tersimpan = localStorage.getItem('wishlist');
if (tersimpan) {
  state.wishlist = JSON.parse(tersimpan);
}

render();`,
    hints: [
        "`const res = await fetch(API_URL + '/scholarships?search=' + encodeURIComponent(kata));` lalu `const json = await res.json();`",
        '`clearTimeout(timer); timer = setTimeout(() => cariBeasiswa(inputCari.value.trim()), 600);`',
        "`const tombol = e.target.closest('[data-slug]');` lalu pakai `includes` untuk mengecek; hapus dengan `filter`, tambah dengan `push`.",
        "`localStorage.setItem('wishlist', JSON.stringify(state.wishlist));` — muat dengan `getItem` + `JSON.parse` sebelum `render()` terakhir.",
    ],
    tests: TESTS,
    checkLabels: CHECK_LABELS,
};
