import { Callout, CodeBlock, CodeWalkthrough, LessonSection, Step } from '../../Components/Lesson/Blocks';
import Gallery from '../S21Medan/Gallery';

const ICON = '/ref-assets/client/icons';
const SHOT = (n) => `/ref-assets/client/screens/screen-${String(n).padStart(2, '0')}.png`;

const MAP = [
    { icon: 'move', fitur: 'Toolbar: satu alat aktif, klik ulang mematikan, label footer', konsep: 'Event delegation + classList.toggle', bab: '1.3' },
    { icon: 'plus', fitur: 'Formasi 4-3-3 dkk. langsung menyusun 11 pemain', konsep: 'Array, split + map(Number), perhitungan X/Y', bab: '1.1 · 1.2' },
    { icon: 'text', fitur: 'Team Roster & Board Stats (jumlah Home, Away, cone, arrow)', konsep: 'Array of objects + filter / length', bab: '1.1 · 1.2' },
    { icon: 'eraser', fitur: 'Eraser tidak boleh menghapus pemain (muncul peringatan)', konsep: 'if / else di dalam fungsi', bab: '1.2' },
    { icon: 'undo', fitur: 'Undo/Redo maks 60 langkah', konsep: 'State → Render + tumpukan snapshot', bab: '1.4' },
];

