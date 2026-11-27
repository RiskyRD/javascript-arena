import { Head } from '@inertiajs/react';
import { ArrowDown, CheckCircle2, Loader2, SkipForward, Zap } from 'lucide-react';
import MiniQuiz from './MiniQuiz';
import StageCompleteBar from './StageCompleteBar';
import useStageState from '../../Hooks/useStageState';
import useStageNav from '../../Hooks/useStageNav';
import { useArena } from '../Arena/ArenaSessionProvider';

function ChapterHeader({ lesson, code, completed }) {
    const { skipStage, skipping } = useStageNav(lesson);
    return (
        <header className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">
                    {lesson.chapter_title} <span className="mx-1.5 text-arena-line">/</span>
                    <span className="font-mono text-gold-500">Chapter {code}</span>
                </p>
                {!completed && (
                    <button
                        onClick={skipStage}
                        disabled={skipping}
                        title="Lewati tanpa XP — bisa dikerjakan lagi nanti"
                        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm text-ink-muted transition-colors hover:bg-arena-line/50 hover:text-ink disabled:opacity-50"
                    >
                        {skipping ? <Loader2 className="size-4 animate-spin" /> : <SkipForward className="size-4" />} Lewati
                    </button>
                )}
            </div>
            <h1 className="font-display text-3xl leading-tight font-bold text-ink sm:text-4xl">{lesson.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-gold-500/15 px-2.5 py-1 font-mono text-gold-400">
                    <Zap className="size-3.5" /> {lesson.max_xp} XP
                </span>
                {completed ? (
                    <span className="inline-flex items-center gap-1.5 text-xp">
                        <CheckCircle2 className="size-4" /> Selesai
                    </span>
                ) : (
                    <span className="text-ink-muted">Baca materinya, lalu selesaikan latihan & mini check untuk klaim XP</span>
                )}
                <a href="#zona-praktik" className="inline-flex items-center gap-1 text-cyber hover:text-ink">
                    Langsung ke latihan <ArrowDown className="size-3.5" />
                </a>
            </div>
        </header>
    );
}

function ZoneDivider({ id, label }) {
    return (
        <div id={id} className="flex scroll-mt-24 items-center gap-4 pt-4">
            <span className="h-px flex-1 bg-arena-line" />
            <span className="text-sm font-medium text-ink-muted">{label}</span>
            <span className="h-px flex-1 bg-arena-line" />
        </div>
    );
}

/**
 * Halaman satu Chapter — alur vertikal satu kolom (max-w-4xl):
 *   Header → Zona Baca (materi) → Zona Praktik (bridge + live code) → Mini Check → Selesaikan / Lewati.
 *
 * materi: blok baca (story/concept/visual). practiceIntro: blok "bridge" di awal zona praktik.
 * renderLab({ saved, update, onPass }) → kartu live code.
 */
export default function StageShell({ lesson, code, materi, practiceIntro, renderLab, quiz, labRequired = true }) {
    const [saved, update] = useStageState(lesson.slug);
    const { bySlug } = useArena();
    const completed = bySlug[lesson.slug]?.status === 'completed';

    const requirements = [
        ...(labRequired ? [{ label: 'Latihan kode lulus semua pengujian', done: Boolean(saved.labPassed) }] : []),
        { label: `Mini check benar semua (${quiz.length} soal)`, done: Boolean(saved.quizPassed) },
    ];

    return (
        <>
            <Head title={`Chapter ${code} · ${lesson.title}`} />
            <article className="mx-auto max-w-4xl space-y-10 px-5 py-10 sm:px-8 lg:py-14">
                <ChapterHeader lesson={lesson} code={code} completed={completed} />

                {materi}

                <ZoneDivider id="zona-praktik" label="Zona praktik · Live Code" />
                {practiceIntro}
                {renderLab({ saved, update, onPass: () => update({ labPassed: true }) })}

                <MiniQuiz questions={quiz} passed={saved.quizPassed} onPass={() => update({ quizPassed: true })} />
                <StageCompleteBar lesson={lesson} requirements={requirements} />
            </article>
        </>
    );
}
