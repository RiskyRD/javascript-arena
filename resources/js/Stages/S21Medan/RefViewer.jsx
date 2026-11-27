import { useState } from 'react';
import { ExternalLink, FileText, Gamepad2, Images, PlayCircle, Shapes } from 'lucide-react';
import Gallery from './Gallery';
import { MODULES } from './refAssets';

function Panel({ icon: Icon, title, children, action }) {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                    <Icon className="size-4 text-cyber" /> {title}
                </h3>
                {action}
            </div>
            {children}
        </div>
    );
}

const linkCls = 'inline-flex items-center gap-1.5 text-sm text-cyber hover:text-ink';

/** Viewer dokumen soal: tab per modul → info, PDF, video demo, galeri, ikon asli. */
export default function RefViewer() {
    const [active, setActive] = useState('client');
    const m = MODULES.find((x) => x.id === active);

    return (
        <div className="space-y-6">
            <div role="tablist" className="grid grid-cols-2 gap-2">
                {MODULES.map((x) => (
                    <button
                        key={x.id}
                        role="tab"
                        aria-selected={active === x.id}
                        onClick={() => setActive(x.id)}
                        className={`rounded-md border px-4 py-3 text-left transition-colors ${
                            active === x.id ? 'border-gold-500/70 bg-gold-500/10' : 'border-arena-line hover:border-ink-muted/50'
                        }`}
                    >
                        <span className="block text-sm font-semibold text-ink">{x.name}</span>
                        <span className="block text-xs text-ink-muted">{x.product}</span>
                    </button>
                ))}
            </div>

            <dl className="grid gap-x-6 gap-y-2 rounded-md bg-arena-bg p-4 text-sm sm:grid-cols-2">
                {m.meta.map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                        <dt className="w-24 shrink-0 text-ink-muted">{k}</dt>
                        <dd className="text-ink">{v}</dd>
                    </div>
                ))}
            </dl>

            <Panel icon={FileText} title="Dokumen soal (PDF)" action={<a href={m.pdf} target="_blank" rel="noreferrer" className={linkCls}>Buka di tab baru <ExternalLink className="size-3.5" /></a>}>
                <iframe key={m.pdf} src={m.pdf} title={`PDF ${m.name}`} className="h-[70vh] min-h-96 w-full rounded-md border border-arena-line bg-white" />
                <p className="text-xs text-ink-muted">Kalau PDF tidak tampil (sering terjadi di browser HP), gunakan tautan "Buka di tab baru".</p>
            </Panel>

            {m.video && (
                <Panel icon={PlayCircle} title="Video demo aplikasi jadi">
                    <video key={m.video} src={m.video} controls preload="metadata" className="w-full rounded-md border border-arena-line bg-black" />
                </Panel>
            )}

            <Panel icon={Images} title={m.id === 'client' ? 'Screenshot dari dokumen soal' : 'Wireframe dari dokumen soal'}>
                <Gallery key={m.id} items={m.gallery} />
            </Panel>

            <Panel
                icon={Shapes}
                title="Aset ikon asli yang disediakan"
                action={m.extra && <a href={m.extra.href} target="_blank" rel="noreferrer" className={linkCls}><Gamepad2 className="size-4" /> {m.extra.label}</a>}
            >
                <ul className="flex flex-wrap gap-2">
                    {m.icons.map((ic) => (
                        <li key={ic.src} title={ic.name} className={`flex flex-col items-center gap-1 rounded-md border border-arena-line p-2 ${m.iconTile}`}>
                            <img src={ic.src} alt="" className="size-7" />
                            <span className="max-w-16 truncate font-mono text-[10px] text-ink-muted">{ic.name}</span>
                        </li>
                    ))}
                </ul>
            </Panel>
        </div>
    );
}
