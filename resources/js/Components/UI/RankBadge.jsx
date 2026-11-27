import { Shield } from 'lucide-react';
import { rankFor } from '../../Lib/rank';

const HEX = 'polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)';

/** Badge heksagon rank. `compact` = hanya ikon, untuk tabel. */
export default function RankBadge({ xp = 0, compact = false }) {
    const rank = rankFor(xp);

    const hex = (
        <span
            className={`grid size-8 shrink-0 place-items-center p-px ${rank.ring} ${rank.glow ? 'animate-pulse' : ''}`}
            style={{ clipPath: HEX }}
            title={rank.name}
        >
            <span className="grid size-full place-items-center bg-arena-bg" style={{ clipPath: HEX }}>
                <Shield className={`size-4 ${rank.color}`} />
            </span>
        </span>
    );

    if (compact) return hex;

    return (
        <span className="inline-flex items-center gap-2">
            {hex}
            <span className={`font-display text-xs font-semibold tracking-widest uppercase ${rank.color}`}>{rank.name}</span>
        </span>
    );
}
