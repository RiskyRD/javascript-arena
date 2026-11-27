/**
 * Menjalankan kode siswa (tanpa DOM) di Web Worker terisolasi.
 * - console.* ditangkap dan dikirim balik sebagai log.
 * - `epilogue` dijalankan di scope yang sama setelah kode siswa dan nilai return-nya
 *   (harus bisa di-JSON-kan) dipakai untuk pengujian di main thread.
 * - Worker dimatikan paksa setelah `timeout` ms (melindungi dari infinite loop).
 */
const WORKER_SRC = `
const fmt = (v) => {
  if (typeof v === 'string') return v;
  if (typeof v === 'function') return '[Function ' + (v.name || 'anonim') + ']';
  if (v === undefined) return 'undefined';
  try { return JSON.stringify(v, null, 2); } catch (e) { return String(v); }
};
const send = (level, args) => postMessage({ kind: 'log', level, text: args.map(fmt).join(' ') });
['log', 'info', 'warn', 'error'].forEach((lvl) => { console[lvl] = (...a) => send(lvl, a); });
console.table = (d) => send('log', [d]);
onmessage = (e) => {
  const { code, epilogue } = e.data;
  try {
    const value = new Function(code + '\\n;\\n' + (epilogue || ''))();
    postMessage({ kind: 'done', value: value === undefined ? null : JSON.parse(JSON.stringify(value)) });
  } catch (err) {
    postMessage({ kind: 'done', error: err.name + ': ' + err.message });
  }
};`;

export function runInWorker(code, epilogue = '', timeout = 2000) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }));
        const worker = new Worker(url);
        const logs = [];

        const finish = (result) => {
            clearTimeout(timer);
            worker.terminate();
            URL.revokeObjectURL(url);
            resolve({ logs, value: null, error: null, ...result });
        };
        const timer = setTimeout(
            () => finish({ error: 'Timeout: kode berjalan lebih dari 2 detik. Cek kemungkinan infinite loop.' }),
            timeout,
        );

        worker.onmessage = (e) => {
            if (e.data.kind === 'log') logs.push({ level: e.data.level, text: e.data.text });
            else finish({ value: e.data.value, error: e.data.error ?? null });
        };
        worker.onerror = (e) => {
            e.preventDefault();
            finish({ error: e.message });
        };
        worker.postMessage({ code, epilogue });
    });
}

/** Epilogue standar: kembalikan variabel siswa (null jika tidak dideklarasikan). */
export const exportVars = (names) =>
    `return { ${names.map((n) => `${n}: typeof ${n} === 'undefined' ? null : ${n}`).join(', ')} };`;

/** Jalankan daftar check `{ label, test(value, code) }` dengan aman. */
export function evaluateChecks(checks, value, code, failed = false) {
    return checks.map(({ label, test }) => {
        if (failed) return { label, pass: false };
        try {
            return { label, pass: Boolean(test(value, code)) };
        } catch {
            return { label, pass: false };
        }
    });
}
