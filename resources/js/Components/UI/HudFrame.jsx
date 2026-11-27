const CORNERS = [
    'top-0 left-0 border-t-2 border-l-2',
    'top-0 right-0 border-t-2 border-r-2',
    'bottom-0 left-0 border-b-2 border-l-2',
    'bottom-0 right-0 border-b-2 border-r-2',
];

/** Bingkai siku HUD di keempat sudut, untuk layar penyambut / panel penting. */
export default function HudFrame({ className = '', children }) {
    return (
        <div className={`relative p-6 sm:p-10 ${className}`}>
            {CORNERS.map((c) => (
                <span key={c} aria-hidden className={`pointer-events-none absolute size-6 border-gold-500/80 ${c}`} />
            ))}
            {children}
        </div>
    );
}
