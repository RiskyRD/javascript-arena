import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { arenaApi, NAME_KEY, TOKEN_KEY } from '../../Lib/arenaApi';
import { rankFor } from '../../Lib/rank';
import { useToast } from '../UI/Toast';

const SessionContext = createContext(null);

const clearStorage = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
};

/**
 * Sesi siswa global (dipasang di root app.jsx) sehingga profil tidak dimuat ulang
 * setiap pindah halaman Inertia. Boot hanya terjadi saat ada komponen yang memakai useArena().
 */
export function ArenaSessionProvider({ children }) {
    const toast = useToast();
    const [student, setStudent] = useState(null);
    const [progress, setProgress] = useState([]);
    const [status, setStatus] = useState('idle'); // idle | booting | ready
    const [offline, setOffline] = useState(false);
    const booted = useRef(false);

    const apply = useCallback((data) => {
        if (data.session_token) localStorage.setItem(TOKEN_KEY, data.session_token);
        localStorage.setItem(NAME_KEY, data.student.display_name);
        setStudent(data.student);
        setProgress(data.progress);
        return data;
    }, []);

    const boot = useCallback(() => {
        if (booted.current) return;
        booted.current = true;
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return setStatus('ready');

        setStatus('booting');
        setOffline(false);
        arenaApi
            .enter({ session_token: token })
            .then(apply)
            .catch((err) => {
                // 422 = token tak dikenal (mis. data direset guru). Error jaringan: token dipertahankan.
                if (err.status) clearStorage();
                else setOffline(true);
            })
            .finally(() => setStatus('ready'));
    }, [apply]);

    const retry = useCallback(() => {
        booted.current = false;
        boot();
    }, [boot]);

    const enter = useCallback((name) => arenaApi.enter({ name }).then(apply), [apply]);

    const leave = useCallback(() => {
        clearStorage();
        setStudent(null);
        setProgress([]);
    }, []);

    const complete = useCallback(
        async (lesson) => {
            const before = student?.total_xp ?? 0;
            const data = await arenaApi.complete({
                session_token: localStorage.getItem(TOKEN_KEY),
                module_slug: lesson.slug,
                xp_earned: lesson.xp,
            });
            setStudent(data.student);
            setProgress(data.progress);

            if (data.already_completed) {
                toast({ type: 'info', title: 'Misi sudah selesai', message: 'XP misi ini sudah pernah diklaim.' });
                return data;
            }
            toast({ type: 'success', title: `+${data.xp_awarded} XP`, message: `Misi "${lesson.title}" selesai!` });
            const newRank = rankFor(data.student.total_xp);
            if (newRank.name !== rankFor(before).name) {
                toast({ type: 'achievement', title: `Rank naik: ${newRank.name}`, message: 'Pertahankan momentum!', duration: 6000 });
            }
            return data;
        },
        [student, toast],
    );

    // Lewati stage tanpa XP; tetap bisa diselesaikan nanti untuk klaim XP.
    const skip = useCallback(
        async (lesson) => {
            const data = await arenaApi.skip({ session_token: localStorage.getItem(TOKEN_KEY), module_slug: lesson.slug });
            setStudent(data.student);
            setProgress(data.progress);
            toast(
                data.already_completed
                    ? { type: 'info', title: 'Chapter sudah selesai', message: 'XP chapter ini sudah kamu klaim.' }
                    : { type: 'warning', title: 'Chapter dilewati (0 XP)', message: `"${lesson.title}" bisa dikerjakan lagi kapan saja untuk klaim XP.` },
            );
            return data;
        },
        [toast],
    );

    const bySlug = useMemo(() => Object.fromEntries(progress.map((p) => [p.module_slug, p])), [progress]);

    const value = { student, progress, bySlug, status, offline, boot, retry, enter, leave, complete, skip };
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useArena() {
    const ctx = useContext(SessionContext);
    useEffect(() => ctx.boot(), [ctx.boot]);
    return ctx;
}
