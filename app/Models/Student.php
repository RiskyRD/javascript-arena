<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Student extends Model
{
    protected $fillable = ['name', 'name_key', 'tag', 'session_token', 'total_xp', 'current_streak', 'last_active_at'];

    protected $hidden = ['session_token'];

    // Samakan dengan default kolom agar model baru tidak bernilai null sebelum di-refresh.
    protected $attributes = ['total_xp' => 0, 'current_streak' => 0];

    protected function casts(): array
    {
        return [
            'total_xp' => 'integer',
            'current_streak' => 'integer',
            'last_active_at' => 'datetime',
        ];
    }

    public function progress(): HasMany
    {
        return $this->hasMany(ModuleProgress::class);
    }

    public static function hashToken(string $plain): string
    {
        return hash('sha256', $plain);
    }

    public static function findByToken(?string $plain): ?self
    {
        if (! is_string($plain) || strlen($plain) < 20) {
            return null;
        }

        return static::where('session_token', static::hashToken($plain))->first();
    }

    /** Buat token baru, simpan hash-nya, kembalikan token mentah untuk localStorage. */
    public static function newPlainToken(): string
    {
        return Str::random(48);
    }

    /** Perbarui streak harian berdasarkan zona waktu arena, lalu tandai aktif. */
    public function registerActivity(): void
    {
        $tz = config('arena.timezone');
        $today = now($tz)->startOfDay();
        $last = $this->last_active_at?->copy()->setTimezone($tz)->startOfDay();

        $this->current_streak = match (true) {
            $last === null => 1,
            $last->equalTo($today) => max(1, $this->current_streak),
            $last->equalTo($today->copy()->subDay()) => $this->current_streak + 1,
            default => 1,
        };

        $this->last_active_at = now();
    }

    public function toProfile(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'tag' => $this->tag,
            'display_name' => "{$this->name} #{$this->tag}",
            'total_xp' => $this->total_xp,
            'current_streak' => $this->current_streak,
            'last_active_at' => $this->last_active_at?->toIso8601String(),
        ];
    }
}
