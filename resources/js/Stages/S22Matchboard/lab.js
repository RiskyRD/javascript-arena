const ICON = '/ref-assets/client/icons';

// Garis lapangan (dibuat ulang; berkas pitch SVG asli tidak tersedia di .ref) — viewBox 600×400.
const PITCH = `<svg id="pitch" viewBox="0 0 600 400" role="img" aria-label="Lapangan">
  <rect x="0" y="0" width="600" height="400" fill="#1f6b3a"/>
  <g fill="none" stroke="#eef1ea" stroke-opacity=".8" stroke-width="2">
    <rect x="6" y="6" width="588" height="388"/><line x1="300" y1="6" x2="300" y2="394"/>
    <circle cx="300" cy="200" r="48"/><rect x="6" y="110" width="80" height="180"/><rect x="514" y="110" width="80" height="180"/>
    <rect x="6" y="160" width="28" height="80"/><rect x="566" y="160" width="28" height="80"/>
  </g>
  <g id="pemain"></g>
</svg>`;

const HEAD = `const W = 600, H = 400;
const pilihFormasi = document.querySelector('#formasi');
const tombolUndo = document.querySelector('#undo');
const lapisanPemain = document.querySelector('#pemain');
const stats = document.querySelector('#stats');

const state = { home: [] };  // posisi pemain HOME: [{ x, y }, ...]
const riwayat = [];          // tumpukan snapshot untuk Undo

// Sudah disediakan: membuat satu titik pemain di SVG
function buatTitik(x, y) {
  const titik = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  titik.setAttribute('cx', x);
  titik.setAttribute('cy', y);
  titik.setAttribute('r', 11);
  titik.setAttribute('class', 'pemain');
  return titik;
}

// Sudah disediakan: simpan salinan state sebelum berubah
function simpanRiwayat() {
  riwayat.push(JSON.stringify(state.home));
}
`;

const CHECK_LABELS = [
    'Pilih 4-3-3 → 11 titik pemain & teks "Home: 11"',
    'Posisi 4-3-3 benar (kiper + 3 baris tersebar merata)',
    'Ganti ke 3-5-2 → pemain diganti (tetap 11) dengan posisi benar',
    'Undo → kembali ke posisi 4-3-3',
    'Undo lagi → papan kosong & "Home: 0"',
    'Undo saat riwayat kosong tidak error',
];

const TESTS = `() => {
  const L = ${JSON.stringify(CHECK_LABELS)};
  const $ = (s) => document.querySelector(s);
  const ref = (f) => {
    const b = f.split('-').map(Number), p = [{ x: 30, y: 200 }];
    b.forEach((n, i) => { const x = 300 * (i + 1) / (b.length + 1); for (let j = 0; j < n; j++) p.push({ x, y: 400 * (j + 1) / (n + 1) }); });
    return p;
  };
  const dots = () => [...$('#pemain').querySelectorAll('circle')].map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy') }));
  const same = (a, b) => a.length === b.length && a.every((p, i) => Math.abs(p.x - b[i].x) < 0.5 && Math.abs(p.y - b[i].y) < 0.5);
  const pick = (f) => { $('#formasi').value = f; $('#formasi').dispatchEvent(new Event('change', { bubbles: true })); };
  const stat = () => $('#stats').textContent.trim();
  const out = [];
  const check = (i, fn) => { let pass = false; try { pass = !!fn(); } catch (e) {} out.push({ label: L[i], pass }); };

  pick('4-3-3');
  check(0, () => dots().length === 11 && stat() === 'Home: 11');
  check(1, () => same(dots(), ref('4-3-3')));
  pick('3-5-2');
  check(2, () => same(dots(), ref('3-5-2')));
  $('#undo').click();
  check(3, () => out[2].pass && same(dots(), ref('4-3-3')));
  $('#undo').click();
  check(4, () => out[3].pass && dots().length === 0 && stat() === 'Home: 0');
  let crashed = false;
  const onErr = () => { crashed = true; };
  window.addEventListener('error', onErr);
  $('#undo').click();
  window.removeEventListener('error', onErr);
  check(5, () => out[4].pass && !crashed && dots().length === 0);
  return out;
}`;

