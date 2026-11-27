import { Callout, LessonSection, Step } from '../../Components/Lesson/Blocks';
import RefViewer from './RefViewer';
import { MODULES } from './refAssets';

function MarksTable() {
    const marks = MODULES[0].marks;
    const total = marks.reduce((t, [, v]) => t + v, 0);
    return (
        <table className="w-full max-w-[65ch] text-left text-sm">
            <thead className="text-ink-muted">
                <tr className="border-b border-arena-line">
                    <th className="py-2 pr-4 font-medium">Sub-kriteria Client Module</th>
                    <th className="py-2 text-right font-medium">Nilai</th>
                </tr>
            </thead>
            <tbody>
                {marks.map(([name, value]) => (
                    <tr key={name} className="border-b border-arena-line/50">
                        <td className="py-2 pr-4 text-ink/85">{name}</td>
                        <td className="py-2 text-right font-mono text-gold-400">{String(value).replace('.', ',')}</td>
                    </tr>
                ))}
                <tr>
                    <td className="py-2 pr-4 font-semibold text-ink">Total</td>
                    <td className="py-2 text-right font-mono font-semibold text-ink">{total}</td>
                </tr>
            </tbody>
        </table>
    );
}

export default function Materi() {
    return (
        <>
            <LessonSection kind="story" title="Sekarang kita lihat medan tempurnya">
                <p>
                    Di Bab 1 kamu belajar JavaScript sebagai bahasa: variabel, fungsi, DOM, dan state. Sekarang saatnya melihat untuk apa semua
                    itu dipakai. Lomba LKS Web Technologies tingkat nasional 2026 punya dua modul yang berkaitan langsung dengan JavaScript:{' '}
                    <strong>Client Module</strong>, yaitu membangun papan taktik sepak bola bernama <em>Matchboard</em>, dan{' '}
                    <strong>Mobile Web Service Module</strong>, yaitu membangun aplikasi pencari beasiswa luar negeri.
                </p>
                <p>
                    Banyak peserta kehilangan nilai bukan karena tidak bisa coding, tapi karena salah membaca soal: mengerjakan fitur yang
                    bobotnya kecil lebih dulu, melewatkan satu kalimat syarat, atau baru sadar di menit terakhir bahwa aplikasi harus jalan
                    hanya dengan membuka <code>index.html</code>. Chapter ini melatihmu membaca dokumen soal seperti seorang pemain membaca
                    lapangan sebelum pertandingan.
                </p>
            </LessonSection>

            <LessonSection kind="concept" title="Cara membaca dokumen soal">
                <Step n={1} title="Baca batasan dulu, baru fitur" />
                <p>
                    Sebelum melihat daftar fitur, cari kalimat yang membatasi caramu bekerja. Di Client Module misalnya: waktunya{' '}
                    <strong>3 jam</strong>, hanya boleh <strong>HTML, CSS, dan JavaScript</strong> tanpa framework, dinilai di Chrome atau Firefox
                    Developer Edition, dan harus jalan saat <code>index.html</code> dibuka langsung. Di Mobile Web Service Module: lebar layar
                    maksimal <strong>480px</strong>, boleh memakai React, Vue, atau JavaScript murni, dan wajib mendukung tiga bahasa. Batasan
                    seperti ini menentukan keputusan teknismu sejak menit pertama.
                </p>

                <Step n={2} title="Ubah paragraf fitur menjadi checklist" />
                <p>
                    Dokumen soal ditulis sebagai paragraf panjang, padahal setiap kalimat bisa berisi beberapa syarat yang dinilai terpisah.
                    Ambil contoh kalimat tentang toolbar: "Only one tool can be active at a time, clicking the active tool again turns it off,
                    and a footer label always shows which tool is currently selected." Itu tiga syarat sekaligus: hanya satu alat aktif, klik
                    ulang mematikan, dan label footer selalu menunjukkan alat aktif. Tulis setiap syarat sebagai satu baris checklist, supaya
                    tidak ada yang terlewat saat kamu mengetes di akhir.
                </p>

                <Step n={3} title="Cocokkan dengan tabel nilai" />
                <p>
                    Di bagian akhir dokumen Client Module ada tabel pembagian nilai. Inilah peta prioritasmu. Perhatikan bahwa kriteria pertama
                    (pitch, toolbar, formasi) bernilai paling besar, padahal fiturnya paling dasar — juri sengaja memberi bobot besar pada
                    fondasi. Dokumen Mobile Web Service Module tidak mencantumkan tabel nilai, jadi di sana kamu perlu memprioritaskan sendiri
                    berdasarkan fitur inti: tampilan mobile, pencarian, wishlist, dan penyimpanan data.
                </p>
                <MarksTable />

                <Step n={4} title="Tonton demonya, lalu tentukan urutan kerja" />
                <p>
                    Kalau tersedia video demo atau screenshot, pakai untuk memahami perilaku yang sulit dibayangkan dari teks, misalnya
                    bagaimana Passing Path menyorot jalur umpan atau bagaimana sidebar turun ke bawah di layar kecil. Setelah itu susun urutan
                    kerja: fondasi bernilai besar dulu, lalu fitur yang bergantung padanya, dan fitur "pemanis" paling akhir.
                </p>
                <Callout kind="pitfall">
                    <p>
                        Melewatkan bagian <strong>Instructions to the Competitors</strong>. Nama folder (<code>XX_CLIENT_MODULE</code>), cara
                        upload, dan syarat "harus jalan dari index.html" ada di sana. Pekerjaan yang bagus bisa tidak dinilai kalau aturan ini
                        diabaikan.
                    </p>
                </Callout>
            </LessonSection>

            <LessonSection kind="visual" title="Buka dokumen soal & demonya">
                <p>
                    Pilih modul di bawah ini. Kamu bisa membaca PDF soal aslinya, menonton video demo Matchboard, melihat screenshot dan
                    wireframe, serta ikon asli yang disediakan panitia. Coba temukan sendiri kalimat-kalimat syarat yang dibahas di atas.
                </p>
                <RefViewer />
            </LessonSection>
        </>
    );
}

export function PracticeIntro() {
    return (
        <LessonSection kind="bridge" title="Mengolah tabel nilai dengan JavaScript">
            <p>
                Latihan di bawah memakai kemampuan Bab 1 untuk tugas yang sangat nyata: menyusun prioritas kerja. Tabel nilai Client Module
                sudah diubah menjadi array of objects bernama <code>kriteria</code>, lengkap dengan daftar fitur tiap kriteria.
            </p>
            <p>
                <strong>TODO 1</strong> dan <strong>TODO 4</strong> memakai <code>reduce</code> untuk menjumlahkan, seperti menghitung total
                belanja di Chapter 1.2. <strong>TODO 2</strong> memakai <code>filter</code>. <strong>TODO 3</strong> mengenalkan satu method
                baru, <code>sort</code>: tulis <code>(a, b) =&gt; b.bobot - a.bobot</code> untuk mengurutkan dari besar ke kecil. Karena{' '}
                <code>sort</code> mengubah array aslinya, buat salinan dulu dengan <code>[...kriteria]</code>, lalu ambil namanya dengan{' '}
                <code>map</code>.
            </p>
        </LessonSection>
    );
}
