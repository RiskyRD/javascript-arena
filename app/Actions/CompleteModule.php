<?php

namespace App\Actions;

use App\Models\ModuleProgress;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class CompleteModule
{
    public function __construct(private SyncProgress $sync) {}

    /**
     * Tandai modul selesai dan tambahkan XP sekali saja per modul.
     *
     * @return array{student: array, progress: array, xp_awarded: int, already_completed: bool}
     */
    public function handle(Student $student, string $slug, int $xp): array
    {
        $this->sync->handle($student);

        $already = DB::transaction(function () use ($student, $slug, $xp) {
            $row = ModuleProgress::where('student_id', $student->id)
                ->where('module_slug', $slug)
                ->lockForUpdate()
                ->firstOrFail();

            if ($row->isCompleted()) {
                return true;
            }

            // Navigasi bebas: modul belum dimulai atau yang pernah dilewati tetap boleh diselesaikan.
            $row->update([
                'status' => ModuleProgress::COMPLETED,
                'score' => $xp,
                'completed_at' => now(),
            ]);

            $student->increment('total_xp', $xp);

            return false;
        });

        $student->refresh();
        $student->registerActivity();
        $student->save();

        return [
            'student' => $student->toProfile(),
            'progress' => $this->sync->handle($student),
            'xp_awarded' => $already ? 0 : $xp,
            'already_completed' => $already,
        ];
    }
}
