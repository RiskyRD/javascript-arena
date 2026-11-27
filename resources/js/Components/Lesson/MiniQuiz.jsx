import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import CutButton from '../UI/CutButton';
import { CodeBlock, LessonSection } from './Blocks';
import { inlineCode } from './SandboxControls';

const normalize = (s = '') => s.replace(/\s+/g, '').replace(/;+$/, '');

/** true jika jawaban benar. mcq: index opsi; fill: teks dibandingkan tanpa spasi/titik koma akhir. */
const isCorrect = (q, answer) =>
    q.type === 'fill' ? q.accept.some((a) => normalize(a) === normalize(answer)) : answer === q.answer;

function Question({ q, index, answer, onAnswer, checked }) {
    const correct = checked && isCorrect(q, answer);
    const feedback = q.type === 'fill' ? q.explain : q.options[answer]?.explain;

    return (
        <fieldset className="space-y-3 border-t border-arena-line/60 pt-4 first:border-0 first:pt-0">
            <legend className="font-medium text-ink">
                <span className="mr-2 font-mono text-gold-500">Q{index + 1}.</span>
                {inlineCode(q.prompt)}
            </legend>
            {q.code && <CodeBlock>{q.code}</CodeBlock>}

            {q.type === 'fill' ? (
                <input
                    value={answer ?? ''}
                    onChange={(e) => onAnswer(e.target.value)}
                    placeholder="ketik jawaban..."
                    aria-label={`Jawaban Q${index + 1}`}
                    spellCheck={false}
                    className="cut-corner-sm w-full border border-arena-line bg-arena-bg px-3 py-2 font-mono text-sm focus:border-gold-500/60 focus:outline-none sm:w-72"
                />
            ) : (
                <div className="grid gap-2">
                    {q.options.map((opt, i) => (
                        <label
                            key={i}
                            className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
                                answer === i ? 'border-gold-500/70 bg-gold-500/10' : 'border-arena-line hover:border-ink-muted/50'
                            }`}
                        >
                            <input type="radio" name={q.id} checked={answer === i} onChange={() => onAnswer(i)} className="accent-amber-500" />
                            <span className="[&_code]:font-mono [&_code]:text-code">{inlineCode(opt.text)}</span>
                        </label>
                    ))}
                </div>
            )}

            {checked && (
                <p className={`flex items-start gap-2 text-sm ${correct ? 'text-xp' : 'text-danger'}`}>
                    {correct ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <XCircle className="mt-0.5 size-4 shrink-0" />}
                    <span className="[&_code]:font-mono">
                        {correct ? 'Benar! ' : 'Belum tepat. '}
                        {feedback ? inlineCode(feedback) : correct ? '' : (q.hint ?? 'Coba baca ulang materinya.')}
                    </span>
                </p>
            )}
        </fieldset>
    );
}

/**
 * questions: [{ id, type:'mcq', prompt, code?, options:[{text, explain}], answer }
 *            | { id, type:'fill', prompt, code?, accept:[..], explain, hint }]
 */
export default function MiniQuiz({ questions, passed, onPass, title = 'Cek pemahaman sebelum lanjut' }) {
    const [answers, setAnswers] = useState({});
    const [checked, setChecked] = useState(false);
    const allAnswered = questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

    const check = () => {
        setChecked(true);
        if (questions.every((q) => isCorrect(q, answers[q.id]))) onPass();
    };

    return (
        <LessonSection kind="check" title={title} accent={passed ? 'xp' : 'gold'}>
            {passed && <p className="font-mono text-xs text-xp">✓ Mini Check sudah lulus. Boleh dikerjakan ulang untuk latihan.</p>}
            <div className="space-y-5">
                {questions.map((q, i) => (
                    <Question
                        key={q.id}
                        q={q}
                        index={i}
                        answer={answers[q.id]}
                        checked={checked}
                        onAnswer={(a) => {
                            setChecked(false);
                            setAnswers((prev) => ({ ...prev, [q.id]: a }));
                        }}
                    />
                ))}
            </div>
            <CutButton onClick={check} disabled={!allAnswered} className="min-h-10 px-4 text-xs">
                Periksa Jawaban
            </CutButton>
        </LessonSection>
    );
}
