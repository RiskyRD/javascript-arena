import { Head, Link, usePage } from '@inertiajs/react';
import { Crosshair, Flame, Target, Trophy } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import ChapterCard from '../../Components/Arena/ChapterCard';
import StatTile from '../../Components/UI/StatTile';
import HudFrame from '../../Components/UI/HudFrame';
import { useArena } from '../../Components/Arena/ArenaSessionProvider';
import { currentLesson, flattenLessons } from '../../Lib/curriculum';

/** Dashboard Peta Materi: briefing misi berikutnya + peta bab. */
export default function MissionMap() {
    const { curriculum } = usePage().props;
    const { student, bySlug } = useArena();
    const lessons = flattenLessons(curriculum);
    const done = lessons.filter((l) => bySlug[l.slug]?.status === 'completed').length;
    const next = currentLesson(curriculum, bySlug);

    return (
        <>
            <Head title="Peta Materi" />
            <div className="space-y-8">
                <HudFrame className="bg-arena-panel/40">
                    <p className="font-mono text-[11px] tracking-[0.3em] text-cyber">MISSION BRIEFING</p>
                    <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                        Siap bertugas, <span className="text-gold-500">{student.name}</span>
                    </h1>
                    {next ? (
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-ink-muted">Misi berikutnya</p>
                                <p className="font-display text-lg font-semibold">
                                    <span className="mr-2 font-mono text-gold-500">{next.code}</span>
                                    {next.title}
                                </p>
                            </div>
                            <Link
                                href={`/arena/${next.slug}`}
                                className="cut-corner inline-flex min-h-12 items-center gap-2 bg-gold-500 px-6 text-sm font-bold tracking-widest text-arena-bg uppercase transition-colors hover:bg-gold-400"
                            >
                                <Crosshair className="size-4" /> Lanjutkan Misi
                            </Link>
                        </div>
                    ) : (
                        <p className="mt-4 flex items-center gap-2 text-xp">
                            <Trophy className="size-5" /> Semua chapter selesai. Luar biasa!
                        </p>
                    )}
                </HudFrame>

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatTile icon={Target} label="Misi selesai" value={`${done}/${lessons.length}`} accent="text-xp" />
                    <StatTile icon={Trophy} label="Total XP" value={student.total_xp.toLocaleString('id-ID')} />
                    <StatTile icon={Flame} label="Streak" value={`${student.current_streak} hari`} accent="text-cyber" />
                </div>

                {curriculum.map((part, pi) => (
                    <section key={part.slug} className="space-y-4">
                        <h2 className="font-display text-sm font-semibold tracking-widest text-ink-muted uppercase">
                            Bagian {pi + 1} // {part.title}
                        </h2>
                        <div className="grid gap-5 md:grid-cols-2">
                            {part.chapters.map((chapter, ci) => (
                                <ChapterCard key={chapter.slug} chapter={chapter} index={ci} bySlug={bySlug} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}

MissionMap.layout = (page) => <AppLayout>{page}</AppLayout>;
