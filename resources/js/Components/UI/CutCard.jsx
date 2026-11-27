const GLOW = {
    none: 'bg-arena-line',
    gold: 'bg-gradient-to-br from-gold-500/70 via-arena-line to-gold-400/40 drop-shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    xp: 'bg-gradient-to-br from-xp/70 via-arena-line to-xp/30 drop-shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    cyber: 'bg-gradient-to-br from-cyber/60 via-arena-line to-cyber/30 drop-shadow-[0_0_12px_rgba(56,189,248,0.2)]',
};

/**
 * Panel ber-sudut terpotong. Wrapper luar = "border" 1px bercahaya,
 * karena clip-path memotong border & box-shadow biasa.
 */
export default function CutCard({ glow = 'none', className = '', innerClassName = '', children }) {
    return (
        <div className={`cut-corner p-px transition-all duration-200 ${GLOW[glow]} ${className}`}>
            <div className={`cut-corner h-full bg-arena-panel ${innerClassName}`}>{children}</div>
        </div>
    );
}
