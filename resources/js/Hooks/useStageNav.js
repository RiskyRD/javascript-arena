import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useArena } from '../Components/Arena/ArenaSessionProvider';
import { useToast } from '../Components/UI/Toast';
import { neighbours } from '../Lib/curriculum';

/**
 * Navigasi antar-stage + aksi "Lewati Stage (0 XP)".
 * Setelah dilewati, langsung pindah ke stage berikutnya (atau Peta Materi jika terakhir).
 */
export default function useStageNav(lesson) {
    const { curriculum } = usePage().props;
    const { skip } = useArena();
    const toast = useToast();
    const [skipping, setSkipping] = useState(false);
    const { prev, next } = neighbours(curriculum, lesson.slug);

    const skipStage = async () => {
        setSkipping(true);
        try {
            await skip(lesson);
            router.visit(next ? `/arena/${next.slug}` : '/arena');
        } catch (err) {
            toast({ type: 'error', title: 'Gagal melewati chapter', message: err.firstError ?? 'Periksa koneksi lalu coba lagi.' });
        } finally {
            setSkipping(false);
        }
    };

    return { prev, next, skipStage, skipping };
}
