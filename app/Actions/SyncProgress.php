<?php

namespace App\Actions;

use App\Models\ModuleProgress;
use App\Models\Student;
use App\Support\ModuleRegistry;

/**
 * Pastikan setiap modul di registry punya baris progres untuk siswa, lalu tandai
 * modul pertama yang belum selesai/dilewati sebagai in_progress (rekomendasi berikutnya).
 * Navigasi tidak dikunci: modul mana pun boleh dibuka & diselesaikan.
 */
class SyncProgress
{
    public function handle(Student $student): array
    {
        $existing = $student->progress()->get()->keyBy('module_slug');
        $unlockedNext = false;

        foreach (ModuleRegistry::slugs() as $slug) {
            $row = $existing->get($slug) ?? $student->progress()->create([
                'module_slug' => $slug,
                'status' => ModuleProgress::LOCKED,
            ]);

            if ($row->isCompleted() || $row->status === ModuleProgress::SKIPPED) {
                continue;
            }

            if (! $unlockedNext) {
                $unlockedNext = true;
                if ($row->status === ModuleProgress::LOCKED) {
                    $row->update(['status' => ModuleProgress::IN_PROGRESS]);
                }
            }
        }

        return $this->snapshot($student);
    }

    /** Progres terurut sesuai registry (baris modul yang sudah dihapus dari config diabaikan). */
    public function snapshot(Student $student): array
    {
        $rows = $student->progress()->get()->keyBy('module_slug');

        return collect(ModuleRegistry::slugs())
            ->filter(fn ($slug) => $rows->has($slug))
            ->map(fn ($slug) => $rows[$slug]->toArenaArray())
            ->values()
            ->all();
    }
}
