<?php

namespace App\Support;

use Illuminate\Support\Collection;

/**
 * Akses baca ke kurikulum di config/arena.php.
 * "Module" di backend = satu sub-materi (unit progres & XP).
 */
class ModuleRegistry
{
    /** Struktur bersarang mentah (Bagian → Bab → Sub-materi), untuk frontend. */
    public static function curriculum(): array
    {
        return config('arena.parts', []);
    }

    /** Daftar datar semua sub-materi sesuai urutan unlock, plus info bab. */
    public static function all(): Collection
    {
        return collect(static::curriculum())
            ->flatMap(fn ($part) => $part['chapters'])
            ->flatMap(fn ($chapter) => collect($chapter['lessons'])->map(fn ($lesson) => [
                ...$lesson,
                'chapter' => $chapter['slug'],
                'chapter_title' => $chapter['title'],
            ]))
            ->values();
    }

    public static function slugs(): array
    {
        return static::all()->pluck('slug')->all();
    }

    public static function find(string $slug): ?array
    {
        return static::all()->firstWhere('slug', $slug);
    }

    public static function count(): int
    {
        return static::all()->count();
    }
}
