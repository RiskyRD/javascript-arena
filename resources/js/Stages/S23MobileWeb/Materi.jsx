import { Callout, CodeBlock, CodeWalkthrough, LessonSection, Step } from '../../Components/Lesson/Blocks';
import Gallery from '../S21Medan/Gallery';

const WIRE = (n) => `/ref-assets/mobile/wireframes/wireframe-0${n}.png`;

export default function Materi() {
    return (
        <>
            <LessonSection kind="story" title="Data yang datang dari internet">
                <p>
                    Di Bab 1, semua data sudah tertulis di dalam kode: daftar kontak, keranjang belanja, daftar barang. Aplikasi beasiswa di
                    Mobile Web Service Module berbeda. Datanya tinggal di server panitia, dan aplikasimu harus <strong>memintanya lewat
                    internet</strong> melalui API di <code>https://web.lksn26.id/api</code>.
                </p>
                <p>
                    Soal ini juga punya tiga syarat yang sering membuat peserta kehilangan nilai. Pencarian harus memakai{' '}
                    <strong>debounce</strong> 0,5–1 detik — tidak boleh mengirim request di setiap ketikan, dan tidak boleh menunggu tombol
                    diklik. <strong>Wishlist</strong> harus tersinkron di semua halaman. Lalu profil, wishlist, dan bahasa pilihan harus{' '}
                    <strong>tetap ada</strong> setelah browser ditutup. Kabar baiknya, syarat ketiga sudah kamu kuasai di Chapter 1.4.
                </p>
            </LessonSection>

            <LessonSection kind="concept" title="fetch, async/await, debounce, dan wishlist">
                <Step n={1} title="Meminta data dengan fetch dan async/await" />
                <p>
                    Meminta data ke server itu seperti memesan makanan lewat aplikasi: kamu memesan, lalu <strong>menunggu</strong> pesanan
                    datang sebelum bisa makan. <code>fetch()</code> adalah cara JavaScript memesan data, dan <code>await</code> adalah cara
                    menunggu sampai datanya tiba. Fungsi yang memakai <code>await</code> harus diberi kata <code>async</code> di depannya.
                </p>
                <CodeWalkthrough
                    title="mengambil daftar beasiswa"
                    steps={[
                        { code: "const API_URL = 'https://web.lksn26.id/api';", note: <>Soal mewajibkan base URL ditulis di <strong>satu tempat</strong>. Kalau alamat server berubah, cukup ganti baris ini.</> },
                        { code: 'async function cariBeasiswa(kata) {', note: <><code>async</code> menandai fungsi yang di dalamnya boleh menunggu.</> },
                        { code: '  const url = `${API_URL}/scholarships?search=${encodeURIComponent(kata)}`;', note: <>Query parameter ditulis setelah tanda tanya. <code>encodeURIComponent</code> mengamankan kata kunci yang berisi spasi atau simbol. Soal juga menyediakan parameter lain seperti <code>page</code>, <code>regions</code>, dan <code>educations</code>.</> },
                        { code: "  const res = await fetch(url, {\n    headers: { 'Accept-Language': 'id' },\n  });", note: <><code>await</code> menunggu server menjawab. Header <code>Accept-Language</code> (<code>id</code>, <code>en</code>, atau <code>ko</code>) meminta konten dalam bahasa yang dipilih pengguna — inilah cara fitur tiga bahasa bekerja di sisi data.</> },
                        { code: '  const json = await res.json();\n  state.hasil = json.data;\n  render();\n}', note: <>Ubah jawaban server menjadi object dengan <code>res.json()</code> (yang juga perlu ditunggu), simpan ke state, lalu render — pola Chapter 1.4 lagi.</> },
                    ]}
                />

                <Step n={2} title="Debounce: tunggu sampai pengguna selesai mengetik" />
                <p>
                    Bayangkan pintu lift. Pintu tidak langsung menutup begitu satu orang masuk; ia menunggu beberapa detik, dan setiap kali ada
                    orang lain masuk, hitungannya diulang dari awal. Pintu baru menutup setelah tidak ada lagi yang masuk. Debounce bekerja
                    sama: setiap ketikan membatalkan rencana pencarian sebelumnya, dan pencarian baru benar-benar dijalankan setelah pengguna
                    berhenti mengetik.
                </p>
                <CodeWalkthrough
                    title="debounce dengan setTimeout dan clearTimeout"
                    steps={[
                        { code: 'let timer = null;', note: <>Variabel untuk menyimpan "rencana" pencarian yang sedang menunggu. Pakai <code>let</code> karena isinya akan diganti terus.</> },
                        { code: "inputCari.addEventListener('input', () => {\n  clearTimeout(timer);", note: <>Event <code>input</code> terjadi di setiap ketikan. Hal pertama yang dilakukan: batalkan rencana sebelumnya — seperti pintu lift yang mengulang hitungannya.</> },
                        { code: '  timer = setTimeout(() => {\n    cariBeasiswa(inputCari.value.trim());\n  }, 600);\n});', note: <><code>setTimeout</code> menjadwalkan fungsi untuk dijalankan 600 milidetik kemudian. Kalau dalam 600ms ada ketikan baru, jadwal ini dibatalkan oleh baris sebelumnya. Nilai 600 berada dalam rentang 0,5–1 detik yang diminta soal.</> },
                    ]}
                />

                <Step n={3} title="Wishlist: daftar slug di state + localStorage" />
                <p>
                    Wishlist cukup disimpan sebagai array berisi <em>slug</em> beasiswa (pengenal unik di URL, misalnya{' '}
                    <code>kaist-global-scholarship</code>). Tombol hati bekerja seperti sakelar: kalau slug sudah ada, hapus; kalau belum,
                    tambahkan. Karena semua halaman membaca array yang sama dari state, wishlist otomatis tersinkron di Home, Discover,
                    Eligibility, dan Wishlist. Simpan ke localStorage setiap kali berubah, persis seperti daftar belanja di Chapter 1.4.
                </p>
                <CodeBlock title="toggle wishlist + bahasa pilihan">{`
function toggleWishlist(slug) {
  if (state.wishlist.includes(slug)) {
    state.wishlist = state.wishlist.filter((s) => s !== slug);
  } else {
    state.wishlist.push(slug);
  }
  localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  render();
}

// Bahasa pilihan juga wajib persisten
function gantiBahasa(kode) {          // 'id' | 'en' | 'ko'
  state.lang = kode;
  localStorage.setItem('lang', kode); // teks biasa, tidak perlu JSON
  render();
}`}</CodeBlock>
                <Callout kind="pitfall">
                    <p>
                        Lupa <code>clearTimeout</code>. Tanpa baris itu, setiap ketikan tetap menjadwalkan pencarian sendiri, sehingga mengetik
                        "LPDP" mengirim empat request — hanya tertunda sedikit. Juri bisa melihatnya di tab Network DevTools.
                    </p>
                    <p>
                        Lupa <code>await</code> di depan <code>fetch</code> atau <code>res.json()</code>. Hasilnya berupa Promise yang belum
                        selesai, sehingga <code>json.data</code> bernilai <code>undefined</code>. Bentuk JSON API asli juga belum tentu{' '}
                        <code>{'{ data: [...] }'}</code> — saat lomba, selalu <code>console.log</code> respons pertama untuk melihat bentuknya.
                    </p>
                </Callout>
            </LessonSection>

            <LessonSection kind="visual" title="Wireframe dari dokumen soal">
                <Gallery
                    items={[
                        { src: WIRE(1), caption: 'Home: pencarian dengan debounce + hati wishlist' },
                        { src: WIRE(3), caption: 'Discover: filter yang menjadi query parameter API' },
                        { src: WIRE(2), caption: 'Detail beasiswa (konten dari Accept-Language: ko)' },
                        { src: WIRE(4), caption: 'Settings: profil yang disimpan di localStorage' },
                    ]}
                />
            </LessonSection>
        </>
    );
}

