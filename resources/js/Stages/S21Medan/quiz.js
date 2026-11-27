export default [
    {
        id: 'c21-q1',
        type: 'mcq',
        prompt: 'Waktumu di Client Module tinggal 40 menit dan fitur dasar (pitch, toolbar, formasi) belum jalan. Mana yang paling masuk akal dikerjakan dulu?',
        options: [
            { text: 'Export PNG resolusi ganda, karena terlihat keren', explain: 'Export ada di kriteria bernilai 8 bersama banyak fitur lain, dan bergantung pada papan yang sudah berfungsi.' },
            { text: 'Pitch, toolbar, dan formasi', explain: 'Tepat. Kriteria ini bernilai paling besar (10,5) dan menjadi fondasi fitur lain — tanpa papan dan pemain, fitur arrow atau undo tidak bisa dinilai.' },
            { text: 'Passing Path dengan BFS', explain: 'Bobotnya besar (10), tapi BFS butuh Link Teammates dan pemain di papan terlebih dahulu.' },
            { text: 'Mengganti warna kostum pemain', explain: 'Kustomisasi warna ada di kriteria terkecil (6,5) dan tidak berguna sebelum pemain bisa ditaruh.' },
        ],
        answer: 1,
    },
    {
        id: 'c21-q2',
        type: 'fill',
        prompt: 'Menurut dokumen Mobile Web Service Module, berapa lebar layar maksimal aplikasinya (dalam piksel)?',
        accept: ['480', '480px'],
        explain: 'Bagian "Mobile Web Layout" menyebut "Max width of 480px (mobile screen only)".',
        hint: 'Cari bagian B. Mobile Web Layout di PDF modul kedua.',
    },
];
