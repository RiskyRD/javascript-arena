import { useState } from 'react';
import CodeEditor from './CodeEditor';
import ConsolePanel from './ConsolePanel';
import LabFrame from './LabFrame';
import SandboxControls from './SandboxControls';
import { evaluateChecks, runInWorker } from '../../Lib/sandbox/runWorker';

/**
 * Playground kode murni (tanpa DOM) — dijalankan di Web Worker.
 * lab = { title, tasks, starter, solution, hints, epilogue, checks:[{label, test(value, code)}] }
 * preview(value) opsional: visualisasi hasil run terakhir (mis. lapangan mini).
 */
export default function CodeSandbox({ lab, saved, update, onPass, preview }) {
    const [code, setCode] = useState(saved.code ?? lab.starter);
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState(null);

    const changeCode = (next) => {
        setCode(next);
        update({ code: next });
    };

    const run = async () => {
        setRunning(true);
        const r = await runInWorker(code, lab.epilogue);
        const checks = evaluateChecks(lab.checks, r.value, code, Boolean(r.error));
        setResult({ ...r, checks });
        setRunning(false);
        if (checks.every((c) => c.pass)) onPass();
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
                        running={running}
                        onRun={run}
                        onReset={() => {
                            changeCode(lab.starter);
                            setResult(null);
                        }}
                        onSolution={() => changeCode(lab.solution)}
                        hints={lab.hints}
                    />
                    {preview?.(result?.value ?? null)}
                    <ConsolePanel
                        running={running}
                        logs={result?.logs}
                        error={result?.error}
                        checks={result?.checks ?? lab.checks.map((c) => ({ label: c.label, pass: false }))}
                    />
                </>
            }
        />
    );
}
