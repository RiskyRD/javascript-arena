import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import CutButton from '../UI/CutButton';

/** Reset seluruh data siswa — butuh mengetik "RESET". */
export default function ResetPanel() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ confirm: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/reset', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    if (!open) {
        return (
            <CutButton variant="danger" onClick={() => setOpen(true)}>
                <RotateCcw className="size-4" /> Reset Data
            </CutButton>
        );
    }

    return (
        <form onSubmit={submit} className="flex flex-wrap items-start gap-2">
            <div>
                <input
                    autoFocus
                    value={data.confirm}
                    onChange={(e) => setData('confirm', e.target.value)}
                    placeholder="Ketik RESET"
                    aria-label="Konfirmasi reset"
                    className="cut-corner-sm min-h-11 w-36 border border-danger/50 bg-arena-bg px-3 font-mono text-sm focus:outline-none"
                />
                {errors.confirm && <p className="mt-1 text-xs text-danger">{errors.confirm}</p>}
            </div>
            <CutButton type="submit" variant="danger" disabled={processing || data.confirm !== 'RESET'}>
                <AlertTriangle className="size-4" /> Hapus Semua
            </CutButton>
            <CutButton variant="secondary" onClick={() => { reset(); setOpen(false); }}>Batal</CutButton>
        </form>
    );
}
