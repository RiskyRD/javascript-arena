<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleProgress extends Model
{
    /** Belum dimulai. Navigasi tetap bebas — nama "locked" dipertahankan demi kompatibilitas data. */
    public const LOCKED = 'locked';
    /** Stage yang direkomendasikan untuk dikerjakan berikutnya. */
    public const IN_PROGRESS = 'in_progress';
    public const COMPLETED = 'completed';
    /** Dilewati tanpa XP; bisa diselesaikan kapan saja untuk klaim XP. */
    public const SKIPPED = 'skipped';

    protected $table = 'module_progress';

    protected $fillable = ['student_id', 'module_slug', 'status', 'score', 'completed_at'];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'completed_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === self::COMPLETED;
    }

    public function toArenaArray(): array
    {
        return [
            'module_slug' => $this->module_slug,
            'status' => $this->status,
            'score' => $this->score,
            'completed_at' => $this->completed_at?->toIso8601String(),
        ];
    }
}
