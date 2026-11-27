const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
const STEPS = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
];

/** "5 menit yang lalu" dari string ISO; '—' jika kosong. */
export function timeAgo(iso) {
    if (!iso) return '—';
    const diff = (new Date(iso).getTime() - Date.now()) / 1000;
    for (const [unit, sec] of STEPS) {
        if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
    }
    return 'baru saja';
}
