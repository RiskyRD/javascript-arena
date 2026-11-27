import { Fragment } from 'react';
import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import CutCard from '../UI/CutCard';
import XpBar from '../UI/XpBar';
import { chapterStats, pad2, statusOf } from '../../Lib/curriculum';

const NODE = {
    completed: 'border-gold-400 bg-gold-500 text-arena-bg',
    in_progress: 'border-gold-500 bg-arena-bg text-gold-500 shadow-[0_0_14px_rgba(245,158,11,0.45)]',
    skipped: 'border-dashed border-gold-500/60 bg-arena-bg text-gold-500/80',
    locked: 'border-arena-line bg-arena-bg text-ink-muted',
};
const LABEL = { completed: 'selesai', in_progress: 'rekomendasi', skipped: 'dilewati', locked: 'belum dimulai' };

/** Node stage — semua bisa diklik (navigasi bebas). */
function Node({ lesson, code, status }) {
    return (
        <Link href={`/arena/${lesson.slug}`} title={`${code} · ${lesson.title} (${LABEL[status]})`} className="transition-transform hover:scale-110">
            <span className={`grid size-11 place-items-center rounded-full border-2 font-mono text-xs font-bold ${NODE[status]}`}>
                {status === 'completed' ? <Check className="size-5" /> : code}
            </span>
        </Link>
    );
}

/** Kartu bab di Peta Materi: progres bab + jalur node sub-materi. */
export default function ChapterCard({ chapter, index, bySlug }) {
    const { done, total } = chapterStats(chapter, bySlug);
    const statuses = chapter.lessons.map((l) => statusOf(bySlug, l.slug));
    const glow = done === total ? 'xp' : statuses.includes('in_progress') ? 'gold' : 'none';

    return (
        <CutCard glow={glow} innerClassName="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-start gap-4">
                <span className="font-mono text-4xl leading-none font-bold text-arena-line">{pad2(index + 1)}</span>
                <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] tracking-[0.25em] text-cyber">BAB {pad2(index + 1)}</p>
                    <h3 className="font-display text-lg font-bold">{chapter.title}</h3>
                </div>
                {done === total && (
                    <span className="cut-corner-sm bg-xp/15 px-2 py-1 font-mono text-[10px] font-bold tracking-widest text-xp">CLEARED</span>
                )}
            </div>

            <div className="flex items-center">
                {chapter.lessons.map((lesson, li) => (
                    <Fragment key={lesson.slug}>
                        {li > 0 && (
                            <span className={`h-0.5 flex-1 ${statuses[li - 1] === 'completed' ? 'bg-gold-500' : 'bg-arena-line'}`} />
                        )}
                        <Node lesson={lesson} code={`${index + 1}.${li + 1}`} status={statuses[li]} />
                    </Fragment>
                ))}
            </div>

            <XpBar value={done} max={total} color="gold" size="sm" label="Progres bab" valueLabel={`${done}/${total} misi`} />
        </CutCard>
    );
}
