import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Hexagon, PanelLeft, Trophy } from 'lucide-react';
import RankBadge from '../UI/RankBadge';
import XpBar from '../UI/XpBar';
import { rankProgress } from '../../Lib/rank';
import { flattenLessons } from '../../Lib/curriculum';
import { useArena } from './ArenaSessionProvider';

/** Teks "+N XP" melayang setiap total XP bertambah. */
function useXpGain(xp) {
    const prev = useRef(xp);
    const [gain, setGain] = useState(null);
    useEffect(() => {
        if (xp > prev.current) setGain({ amount: xp - prev.current, key: Date.now() });
        prev.current = xp;
    }, [xp]);
    return gain;
}

/** Konteks halaman aktif untuk ditampilkan di top bar. */
function useContextTitle() {
    const { url, props } = usePage();
    const path = url.split('?')[0];
    if (path === '/leaderboard') return { main: 'Leaderboard' };
    const lesson = flattenLessons(props.curriculum).find((l) => path === `/arena/${l.slug}`);
    if (lesson) return { eyebrow: `Chapter ${lesson.code}`, main: lesson.title };
    return { main: 'Peta Materi' };
}

/** Top bar ringkas: toggle · logo · konteks aktif · rank + XP · Leaderboard. */
export default function TopBar({ onToggleNav, navOpen }) {
    const { student } = useArena();
    const rp = rankProgress(student.total_xp);
    const gain = useXpGain(student.total_xp);
    const ctx = useContextTitle();

    return (
        <header className="sticky top-0 z-30 border-b border-arena-line bg-arena-bg/95 backdrop-blur">
            <div className="flex h-16 items-center gap-4 px-3 sm:px-5">
                <button
                    onClick={onToggleNav}
                    aria-label={navOpen ? 'Ciutkan navigasi' : 'Buka navigasi'}
                    aria-expanded={navOpen}
                    className="grid size-10 shrink-0 place-items-center rounded-md text-ink-muted transition-colors hover:bg-arena-line/50 hover:text-ink"
                >
                    <PanelLeft className="size-5" />
                </button>

                <Link href="/arena" className="flex shrink-0 items-center gap-2" aria-label="JS Arena — Peta Materi">
                    <Hexagon className="size-6 fill-gold-500/15 text-gold-500" />
                    <span className="hidden font-display text-base font-bold tracking-wide sm:inline">
                        JS <span className="text-gold-500">ARENA</span>
                    </span>
                </Link>

                <div className="hidden min-w-0 items-center gap-3 border-l border-arena-line pl-4 md:flex">
                    {ctx.eyebrow && <span className="shrink-0 font-mono text-xs text-gold-500">{ctx.eyebrow}</span>}
                    <span className="truncate text-sm font-medium text-ink">{ctx.main}</span>
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
                    <div className="relative flex items-center gap-3">
                        <RankBadge xp={student.total_xp} compact />
                        <div className="hidden w-44 md:block lg:w-52">
                            <XpBar
                                value={rp.value}
                                max={rp.max}
                                size="sm"
                                label={<span className={`normal-case tracking-normal ${rp.current.color}`}>{rp.current.name}</span>}
                                valueLabel={`${student.total_xp.toLocaleString('id-ID')} XP`}
                            />
                        </div>
                        <span className="font-mono text-xs text-gold-500 md:hidden">{student.total_xp} XP</span>
                        {gain && (
                            <span key={gain.key} className="animate-float-up absolute -top-2 right-0 font-mono text-sm font-bold text-xp">
                                +{gain.amount} XP
                            </span>
                        )}
                    </div>

                    <Link
                        href="/leaderboard"
                        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-arena-line px-3 text-sm text-ink transition-colors hover:border-gold-500/60 hover:text-gold-400"
                    >
                        <Trophy className="size-4 text-gold-500" />
                        <span className="hidden lg:inline">Leaderboard</span>
                    </Link>
                </div>
            </div>
            <div className="md:hidden">
                <XpBar value={rp.value} max={rp.max} size="sm" />
            </div>
        </header>
    );
}
