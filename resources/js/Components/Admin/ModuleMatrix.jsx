import { Minus } from 'lucide-react';

const LEGEND = [
    { key: 'completed', label: 'Selesai (angka = skor XP)', cls: 'border-xp/60 bg-xp/20' },
    { key: 'skipped', label: 'Dilewati (0 XP)', cls: 'border-gold-500/60 bg-gold-500/15' },
    { key: 'in_progress', label: 'Rekomendasi berikutnya', cls: 'border-cyber/60 border-dashed' },
    { key: 'locked', label: 'Belum dimulai', cls: 'border-arena-line' },
];

function Cell({ status, score, title }) {
    const base = 'cut-corner-sm mx-auto grid h-7 w-10 place-items-center border font-mono text-[11px] font-semibold';
    if (status === 'completed') return <span title={`${title}: selesai, ${score} XP`} className={`${base} border-xp/60 bg-xp/20 text-xp`}>{score}</span>;
    if (status === 'skipped') return <span title={`${title}: dilewati (0 XP)`} className={`${base} border-gold-500/60 bg-gold-500/15 text-gold-400`}>skip</span>;
    if (status === 'in_progress') return <span title={`${title}: rekomendasi berikutnya`} className={`${base} border-dashed border-cyber/60 text-cyber`}>▶</span>;
    return <span title={`${title}: belum dimulai`} className={`${base} border-arena-line text-ink-muted/40`}><Minus className="size-3" /></span>;
}

/** Kelompokkan sub-materi per bab, mempertahankan urutan. */
function groupByChapter(modules) {
    return modules.reduce((groups, m) => {
        const last = groups.at(-1);
        if (last?.slug === m.chapter) last.lessons.push(m);
        else groups.push({ slug: m.chapter, title: m.chapter_title, lessons: [m] });
        return groups;
    }, []);
}

/** Matriks real-time: baris = siswa, kolom = sub-materi, sel = status + skor. */
export default function ModuleMatrix({ modules, rows }) {
    const chapters = groupByChapter(modules);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th rowSpan={2} className="sticky left-0 z-10 border-b border-arena-line bg-arena-panel px-4 py-2 text-left font-display text-xs tracking-widest text-ink-muted uppercase">
                                Siswa
                            </th>
                            {chapters.map((c, ci) => (
                                <th key={c.slug} colSpan={c.lessons.length} title={c.title} className="border-x border-arena-line/60 px-2 pt-3 pb-1 text-center">
                                    <span className="font-mono text-[11px] tracking-widest text-cyber">BAB {ci + 1}</span>
                                    <span className="block truncate text-[11px] font-normal text-ink-muted">{c.title}</span>
                                </th>
                            ))}
                            <th rowSpan={2} className="border-b border-arena-line px-4 py-2 text-right font-display text-xs tracking-widest text-ink-muted uppercase">
                                XP
                            </th>
                        </tr>
                        <tr className="border-b border-arena-line">
                            {chapters.flatMap((c, ci) =>
                                c.lessons.map((m, li) => (
                                    <th key={m.slug} title={m.title} className={`px-1 pb-2 text-center ${li === 0 ? 'border-l border-arena-line/60' : ''}`}>
                                        <span className="block font-mono text-xs text-ink">{ci + 1}.{li + 1}</span>
                                        <span className="block font-mono text-[10px] font-normal text-ink-muted">{m.percent}%</span>
                                    </th>
                                )),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id} className="border-b border-arena-line/50 last:border-0 hover:bg-arena-line/20">
                                <td className="sticky left-0 z-10 max-w-44 bg-arena-panel px-4 py-2">
                                    <span className="mr-2 font-mono text-xs text-ink-muted">{r.rank}.</span>
                                    <span className="truncate">{r.name}</span>
                                    <span className="ml-1 font-mono text-[10px] text-ink-muted">#{r.tag}</span>
                                </td>
                                {modules.map((m) => (
                                    <td key={m.slug} className="px-1 py-2">
                                        <Cell status={r.statuses[m.slug]} score={r.scores?.[m.slug]} title={m.title} />
                                    </td>
                                ))}
                                <td className="px-4 py-2 text-right font-mono font-semibold text-gold-500">{r.total_xp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-wrap gap-4 border-t border-arena-line px-4 py-3 text-xs text-ink-muted">
                {LEGEND.map((l) => (
                    <span key={l.key} className="inline-flex items-center gap-2">
                        <span className={`cut-corner-sm h-3 w-5 border ${l.cls}`} /> {l.label}
                    </span>
                ))}
                <span className="ml-auto font-mono">% = siswa yang menyelesaikan sub-materi</span>
            </div>
        </div>
    );
}
