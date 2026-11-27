import ChapterVariabel from './S11Variabel';
import ChapterFungsi from './S12Fungsi';
import ChapterDom from './S13Dom';
import ChapterState from './S14State';
import ChapterMedan from './S21Medan';
import ChapterMatchboard from './S22Matchboard';
import ChapterMobileWeb from './S23MobileWeb';

/** Peta slug chapter (config/arena.php) → komponen halaman chapter. */
export default {
    'variabel-tipe-data-objek': ChapterVariabel,
    'percabangan-fungsi': ChapterFungsi,
    'dom-event': ChapterDom,
    'state-render-storage': ChapterState,
    'medan-tempur': ChapterMedan,
    'koneksi-matchboard': ChapterMatchboard,
    'koneksi-mobile-web': ChapterMobileWeb,
};
