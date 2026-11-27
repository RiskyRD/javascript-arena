<?php

namespace App\Actions;

use App\Models\ModuleProgress;
use App\Models\Student;

/**
 * Lewati modul tanpa XP (status `skipped`). Modul yang sudah selesai tidak diubah.
 * Modul yang dilewati tetap bisa diselesaikan nanti untuk mengklaim XP-nya.
 */
class SkipModule
{
    public function __construct(private SyncProgress $sync) {}

    /**
     * @return array{student: array, progress: array, already_completed: bool}
     */
    public function handle(Student $student, string $slug): array
    {
        $this->sync->handle($student);

        $row = $student->progress()->where('module_slug', $slug)->firstOrFail();
        $already = $row->isCompleted();

        if (! $already) {
            $row->update(['status' => ModuleProgress::SKIPPED, 'score' => 0, 'completed_at' => null]);
        }

        $student->registerActivity();
        $student->save();

        return [
            'student' => $student->toProfile(),
            'progress' => $this->sync->handle($student),
            'already_completed' => $already,
        ];
    }
}
