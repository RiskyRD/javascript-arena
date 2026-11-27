import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import TopBar from '../Components/Arena/TopBar';
import StageNavigator from '../Components/Arena/StageNavigator';
import { useArena } from '../Components/Arena/ArenaSessionProvider';

const PREF_KEY = 'jsarena.sidebar_collapsed';
const isStageUrl = (url) => /^\/arena\/[a-z0-9-]+/.test(url);
const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

/**
 * Kerangka HUD utama halaman siswa (persistent layout):
 *   Page.layout = (page) => <AppLayout>{page}</AppLayout>
 *
 * - Sidebar: lebar penuh ↔ rail. Otomatis rail di halaman Stage; di halaman lain
 *   mengikuti preferensi siswa. Di bawah lg menjadi drawer.
 * - Halaman Stage mendapat area penuh tanpa padding (StageShell mengatur split-pane sendiri).
 */
export default function AppLayout({ children }) {
    const { student, status } = useArena();
    const url = usePage().url.split('?')[0];
    const onStage = isStageUrl(url);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => onStage || localStorage.getItem(PREF_KEY) === '1');

    // Tanpa sesi → kembali ke layar Enter Arena.
    useEffect(() => {
        if (status === 'ready' && !student) router.visit('/', { replace: true });
    }, [status, student]);

    // Masuk Stage → rail (fokus belajar). Keluar Stage → kembali ke preferensi.
    useEffect(() => {
        setCollapsed(onStage || localStorage.getItem(PREF_KEY) === '1');
    }, [onStage]);

    useEffect(() => router.on('navigate', () => setDrawerOpen(false)), []);

    const toggle = () => {
        if (!isDesktop()) return setDrawerOpen((o) => !o);
        setCollapsed((c) => {
            if (!onStage) localStorage.setItem(PREF_KEY, c ? '0' : '1');
            return !c;
        });
    };

    if (!student) {
        return (
            <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-ink-muted">
                <Loader2 className="size-4 animate-spin text-gold-500" /> Memuat arena...
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <TopBar onToggleNav={toggle} navOpen={drawerOpen || !collapsed} />
            <div className="flex">
                <StageNavigator collapsed={collapsed} drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} onToggle={toggle} />
                <main className="min-w-0 flex-1">
                    {onStage ? children : <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</div>}
                </main>
            </div>
        </div>
    );
}
