import { Callout, CodeBlock, CodeWalkthrough, LessonSection, Step } from '../../Components/Lesson/Blocks';

export default function Materi() {
    return (
        <>
            <LessonSection kind="story" title="Bagaimana program 'mengingat' sesuatu?">
                <p>
                    Coba buka daftar kontak di HP-mu. Ada ratusan nama, masing-masing dengan nomor telepon, mungkin juga alamat dan tanggal
                    lahir. Saat kamu menambah kontak baru atau mengganti nomor teman, HP langsung mengingatnya. Pertanyaannya: bagaimana sebuah
                    program bisa menyimpan dan mengingat semua informasi itu?
                </p>
                <p>
                    Jawabannya ada pada tiga hal yang akan kita pelajari di chapter ini. Pertama, <strong>variabel</strong> — tempat menyimpan
                    satu nilai. Kedua, <strong>object</strong> — cara mengelompokkan beberapa keterangan tentang satu hal, seperti satu kartu
                    kontak. Ketiga, <strong>array</strong> — cara menyimpan banyak data secara berurutan, seperti daftar seluruh kontakmu.
                </p>
                <p>
                    Hampir semua program yang pernah kamu pakai, dari aplikasi chat sampai game, dibangun di atas tiga hal ini. Jadi pelan-pelan
                    saja; kalau bagian ini sudah kuat, chapter berikutnya akan terasa jauh lebih mudah.
                </p>
            </LessonSection>

            <LessonSection kind="concept" title="Dari satu nilai sampai daftar data">
                <Step n={1} title="Variabel: kotak yang diberi label" />
                <p>
                    Bayangkan toples-toples di dapur yang ditempeli label: "Gula", "Garam", "Kopi". Variabel bekerja persis seperti itu — sebuah
                    kotak penyimpanan yang kita beri nama, supaya isinya mudah dipanggil lagi nanti. Di JavaScript ada dua cara membuatnya:{' '}
                    <code>const</code> dan <code>let</code>.
                </p>
                <CodeWalkthrough
                    title="membuat variabel"
                    steps={[
                        { code: "const nama = 'Andi';", note: <><code>const</code> membuat kotak bernama <code>nama</code> yang isinya <strong>tidak boleh diganti</strong>. Tanda <code>=</code> artinya "masukkan nilai ini ke dalam kotak", bukan "sama dengan" seperti di matematika.</> },
                        { code: 'let skor = 0;', note: <><code>let</code> membuat kotak yang isinya <strong>boleh diganti</strong> nanti. Cocok untuk nilai yang memang akan berubah, seperti skor permainan.</> },
                        { code: 'skor = 10;', note: <>Mengganti isi kotak <code>skor</code>. Perhatikan: tidak ada <code>let</code> lagi, karena kotaknya sudah ada — kita hanya mengganti isinya.</> },
                        { code: 'console.log(nama, skor); // Andi 10', note: <><code>console.log</code> menampilkan isi kotak ke konsol. Ini cara termudah untuk "mengintip" isi variabel saat belajar.</> },
                    ]}
                />
                <p>
                    Lalu kapan pakai yang mana? Biasakan memakai <code>const</code> sebagai pilihan utama. Ganti ke <code>let</code> hanya kalau kamu
                    tahu nilainya memang akan berubah. Dengan begitu, kamu terlindung dari kesalahan tidak sengaja mengganti nilai yang seharusnya
                    tetap.
                </p>

                <Step n={2} title="Jenis-jenis data" />
                <p>
                    Isi kotak bisa bermacam-macam jenisnya. Yang paling sering dipakai ada tiga: <strong>string</strong> (teks, selalu diapit tanda
                    kutip), <strong>number</strong> (angka, tanpa tanda kutip), dan <strong>boolean</strong> (hanya punya dua nilai:{' '}
                    <code>true</code> atau <code>false</code>, seperti sakelar yang nyala atau mati).
                </p>
                <CodeBlock title="string, number, boolean">{`
const kota = 'Bandung';     // string  → teks
const umur = 17;            // number  → angka, bisa dihitung
const sudahMenikah = false; // boolean → benar/salah

console.log(typeof umur);   // "number"`}</CodeBlock>

                <Step n={3} title="Object: satu kartu kontak" />
                <p>
                    Satu kontak punya beberapa keterangan sekaligus: nama, umur, kota. Kalau setiap keterangan disimpan di variabel terpisah,
                    lama-lama berantakan. <strong>Object</strong> mengelompokkan semua keterangan itu dalam satu wadah, seperti satu kartu kontak.
                </p>
                <CodeWalkthrough
                    title="membuat dan memakai object"
                    steps={[
                        { code: "const teman = { nama: 'Bunga', umur: 16, kota: 'Denpasar' };", note: <>Object ditulis dengan kurung kurawal. Isinya pasangan <code>kunci: nilai</code> yang dipisahkan koma. Kunci (<code>nama</code>, <code>umur</code>, <code>kota</code>) disebut <strong>properti</strong>.</> },
                        { code: 'console.log(teman.nama); // Bunga', note: <>Untuk mengambil satu properti, tulis nama object, titik, lalu nama propertinya. Bacanya: "nama milik teman".</> },
                        { code: 'teman.umur = 17;', note: <>Properti juga bisa diganti dengan cara yang sama. Ini tetap boleh walaupun <code>teman</code> dibuat dengan <code>const</code> — yang disegel adalah kotaknya, bukan isi di dalam object.</> },
                    ]}
                />

                <Step n={4} title="Array: daftar belanja" />
                <p>
                    Kalau object seperti satu kartu, <strong>array</strong> seperti daftar belanja: kumpulan data yang berurutan. Array ditulis
                    dengan kurung siku, dan setiap isinya punya nomor urut yang disebut <strong>index</strong>. Hal yang paling sering bikin
                    bingung pemula: index dimulai dari <strong>0</strong>, bukan 1.
                </p>
                <CodeWalkthrough
                    title="membuat dan memakai array"
                    steps={[
                        { code: "const belanja = ['telur', 'susu', 'roti'];", note: <>Array berisi tiga teks. <code>'telur'</code> ada di index 0, <code>'susu'</code> di index 1, <code>'roti'</code> di index 2.</> },
                        { code: 'console.log(belanja[1]); // susu', note: <>Ambil isi array dengan menulis index-nya di dalam kurung siku.</> },
                        { code: 'console.log(belanja.length); // 3', note: <><code>.length</code> memberi tahu berapa banyak isi array. Sangat berguna untuk menghitung.</> },
                        { code: "belanja.push('apel'); // sekarang 4 item", note: <><code>.push()</code> menambahkan item baru di akhir array.</> },
                    ]}
                />

                <Step n={5} title="Array of objects: seluruh buku kontak" />
                <p>
                    Sekarang gabungkan keduanya. Buku kontak adalah <strong>array</strong> yang setiap isinya adalah <strong>object</strong>. Bentuk
                    ini sangat sering dipakai dalam program sungguhan, jadi pastikan kamu nyaman membacanya.
                </p>
                <CodeWalkthrough
                    title="array berisi object"
                    steps={[
                        { code: "const kontak = [\n  { nama: 'Andi', umur: 17 },\n  { nama: 'Bunga', umur: 16 },\n];", note: <>Array dengan dua object di dalamnya. Setiap object punya properti yang sama, sehingga mudah diolah dengan cara yang seragam.</> },
                        { code: 'console.log(kontak[0].nama); // Andi', note: <>Dibaca dari kiri: ambil isi index 0 dari <code>kontak</code> (object Andi), lalu ambil properti <code>nama</code>-nya.</> },
                        { code: "kontak.push({ nama: 'Citra', umur: 18 });", note: <>Menambah kontak baru sama seperti menambah item belanja — yang dimasukkan kali ini sebuah object.</> },
                    ]}
                />
                <Callout title="Kesalahan yang sering terjadi">
                    <p>
                        Mengambil item pertama dengan <code>kontak[1]</code>. Karena index dimulai dari 0, item pertama adalah <code>kontak[0]</code>.
                    </p>
                    <p>
                        Menulis angka di dalam tanda kutip, misalnya <code>umur: '17'</code>. Itu jadi teks, bukan angka, sehingga{' '}
                        <code>'17' + 1</code> menghasilkan <code>'171'</code>, bukan 18.
                    </p>
                </Callout>
            </LessonSection>
        </>
    );
}

