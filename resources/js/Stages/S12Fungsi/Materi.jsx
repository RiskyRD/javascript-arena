import { Callout, CodeWalkthrough, LessonSection, Step } from '../../Components/Lesson/Blocks';

export default function Materi() {
    return (
        <>
            <LessonSection kind="story" title="Membuat program yang bisa berpikir dan bekerja berulang">
                <p>
                    Di chapter sebelumnya kamu sudah bisa menyimpan data. Tapi data saja belum cukup — program juga harus bisa{' '}
                    <strong>mengolah</strong> data itu. Bayangkan aplikasi belanja online: setiap barang di keranjang harus dihitung harganya,
                    barang yang sedang diskon harus ditandai, dan di akhir semua harga dijumlahkan menjadi total.
                </p>
                <p>
                    Kalau keranjangmu berisi 4 barang, kamu mungkin masih sanggup menghitung satu per satu. Tapi bagaimana kalau isinya 100? Kita
                    butuh tiga kemampuan baru. <strong>Fungsi</strong> agar perhitungan cukup ditulis sekali lalu dipakai berkali-kali.{' '}
                    <strong>Percabangan</strong> (<code>if/else</code>) agar program bisa mengambil keputusan, misalnya "kalau harganya di bawah
                    10 ribu, tandai sebagai murah". Dan <strong>method array</strong> agar program bisa mengolah seluruh isi daftar tanpa kita
                    menulis perintah untuk setiap item.
                </p>
            </LessonSection>

            <LessonSection kind="concept" title="Fungsi, keputusan, dan pengolahan daftar">
                <Step n={1} title="Fungsi: mesin dengan input dan output" />
                <p>
                    Bayangkan blender. Kamu memasukkan buah (input), menekan tombol, dan keluar jus (output). Kamu tidak perlu tahu cara kerja
                    mesinnya setiap kali — cukup pakai. Fungsi di JavaScript sama: kita menuliskan langkah-langkahnya sekali, memberinya nama, lalu
                    "memanggilnya" kapan saja dengan input yang berbeda.
                </p>
                <CodeWalkthrough
                    title="membuat dan memanggil fungsi"
                    steps={[
                        { code: 'function hitungLuas(panjang, lebar) {', note: <>Kata <code>function</code> diikuti nama fungsi. Di dalam kurung ada <strong>parameter</strong> — nama sementara untuk input yang akan diterima.</> },
                        { code: '  return panjang * lebar;\n}', note: <><code>return</code> mengirim hasil keluar dari fungsi, seperti jus yang keluar dari blender. Begitu <code>return</code> dijalankan, fungsi langsung berhenti.</> },
                        { code: 'const luasKamar = hitungLuas(4, 3);\nconsole.log(luasKamar); // 12', note: <>Memanggil fungsi dengan input 4 dan 3. Di dalam fungsi, <code>panjang</code> menjadi 4 dan <code>lebar</code> menjadi 3. Hasil <code>return</code>-nya kita simpan ke variabel.</> },
                    ]}
                />

                <Step n={2} title="if/else: program yang bisa memutuskan" />
                <p>
                    Setiap hari kamu mengambil keputusan: "kalau hujan, bawa payung; kalau tidak, pakai topi." Program bisa melakukan hal yang
                    sama dengan <code>if</code> dan <code>else</code>. Syaratnya ditulis di dalam kurung dan hasilnya selalu <code>true</code> atau{' '}
                    <code>false</code>.
                </p>
                <CodeWalkthrough
                    title="fungsi dengan keputusan"
                    steps={[
                        { code: 'function cekNilai(nilai) {\n  if (nilai >= 75) {', note: <>Syarat: apakah nilai lebih besar atau sama dengan 75? Operator pembanding lainnya: <code>&gt;</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>===</code> (sama dengan), dan <code>!==</code> (tidak sama dengan).</> },
                        { code: "    return 'Lulus';", note: <>Kalau syaratnya <code>true</code>, baris ini dijalankan dan fungsi selesai.</> },
                        { code: "  } else {\n    return 'Remedial';\n  }\n}", note: <>Kalau syaratnya <code>false</code>, bagian <code>else</code> yang dijalankan.</> },
                        { code: "console.log(cekNilai(80)); // 'Lulus'\nconsole.log(cekNilai(60)); // 'Remedial'", note: <>Satu fungsi, dua hasil berbeda tergantung input — inilah kekuatan menggabungkan fungsi dengan percabangan.</> },
                    ]}
                />

                <Step n={3} title="Mengolah seluruh daftar dengan method array" />
                <p>
                    Sekarang bayangkan daftar belanja berisi object. JavaScript menyediakan beberapa method yang "berjalan" ke setiap item satu
                    per satu, sehingga kita tidak perlu menulis perintah untuk setiap barang. Di dalam kurungnya kita menulis{' '}
                    <strong>arrow function</strong>, yaitu cara singkat menulis fungsi: <code>(b) =&gt; b.harga</code> artinya "fungsi yang
                    menerima <code>b</code> lalu mengembalikan <code>b.harga</code>". Anggap <code>b</code> sebagai barang yang sedang diperiksa
                    pada putaran itu.
                </p>
                <CodeWalkthrough
                    title="forEach, filter, find, map"
                    steps={[
                        {
                            code: "const belanja = [\n  { nama: 'Sabun', harga: 4000 },\n  { nama: 'Beras', harga: 65000 },\n  { nama: 'Teh', harga: 6000 },\n];",
                            note: <>Data contoh: array berisi tiga object barang.</>,
                        },
                        { code: 'belanja.forEach((b) => {\n  console.log(b.nama);\n});', note: <><strong>forEach</strong> menjalankan perintah untuk setiap barang, satu per satu. Hasilnya: konsol menampilkan Sabun, Beras, Teh. forEach tidak mengembalikan apa pun — ia hanya "mengerjakan".</> },
                        { code: 'const murah = belanja.filter((b) => b.harga < 10000);', note: <><strong>filter</strong> memeriksa setiap barang. Kalau syaratnya <code>true</code>, barang itu ikut masuk ke array baru. Hasilnya: Sabun dan Teh.</> },
                        { code: "const beras = belanja.find((b) => b.nama === 'Beras');", note: <><strong>find</strong> mencari <em>satu</em> barang pertama yang cocok dan mengembalikan object-nya. Kalau tidak ada yang cocok, hasilnya <code>undefined</code>.</> },
                        { code: 'const nama = belanja.map((b) => b.nama);', note: <><strong>map</strong> mengubah setiap barang menjadi bentuk lain. Di sini setiap object diganti dengan namanya saja: <code>['Sabun', 'Beras', 'Teh']</code>.</> },
                    ]}
                />
                <Callout title="Kesalahan yang sering terjadi">
                    <p>
                        Lupa menulis <code>return</code> di dalam fungsi. Fungsinya tetap jalan, tapi hasilnya <code>undefined</code>, sehingga
                        variabel yang menampung hasilnya kosong.
                    </p>
                    <p>
                        Memakai satu tanda <code>=</code> di dalam <code>if</code>. Satu <code>=</code> artinya mengisi nilai, bukan membandingkan.
                        Untuk membandingkan, pakai <code>===</code>.
                    </p>
                </Callout>
            </LessonSection>
        </>
    );
}

