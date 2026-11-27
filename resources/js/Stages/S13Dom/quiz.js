export default [
    {
        id: 'c13-q1',
        type: 'mcq',
        prompt: "Elemen `lampu` SUDAH punya class `nyala`. Apa yang terjadi setelah `lampu.classList.toggle('nyala')`?",
        options: [
            { text: 'Class `nyala` ditambahkan lagi sehingga ada dua', explain: 'Sebuah class tidak bisa muncul dua kali pada elemen yang sama.' },
            { text: 'Class `nyala` dihapus', explain: 'Tepat. toggle seperti sakelar: kalau sudah ada, dihapus; kalau belum ada, ditambahkan.' },
            { text: 'Tidak terjadi apa-apa', explain: 'Itu perilaku `classList.add` ketika class sudah ada, bukan toggle.' },
            { text: 'Muncul error karena class sudah ada', explain: 'toggle justru dibuat untuk situasi ini dan tidak pernah error.' },
        ],
        answer: 1,
    },
    {
        id: 'c13-q2',
        type: 'fill',
        prompt: 'Lengkapi nama event agar fungsi dijalankan saat tombol diklik:',
        code: "tombol.addEventListener('_____', () => {\n  console.log('Tombol diklik!');\n});",
        accept: ['click', "'click'"],
        explain: "Nama event untuk klik mouse (dan sentuhan di HP) adalah 'click'.",
        hint: 'Kata dalam bahasa Inggris untuk "klik".',
    },
];
