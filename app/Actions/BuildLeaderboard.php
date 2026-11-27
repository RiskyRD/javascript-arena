<?php

namespace App\Actions;

use App\Models\ModuleProgress;
use App\Models\Student;
use App\Support\ModuleRegistry;

/**
 * Urutan: total_xp tertinggi → siapa yang lebih dulu mencapai XP tsb
 * (completed_at terakhir paling awal) → siswa tanpa penyelesaian di akhir.
 */
class BuildLeaderboard
{
    public function handle(): array
    {
        $slugs = ModuleRegistry::slugs();
        $total = max(count($slugs), 1);

        return Student::query()
            ->with('progress')
            ->withMax(['progress as last_completed_at' => fn ($q) => $q->where('status', ModuleProgress::COMPLETED)], 'completed_at')
            ->orderByDesc('total_xp')
            ->orderByRaw('last_completed_at is null')
            ->orderBy('last_completed_at')
            ->orderBy('id')
            ->get()
            ->values()
            ->map(function (Student $s, int $i) use ($slugs, $total) {
                $rows = $s->progress->keyBy('module_slug');
                $completed = $s->progress
                    ->filter(fn ($p) => $p->isCompleted() && in_array($p->module_slug, $slugs, true))
                    ->sortBy('completed_at');

                return [
                    'rank' => $i + 1,
                    ...$s->toProfile(),
                    'last_completed_at' => $completed->last()?->completed_at?->toIso8601String(),
                    'completed_count' => $completed->count(),
                    'skipped_count' => $s->progress->where('status', ModuleProgress::SKIPPED)->whereIn('module_slug', $slugs)->count(),
                    'completion_percent' => (int) round($completed->count() / $total * 100),
                    'completed_modules' => $completed->map->toArenaArray()->values()->all(),
                    'statuses' => collect($slugs)
                        ->mapWithKeys(fn ($slug) => [$slug => $rows[$slug]->status ?? ModuleProgress::LOCKED])
                        ->all(),
                    'scores' => $completed->mapWithKeys(fn ($p) => [$p->module_slug => $p->score])->all(),
                ];
            })
            ->all();
    }
}
