import { Link } from '@inertiajs/react';
import { CheckCircle2, Circle, SkipForward } from 'lucide-react';

/** Ikon status stage (dipakai juga oleh rail & peta). Semua stage bebas dibuka. */
export function StatusIcon({ status, className = 'size-4' }) {
    if (status === 'completed') return <CheckCircle2 className={`${className} shrink-0 text-gold-400`} />;
    if (status === 'skipped') return <SkipForward className={`${className} shrink-0 text-gold-500/70`} />;
    if (status === 'in_progress') {
        return (
            <span className={`relative grid shrink-0 place-items-center ${className}`}>
                <span className="absolute size-3 animate-ping rounded-full bg-gold-500/50" />
                <span className="size-2 rounded-full bg-gold-500" />
            </span>
        );
    }
    return <Circle className={`${className} shrink-0 text-ink-muted/50`} />;
}

const SUBTITLE = {
    in_progress: { text: 'Rekomendasi berikutnya', cls: 'text-gold-500' },
    skipped: { text: 'Dilewati · klaim XP kapan saja', cls: 'text-gold-500/80' },
    locked: { text: 'Belum dimulai', cls: 'text-ink-muted' },
};

/** Satu baris stage di navigator (mode lebar). */
export default function LessonNavItem({ lesson, progress, active }) {
    const status = progress?.status ?? 'locked';
    const done = status === 'completed';
    const sub = SUBTITLE[status];

    return (
        <Link
            href={`/arena/${lesson.slug}`}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-md border-l-2 py-2 pr-3 pl-3 text-sm transition-colors ${
                active ? 'border-gold-500 bg-gold-500/10 text-ink' : 'border-transparent text-ink/75 hover:bg-arena-line/40 hover:text-ink'
            }`}
        >
            <StatusIcon status={status} />
            <span className="font-mono text-xs text-ink-muted">{lesson.code}</span>
            <span className="min-w-0 flex-1">
                <span className="block truncate">{lesson.title}</span>
                {sub && <span className={`text-xs ${sub.cls}`}>{sub.text}</span>}
            </span>
            {done && <span className="shrink-0 rounded-sm bg-xp/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-xp">+{progress.score}</span>}
        </Link>
    );
}
