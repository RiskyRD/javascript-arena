import { Head, useForm } from '@inertiajs/react';
import { KeyRound, Loader2 } from 'lucide-react';
import CutCard from '../../Components/UI/CutCard';
import CutButton from '../../Components/UI/CutButton';

export default function Login({ enabled }) {
    const { data, setData, post, processing, errors } = useForm({ pin: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login', { onFinish: () => setData('pin', '') });
    };

    return (
        <>
            <Head title="Command Center" />
            <main className="flex min-h-screen items-center justify-center px-4">
                <CutCard glow="cyber" className="w-full max-w-sm" innerClassName="p-8">
                    <p className="font-mono text-xs tracking-[0.3em] text-cyber">RESTRICTED // GURU</p>
                    <h1 className="mt-1 mb-6 font-display text-2xl font-bold">Command Center</h1>

                    {!enabled ? (
                        <p className="text-sm text-danger">
                            Admin dinonaktifkan. Set <code className="font-mono text-gold-400">ADMIN_PIN</code> di file .env.
                        </p>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <label htmlFor="pin" className="sr-only">PIN</label>
                            <input
                                id="pin"
                                type="password"
                                inputMode="numeric"
                                autoFocus
                                value={data.pin}
                                onChange={(e) => setData('pin', e.target.value)}
                                placeholder="• • • •"
                                className="cut-corner-sm w-full border border-arena-line bg-arena-bg px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] focus:border-cyber/60 focus:outline-none"
                            />
                            {errors.pin && <p className="text-sm text-danger">{errors.pin}</p>}
                            <CutButton type="submit" className="w-full" disabled={processing || !data.pin}>
                                {processing ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                                Buka Akses
                            </CutButton>
                        </form>
                    )}
                </CutCard>
            </main>
        </>
    );
}
