import { CheckCircle2, SquareTerminal } from 'lucide-react';
import { inlineCode } from './SandboxControls';

/**
 * Kartu Live Code di Zona Praktik, urutan dari atas ke bawah:
 *   judul + status → daftar misi ringkas → editor lebar → tombol aksi, pratinjau, konsol.
 */
export default function LabFrame({ title, passed, tasks = [], editor, footer }) {
    return (
        <section className={`overflow-hidden rounded-lg border bg-arena-panel/50 ${passed ? 'border-xp/40' : 'border-arena-line'}`}>
            <header className="border-b border-arena-line px-6 py-5 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                        <SquareTerminal className="size-5 text-xp" /> {title}
                    </h2>
                    {passed && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-xp/15 px-2.5 py-1 text-sm font-semibold text-xp">
                            <CheckCircle2 className="size-4" /> Latihan lulus
                        </span>
                    )}
                </div>
                {tasks.length > 0 && (
                    <ol className="mt-4 space-y-2 text-[15px] leading-relaxed text-ink/85">
                        {tasks.map((t, i) => (
                            <li key={i} className="flex gap-3 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-code">
                                <span className="mt-0.5 font-mono text-sm text-gold-500">{i + 1}.</span>
                                <span>{inlineCode(t)}</span>
                            </li>
                        ))}
                    </ol>
                )}
            </header>

            <div className="px-6 pt-5 sm:px-8">{editor}</div>
            <div className="space-y-5 px-6 py-5 sm:px-8">{footer}</div>
        </section>
    );
}
