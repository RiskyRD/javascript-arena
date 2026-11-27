import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from './Components/UI/Toast';
import { ArenaSessionProvider } from './Components/Arena/ArenaSessionProvider';

const appName = import.meta.env.VITE_APP_NAME || 'JS Arena';

createInertiaApp({
    title: (title) => (title ? `${title} · ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ToastProvider>
                <ArenaSessionProvider>
                    <App {...props} />
                </ArenaSessionProvider>
            </ToastProvider>,
        );
    },
    progress: { color: '#F59E0B' },
});