export function PracticeIntro() {
    return (
        <LessonSection kind="bridge" title="Menjadi kasir keranjang belanja">
            <p>
                Di editor bawah sudah ada array <code>keranjang</code> berisi empat barang, masing-masing dengan harga dan jumlah. Kamu akan
                membuat program kasir kecil dalam enam langkah.
            </p>
            <p>
                <strong>TODO 1</strong> adalah fungsi seperti <code>hitungLuas</code> di langkah 1: kalikan dua properti dari parameter{' '}
                <code>barang</code>. <strong>TODO 2</strong> adalah fungsi dengan keputusan seperti <code>cekNilai</code> di langkah 2.{' '}
                <strong>TODO 3–5</strong> memakai <code>filter</code>, <code>find</code>, dan <code>map</code> persis seperti contoh langkah 3 —
                hanya datanya yang berbeda. Terakhir, <strong>TODO 6</strong> menggabungkan semuanya: pakai <code>forEach</code> untuk berjalan
                ke setiap barang, panggil <code>hitungSubtotal</code> dari TODO 1, lalu tambahkan hasilnya ke <code>totalBelanja</code>.
            </p>
            <p>
                Tekan <strong>Jalankan Kode</strong> setelah setiap TODO dan perhatikan konsol serta daftar <strong>Pengujian</strong>. Fungsi
                kamu juga akan diuji dengan input lain, jadi pastikan rumusnya memakai parameter, bukan angka yang ditulis langsung.
            </p>
        </LessonSection>
    );
}
