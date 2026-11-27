import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Loader2, SkipForward, Trophy, Zap } from 'lucide-react';
import CutButton from '../UI/CutButton';
import { useToast } from '../UI/Toast';
import { useArena } from '../Arena/ArenaSessionProvider';
import useStageNav from '../../Hooks/useStageNav';

function StageLink({ lesson, dir }) {
    if (!lesson) return <span />;
    const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
    return (
        <Link
            href={`/arena/${lesson.slug}`}
            className={`group flex min-h-11 max-w-[48%] items-center gap-2 text-sm text-ink-muted hover:text-ink ${dir === 'next' ? 'ml-auto text-right' : ''}`}
        >
            {dir === 'prev' && <Icon className="size-4 shrink-0" />}
            <span className="min-w-0">
                <span className="block text-xs">{dir === 'prev' ? 'Sebelumnya' : 'Berikutnya'} · Chapter {lesson.code}</span>
                <span className="block truncate font-medium text-ink/85 group-hover:text-ink">{lesson.title}</span>
            </span>
            {dir === 'next' && <Icon className="size-4 shrink-0" />}
        </Link>
    );
}

/**
 * Bagian bawah stage: checklist syarat, tombol "Klaim XP" + "Lewati Stage (0 XP)",
 * dan navigasi sebelumnya/berikutnya. Semua stage bebas dibuka.
 */
export default function StageCompleteBar({ lesson, requirements }) {
    const { bySlug, complete } = useArena();
    const toast = useToast();
    const { prev, next, skipStage, skipping } = useStageNav(lesson);
    const [busy, setBusy] = useState(false);
    const status = bySlug[lesson.slug]?.status;
    const completed = status === 'completed';
    const ready = requirements.every((r) => r.done);

    const claim = async () => {
        setBusy(true);
        try {
            await complete({ slug: lesson.slug, title: lesson.title, xp: lesson.max_xp });
            if (next) router.visit(`/arena/${next.slug}`);
        } catch (err) {
            toast({ type: 'error', title: 'Gagal klaim XP', message: err.firstError ?? 'Periksa koneksi lalu coba lagi.' });
        } finally {
            setBusy(false);
        }
    };

    const tone = completed ? 'border-xp/40 bg-xp/[0.06]' : ready ? 'border-gold-500/50 bg-gold-500/[0.06]' : 'border-arena-line bg-arena-panel/50';

    return (
        <div className="space-y-6">
            <section className={`space-y-5 rounded-lg border px-6 py-6 ${tone}`}>
                {status === 'skipped' && (
                    <p className="rounded-md bg-gold-500/10 px-3 py-2 text-sm text-gold-400">
                        Kamu pernah melewati chapter ini. Selesaikan latihan & mini check kapan saja untuk tetap mendapat XP-nya.
                    </p>
                )}
                <ul className="space-y-1.5 text-sm">
                    {requirements.map((r) => (
                        <li key={r.label} className={`flex items-center gap-2 ${r.done || completed ? 'text-xp' : 'text-ink-muted'}`}>
                            {r.done || completed ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />} {r.label}
                        </li>
                    ))}
                </ul>

                {completed ? (
                    <p className="flex items-center gap-2 font-display font-semibold text-xp">
                        {next ? <CheckCircle2 className="size-5" /> : <Trophy className="size-5" />}
                        {next ? `Chapter selesai · +${bySlug[lesson.slug].score} XP sudah diklaim` : 'Semua chapter tuntas! Kamu siap masuk tahap hands-on.'}
                    </p>
                ) : (
                    <div className="flex flex-wrap items-center gap-3">
                        <CutButton onClick={claim} disabled={!ready || busy || skipping} className="min-h-12">
                            {busy ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
                            Selesaikan Chapter & Klaim +{lesson.max_xp} XP
                        </CutButton>
                        <CutButton variant="secondary" onClick={skipStage} disabled={busy || skipping} className="min-h-12">
                            {skipping ? <Loader2 className="size-4 animate-spin" /> : <SkipForward className="size-4" />}
                            Lewati Chapter (0 XP) →
                        </CutButton>
                    </div>
                )}
            </section>

            <nav aria-label="Navigasi chapter" className="flex items-center gap-4 border-t border-arena-line pt-5">
                <StageLink lesson={prev} dir="prev" />
                <StageLink lesson={next} dir="next" />
            </nav>
        </div>
    );
}
