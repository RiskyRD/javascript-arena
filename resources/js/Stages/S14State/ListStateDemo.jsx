import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Database, MonitorPlay, MousePointerClick, RefreshCw } from 'lucide-react';

const FLOW = [
    { label: 'Aksi', icon: MousePointerClick },
    { label: 'Ubah state', icon: Database },
    { label: 'render()', icon: RefreshCw },
    { label: 'Layar', icon: MonitorPlay },
];
const STEP_MS = 380;
const SAMPLE = ['Telur', 'Susu', 'Roti', 'Apel', 'Beras', 'Teh'];
const INITIAL = { barang: ['Telur'] };

const ACTIONS = [
    { label: 'Tambah barang', code: 'state.barang.push(...)', run: (s) => ({ barang: [...s.barang, SAMPLE[s.barang.length % SAMPLE.length]] }) },
    { label: 'Hapus terakhir', code: 'state.barang.pop()', run: (s) => ({ barang: s.barang.slice(0, -1) }) },
    { label: 'Kosongkan', code: 'state.barang = []', run: () => ({ barang: [] }) },
];

/** Visualizer siklus Aksi → Ubah state → render() → Layar pada daftar belanja. */
export default function ListStateDemo() {
    const [state, setState] = useState(INITIAL);
    const [screen, setScreen] = useState(INITIAL);
    const [step, setStep] = useState(-1);
    const [renders, setRenders] = useState(1);
    const [last, setLast] = useState(null);
    const timers = useRef([]);
    const latest = useRef(INITIAL);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const dispatch = (action) => {
        timers.current.forEach(clearTimeout);
        const next = action.run(latest.current);
        latest.current = next;
        setLast(action.code);
        setStep(0);
        const at = (i, fn) => timers.current.push(setTimeout(fn, STEP_MS * i));
        at(1, () => (setStep(1), setState(next)));
        at(2, () => setStep(2));
        at(3, () => (setStep(3), setScreen(next), setRenders((n) => n + 1)));
        at(6, () => setStep(-1));
    };

    return (
        <div className="space-y-5">
            <div className="flex items-stretch gap-1.5">
                {FLOW.map((n, i) => (
                    <div key={n.label} className="flex min-w-0 flex-1 items-center gap-1.5">
                        <div
                            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-md border px-1 py-2.5 text-center text-xs font-medium transition-all duration-300 ${
                                step === i ? 'scale-105 border-gold-500 bg-gold-500/15 text-gold-400' : step > i ? 'border-xp/50 text-xp' : 'border-arena-line text-ink-muted'
                            }`}
                        >
                            <n.icon className="size-4" /> {n.label}
                        </div>
                        {i < FLOW.length - 1 && <ArrowRight className={`size-3 shrink-0 ${step > i ? 'text-xp' : 'text-arena-line'}`} />}
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2">
                {ACTIONS.map((a) => (
                    <button key={a.label} onClick={() => dispatch(a)} className="min-h-10 rounded-md border border-arena-line px-3 text-sm text-ink hover:border-gold-500/60 hover:text-gold-400">
                        {a.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="mb-1.5 text-sm text-ink-muted">
                        Data (state) {last && <span className="font-mono text-xs text-gold-500">← {last}</span>}
                    </p>
                    <pre className={`h-36 overflow-auto rounded-md border bg-arena-bg p-3 font-mono text-[13px] leading-6 text-code transition-colors ${step === 1 ? 'border-gold-500' : 'border-arena-line'}`}>
                        {`const state = ${JSON.stringify(state, null, 2)};`}
                    </pre>
                </div>
                <div>
                    <p className="mb-1.5 text-sm text-ink-muted">
                        Layar (hasil render) · dipanggil <span className="font-mono text-xp">{renders}×</span>
                    </p>
                    <div className={`flex h-36 flex-wrap content-start gap-1.5 overflow-auto rounded-md border bg-arena-bg p-3 transition-colors ${step === 3 ? 'border-gold-500' : 'border-arena-line'}`}>
                        {screen.barang.map((b, i) => (
                            <span key={i} className="h-fit rounded-full border border-arena-line px-2.5 py-0.5 text-sm">{b}</span>
                        ))}
                        <p className="w-full pt-1 font-mono text-xs text-code">{screen.barang.length} barang</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
