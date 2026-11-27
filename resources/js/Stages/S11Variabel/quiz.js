export default [
    {
        id: 'c11-q1',
        type: 'mcq',
        prompt: 'Apa yang terjadi saat kode berikut dijalankan?',
        code: 'const skor = 0;\nskor = 5;',
        options: [
            { text: '`skor` berubah menjadi 5', explain: 'Itu yang terjadi kalau `skor` dibuat dengan `let`. Dengan `const`, isinya tidak boleh diganti.' },
            { text: 'Error: Assignment to constant variable', explain: 'Tepat. `const` artinya kotaknya disegel — isinya tidak bisa diganti. Pakai `let` untuk nilai yang akan berubah, seperti skor.' },
            { text: '`skor` menjadi 0 lagi', explain: 'JavaScript tidak diam-diam mengabaikan perintah ini; ia menghentikan program dengan error.' },
            { text: '`skor` menjadi teks "5"', explain: 'Tipe data tidak berubah sendiri, dan baris kedua ini bahkan tidak dijalankan karena error.' },
        ],
        answer: 1,
    },
    {
        id: 'c11-q2',
        type: 'fill',
        prompt: "Isi angka yang tepat agar program menampilkan 'jeruk':",
        code: "const buah = ['apel', 'jeruk', 'mangga'];\nconsole.log(buah[__]);",
        accept: ['1'],
        explain: 'Urutan array dimulai dari 0: apel = 0, jeruk = 1, mangga = 2.',
        hint: 'Ingat, item pertama ada di posisi 0, bukan 1.',
    },
];
