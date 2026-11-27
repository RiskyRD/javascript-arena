export default [
    {
        id: 'c12-q1',
        type: 'mcq',
        prompt: 'Apa yang ditampilkan konsol?',
        code: "function cekUkuran(n) {\n  if (n > 10) {\n    return 'besar';\n  }\n  return 'kecil';\n}\n\nconsole.log(cekUkuran(10));",
        options: [
            { text: "`'besar'`", explain: '10 tidak lebih besar dari 10. Kalau ingin 10 ikut "besar", syaratnya harus `n >= 10`.' },
            { text: "`'kecil'`", explain: 'Tepat. `10 > 10` bernilai false, jadi blok if dilewati dan fungsi lanjut ke `return \'kecil\'`.' },
            { text: '`undefined`', explain: 'Fungsi ini selalu mengembalikan sesuatu: kalau tidak masuk if, ia sampai ke `return \'kecil\'`.' },
            { text: 'Keduanya: `besar` lalu `kecil`', explain: '`return` langsung menghentikan fungsi, jadi paling banyak satu nilai yang dikembalikan.' },
        ],
        answer: 1,
    },
    {
        id: 'c12-q2',
        type: 'mcq',
        prompt: 'Kamu ingin mengambil SATU kontak yang namanya "Bunga" dari array `kontak`. Method mana yang paling tepat?',
        options: [
            { text: '`kontak.filter(...)`', explain: 'filter mengembalikan array (meskipun isinya cuma satu), jadi kamu masih harus mengambil `[0]`.' },
            { text: '`kontak.map(...)`', explain: 'map mengubah setiap item menjadi bentuk lain, bukan mencari.' },
            { text: '`kontak.find(...)`', explain: 'Tepat. find berhenti di item pertama yang cocok dan langsung mengembalikan object-nya.' },
            { text: '`kontak.forEach(...)`', explain: 'forEach hanya menjalankan sesuatu untuk setiap item dan tidak mengembalikan hasil.' },
        ],
        answer: 2,
    },
];
