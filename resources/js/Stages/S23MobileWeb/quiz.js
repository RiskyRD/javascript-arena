export default [
    {
        id: 'c23-q1',
        type: 'mcq',
        prompt: 'Pengguna mengetik "LPDP" (4 huruf) dengan cepat di kolom pencarian yang memakai debounce 600ms. Berapa request yang dikirim ke API?',
        options: [
            { text: '4 request, satu untuk setiap huruf', explain: 'Itu yang terjadi tanpa debounce — dan persis yang dilarang soal: "search does not trigger an API request on every keystroke".' },
            { text: '1 request, setelah pengguna berhenti mengetik 600ms', explain: 'Tepat. Setiap ketikan membatalkan timer sebelumnya dengan clearTimeout, jadi hanya timer terakhir yang sempat berjalan.' },
            { text: '0 request sampai pengguna menekan tombol Cari', explain: 'Soal justru melarang pencarian yang menunggu klik tombol.' },
            { text: '2 request: di huruf pertama dan terakhir', explain: 'Debounce tidak mengirim request di awal; ia selalu menunggu jeda setelah ketikan terakhir.' },
        ],
        answer: 1,
    },
    {
        id: 'c23-q2',
        type: 'fill',
        prompt: 'Lengkapi kata kunci yang hilang agar kode menunggu respons API selesai sebelum lanjut:',
        code: "async function ambilRegion() {\n  const res = ______ fetch(`${API_URL}/regions`);\n  const json = await res.json();\n  return json;\n}",
        accept: ['await'],
        explain: '`await` membuat fungsi menunggu fetch selesai. Tanpa await, `res` berisi Promise yang belum selesai, bukan respons.',
        hint: 'Kata yang sama juga dipakai di baris berikutnya.',
    },
];