export function PracticeIntro() {
    return (
        <LessonSection kind="bridge" title="Mencoba pencarian dan wishlist">
            <p>
                Latihan di bawah adalah potongan halaman Discover. Karena kelas belum tentu terhubung ke internet, <code>fetch</code> di
                latihan ini diarahkan ke <strong>API tiruan</strong> yang berisi enam beasiswa contoh dan menjawab dalam bentuk{' '}
                <code>{'{ data: [...] }'}</code>. Fungsi <code>render()</code> sudah disediakan.
            </p>
            <p>
                <strong>TODO 1</strong> adalah fungsi <code>cariBeasiswa</code> dari langkah 1 (header bahasa boleh dilewati).{' '}
                <strong>TODO 2</strong> adalah debounce dari langkah 2. <strong>TODO 3</strong> memakai event delegation dari Chapter 1.3 untuk
                tombol hati, ditambah logika toggle dari langkah 3. <strong>TODO 4</strong> adalah simpan dan muat dari Chapter 1.4.
            </p>
            <p>
                Pengujian akan mengetik "scholarship" huruf demi huruf dengan cepat, lalu <strong>menghitung berapa request yang terkirim</strong>
                — harus tepat satu. Setelah itu tombol hati diklik dan halaman di-refresh untuk memastikan wishlist tersimpan. Pengujian ini
                butuh sekitar 2 detik karena menunggu jeda debounce.
            </p>
        </LessonSection>
    );
}
