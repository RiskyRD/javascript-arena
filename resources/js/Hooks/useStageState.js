import { useCallback, useState } from 'react';
import { useArena } from '../Components/Arena/ArenaSessionProvider';

/**
 * Status lokal satu stage (draft kode, lab lulus, quiz lulus) per siswa di localStorage,
 * agar latihan bisa dilanjutkan setelah refresh / di sesi berikutnya pada browser yang sama.
 */
export default function useStageState(slug) {
    const { student } = useArena();
    const key = `jsarena.s${student.id}.${slug}`;

    const [state, setState] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? {};
        } catch {
            return {};
        }
    });

    const update = useCallback(
        (patch) =>
            setState((prev) => {
                const next = { ...prev, ...patch };
                localStorage.setItem(key, JSON.stringify(next));
                return next;
            }),
        [key],
    );

    return [state, update];
}
