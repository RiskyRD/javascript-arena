/** Tier rank berdasarkan total XP (Bab 1 + Bab 2 = 700 XP; naikkan saat bab baru ditambah). Urut dari terendah. */
export const RANKS = [
    { name: 'Rookie', minXp: 0, color: 'text-ink-muted', ring: 'bg-ink-muted/30' },
    { name: 'Tactician', minXp: 150, color: 'text-cyber', ring: 'bg-cyber/50' },
    { name: 'Code Striker', minXp: 350, color: 'text-xp', ring: 'bg-xp/50' },
    { name: 'LKS Champion', minXp: 600, color: 'text-gold-400', ring: 'bg-gold-400/80', glow: true },
];

export function rankFor(xp = 0) {
    return [...RANKS].reverse().find((r) => xp >= r.minXp) ?? RANKS[0];
}

/** Progres menuju rank berikutnya: { current, next, value, max }. */
export function rankProgress(xp = 0) {
    const current = rankFor(xp);
    const next = RANKS[RANKS.indexOf(current) + 1] ?? null;
    if (!next) return { current, next: null, value: 1, max: 1 };
    return { current, next, value: xp - current.minXp, max: next.minXp - current.minXp };
}
