import { Callout, CodeWalkthrough, LessonSection, Step } from '../../Components/Lesson/Blocks';
import ListStateDemo from './ListStateDemo';

export default function Materi() {
    return (
        <>
            <LessonSection kind="story" title="Kenapa datanya hilang saat halaman di-refresh?">
                <p>
                    Bayangkan kamu membuat aplikasi daftar belanja sederhana. Kamu mengetik "Telur", menekan Tambah, dan "Telur" muncul di layar.
                    Kamu tambahkan "Susu" dan "Roti". Lalu tanpa sengaja kamu menekan tombol refresh — dan semuanya hilang. Menyebalkan, kan?
                </p>
                <p>
                    Ada dua masalah yang sering dialami pemula di sini. Pertama, data hanya "ditempel" langsung ke layar, sehingga sulit dibaca
                    ulang, dihitung, atau disimpan. Kedua, data hanya ada di memori sementara, yang terhapus begitu halaman dimuat ulang.
                </p>
                <p>
                    Chapter ini membahas dua solusinya. Pola <strong>State → Render</strong> memisahkan data dari tampilan sehingga program
                    tetap rapi walaupun fiturnya bertambah. Lalu <strong>localStorage</strong>, laci penyimpanan kecil milik browser, menjaga
                    data tetap ada setelah halaman di-refresh, bahkan setelah browser ditutup.
                </p>
            </LessonSection>

            <LessonSection kind="concept" title="Pisahkan data dari tampilan">
                <Step n={1} title="State: catatan utama" />
                <p>
                    Bayangkan papan pengumuman di dapur rumah yang berisi daftar belanja. Ibumu menyimpan daftar aslinya di buku catatan, dan
                    papan itu hanya salinannya. Kalau papan terhapus, tinggal ditulis ulang dari buku catatan. Dalam program, buku catatan itu
                    disebut <strong>state</strong>: satu object yang menyimpan semua data penting. Layar hanyalah salinan dari state.
                </p>
                <CodeWalkthrough
                    title="membuat state"
                    steps={[
                        { code: 'const state = {\n  barang: [],\n};', note: <>Satu object berisi semua data aplikasi. Untuk saat ini isinya hanya array <code>barang</code> yang masih kosong. Kalau nanti aplikasinya berkembang, data baru juga masuk ke sini.</> },
                    ]}
                />

                <Step n={2} title="render(): menyalin state ke layar" />
                <p>
                    Fungsi <code>render()</code> bertugas menulis ulang papan pengumuman dari buku catatan. Ia menghapus tampilan lama lalu membuat
                    tampilan baru berdasarkan isi state. Yang penting: render hanya <strong>membaca</strong> state, tidak pernah mengubahnya.
                </p>
                <CodeWalkthrough
                    title="fungsi render"
                    steps={[
                        { code: "function render() {\n  daftar.innerHTML = '';", note: <>Kosongkan daftar di layar. Tidak perlu khawatir, karena datanya aman di state.</> },
                        { code: "  state.barang.forEach((nama) => {\n    const li = document.createElement('li');", note: <>Untuk setiap barang di state, buat elemen <code>&lt;li&gt;</code> baru. <code>createElement</code> membuat elemen HTML lewat JavaScript.</> },
                        { code: '    li.textContent = nama;\n    daftar.append(li);\n  });', note: <>Isi teksnya dengan nama barang, lalu masukkan ke dalam daftar dengan <code>append</code>.</> },
                        { code: "  jumlah.textContent = state.barang.length + ' barang';\n}", note: <>Tulis juga jumlah barangnya. Karena dihitung dari state, angkanya selalu cocok dengan isi daftar.</> },
                    ]}
                />

                <Step n={3} title="Setiap aksi: ubah state, lalu render" />
                <p>
                    Sekarang setiap kali pengguna melakukan sesuatu, kita tidak mengubah layar secara langsung. Kita ubah state-nya, lalu panggil{' '}
                    <code>render()</code>. Pola tiga langkah ini — <strong>aksi → ubah state → render</strong> — membuat semua fitur ditulis
                    dengan cara yang sama.
                </p>
                <CodeWalkthrough
                    title="menambah barang dari form"
                    steps={[
                        { code: "form.addEventListener('submit', (e) => {\n  e.preventDefault();", note: <>Event <code>submit</code> terjadi saat form dikirim (tombol diklik atau Enter ditekan). <code>preventDefault()</code> mencegah perilaku bawaan form yang memuat ulang halaman.</> },
                        { code: "  const nama = input.value.trim();\n  if (nama === '') return;", note: <><code>.value</code> mengambil isi input, <code>.trim()</code> membuang spasi di awal dan akhir. Kalau hasilnya kosong, berhenti.</> },
                        { code: "  state.barang.push(nama);\n  input.value = '';\n  render();\n});", note: <>Ubah state, kosongkan kotak input, lalu render. Kita tidak pernah membuat <code>&lt;li&gt;</code> di sini — itu tugas render.</> },
                    ]}
                />
            </LessonSection>

            <LessonSection kind="visual" title="Amati siklusnya">
                <ListStateDemo />
            </LessonSection>

            <LessonSection kind="concept" title="Menyimpan data agar tidak hilang">
                <Step n={4} title="localStorage: laci kecil di browser" />
                <p>
                    Setiap browser punya tempat penyimpanan kecil untuk setiap website, namanya <strong>localStorage</strong>. Isinya tetap ada
                    walaupun halaman di-refresh. Cara kerjanya seperti laci berlabel: <code>setItem(label, isi)</code> untuk menyimpan dan{' '}
                    <code>getItem(label)</code> untuk mengambil. Ada satu aturan penting: laci ini <strong>hanya bisa menyimpan teks</strong>.
                    Karena itu array atau object harus diubah dulu menjadi teks dengan <code>JSON.stringify</code>, dan dikembalikan dengan{' '}
                    <code>JSON.parse</code> saat diambil.
                </p>
                <CodeWalkthrough
                    title="simpan dan muat"
                    steps={[
                        { code: "function simpan() {\n  localStorage.setItem('belanja', JSON.stringify(state.barang));\n}", note: <><code>JSON.stringify</code> mengubah array <code>['Telur', 'Susu']</code> menjadi teks <code>'["Telur","Susu"]'</code>, lalu disimpan dengan label <code>'belanja'</code>. Panggil <code>simpan()</code> setiap kali state berubah.</> },
                        { code: "const tersimpan = localStorage.getItem('belanja');", note: <>Saat halaman dibuka, ambil isi laci. Kalau belum pernah disimpan, hasilnya <code>null</code>.</> },
                        { code: 'if (tersimpan) {\n  state.barang = JSON.parse(tersimpan);\n}\nrender();', note: <>Kalau ada isinya, ubah teks kembali menjadi array dengan <code>JSON.parse</code> dan masukkan ke state. Terakhir panggil <code>render()</code> agar data lama langsung tampil.</> },
                    ]}
                />
                <Callout title="Kesalahan yang sering terjadi">
                    <p>
                        Menyimpan array tanpa <code>JSON.stringify</code>. localStorage diam-diam mengubahnya menjadi teks biasa seperti{' '}
                        <code>"Telur,Susu"</code>, dan <code>JSON.parse</code> nanti gagal membacanya.
                    </p>
                    <p>
                        Mengubah state tapi lupa memanggil <code>render()</code>. Datanya sudah berubah, tapi layar diam, sehingga terlihat seperti
                        programnya tidak bekerja.
                    </p>
                </Callout>
            </LessonSection>
        </>
    );
}