export default function Materi() {
    return (
        <>
            <LessonSection kind="story" title="Matchboard dibangun dari potongan yang sudah kamu kuasai">
                <p>
                    Saat pertama kali membaca soal Matchboard, daftar fiturnya terasa menakutkan: toolbar, formasi, roster, panah, BFS, undo,
                    export, responsif. Tapi kalau dibedah satu per satu, sebagian besar fitur itu hanyalah gabungan konsep yang sudah kamu latih
                    di Bab 1. Toolbar adalah lampu kamar dengan pilihan warna. Formasi adalah array yang dihitung posisinya. Board Stats adalah
                    menghitung isi keranjang belanja. Undo adalah daftar belanja yang disimpan di state.
                </p>
                <p>
                    Chapter ini menunjukkan jembatannya secara langsung, supaya saat lomba kamu tidak melihat 15 fitur asing, melainkan 15
                    pola yang sudah kamu kenal.
                </p>
            </LessonSection>

            <LessonSection kind="concept" title="Peta fitur Matchboard ke konsep Bab 1">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[34rem] text-left text-sm">
                        <thead className="text-ink-muted">
                            <tr className="border-b border-arena-line">
                                <th className="py-2 pr-3 font-medium">Fitur di soal</th>
                                <th className="py-2 pr-3 font-medium">Konsep JavaScript</th>
                                <th className="py-2 font-medium">Bab</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MAP.map((r) => (
                                <tr key={r.icon} className="border-b border-arena-line/50 align-top">
                                    <td className="py-2.5 pr-3">
                                        <span className="flex gap-2.5">
                                            <img src={`${ICON}/${r.icon}.svg`} alt="" className="mt-0.5 size-5 shrink-0" />
                                            <span className="text-ink/85">{r.fitur}</span>
                                        </span>
                                    </td>
                                    <td className="py-2.5 pr-3 text-code">{r.konsep}</td>
                                    <td className="py-2.5 font-mono text-gold-400">{r.bab}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-ink-muted">Ikon di tabel adalah ikon asli dari berkas media soal.</p>

                <Step n={1} title="Toolbar = lampu kamar dengan pilihan warna" />
                <p>
                    Toolbar Matchboard berperilaku persis seperti tombol pilihan warna di Chapter 1.3, ditambah satu aturan: klik alat yang
                    sedang aktif akan mematikannya. Bedanya hanya pada aturan tambahan Eraser, yang tidak boleh menghapus pemain.
                </p>
                <CodeBlock title="toolbar + aturan eraser">{`
toolbar.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-tool]');
  if (!btn) return;
  state.tool = state.tool === btn.dataset.tool ? null : btn.dataset.tool;
  render(); // render menyalakan class 'active' & menulis label footer
});

function hapusMarker(marker) {
  if (marker.type === 'player') return tampilkanPeringatan('Pemain tidak bisa dihapus');
  state.markers = state.markers.filter((m) => m.id !== marker.id);
  render();
}`}</CodeBlock>

                <Step n={2} title="Formasi = array + rumus jarak merata" />
                <p>
                    Saat pelatih memilih 4-3-3, program harus menaruh 11 titik tanpa kita ketik satu per satu. Ubah dulu teks formasi menjadi
                    array angka, lalu sebarkan pemain dengan "rumus pagar": kalau ingin menancapkan <em>n</em> tiang dengan jarak sama di
                    sepanjang <em>L</em> tanpa tiang di ujung, bagi pagar menjadi <em>n + 1</em> bagian. Tiang ke-<em>j</em> (mulai 0) ada di{' '}
                    <code>L × (j + 1) ÷ (n + 1)</code>.
                </p>
                <CodeWalkthrough
                    title="menghitung posisi formasi"
                    steps={[
                        { code: "const baris = formasi.split('-').map(Number); // [4, 3, 3]", note: <><code>split</code> memotong teks di tanda hubung (hasilnya masih teks), <code>map(Number)</code> mengubahnya menjadi angka. Tanpa ini, <code>'4' + 1</code> menjadi <code>'41'</code>.</> },
                        { code: 'const posisi = [{ x: 30, y: H / 2 }]; // kiper', note: <>Kiper selalu pertama — sesuai soal, nomor punggung dimulai dari 1 untuk kiper.</> },
                        { code: 'baris.forEach((jumlah, i) => {\n  const x = (W / 2) * (i + 1) / (baris.length + 1);', note: <>Tim HOME memakai setengah lapangan kiri. Baris ke-<code>i</code> ditaruh dengan rumus pagar di sumbu X.</> },
                        { code: '  for (let j = 0; j < jumlah; j++) {\n    posisi.push({ x, y: H * (j + 1) / (jumlah + 1) });\n  }\n});', note: <>Di dalam satu baris, pemain disebar dari atas ke bawah dengan rumus yang sama di sumbu Y.</> },
                    ]}
                />
                <p>
                    Tim AWAY tidak butuh rumus baru: cerminkan saja setiap titik dengan <code>x = W - x</code>. Dan karena soal meminta formasi
                    hanya mengganti pemain di sisi itu, cukup tulis <code>state.home = hitungFormasi(f)</code> — data lain di state tetap aman.
                </p>

                <Step n={3} title="Roster & Board Stats = array of objects" />
                <p>
                    Semua marker di papan bisa disimpan dalam satu array of objects. Board Stats tinggal menghitung dengan <code>filter</code>,
                    persis seperti menyaring barang murah di keranjang belanja. Karena dihitung di dalam <code>render()</code>, angkanya
                    otomatis ter-update setiap kali papan berubah, seperti yang diminta soal.
                </p>
                <CodeBlock title="board stats dari state">{`
const homeCount = state.markers.filter((m) => m.type === 'player' && m.team === 'home').length;
const coneCount = state.markers.filter((m) => m.type === 'cone').length;
stats.textContent = \`Home: \${homeCount} · Cones: \${coneCount} · Arrows: \${state.arrows.length}\`;`}</CodeBlock>

                <Step n={4} title="Undo/Redo = state + tumpukan snapshot" />
                <p>
                    Inilah alasan pola State → Render begitu penting. Karena seluruh papan ada di satu object, kita bisa memotret state sebelum
                    setiap perubahan dan menumpuknya di array <code>riwayat</code>. Undo cukup mengambil potret terakhir dengan{' '}
                    <code>pop()</code> lalu memanggil <code>render()</code>. Potret disimpan sebagai teks JSON supaya benar-benar salinan,
                    bukan referensi ke object yang sama. Redo bekerja dengan tumpukan kedua yang diisi saat undo.
                </p>
                <Callout kind="pitfall">
                    <p>
                        Menyimpan <code>riwayat.push(state.home)</code> tanpa JSON. Yang tersimpan hanyalah referensi ke array yang sama, sehingga
                        ketika state berubah, isi riwayat ikut berubah dan undo tidak mengembalikan apa-apa.
                    </p>
                    <p>
                        Fitur <strong>Passing Path (BFS)</strong> bernilai besar tapi butuh konsep graf dan antrean. Kuasai dulu fondasi di atas;
                        BFS akan dibahas di tahap hands-on.
                    </p>
                </Callout>
            </LessonSection>

            <LessonSection kind="visual" title="Bandingkan dengan aplikasi aslinya">
                <Gallery
                    items={[
                        { src: SHOT(2), caption: 'Toolbar: alat Move aktif, label di footer' },
                        { src: SHOT(3), caption: 'Dropdown formasi HOME' },
                        { src: SHOT(4), caption: 'Dua tim tersusun otomatis' },
                        { src: SHOT(5), caption: 'Selection panel & roster' },
                    ]}
                />
            </LessonSection>
        </>
    );
}

export function PracticeIntro() {
    return (
        <LessonSection kind="bridge" title="Membangun Mini Matchboard">
            <p>
                Latihan di bawah adalah potongan kecil Matchboard: dropdown formasi HOME, tombol Undo dengan ikon asli dari soal, teks
                statistik, dan lapangan SVG. Fungsi <code>buatTitik</code> (membuat lingkaran di SVG) dan <code>simpanRiwayat</code> sudah
                disediakan.
            </p>
            <p>
                <strong>TODO 1</strong> adalah rumus formasi dari langkah 2. <strong>TODO 2</strong> adalah <code>render()</code> seperti
                daftar belanja di Chapter 1.4, hanya saja yang digambar titik pemain. <strong>TODO 3</strong> menghubungkan dropdown: simpan
                riwayat dulu, baru ubah state, lalu render. <strong>TODO 4</strong> adalah undo dari langkah 4.
            </p>
            <p>
                Pengujian akan memilih 4-3-3, menggantinya dengan 3-5-2, lalu menekan Undo beberapa kali — termasuk saat riwayat sudah habis.
                Setelah itu, pilih formasi sendiri di pratinjau dan lihat pemainmu tersusun.
            </p>
        </LessonSection>
    );
}
