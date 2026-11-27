import { useState } from 'react';
import { Eye, Lightbulb, Loader2, Play, RotateCcw } from 'lucide-react';
import CutButton from '../UI/CutButton';

/** Teks di antara `backtick` ditampilkan sebagai kode. */
export const inlineCode = (text) => text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));

/**
 * Tombol Jalankan / Reset / Petunjuk (bertahap) / Lihat Solusi + kotak petunjuk.
 */
export default function SandboxControls({ running, onRun, onReset, onSolution, hints = [] }) {
    const [shown, setShown] = useState(0);
    const [confirmSolution, setConfirmSolution] = useState(false);

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                <CutButton onClick={onRun} disabled={running} className="min-h-10 px-4 text-xs">
                    {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />} Jalankan Kode
                </CutButton>
                <CutButton variant="secondary" onClick={onReset} className="min-h-10 px-3 text-xs">
                    <RotateCcw className="size-4" /> Reset
                </CutButton>
                {hints.length > 0 && (
                    <CutButton
                        variant="secondary"
                        onClick={() => setShown((n) => Math.min(n + 1, hints.length))}
                        disabled={shown >= hints.length}
                        className="min-h-10 px-3 text-xs"
                    >
                        <Lightbulb className="size-4 text-cyber" /> Petunjuk {shown}/{hints.length}
                    </CutButton>
                )}
                {onSolution && (
                    <CutButton
                        variant="terminal"
                        onClick={() => (confirmSolution ? (onSolution(), setConfirmSolution(false)) : setConfirmSolution(true))}
                        className="min-h-10 text-xs"
                    >
                        <Eye className="size-4" /> {confirmSolution ? 'yakin? kode kamu akan diganti' : 'lihat solusi'}
                    </CutButton>
                )}
            </div>

            {shown > 0 && (
                <ol className="space-y-1 border-l-2 border-cyber bg-cyber/5 py-2 pr-3 pl-4 text-sm">
                    {hints.slice(0, shown).map((h, i) => (
                        <li key={i} className="[&_code]:font-mono [&_code]:text-code">
                            <span className="mr-2 font-mono text-xs text-cyber">#{i + 1}</span>
                            {inlineCode(h)}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
