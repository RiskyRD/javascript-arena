import { AlertTriangle, Eye, Flag, FlaskConical, Footprints, Lightbulb, ListChecks } from 'lucide-react';

export { CodeBlock, CodeWalkthrough } from './Code';

// Alur wajib per stage (skill pedagogy-lks): story → concept → (visual) → bridge → check.
const KINDS = {
    story: { icon: Flag, label: 'Latar belakang · kenapa penting di lomba', accent: 'text-gold-400' },
    concept: { icon: Footprints, label: 'Konsep langkah demi langkah', accent: 'text-cyber' },
    visual: { icon: Eye, label: 'Coba langsung', accent: 'text-xp' },
    bridge: { icon: FlaskConical, label: 'Jembatan ke lab', accent: 'text-xp' },
    check: { icon: ListChecks, label: 'Mini check', accent: 'text-gold-400' },
};

// Hierarki teks bacaan: paragraf 15.5px / line-height 1.7 / maks 65ch. Inline code = biru (text-code).
export const PROSE = [
    'space-y-4 text-[15.5px] leading-[1.7] text-ink/85',
    '[&_p]:max-w-[65ch] [&_li]:max-w-[62ch] [&_strong]:font-semibold [&_strong]:text-ink',
    '[&_code]:rounded-sm [&_code]:bg-arena-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.84em] [&_code]:text-code',
    '[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
].join(' ');

const ACCENT = { gold: 'border-gold-500/50', xp: 'border-xp/60', none: 'border-transparent' };

/** Blok materi: surface gelap bersih, aksen garis tipis kiri, label jenis → judul → isi. */
export function LessonSection({ kind, title, accent = 'gold', children }) {
    const k = KINDS[kind];
    return (
        <section className={`rounded-lg border-l-2 bg-arena-panel/50 px-6 py-7 sm:px-8 ${ACCENT[accent]}`}>
            <p className={`flex items-center gap-2 text-sm font-medium ${k.accent}`}>
                <k.icon className="size-4" /> {k.label}
            </p>
            {title && <h2 className="mt-2 font-display text-xl font-semibold text-ink">{title}</h2>}
            <div className={`mt-5 ${PROSE}`}>{children}</div>
        </section>
    );
}

/** Sub-judul langkah di dalam blok konsep: "Langkah 2 — Dari kata benda ke array". */
export function Step({ n, title }) {
    return (
        <h3 className="!mt-8 flex items-baseline gap-3 font-display text-lg font-semibold text-ink first:!mt-0">
            <span className="font-mono text-sm text-gold-500">Langkah {n}</span>
            {title}
        </h3>
    );
}

/** Kotak "Jebakan lomba" (pitfall) atau tips. */
export function Callout({ kind = 'pitfall', title, children }) {
    const pitfall = kind === 'pitfall';
    const Icon = pitfall ? AlertTriangle : Lightbulb;
    return (
        <aside className={`rounded-md py-3 pr-4 pl-4 ${pitfall ? 'bg-danger/[0.07]' : 'bg-cyber/[0.07]'}`}>
            <p className={`mb-1.5 flex items-center gap-2 text-sm font-semibold ${pitfall ? 'text-danger' : 'text-cyber'}`}>
                <Icon className="size-4" /> {title ?? (pitfall ? 'Jebakan lomba' : 'Tips')}
            </p>
            <div className="space-y-2 text-[14.5px] leading-[1.65] text-ink/85 [&_code]:font-mono [&_code]:text-code">{children}</div>
        </aside>
    );
}
