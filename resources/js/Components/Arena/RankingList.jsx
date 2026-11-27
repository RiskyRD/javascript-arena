import RankBadge from '../UI/RankBadge';
import XpBar from '../UI/XpBar';

/** Daftar peringkat lengkap; baris siswa aktif disorot. */
export default function RankingList({ rows, meId }) {
    return (
        <ol className="divide-y divide-arena-line/70">
            {rows.map((r) => {
                const me = r.id === meId;
                return (
                    <li
                        key={r.id}
                        id={me ? 'my-rank' : undefined}
                        aria-current={me ? 'true' : undefined}
                        className={`flex items-center gap-3 border-l-2 px-3 py-3 sm:gap-4 sm:px-5 ${
                            me ? 'border-gold-500 bg-gold-500/10' : 'border-transparent'
                        }`}
                    >
                        <span className={`w-8 shrink-0 text-center font-mono text-lg font-bold ${r.rank <= 3 ? 'text-gold-400' : 'text-ink-muted'}`}>
                            {r.rank}
                        </span>
                        <RankBadge xp={r.total_xp} compact />
                        <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-2 truncate font-medium">
                                {r.name}
                                {me && <span className="cut-corner-sm bg-cyber/20 px-1.5 font-mono text-[10px] font-bold text-cyber">KAMU</span>}
                            </p>
                            <p className="font-mono text-xs text-ink-muted">#{r.tag} · {r.completed_count} misi</p>
                        </div>
                        <div className="hidden w-40 sm:block">
                            <XpBar value={r.completion_percent} size="sm" color="gold" />
                        </div>
                        <span className="w-20 shrink-0 text-right font-mono text-sm font-semibold text-gold-500">
                            {r.total_xp.toLocaleString('id-ID')}
                            <span className="ml-1 text-[10px] text-ink-muted">XP</span>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
