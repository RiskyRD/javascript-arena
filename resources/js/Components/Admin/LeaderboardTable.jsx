import { Flame } from 'lucide-react';
import RankBadge from '../UI/RankBadge';
import XpBar from '../UI/XpBar';
import { timeAgo } from '../../Lib/time';

const PODIUM = ['text-gold-400', 'text-ink', 'text-amber-700'];

function Operative({ row }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <RankBadge xp={row.total_xp} compact />
            <div className="min-w-0">
                <p className="truncate font-medium">{row.name}</p>
                <p className="font-mono text-xs text-ink-muted">#{row.tag}</p>
            </div>
        </div>
    );
}

export default function LeaderboardTable({ rows }) {
    if (!rows.length) {
        return <p className="p-8 text-center font-mono text-sm text-ink-muted">Belum ada siswa yang masuk arena.</p>;
    }

    return (
        <>
            {/* Mobile: daftar kartu */}
            <ul className="divide-y divide-arena-line md:hidden">
                {rows.map((r) => (
                    <li key={r.id} className="space-y-3 p-4">
                        <div className="flex items-center gap-3">
                            <span className={`w-8 font-mono text-lg font-bold ${PODIUM[r.rank - 1] ?? 'text-ink-muted'}`}>{r.rank}</span>
                            <Operative row={r} />
                            <span className="ml-auto font-mono text-gold-500">{r.total_xp} XP</span>
                        </div>
                        <XpBar value={r.completion_percent} size="sm" label="Progres" />
                    </li>
                ))}
            </ul>

            {/* Desktop: tabel */}
            <table className="hidden w-full text-left text-sm md:table">
                <thead className="font-display text-xs tracking-widest text-ink-muted uppercase">
                    <tr className="border-b border-arena-line">
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Siswa</th>
                        <th className="px-4 py-3 text-right">XP</th>
                        <th className="w-48 px-4 py-3">Penyelesaian</th>
                        <th className="px-4 py-3">Streak</th>
                        <th className="px-4 py-3">Aktif</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-b border-arena-line/60 transition-colors last:border-0 hover:bg-arena-line/30">
                            <td className={`px-4 py-3 font-mono text-lg font-bold ${PODIUM[r.rank - 1] ?? 'text-ink-muted'}`}>{r.rank}</td>
                            <td className="px-4 py-3"><Operative row={r} /></td>
                            <td className="px-4 py-3 text-right font-mono text-gold-500">{r.total_xp.toLocaleString('id-ID')}</td>
                            <td className="px-4 py-3">
                                <XpBar value={r.completion_percent} size="sm" valueLabel={`${r.completed_count} modul · ${r.completion_percent}%`} label=" " />
                            </td>
                            <td className="px-4 py-3 font-mono">
                                <span className="inline-flex items-center gap-1"><Flame className="size-4 text-gold-500" />{r.current_streak}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-ink-muted">{timeAgo(r.last_active_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
