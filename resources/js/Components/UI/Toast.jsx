import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, Trophy, X, XCircle } from 'lucide-react';

const ToastContext = createContext(() => {});
const MAX_TOASTS = 3;

const VARIANTS = {
    success: { icon: CheckCircle2, color: 'text-xp', bar: 'bg-xp' },
    info: { icon: Info, color: 'text-cyber', bar: 'bg-cyber' },
    warning: { icon: AlertTriangle, color: 'text-gold-500', bar: 'bg-gold-500' },
    achievement: { icon: Trophy, color: 'text-gold-400', bar: 'bg-gold-400' },
    error: { icon: XCircle, color: 'text-danger', bar: 'bg-danger' },
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(0);

    const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

    const toast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
        const id = ++nextId.current;
        setToasts((t) => [...t, { id, type, title, message, duration }].slice(-MAX_TOASTS));
    }, []);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div
                aria-live="polite"
                className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-4 sm:bottom-6 sm:items-end"
            >
                {toasts.map((t) => (
                    <ToastItem key={t.id} {...t} onDone={() => dismiss(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ type, title, message, duration, onDone }) {
    const [paused, setPaused] = useState(false);
    const v = VARIANTS[type] ?? VARIANTS.info;
    const Icon = v.icon;

    return (
        <div
            role="status"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="cut-corner-sm pointer-events-auto relative w-full max-w-sm overflow-hidden border border-arena-line bg-arena-panel/95 shadow-xl backdrop-blur"
        >
            <div className="flex items-start gap-3 p-4 pr-10">
                <Icon className={`mt-0.5 size-5 shrink-0 ${v.color}`} />
                <div className="min-w-0">
                    {title && <p className="font-display text-sm font-semibold text-ink">{title}</p>}
                    {message && <p className="text-sm text-ink-muted">{message}</p>}
                </div>
            </div>
            <button onClick={onDone} aria-label="Tutup" className="absolute top-3 right-3 text-ink-muted hover:text-ink">
                <X className="size-4" />
            </button>
            <div
                className={`animate-shrink absolute bottom-0 left-0 h-[3px] w-full origin-left ${v.bar}`}
                style={{ animationDuration: `${duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                onAnimationEnd={onDone}
            />
        </div>
    );
}

export const useToast = () => useContext(ToastContext);
