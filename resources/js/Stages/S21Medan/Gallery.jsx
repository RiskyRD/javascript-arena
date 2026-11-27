import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/** Galeri screenshot/wireframe dengan lightbox (Esc untuk menutup, panah kiri/kanan untuk berpindah). */
export default function Gallery({ items }) {
    const [open, setOpen] = useState(null);

    useEffect(() => {
        if (open === null) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(null);
            if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % items.length);
            if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + items.length) % items.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, items.length]);

    return (
        <>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {items.map((it, i) => (
                    <li key={it.src}>
                        <button onClick={() => setOpen(i)} className="group block w-full text-left">
                            <img
                                src={it.src}
                                alt={it.caption}
                                loading="lazy"
                                className="aspect-video w-full rounded-md border border-arena-line bg-white object-cover object-top transition-colors group-hover:border-gold-500/60"
                            />
                            <span className="mt-1.5 block text-xs leading-snug text-ink-muted group-hover:text-ink">{it.caption}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {open !== null && (
                <div role="dialog" aria-modal="true" aria-label={items[open].caption} className="fixed inset-0 z-50 flex flex-col bg-arena-bg/95 p-4 backdrop-blur" onClick={() => setOpen(null)}>
                    <div className="flex items-center justify-between gap-3 pb-3 text-sm text-ink">
                        <span>
                            <span className="mr-2 font-mono text-gold-500">{open + 1}/{items.length}</span>
                            {items[open].caption}
                        </span>
                        <button aria-label="Tutup" className="grid size-10 place-items-center rounded-md hover:bg-arena-line/60">
                            <X className="size-5" />
                        </button>
                    </div>
                    <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <button aria-label="Sebelumnya" onClick={() => setOpen((open - 1 + items.length) % items.length)} className="absolute left-0 z-10 grid size-11 place-items-center rounded-full bg-arena-panel/80 hover:text-gold-400">
                            <ChevronLeft className="size-6" />
                        </button>
                        <img src={items[open].src} alt={items[open].caption} className="max-h-full max-w-full rounded-md bg-white object-contain" />
                        <button aria-label="Berikutnya" onClick={() => setOpen((open + 1) % items.length)} className="absolute right-0 z-10 grid size-11 place-items-center rounded-full bg-arena-panel/80 hover:text-gold-400">
                            <ChevronRight className="size-6" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
