export default [
    {
        id: 'c14-q1',
        type: 'mcq',
        prompt: 'Kenapa data perlu diubah dengan `JSON.stringify` sebelum disimpan ke localStorage?',
        options: [
            { text: 'Supaya datanya terenkripsi dan aman', explain: 'JSON.stringify tidak mengenkripsi apa pun — teksnya tetap bisa dibaca siapa saja.' },
            {
                text: 'Karena localStorage hanya bisa menyimpan teks, jadi array/object harus diubah menjadi teks dulu',
                explain: 'Tepat. Tanpa stringify, array `["Telur"]` akan tersimpan sebagai teks "Telur" dan object menjadi "[object Object]".',
            },
            { text: 'Supaya ukuran datanya jadi lebih kecil', explain: 'Ukurannya justru bisa sedikit bertambah karena tanda kutip dan kurung ikut disimpan.' },
            { text: 'Karena localStorage hanya menerima angka', explain: 'localStorage menerima teks (string), bukan angka.' },
        ],
        answer: 1,
    },
    {
        id: 'c14-q2',
        type: 'fill',
        prompt: 'Lengkapi baris terakhir agar tampilan layar ikut berubah setelah data di state diubah:',
        code: "function tambahBarang(nama) {\n  state.barang.push(nama);\n  simpan();\n  ______\n}",
        accept: ['render()', 'render();'],
        explain: 'Pola wajibnya: ubah state → (simpan) → render(). Tanpa render, data sudah berubah tapi layar diam.',
        hint: 'Fungsi yang menggambar ulang tampilan dari state.',
    },
    {
        id: 'c14-q3',
        type: 'mcq',
        prompt: 'Data sudah berhasil disimpan ke localStorage, tapi setelah halaman di-refresh daftar belanja tetap kosong. Bagian apa yang kemungkinan besar terlupa?',
        options: [
            { text: 'Memanggil `simpan()` setelah menambah barang', explain: 'Kalau simpan terlupa, datanya tidak akan ada di localStorage. Di soal ini datanya sudah tersimpan.' },
            { text: 'Membaca data dari localStorage (getItem + JSON.parse) saat halaman dibuka', explain: 'Tepat. Saat refresh, state kembali kosong. Data harus dimuat ulang dari localStorage sebelum render() pertama.' },
            { text: 'Menulis `e.preventDefault()`', explain: 'preventDefault mencegah form memuat ulang halaman saat dikirim, bukan memuat data saat halaman dibuka.' },
            { text: 'Memakai `const` untuk state', explain: 'const tidak menghalangi isi state berubah, dan tidak berhubungan dengan refresh.' },
        ],
        answer: 1,
    },
];
