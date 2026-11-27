import { Head, usePage } from '@inertiajs/react';
import { Construction } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import { neighbours } from '../../Lib/curriculum';
import STAGES from '../../Stages';

/** Halaman satu Stage. Navigasi bebas: semua stage bisa dibuka kapan saja. */
export default function Lesson({ lesson }) {
    const { curriculum } = usePage().props;
    const { current } = neighbours(curriculum, lesson.slug);
    const Stage = STAGES[lesson.slug];

    if (!Stage) {
        return (
            <div className="mx-auto max-w-lg space-y-4 px-6 py-20 text-center">
                <Head title={lesson.title} />
                <Construction className="mx-auto size-10 text-ink-muted" />
                <h1 className="font-display text-2xl font-bold">{lesson.title}</h1>
                <p className="text-ink-muted">Konten chapter ini sedang disiapkan.</p>
            </div>
        );
    }

    // key → state lab/quiz direset bersih saat berpindah stage.
    return <Stage key={lesson.slug} lesson={lesson} code={current?.code} />;
}

Lesson.layout = (page) => <AppLayout>{page}</AppLayout>;