export function PracticeIntro() {
    return (
        <LessonSection kind="bridge" title="Mengelola buku kontak sendiri">
            <p>
                Di editor bawah, array <code>kontak</code> sudah berisi tiga orang — bentuknya sama persis dengan langkah 5. Tugasmu ada lima,
                masing-masing ditandai <code>// TODO</code>.
            </p>
            <p>
                <strong>TODO 1</strong> melatih langkah 1 dan 2: buat konstanta berisi teks. <strong>TODO 2</strong> memakai{' '}
                <code>.length</code> dari langkah 4. <strong>TODO 3</strong> adalah gabungan: buat object seperti langkah 3, tambahkan dengan{' '}
                <code>.push()</code>, lalu isi ulang <code>jumlahKontak</code> — di sinilah kamu melihat kenapa variabel itu dibuat dengan{' '}
                <code>let</code>. <strong>TODO 4</strong> dan <strong>TODO 5</strong> melatih cara membaca dan mengubah properti di dalam array
                of objects.
            </p>
            <p>
                Kerjakan berurutan dan tekan <strong>Jalankan Kode</strong> setiap selesai satu TODO. Konsol akan menampilkan isi variabel, dan
                daftar <strong>Pengujian</strong> berubah hijau satu per satu. Kalau bingung, tekan <strong>Petunjuk</strong>.
            </p>
        </LessonSection>
    );
}
