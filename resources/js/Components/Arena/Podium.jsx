import { Crown } from 'lucide-react';
import RankBadge from '../UI/RankBadge';

// Urutan visual 2 – 1 – 3 ala podium turnamen.
const SLOTS = [
    { place: 2, height: 'h-24 sm:h-32', tone: 'from-slate-300/30 to-slate-300/5', text: 'text-slate-300', border: 'border-slate-300/60' },
    { place: 1, height: 'h-32 sm:h-44', tone: 'from-gold-500/40 to-gold-500/5', text: 'text-gold-400', border: 'border-gold-400' },
    { place: 3, height: 'h-16 sm:h-24', tone: 'from-amber-700/40 to-amber-700/5', text: 'text-amber-600', border: 'border-amber-700/70' },
];

function Contender({ row, slot, isMe }) {
    if (!row) {
        return <p className="pb-3 text-center font-mono text-xs text-ink-muted/50">— kosong —</p>;
    }
    return (
        <div className={`flex flex-col items-center gap-1 pb-3 text-center ${slot.place === 1 ? 'sm:pb-4' : ''}`}>
            {slot.place === 1 && <Crown className="size-6 text-gold-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />}
            <RankBadge xp={row.total_xp} compact />
            <p className="w-full truncate px-1 text-sm font-semibold sm:text-base">{row.name}</p>
            <p className="font-mono text-[10px] text-ink-muted">#{row.tag}</p>
            <p className={`font-mono text-sm font-bold ${slot.text}`}>{row.total_xp.toLocaleString('id-ID')} XP</p>
            {isMe && <span className="cut-corner-sm bg-cyber/20 px-2 font-mono text-[10px] font-bold text-cyber">KAMU</span>}
        </div>
    );
}

export default function Podium({ rows, meId }) {
    return (
        <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
            {SLOTS.map((slot) => {
                const row = rows[slot.place - 1];
                return (
                    <div key={slot.place} className="flex min-w-0 flex-col">
                        <Contender row={row} slot={slot} isMe={row?.id === meId} />
                        <div
                            className={`cut-corner relative flex items-start justify-center border-t-2 bg-gradient-to-b pt-2 ${slot.height} ${slot.tone} ${slot.border} ${
                                row?.id === meId ? 'ring-1 ring-cyber/60' : ''
                            }`}
                        >
                            <span className={`font-display text-4xl font-bold sm:text-6xl ${slot.text}`}>{slot.place}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
