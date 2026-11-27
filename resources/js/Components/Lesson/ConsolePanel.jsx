import { CheckCircle2, Loader2, Terminal, XCircle } from 'lucide-react';

const LEVEL = { log: 'text-ink', info: 'text-cyber', warn: 'text-gold-500', error: 'text-danger' };

/** Output konsol visual + daftar hasil pengujian otomatis. */
export default function ConsolePanel({ running, logs = [], error, checks = null }) {
    const passed = checks?.filter((c) => c.pass).length ?? 0;

    return (
        <div className="overflow-hidden rounded-md border border-arena-line bg-arena-bg font-mono text-[12.5px]">
            <p className="flex items-center gap-2 border-b border-arena-line px-3 py-1.5 text-[11px] tracking-widest text-ink-muted">
                <Terminal className="size-3.5" /> KONSOL
                {running && <Loader2 className="ml-auto size-3.5 animate-spin text-gold-500" />}
            </p>
            <div className="max-h-48 min-h-20 overflow-y-auto px-3 py-2" aria-live="polite">
                {!logs.length && !error && (
                    <p className="text-ink-muted/50">{running ? 'menjalankan...' : '> tekan "Jalankan Kode" untuk melihat output'}</p>
                )}
                {logs.map((l, i) => (
                    <pre key={i} className={`border-b border-arena-line/30 py-0.5 break-words whitespace-pre-wrap ${LEVEL[l.level] ?? LEVEL.log}`}>
                        {l.text}
                    </pre>
                ))}
                {error && <pre className="py-0.5 whitespace-pre-wrap text-danger">✗ {error}</pre>}
            </div>

            {checks && (
                <div className="border-t border-arena-line px-3 py-2">
                    <p className={`mb-1.5 font-sans text-sm font-medium ${passed === checks.length ? "text-xp" : "text-ink"}`}>
                        Pengujian {passed}/{checks.length}
                    </p>
                    <ul className="space-y-1">
                        {checks.map((c) => (
                            <li key={c.label} className={`flex items-start gap-2 ${c.pass ? 'text-xp' : 'text-ink-muted'}`}>
                                {c.pass ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" /> : <XCircle className="mt-0.5 size-3.5 shrink-0 text-danger/80" />}
                                <span className="font-sans text-[13px]">{c.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
