import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Crosshair, Loader2, RefreshCw, WifiOff } from 'lucide-react';
import CutButton from '../../Components/UI/CutButton';
import HudFrame from '../../Components/UI/HudFrame';
import { useToast } from '../../Components/UI/Toast';
import { useArena } from '../../Components/Arena/ArenaSessionProvider';

const BOOT_LINES = ['SYSTEM ONLINE', 'MODUL BAGIAN 1 // FONDASI LOGIKA JS DIMUAT', 'MENUNGGU IDENTITAS PESERTA'];

export default function Enter() {
    const { student, status, offline, enter, retry } = useArena();
    const toast = useToast();
    const [name, setName] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    // Sudah punya sesi valid → langsung ke Peta Materi.
    useEffect(() => {
        if (student) router.visit('/arena', { replace: true });
    }, [student]);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const data = await enter(name);
            toast({ type: 'success', title: 'Akses diterima', message: `Selamat bertugas, ${data.student.display_name}.` });
        } catch (err) {
            setError(err.firstError ?? 'Gagal terhubung ke server. Coba lagi.');
            setBusy(false);
        }
    };

    const waiting = status !== 'ready' || student;

    return (
        <>
            <Head title="Enter Arena" />
            <main className="flex min-h-screen items-center justify-center px-4 py-10">
                <HudFrame className="w-full max-w-xl">
                    <p className="font-mono text-[11px] tracking-[0.3em] text-cyber">LKS WEB TECHNOLOGIES // TACTICAL LAB</p>
                    <h1 className="mt-3 font-display text-4xl leading-none font-bold tracking-tight sm:text-6xl">
                        JS <span className="text-gold-500">ARENA</span>
                    </h1>
                    <ul className="mt-6 space-y-1 font-mono text-xs text-ink-muted">
                        {BOOT_LINES.map((line, i) => (
                            <li key={line}>
                                <span className="text-xp">&gt;</span> {line}
                                {i === BOOT_LINES.length - 1 && <span className="ml-1 animate-pulse text-gold-500">_</span>}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8">
                        {offline ? (
                            <div className="space-y-4">
                                <p className="flex items-center gap-2 text-sm text-danger">
                                    <WifiOff className="size-4" /> Tidak bisa terhubung ke server arena.
                                </p>
                                <CutButton variant="secondary" onClick={retry}>
                                    <RefreshCw className="size-4" /> Coba Lagi
                                </CutButton>
                            </div>
                        ) : waiting ? (
                            <p className="flex items-center gap-2 font-mono text-sm text-ink-muted">
                                <Loader2 className="size-4 animate-spin text-gold-500" /> memverifikasi sesi...
                            </p>
                        ) : (
                            <form onSubmit={submit} className="space-y-4">
                                <label htmlFor="name" className="block font-display text-sm font-semibold tracking-widest text-ink uppercase">
                                    Masukkan Nama Peserta / Tim
                                </label>
                                <input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={40}
                                    autoFocus
                                    autoComplete="off"
                                    placeholder="mis. Tim Garuda / Budi Santoso"
                                    className="cut-corner-sm w-full border border-arena-line bg-arena-panel px-4 py-4 font-mono text-lg text-ink placeholder:text-ink-muted/40 focus:border-gold-500/70 focus:outline-none"
                                />
                                {error && <p role="alert" className="text-sm text-danger">{error}</p>}
                                <CutButton type="submit" className="min-h-14 w-full text-base" disabled={busy || name.trim().length < 2}>
                                    {busy ? <Loader2 className="size-5 animate-spin" /> : <Crosshair className="size-5" />}
                                    Mulai Misi
                                </CutButton>
                                <p className="text-center text-xs text-ink-muted">Tanpa password. Sesimu tersimpan otomatis di browser ini.</p>
                            </form>
                        )}
                    </div>
                </HudFrame>
            </main>
        </>
    );
}
