export default [
    {
        id: 'c22-q1',
        type: 'mcq',
        prompt: 'Soal Matchboard: "Choosing a formation … replacing any players that side already had while leaving the opposing team, ball, cones, and arrows untouched." Dengan pola State → Render, kode mana yang paling tepat?',
        options: [
            { text: '`pitch.innerHTML = \'\'` lalu gambar pemain HOME yang baru', explain: 'Ini menghapus SEMUA elemen di lapangan, termasuk tim lawan, bola, cone, dan panah.' },
            { text: '`state.home = hitungFormasi(f); render();`', explain: 'Tepat. Hanya data tim HOME yang diganti. Data away, bola, cone, dan arrows di state tidak disentuh, jadi render() menggambarnya kembali seperti semula.' },
            { text: '`state = { home: hitungFormasi(f) }; render();`', explain: 'Seluruh state diganti object baru, sehingga data away, bola, cone, dan arrows ikut hilang.' },
            { text: '`state.home.push(...hitungFormasi(f)); render();`', explain: 'push menambahkan ke pemain lama, sehingga jumlahnya menjadi 22, bukan diganti.' },
        ],
        answer: 1,
    },
    {
        id: 'c22-q2',
        type: 'mcq',
        prompt: 'Riwayat undo Matchboard dibatasi 60 state. Setelah `riwayat.push(snapshot)`, kode apa yang menjaga panjangnya tidak lebih dari 60?',
        options: [
            { text: '`if (riwayat.length > 60) riwayat.shift();`', explain: 'Tepat. `shift()` membuang snapshot paling lama di depan array, sehingga 60 snapshot terbaru tetap tersimpan.' },
            { text: '`if (riwayat.length > 60) riwayat.pop();`', explain: '`pop()` membuang snapshot paling BARU — justru yang baru saja disimpan.' },
            { text: '`riwayat.length = 0;`', explain: 'Ini mengosongkan seluruh riwayat, sehingga undo tidak bisa dipakai sama sekali.' },
            { text: 'Tidak perlu kode apa pun, array otomatis berhenti di 60', explain: 'Array JavaScript tidak punya batas panjang otomatis.' },
        ],
        answer: 0,
    },
];
