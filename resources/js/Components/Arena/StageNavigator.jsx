import { Link, usePage } from '@inertiajs/react';
import { Check, ChevronsLeft, ChevronsRight } from 'lucide-react';
import LessonNavItem from './LessonNavItem';
import RankBadge from '../UI/RankBadge';
import { useArena } from './ArenaSessionProvider';
import { chapterStats, statusOf } from '../../Lib/curriculum';

const RAIL_NODE = {
    completed: 'border-gold-500 bg-gold-500 text-arena-bg',
    in_progress: 'border-gold-500 text-gold-400 shadow-[0_0_10px_rgba(245,158,11,0.35)]',
    skipped: 'border-dashed border-gold-500/60 text-gold-500/80',
    locked: 'border-arena-line text-ink-muted hover:border-ink-muted/60',
};
const RAIL_LABEL = { completed: 'selesai', in_progress: 'rekomendasi', skipped: 'dilewati', locked: 'belum dimulai' };

/** Mode rail (sidebar diciutkan): satu node per stage, warna = status. */
function Rail({ curriculum, bySlug, url }) {
    return (
        <nav className="flex flex-col items-center gap-3 py-5">
            {curriculum.flatMap((part) =>
                part.chapters.flatMap((chapter, ci) =>
                    chapter.lessons.map((lesson, li) => {
                        const status = statusOf(bySlug, lesson.slug);
                        const code = `${ci + 1}.${li + 1}`;
                        const cls = `grid size-10 place-items-center rounded-full border-2 font-mono text-[11px] font-bold transition-colors ${RAIL_NODE[status]} ${
                            url === `/arena/${lesson.slug}` ? 'ring-2 ring-cyber/60 ring-offset-2 ring-offset-arena-bg' : ''
                        }`;
                        return (
                            <Link key={lesson.slug} href={`/arena/${lesson.slug}`} title={`${code} · ${lesson.title} (${RAIL_LABEL[status]})`} className={cls}>
                                {status === 'completed' ? <Check className="size-4" /> : code}
                            </Link>
                        );
                    }),
                ),
            )}
        </nav>
    );
}

function FullList({ curriculum, bySlug, url }) {
    return curriculum.map((part, pi) => (
        <div key={part.slug} className="px-3 py-6">
            <p className="px-3 text-xs text-ink-muted">Bagian {pi + 1}</p>
            <h2 className="px-3 font-display text-base font-semibold text-ink">{part.title}</h2>
            <div className="mt-5 space-y-6">
                {part.chapters.map((chapter, ci) => {
                    const { done, total } = chapterStats(chapter, bySlug);
                    return (
                        <section key={chapter.slug}>
                            <header className="flex items-baseline justify-between px-3 pb-2">
                                <h3 className="text-sm font-medium text-ink/80">{chapter.title}</h3>
                                <span className={`font-mono text-xs ${done === total ? 'text-gold-400' : 'text-ink-muted'}`}>{done}/{total}</span>
                            </header>
                            <div className="space-y-0.5">
                                {chapter.lessons.map((lesson, li) => (
                                    <LessonNavItem
                                        key={lesson.slug}
                                        lesson={{ ...lesson, code: `${ci + 1}.${li + 1}` }}
                                        progress={bySlug[lesson.slug]}
                                        active={url === `/arena/${lesson.slug}`}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    ));
}

/**
 * Sidebar navigasi stage. Desktop: sticky, lebar penuh (w-72) atau rail (w-16).
 * Di bawah lg: drawer (selalu lebar penuh) dengan overlay.
 */
export default function StageNavigator({ collapsed, drawerOpen, onCloseDrawer, onToggle }) {
    const page = usePage();
    const curriculum = page.props.curriculum ?? [];
    const url = page.url.split('?')[0];
    const { bySlug, student } = useArena();
    const rail = collapsed && !drawerOpen;

    return (
        <>
            {drawerOpen && <div onClick={onCloseDrawer} aria-hidden className="fixed inset-0 z-30 bg-arena-bg/70 backdrop-blur-sm lg:hidden" />}
            <aside
                aria-label="Navigasi chapter"
                className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[85vw] flex-col border-r border-arena-line bg-arena-panel transition-[transform,width] duration-200 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:max-w-none lg:translate-x-0 lg:bg-arena-panel/40 ${
                    drawerOpen ? 'translate-x-0' : '-translate-x-full'
                } ${rail ? 'lg:w-16' : 'lg:w-72'}`}
            >
                <div className="flex-1 overflow-y-auto">
                    {rail ? <Rail curriculum={curriculum} bySlug={bySlug} url={url} /> : <FullList curriculum={curriculum} bySlug={bySlug} url={url} />}
                </div>

                <footer className={`flex items-center gap-3 border-t border-arena-line p-3 ${rail ? 'flex-col' : ''}`}>
                    <RankBadge xp={student.total_xp} compact />
                    {!rail && (
                        <div className="min-w-0 flex-1 leading-tight">
                            <p className="truncate text-sm font-medium">{student.name}</p>
                            <p className="font-mono text-xs text-ink-muted">#{student.tag}</p>
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        aria-label={rail ? 'Perlebar navigasi' : 'Ciutkan navigasi'}
                        className="hidden size-9 place-items-center rounded-md text-ink-muted hover:bg-arena-line/50 hover:text-ink lg:grid"
                    >
                        {rail ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
                    </button>
                </footer>
            </aside>
        </>
    );
}
