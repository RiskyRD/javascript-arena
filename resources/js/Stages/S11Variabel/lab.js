import { exportVars } from '../../Lib/sandbox/runWorker.js';

const DATA = `// Daftar kontak di HP (array berisi object)
const kontak = [
  { nama: 'Andi',  umur: 17, kota: 'Bandung' },
  { nama: 'Bunga', umur: 16, kota: 'Denpasar' },
  { nama: 'Citra', umur: 18, kota: 'Surabaya' },
];
`;

const LOGS = `
console.log('Sekolah:', namaSekolah);
console.log('Jumlah kontak:', jumlahKontak);
console.log('Kontak kedua:', namaKedua);
console.log(kontak);
`;

export default {
    title: 'Latihan: Buku Kontak',
    tasks: [
        'Buat `const namaSekolah` berisi nama sekolahmu (teks, tidak boleh kosong)',
        'Buat `let jumlahKontak` berisi panjang array `kontak`',
        'Buat object `kontakBaru` (Dewi, 17, Malang), masukkan ke `kontak`, lalu perbarui `jumlahKontak`',
        'Ambil nama kontak KEDUA ke dalam `const namaKedua`',
        'Ubah kota Andi (kontak pertama) menjadi `Jakarta`',
    ],
    starter: `${DATA}
// TODO 1: buat konstanta namaSekolah berisi teks nama sekolahmu
const namaSekolah = '';

// TODO 2: buat variabel jumlahKontak berisi panjang array kontak
let jumlahKontak = 0;

// TODO 3: buat object kontakBaru { nama: 'Dewi', umur: 17, kota: 'Malang' },
//         tambahkan ke array kontak, lalu isi ulang jumlahKontak
const kontakBaru = null;


// TODO 4: ambil NAMA kontak kedua (ingat: urutan dimulai dari 0)
const namaKedua = '';

// TODO 5: ubah kota kontak pertama (Andi) menjadi 'Jakarta'

${LOGS}`,
    solution: `${DATA}
const namaSekolah = 'SMK Negeri 1';

let jumlahKontak = kontak.length;

const kontakBaru = { nama: 'Dewi', umur: 17, kota: 'Malang' };
kontak.push(kontakBaru);
jumlahKontak = kontak.length;

const namaKedua = kontak[1].nama;

kontak[0].kota = 'Jakarta';
${LOGS}`,
    hints: [
        'Teks ditulis di antara tanda kutip: `const namaSekolah = \'SMK Negeri 1\';`',
        'Setiap array punya properti `.length` yang berisi jumlah isinya: `kontak.length`.',
        'Object ditulis dengan kurung kurawal: `{ nama: \'Dewi\', umur: 17, kota: \'Malang\' }`. Tambahkan ke array dengan `kontak.push(kontakBaru)`, lalu tulis `jumlahKontak = kontak.length;` (tanpa `let` lagi).',
        'Kontak kedua ada di posisi 1, jadi `kontak[1].nama`.',
        'Akses object pertama lalu ganti propertinya: `kontak[0].kota = \'Jakarta\';`',
    ],
    epilogue: exportVars(['namaSekolah', 'jumlahKontak', 'kontakBaru', 'namaKedua', 'kontak']),
    checks: [
        { label: 'namaSekolah berisi teks yang tidak kosong', test: (v) => typeof v.namaSekolah === 'string' && v.namaSekolah.trim().length > 0 },
        {
            label: "kontakBaru adalah object { nama: 'Dewi', umur: 17, kota: 'Malang' } (umur berupa angka)",
            test: (v) => v.kontakBaru?.nama === 'Dewi' && v.kontakBaru?.umur === 17 && v.kontakBaru?.kota === 'Malang',
        },
        { label: 'Array kontak sekarang berisi 4 orang, terakhir Dewi', test: (v) => v.kontak?.length === 4 && v.kontak[3]?.nama === 'Dewi' },
        { label: 'jumlahKontak bernilai 4 (diperbarui setelah menambah)', test: (v) => v.jumlahKontak === 4 },
        { label: "namaKedua bernilai 'Bunga'", test: (v) => v.namaKedua === 'Bunga' },
        { label: "Kota Andi sudah berubah menjadi 'Jakarta'", test: (v) => v.kontak?.[0]?.kota === 'Jakarta' },
    ],
};
