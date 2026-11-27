import { useEffect, useMemo, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import ConsolePanel from './ConsolePanel';
import LabFrame from './LabFrame';
import SandboxControls from './SandboxControls';
import { buildLabDocument, LAB_MESSAGE_SOURCE } from '../../Lib/sandbox/labDocument';

/**
 * Mini-lab DOM: kode siswa dijalankan di iframe sandbox berisi HTML lab,
 * lalu pengujian otomatis (lab.tests) mensimulasikan klik dan memeriksa hasilnya.
 * Setelah pengujian, pratinjau tetap interaktif untuk dicoba manual.
 */
export default function DomLab({ lab, saved, update, onPass }) {
    const [code, setCode] = useState(saved.code ?? lab.starter);
    const [ran, setRan] = useState(null); // { code, id } untuk run terakhir
    const [logs, setLogs] = useState([]);
    const [outcome, setOutcome] = useState(null);
    const frame = useRef(null);
    const onPassRef = useRef(onPass);
    onPassRef.current = onPass;

    const srcDoc = useMemo(
        () => buildLabDocument({ html: lab.html, css: lab.css, code: ran?.code ?? "", tests: ran ? lab.tests : null, api: lab.api ?? null }),
        [ran, lab],
    );

    useEffect(() => {
        const onMessage = (e) => {
            if (e.source !== frame.current?.contentWindow || e.data?.source !== LAB_MESSAGE_SOURCE) return;
            if (e.data.kind === 'log') return setLogs((l) => [...l.slice(-49), { level: e.data.level, text: e.data.text }]);
            const checks = e.data.error ? lab.checkLabels.map((label) => ({ label, pass: false })) : e.data.results;
            setOutcome({ error: e.data.error, checks });
            if (!e.data.error && checks.length && checks.every((c) => c.pass)) onPassRef.current();
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [lab]);

    const changeCode = (next) => {
        setCode(next);
        update({ code: next });
    };

    const run = () => {
        setLogs([]);
        setOutcome(null);
        setRan({ code, id: Date.now() });
    };

    return (
        <LabFrame
            title={lab.title}
            passed={saved.labPassed}
            tasks={lab.tasks}
            editor={<CodeEditor value={code} onChange={changeCode} label={lab.title} />}
            footer={
                <>
                    <SandboxControls
                        running={Boolean(ran) && !outcome}
                        onRun={run}
                        onReset={() => {
                            changeCode(lab.starter);
                            setRan(null);
                            setOutcome(null);
                            setLogs([]);
                        }}
                        onSolution={() => changeCode(lab.solution)}
                        hints={lab.hints}
                    />
                    <div>
                        <p className="mb-1.5 text-sm text-ink-muted">Pratinjau — bisa diklik setelah kode dijalankan</p>
                        <iframe
                            key={ran?.id ?? 'idle'}
                            ref={frame}
                            title="Pratinjau lab"
                            sandbox="allow-scripts"
                            srcDoc={srcDoc}
                            className="h-36 w-full rounded-md border border-arena-line bg-arena-bg"
                        />
                    </div>
                    <ConsolePanel
                        logs={logs}
                        error={outcome?.error}
                        checks={outcome?.checks ?? lab.checkLabels.map((label) => ({ label, pass: false }))}
                    />
                </>
            }
        />
    );
}
