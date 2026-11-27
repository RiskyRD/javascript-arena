/** Helper murni untuk struktur kurikulum (Bagian → Bab → Sub-materi). */

export const pad2 = (n) => String(n).padStart(2, '0');

/** Semua sub-materi datar, dengan nomor bab & nomor sub ("2.3"). */
export function flattenLessons(parts = []) {
    return parts.flatMap((part) =>
        part.chapters.flatMap((chapter, ci) =>
            chapter.lessons.map((lesson, li) => ({
                ...lesson,
                chapter: chapter.slug,
                chapterTitle: chapter.title,
                code: `${ci + 1}.${li + 1}`,
            })),
        ),
    );
}

export const statusOf = (bySlug, slug) => bySlug[slug]?.status ?? 'locked';

export function chapterStats(chapter, bySlug) {
    const done = chapter.lessons.filter((l) => statusOf(bySlug, l.slug) === 'completed').length;
    return { done, total: chapter.lessons.length };
}

/** Sub-materi yang sedang dipelajari (in_progress), atau null jika semua selesai. */
export function currentLesson(parts, bySlug) {
    return flattenLessons(parts).find((l) => statusOf(bySlug, l.slug) === 'in_progress') ?? null;
}

export function neighbours(parts, slug) {
    const list = flattenLessons(parts);
    const i = list.findIndex((l) => l.slug === slug);
    return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null, current: list[i] ?? null };
}
