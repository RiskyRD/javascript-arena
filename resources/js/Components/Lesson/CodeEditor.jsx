import { useRef } from 'react';
import { HighlightedCode } from './Code';

const INDENT = '  ';
// Metrik teks HARUS identik antara lapisan warna (pre) dan textarea agar caret pas.
const METRICS = 'm-0 py-3 pr-3 font-mono text-[13.5px] leading-6 whitespace-pre';

/**
 * Editor kode ringan dengan pewarnaan sintaks: lapisan <pre> berwarna di belakang
 * textarea transparan (caret & seleksi tetap dari textarea). Tanpa dependensi.
 * Tab = indent 2 spasi; Esc = keluar dari editor (agar navigasi keyboard tetap bisa).
 */
export default function CodeEditor({ value, onChange, label = 'Editor kode', height = 'h-[28rem]' }) {
    const gutter = useRef(null);
    const layer = useRef(null);
    const lineCount = value.split('\n').length;

    const onKeyDown = (e) => {
        if (e.key === 'Escape') return e.currentTarget.blur();
        if (e.key !== 'Tab' || e.shiftKey) return;
        e.preventDefault();
        const el = e.currentTarget;
        const { selectionStart: start, selectionEnd: end } = el;
        onChange(value.slice(0, start) + INDENT + value.slice(end));
        requestAnimationFrame(() => {
            el.selectionStart = el.selectionEnd = start + INDENT.length;
        });
    };

    const syncScroll = (e) => {
        const { scrollTop, scrollLeft } = e.currentTarget;
        gutter.current.scrollTop = scrollTop;
        layer.current.scrollTop = scrollTop;
        layer.current.scrollLeft = scrollLeft;
    };

    return (
        <div className={`flex overflow-hidden rounded-md border border-arena-line bg-arena-bg focus-within:border-gold-500/50 ${height}`}>
            <pre ref={gutter} aria-hidden className={`${METRICS} overflow-hidden pl-3 text-right text-ink-muted/40 select-none`}>
                {Array.from({ length: lineCount }, (_, i) => i + 1).join('\n')}
            </pre>
            <div className="relative min-w-0 flex-1">
                <pre ref={layer} aria-hidden className={`${METRICS} pointer-events-none absolute inset-0 overflow-hidden`}>
                    <HighlightedCode code={value + '\n'} />
                </pre>
                <textarea
                    aria-label={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onScroll={syncScroll}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    wrap="off"
                    className={`${METRICS} absolute inset-0 size-full resize-none overflow-auto bg-transparent text-transparent caret-gold-500 outline-none selection:bg-cyber/25`}
                />
            </div>
        </div>
    );
}
