/**
 * Membangun srcdoc untuk iframe lab DOM (sandbox="allow-scripts", tanpa allow-same-origin,
 * sehingga kode siswa tidak bisa membaca localStorage/token halaman utama).
 *
 * Alur di dalam iframe: render HTML lab (di #lab-root) → jalankan kode siswa →
 * (opsional) jalankan fungsi pengujian `tests` (boleh async) → kirim hasil ke parent.
 *
 * Yang disuntikkan ke kode siswa sebagai variabel:
 * - `localStorage` → penyimpanan di memori (iframe sandbox tidak boleh memakai yang asli).
 * - `fetch` → jika `api` diberikan: API tiruan offline berisi `api.scholarships`,
 *   merespons `{ data: [...] }` setelah ~120ms dan mencatat setiap URL ke `fetchLog`.
 *
 * Fungsi pengujian menerima `{ reload, storage, fetchLog, wait }`:
 * `reload()` = simulasi refresh (HTML awal + jalankan ulang kode, storage tetap),
 * `wait(ms)` = Promise jeda (untuk menguji debounce/async).
 */
export const LAB_MESSAGE_SOURCE = 'jsarena-lab';

export function buildLabDocument({ html, css, code = '', tests = null, api = null }) {
    // Escape "<" agar kode siswa tidak bisa menutup tag <script> di srcdoc.
    const payload = JSON.stringify({ code, tests, api }).replace(/</g, '\\u003c');

    return `<!doctype html><html lang="id"><head><meta charset="utf-8"><style>${css}</style></head><body><div id="lab-root">${html}</div>
<script>
(() => {
  const post = (msg) => parent.postMessage(Object.assign({ source: '${LAB_MESSAGE_SOURCE}' }, msg), '*');
  const fmt = (v) => {
    if (typeof v === 'string') return v;
    if (v instanceof Element) return '<' + v.tagName.toLowerCase() + (v.id ? '#' + v.id : '') + '>';
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  };
  ['log', 'info', 'warn', 'error'].forEach((lvl) => {
    console[lvl] = (...a) => post({ kind: 'log', level: lvl, text: a.map(fmt).join(' ') });
  });
  window.addEventListener('error', (e) => post({ kind: 'log', level: 'error', text: e.message }));
  window.addEventListener('unhandledrejection', (e) => post({ kind: 'log', level: 'error', text: String(e.reason) }));

  const { code, tests, api } = ${payload};

  const data = {};
  const storage = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
    clear: () => { Object.keys(data).forEach((k) => delete data[k]); },
    get length() { return Object.keys(data).length; },
  };

  const fetchLog = [];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const fakeFetch = (input) => {
    const url = new URL(String(input), 'https://web.lksn26.id/');
    fetchLog.push(url.pathname + url.search);
    const q = (url.searchParams.get('search') || '').toLowerCase();
    const found = /\\/api\\/scholarships\\/?$/.test(url.pathname);
    const body = found ? { data: api.scholarships.filter((s) => s.title.toLowerCase().includes(q)) } : { message: 'Not Found' };
    return wait(120).then(() => ({ ok: found, status: found ? 200 : 404, json: async () => body }));
  };
  const fetchImpl = api ? fakeFetch : (...a) => window.fetch(...a);

  if (!tests) return;
  const root = document.getElementById('lab-root');
  const ORIGINAL = root.innerHTML;
  const runStudent = () => new Function('localStorage', 'fetch', code)(storage, fetchImpl);
  const reload = () => { root.innerHTML = ORIGINAL; runStudent(); };

  let error = null;
  try { runStudent(); } catch (e) { error = e.name + ': ' + e.message; }
  if (error) return post({ kind: 'done', error, results: [] });

  Promise.resolve()
    .then(() => new Function('return (' + tests + ')')()({ reload, storage, fetchLog, wait }))
    .then((results) => post({ kind: 'done', error: null, results }))
    .catch((e) => post({ kind: 'done', error: 'Error saat pengujian: ' + e.message, results: [] }));
})();
</script></body></html>`;
}