export function PracticeIntro() {
    return (
        <LessonSection kind="bridge" title="Daftar belanja yang tidak hilang">
            <p>
                Di editor bawah, elemen form, input, daftar, dan teks jumlah sudah diambil, dan object <code>state</code> sudah dibuat. Tugasmu
                melengkapi empat bagian, persis mengikuti langkah-langkah di atas.
            </p>
            <p>
                <strong>TODO 1</strong> adalah fungsi <code>render()</code> dari langkah 2. <strong>TODO 2</strong> adalah isi listener dari
                langkah 3, ditambah memanggil <code>simpan()</code> sebelum <code>render()</code>. <strong>TODO 3</strong> dan{' '}
                <strong>TODO 4</strong> adalah fungsi simpan dan kode muat dari langkah 4. Kerjakan berurutan dari TODO 1, karena tanpa render
                kamu tidak akan melihat hasil apa pun di pratinjau.
            </p>
            <p>
                Pengujian otomatis akan menambah "Telur" dan "Susu", mencoba input kosong, memeriksa isi localStorage, lalu{' '}
                <strong>mensimulasikan refresh halaman</strong> untuk memastikan datanya muncul kembali. Setelah itu kamu bisa mencoba sendiri
                di kotak pratinjau.
            </p>
        </LessonSection>
    );
}
