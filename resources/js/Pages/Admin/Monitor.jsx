import { useEffect } from 'react';
import { Head, router, usePage, usePoll } from '@inertiajs/react';
import { Activity, LogOut, Sparkles, Users } from 'lucide-react';
import CutCard from '../../Components/UI/CutCard';
import CutButton from '../../Components/UI/CutButton';
import { useToast } from '../../Components/UI/Toast';
import StatTile from '../../Components/UI/StatTile';
import LeaderboardTable from '../../Components/Admin/LeaderboardTable';
import ModuleMatrix from '../../Components/Admin/ModuleMatrix';
import ResetPanel from '../../Components/Admin/ResetPanel';

const POLL_MS = 10000;

function Section({ title, children }) {
    return (
        <section className="space-y-3">
            <h2 className="font-display text-sm font-semibold tracking-widest text-ink-muted uppercase">{title}</h2>
            <CutCard innerClassName="overflow-hidden">{children}</CutCard>
        </section>
    );
}

export default function Monitor({ modules, leaderboard, stats, generated_at }) {
    const { flash } = usePage().props;
    const toast = useToast();

    // Live update: ambil ulang data tiap 10 detik tanpa reload halaman (aman untuk sesi kelas 3 jam).
    usePoll(POLL_MS, { only: ['modules', 'leaderboard', 'stats', 'generated_at'] });

    useEffect(() => {
        if (flash?.toast) toast(flash.toast);
    }, [flash?.toast, toast]);

    return (
        <>
            <Head title="Monitor Guru" />
            <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="flex items-center gap-2 font-mono text-xs text-xp">
                            <span className="size-2 animate-pulse rounded-full bg-xp" /> LIVE · diperbarui{' '}
                            {new Date(generated_at).toLocaleTimeString('id-ID')}
                        </p>
                        <h1 className="font-display text-3xl font-bold">
                            Command Center <span className="text-gold-500">// Monitor</span>
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-start gap-2">
                        <ResetPanel />
                        <CutButton variant="secondary" onClick={() => router.post('/admin/logout')}>
                            <LogOut className="size-4" /> Keluar
                        </CutButton>
                    </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatTile icon={Users} label="Siswa" value={stats.students} accent="text-cyber" />
                    <StatTile icon={Activity} label="Aktif hari ini" value={stats.active_today} accent="text-xp" />
                    <StatTile icon={Sparkles} label="Total XP" value={stats.total_xp.toLocaleString('id-ID')} />
                </div>

                <Section title="Matriks Progres Kelas (skor XP per sub-materi)">
                    {leaderboard.length ? (
                        <ModuleMatrix modules={modules} rows={leaderboard} />
                    ) : (
                        <p className="p-8 text-center font-mono text-sm text-ink-muted">Menunggu siswa pertama...</p>
                    )}
                </Section>

                <Section title="Live Leaderboard">
                    <LeaderboardTable rows={leaderboard} />
                </Section>
            </main>
        </>
    );
}
