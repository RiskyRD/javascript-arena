import { Callout, CodeBlock, CodeWalkthrough, LessonSection, Step } from '../../Components/Lesson/Blocks';
import BubblingDemo from './BubblingDemo';

export default function Materi() {
    return (
        <>
            <LessonSection kind="story" title="Dari halaman diam menjadi halaman yang bereaksi">
                <p>
                    Halaman web yang hanya berisi HTML dan CSS itu seperti poster: bisa dilihat, tapi tidak bisa diajak berinteraksi. Padahal
                    hampir semua website yang kamu pakai bereaksi saat disentuh — tombol "suka" berubah warna, menu terbuka saat diklik, jumlah
                    barang di keranjang bertambah.
                </p>
                <p>
                    Bayangkan sakelar lampu di kamarmu. Kamu menekan sakelar (sebuah <strong>kejadian</strong>), lalu lampu menyala (sebuah{' '}
                    <strong>perubahan</strong>). JavaScript bisa melakukan hal yang sama pada halaman web: menunggu pengguna melakukan sesuatu,
                    lalu mengubah tampilan halaman. Caranya lewat <strong>DOM</strong> (Document Object Model) — cara JavaScript "melihat" HTML
                    sebagai kumpulan object yang bisa dicari, dibaca, dan diubah.
                </p>
            </LessonSection>

            <LessonSection kind="concept" title="Mencari, mengubah, dan menunggu klik">
                <Step n={1} title="Mencari elemen dengan querySelector" />
                <p>
                    Sebelum bisa mengubah sesuatu, JavaScript harus tahu elemen mana yang dimaksud. <code>document.querySelector()</code> bekerja
                    seperti fitur pencarian di daftar kontak: kamu memberi petunjuk, ia mengembalikan elemen pertama yang cocok. Petunjuknya
                    memakai selektor yang sama dengan CSS.
                </p>
                <CodeWalkthrough
                    title="mencari elemen"
                    steps={[
                        { code: '<h1 id="judul">Halo</h1>\n<button class="tombol">Klik aku</button>', note: <>HTML contoh. Satu elemen punya <code>id</code>, satu lagi punya <code>class</code>.</> },
                        { code: "const judul = document.querySelector('#judul');", note: <>Tanda <code>#</code> berarti "cari berdasarkan id". Elemennya kita simpan ke variabel supaya mudah dipakai lagi.</> },
                        { code: "const tombol = document.querySelector('.tombol');", note: <>Tanda titik berarti "cari berdasarkan class". Kalau tidak ada yang cocok, hasilnya <code>null</code>.</> },
                    ]}
                />

                <Step n={2} title="Mengubah teks dan tampilan" />
                <p>
                    Setelah elemen didapat, kita bisa mengubah isinya. <code>textContent</code> mengganti teks di dalam elemen. Untuk mengubah
                    tampilan, cara paling rapi adalah menambah atau menghapus <strong>class</strong>, lalu biarkan CSS yang mengatur warnanya.{' '}
                    <code>classList.toggle()</code> bekerja persis seperti sakelar: kalau class-nya belum ada, ditambahkan; kalau sudah ada,
                    dihapus.
                </p>
                <CodeBlock title="mengubah elemen">{`
judul.textContent = 'Selamat datang!';   // ganti teks

lampu.classList.add('nyala');            // tambahkan class
lampu.classList.remove('nyala');         // hapus class
lampu.classList.toggle('nyala');         // sakelar: ada ↔ tidak ada

lampu.classList.contains('nyala');       // true atau false`}</CodeBlock>

                <Step n={3} title="Menunggu klik dengan addEventListener" />
                <p>
                    Sekarang bagian yang membuat halaman "hidup". <code>addEventListener</code> menyuruh sebuah elemen menunggu kejadian
                    tertentu, lalu menjalankan fungsi saat kejadian itu terjadi.
                </p>
                <CodeWalkthrough
                    title="sakelar lampu"
                    steps={[
                        { code: "saklar.addEventListener('click', () => {", note: <>"Hai sakelar, setiap kali kamu diklik, jalankan fungsi ini." Fungsi yang dikirim ke listener biasa disebut <em>callback</em>.</> },
                        { code: "  lampu.classList.toggle('nyala');", note: <>Nyalakan atau matikan lampu dengan menukar class <code>nyala</code>.</> },
                        { code: "  const menyala = lampu.classList.contains('nyala');", note: <>Cek keadaan lampu setelah ditukar: <code>true</code> kalau menyala.</> },
                        { code: "  status.textContent = menyala ? 'Lampu menyala' : 'Lampu mati';\n});", note: <>Ini <strong>ternary</strong>, versi singkat if/else: "kalau <code>menyala</code> benar, pakai teks pertama; kalau tidak, pakai teks kedua."</> },
                    ]}
                />

                <Step n={4} title="Banyak tombol, satu listener (event delegation)" />
                <p>
                    Bagaimana kalau ada sekumpulan tombol, misalnya pilihan warna lampu? Memasang listener di setiap tombol memang bisa, tapi ada
                    cara yang lebih rapi. Ketika sebuah tombol diklik, kejadian kliknya ternyata <strong>naik</strong> ke elemen pembungkusnya,
                    lalu ke pembungkusnya lagi — seperti gelembung yang naik ke permukaan air. Ini disebut <strong>bubbling</strong>. Jadi kita
                    cukup memasang <strong>satu</strong> listener di kotak pembungkus, lalu mencari tahu tombol mana yang diklik.
                </p>
            </LessonSection>

            <LessonSection kind="visual" title="Lihat klik 'naik' ke atas">
                <BubblingDemo />
            </LessonSection>

            <LessonSection kind="concept" title="Menulis event delegation">
                <CodeWalkthrough
                    title="satu listener untuk semua tombol warna"
                    steps={[
                        { code: "pilihanWarna.addEventListener('click', (e) => {", note: <>Listener dipasang di kotak pembungkus. Parameter <code>e</code> berisi informasi tentang klik, termasuk <code>e.target</code>: elemen paling dalam yang tersentuh mouse.</> },
                        { code: "  const tombol = e.target.closest('[data-warna]');", note: <><code>e.target</code> bisa saja titik warna di dalam tombol. <code>closest()</code> naik dari situ sampai menemukan elemen yang punya atribut <code>data-warna</code>, yaitu tombolnya.</> },
                        { code: '  if (!tombol) return;', note: <>Kalau yang diklik celah kosong di antara tombol, <code>closest</code> menghasilkan <code>null</code>. Baris ini menghentikan fungsi supaya tidak error.</> },
                        { code: '  lampu.dataset.warna = tombol.dataset.warna;', note: <><code>dataset</code> membaca dan menulis atribut <code>data-…</code>. Warna tombol disalin ke lampu, dan CSS yang mengurus tampilannya.</> },
                        { code: "  pilihanWarna.querySelectorAll('[data-warna]').forEach((b) => {\n    b.classList.toggle('aktif', b === tombol);\n  });\n});", note: <><code>toggle</code> dengan argumen kedua: <code>true</code> → tambahkan class, <code>false</code> → hapus. Hasilnya hanya tombol yang diklik yang bertanda aktif.</> },
                    ]}
                />
                <Callout title="Kesalahan yang sering terjadi">
                    <p>
                        Memakai <code>e.target.dataset.warna</code> langsung. Kelihatannya jalan saat kamu mengklik tulisan tombol, tapi menjadi{' '}
                        <code>undefined</code> saat yang diklik adalah titik warnanya. Selalu naik dulu dengan <code>closest()</code>.
                    </p>
                    <p>
                        Menjalankan <code>querySelector</code> untuk elemen yang salah ketik id-nya. Hasilnya <code>null</code>, dan baris
                        berikutnya error <code>Cannot read properties of null</code>. Kalau melihat error ini, cek ejaan selektormu.
                    </p>
                </Callout>
            </LessonSection>
        </>
    );
}

export function PracticeIntro() {
    return (
        <LessonSection kind="bridge" title="Membuat lampu kamar pintar">
            <p>
                Kotak pratinjau di bawah editor berisi lampu, tulisan status, tombol sakelar, dan tiga tombol pilihan warna. Elemen lampu
                sudah diambil sebagai contoh di baris pertama kode.
            </p>
            <p>
                <strong>TODO 1</strong> melatih langkah 1: ambil tiga elemen lainnya dengan cara yang sama. <strong>TODO 2</strong> adalah
                sakelar dari langkah 3 — kamu bahkan bisa meniru urutan barisnya. <strong>TODO 3 dan 4</strong> adalah event delegation dari
                bagian terakhir: satu listener di <code>pilihanWarna</code>, <code>closest()</code> untuk menemukan tombol, lalu{' '}
                <code>classList.toggle</code> dengan argumen kedua untuk menandai tombol yang aktif.
            </p>
            <p>
                Setelah menekan <strong>Jalankan Kode</strong>, pengujian otomatis akan mengklik sakelar dua kali, mengklik titik warna biru,
                tombol merah, lalu celah kosong. Setelah itu kotak pratinjau tetap bisa kamu klik sendiri untuk mencoba.
            </p>
        </LessonSection>
    );
}
