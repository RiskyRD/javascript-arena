import { useEffect, useRef, useState } from 'react';
import { MousePointerClick } from 'lucide-react';

const COLORS = [
    { warna: 'kuning', label: 'Kuning', dot: 'bg-amber-300' },
    { warna: 'biru', label: 'Biru', dot: 'bg-sky-300' },
    { warna: 'merah', label: 'Merah', dot: 'bg-rose-300' },
    { warna: 'hijau', label: 'Hijau', dot: 'bg-emerald-300' },
];
const STEP_MS = 450;

/** Visualizer: klik tombol → lihat event "naik" dari titik → tombol → kotak pembungkus. */
export default function BubblingDemo() {
    const [path, setPath] = useState(null); // { onDot, warna, step }
    const timers = useRef([]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const fire = (e, warna) => {
        timers.current.forEach(clearTimeout);
        const onDot = Boolean(e.target.closest('[data-dot]'));
        setPath({ onDot, warna, step: 0 });
        timers.current = Array.from({ length: onDot ? 3 : 2 }, (_, i) =>
            setTimeout(() => setPath((p) => p && { ...p, step: i + 1 }), STEP_MS * (i + 1)),
        );
    };

    const nodes = path
        ? [
              ...(path.onDot ? [{ label: 'span.titik', note: 'e.target — elemen yang benar-benar tersentuh mouse' }] : []),
              { label: `button[data-warna="${path.warna}"]`, note: path.onDot ? '← closest() berhenti di sini' : 'e.target = tombol itu sendiri' },
              { label: 'div#pilihan-warna', note: 'satu-satunya listener menangkap klik ✓' },
          ]
        : [];

    return (
        <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm text-ink-muted">
                <MousePointerClick className="size-4 text-cyber" /> Klik tombol — coba klik tepat di <strong>titik warnanya</strong>, lalu di
                tulisannya.
            </p>
            <div className="flex flex-wrap gap-2 rounded-md border border-dashed border-arena-line bg-arena-bg p-3">
                {COLORS.map((c) => (
                    <button
                        key={c.warna}
                        onClick={(e) => fire(e, c.warna)}
                        className={`flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
                            path?.warna === c.warna ? 'border-gold-500 text-gold-400' : 'border-arena-line text-ink-muted hover:text-ink'
                        }`}
                    >
                        <span data-dot className={`size-4 rounded-full ${c.dot}`} />
                        {c.label}
                    </button>
                ))}
            </div>

            <ol className="space-y-2 font-mono text-xs" aria-live="polite">
                {nodes.map((n, i) => (
                    <li
                        key={n.label}
                        className={`flex flex-wrap items-center gap-2 rounded-r-md border-l-2 px-3 py-2 transition-all duration-300 ${
                            path.step > i ? 'border-gold-500 bg-gold-500/10 text-code' : 'border-arena-line text-ink-muted/40'
                        }`}
                    >
                        {i > 0 && <span className="text-gold-500">↑</span>}
                        <span>{n.label}</span>
                        <span className="font-sans text-xs text-ink-muted">{n.note}</span>
                    </li>
                ))}
                {!path && <li className="text-ink-muted/60">// jalur klik akan muncul di sini</li>}
            </ol>
        </div>
    );
}
