import { useEffect, useState } from 'react';

const FILL = {
    xp: 'from-xp to-emerald-300',
    gold: 'from-gold-500 to-gold-400',
    cyber: 'from-cyber to-sky-300',
};

/** Progress bar ala XP bar RPG dengan tick tiap 10% dan animasi pengisian. */
export default function XpBar({ value, max = 100, color = 'xp', label, valueLabel, size = 'md' }) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    const height = size === 'sm' ? 'h-1.5' : 'h-2.5';
    // Mulai dari 0 lalu isi ke nilai sebenarnya agar transisi terlihat saat mount & saat XP naik.
    const [shown, setShown] = useState(0);
    useEffect(() => {
        const id = requestAnimationFrame(() => setShown(pct));
        return () => cancelAnimationFrame(id);
    }, [pct]);

    return (
        <div className="w-full">
            {(label || valueLabel) && (
                <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-display font-semibold tracking-wider text-ink uppercase">{label}</span>
                    <span className="font-mono text-ink-muted">{valueLabel ?? `${pct}%`}</span>
                </div>
            )}
            <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                className={`relative w-full overflow-hidden bg-arena-line ${height}`}
            >
                <div
                    className={`h-full bg-gradient-to-r transition-[width] duration-700 ease-out ${FILL[color]}`}
                    style={{ width: `${shown}%` }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(10%-1px),rgb(11_15_25/0.7)_calc(10%-1px),rgb(11_15_25/0.7)_10%)]" />
            </div>
        </div>
    );
}
