import { Head, usePoll } from '@inertiajs/react';
import { Trophy } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import CutCard from '../../Components/UI/CutCard';
import Podium from '../../Components/Arena/Podium';
import RankingList from '../../Components/Arena/RankingList';
import { useArena } from '../../Components/Arena/ArenaSessionProvider';

export default function Leaderboard({ leaderboard, generated_at }) {
    const { student } = useArena();
    const me = leaderboard.find((r) => r.id === student.id);

    usePoll(10000, { only: ['leaderboard', 'generated_at'] });

    return (
        <>
            <Head title="Leaderboard" />
            <div className="mx-auto max-w-4xl space-y-8">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="font-mono text-[11px] tracking-[0.3em] text-cyber">
                            TOURNAMENT STANDINGS · {new Date(generated_at).toLocaleTimeString('id-ID')}
                        </p>
                        <h1 className="flex items-center gap-3 font-display text-3xl font-bold">
                            <Trophy className="size-7 text-gold-500" /> Leaderboard
                        </h1>
                    </div>
                    {me && (
                        <a href="#my-rank" className="cut-corner-sm border border-gold-500/50 bg-gold-500/10 px-4 py-2 font-mono text-sm text-gold-400">
                            Posisimu: #{me.rank}
                        </a>
                    )}
                </header>

                {leaderboard.length === 0 ? (
                    <p className="py-16 text-center font-mono text-sm text-ink-muted">Belum ada peserta.</p>
                ) : (
                    <>
                        <Podium rows={leaderboard.slice(0, 3)} meId={student.id} />
                        <CutCard innerClassName="overflow-hidden">
                            <RankingList rows={leaderboard} meId={student.id} />
                        </CutCard>
                    </>
                )}
            </div>
        </>
    );
}

Leaderboard.layout = (page) => <AppLayout>{page}</AppLayout>;