export default {
    title: 'Latihan: Mini Matchboard (Formasi + Undo)',
    tasks: [
        '`hitungFormasi(formasi)` → 11 posisi: kiper + pemain setiap baris tersebar merata',
        '`render()` → gambar titik untuk setiap posisi di `state.home`, lalu tulis `Home: 11`',
        'Saat formasi dipilih → `simpanRiwayat()`, isi `state.home`, lalu `render()`',
        'Undo → ambil snapshot terakhir dari `riwayat` (`pop` + `JSON.parse`), lalu `render()`',
    ],
    html: `<div class="board">
  <div class="bar">
    <label>HOME
      <select id="formasi">
        <option value="">Pilih formasi</option>
        <option>4-4-2</option><option>4-3-3</option><option>3-5-2</option>
      </select>
    </label>
    <button id="undo" type="button"><img src="${ICON}/undo.svg" alt=""> Undo</button>
    <span id="stats">Home: 0</span>
  </div>
  ${PITCH}
</div>`,
    css: `body{margin:0;padding:12px;background:#0B0F19;color:#E5E7EB;font:14px system-ui,sans-serif}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:8px}
label{display:flex;align-items:center;gap:6px;font-weight:700;color:#F59E0B}
select,button{padding:6px 10px;border:1px solid #1F2A44;border-radius:6px;background:#131A2B;color:#E5E7EB;font:inherit}
button{display:inline-flex;align-items:center;gap:6px;cursor:pointer}
button img{width:16px;height:16px}
#stats{margin-left:auto;font-family:ui-monospace,monospace;color:#38BDF8}
#pitch{display:block;width:100%;height:auto;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.4)}
.pemain{fill:#ef4444;stroke:#fff;stroke-width:2;transition:cx .3s,cy .3s}`,
    starter: `${HEAD}
// TODO 1: kembalikan 11 posisi (kiper + pemain di setiap baris)
function hitungFormasi(formasi) {
  const baris = [];                      // "4-3-3" → [4, 3, 3]
  const posisi = [{ x: 30, y: H / 2 }];  // kiper
  // baris ke-i  : x = (W / 2) * (i + 1) / (baris.length + 1)
  // pemain ke-j : y = H * (j + 1) / (jumlah + 1)
  return posisi;
}

// TODO 2: kosongkan lapisanPemain, gambar titik untuk setiap posisi di state.home,
//         lalu tulis jumlahnya ke stats, contoh: "Home: 11"
function render() {
}

// TODO 3: simpanRiwayat(), isi state.home dengan hitungFormasi(pilihFormasi.value), lalu render()
pilihFormasi.addEventListener('change', () => {
});

// TODO 4: kalau riwayat kosong, berhenti. Kalau tidak:
//         state.home = JSON.parse(riwayat.pop()); lalu render()
tombolUndo.addEventListener('click', () => {
});

render();`,
    solution: `${HEAD}
function hitungFormasi(formasi) {
  const baris = formasi.split('-').map(Number);
  const posisi = [{ x: 30, y: H / 2 }];
  baris.forEach((jumlah, i) => {
    const x = (W / 2) * (i + 1) / (baris.length + 1);
    for (let j = 0; j < jumlah; j++) {
      posisi.push({ x, y: H * (j + 1) / (jumlah + 1) });
    }
  });
  return posisi;
}

function render() {
  lapisanPemain.innerHTML = '';
  state.home.forEach((p) => lapisanPemain.append(buatTitik(p.x, p.y)));
  stats.textContent = 'Home: ' + state.home.length;
}

pilihFormasi.addEventListener('change', () => {
  simpanRiwayat();
  state.home = hitungFormasi(pilihFormasi.value);
  render();
});

tombolUndo.addEventListener('click', () => {
  if (riwayat.length === 0) return;
  state.home = JSON.parse(riwayat.pop());
  render();
});

render();`,
    hints: [
        "Isi `baris` dengan `formasi.split('-').map(Number)`, lalu `baris.forEach((jumlah, i) => { ... })` dengan loop `for` di dalamnya untuk setiap pemain.",
        "`lapisanPemain.innerHTML = '';` lalu `state.home.forEach((p) => lapisanPemain.append(buatTitik(p.x, p.y)));` dan `stats.textContent = 'Home: ' + state.home.length;`",
        'Urutannya penting: simpan riwayat DULU (sebelum state berubah), baru ganti `state.home`, lalu render.',
        '`if (riwayat.length === 0) return;` mencegah error saat riwayat habis.',
    ],
    tests: TESTS,
    checkLabels: CHECK_LABELS,
};
