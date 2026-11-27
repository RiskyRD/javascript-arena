const VARIANTS = {
    primary: 'cut-corner bg-gold-500 text-arena-bg hover:bg-gold-400 font-bold uppercase tracking-widest',
    secondary: 'cut-corner-sm border border-arena-line text-ink hover:border-gold-500/60 hover:text-gold-400',
    danger: 'cut-corner-sm border border-danger/50 text-danger hover:bg-danger/10',
    terminal: 'font-mono text-cyber hover:text-ink before:content-[">_"] before:mr-1',
};

export default function CutButton({ variant = 'primary', className = '', type = 'button', children, ...props }) {
    return (
        <button
            type={type}
            className={`inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
