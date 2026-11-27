import { tokenize } from '../../Lib/highlight';

const TOKEN_CLASS = {
    plain: 'text-code',
    comment: 'text-code-comment italic',
    keyword: 'text-code-keyword',
    string: 'text-code-string',
    number: 'text-code-number',
};

/** Span berwarna untuk sepotong kode JS. */
export function HighlightedCode({ code }) {
    return tokenize(code).map((t, i) => (
        <span key={i} className={TOKEN_CLASS[t.type]}>
            {t.text}
        </span>
    ));
}

/** Blok contoh kode statis, dengan keterangan opsional ("✗ naif" / "✓ delegation"). */
export function CodeBlock({ title, tone = 'neutral', children }) {
    const toneCls = { neutral: 'text-ink-muted', good: 'text-xp', bad: 'text-danger' }[tone];
    return (
        <figure className="overflow-hidden rounded-md border border-arena-line/70 bg-arena-bg">
            {title && <figcaption className={`border-b border-arena-line/70 px-4 py-2 font-sans text-xs ${toneCls}`}>{title}</figcaption>}
            <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13.5px] leading-6">
                <HighlightedCode code={children.trim()} />
            </pre>
        </figure>
    );
}

/**
 * Penjelasan kode baris demi baris: tiap langkah = potongan kode + narasi di bawahnya.
 * steps: [{ code: string, note: ReactNode }]
 */
export function CodeWalkthrough({ title, steps }) {
    return (
        <figure className="overflow-hidden rounded-md border border-arena-line/70">
            {title && <figcaption className="border-b border-arena-line/70 bg-arena-bg px-4 py-2 text-xs text-ink-muted">{title}</figcaption>}
            <ol>
                {steps.map((s, i) => (
                    <li key={i} className="border-b border-arena-line/50 last:border-0">
                        <pre className="overflow-x-auto bg-arena-bg px-4 py-3 font-mono text-[13.5px] leading-6">
                            <HighlightedCode code={s.code.trim()} />
                        </pre>
                        <div className="flex gap-3 px-4 py-3.5">
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-500/15 font-mono text-[11px] text-gold-400">
                                {i + 1}
                            </span>
                            <p className="text-[15px] leading-[1.7] text-ink/85">{s.note}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </figure>
    );
}
