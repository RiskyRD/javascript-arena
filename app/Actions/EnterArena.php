<?php

namespace App\Actions;

use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class EnterArena
{
    /** Karakter tag tanpa huruf/angka yang mirip (0/O, 1/I/L). */
    private const TAG_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    public function __construct(private SyncProgress $sync) {}

    /**
     * @return array{student: array, session_token: string, progress: array, returning: bool}
     */
    public function handle(?string $token, ?string $name): array
    {
        if ($student = Student::findByToken($token)) {
            return $this->respond($student, $token, true);
        }

        if (blank($name)) {
            throw ValidationException::withMessages([
                'name' => 'Sesi tidak ditemukan. Masukkan nama untuk masuk arena.',
            ]);
        }

        $plain = Student::newPlainToken();
        $student = DB::transaction(fn () => $this->createStudent($name, $plain));

        return $this->respond($student, $plain, false);
    }

    private function createStudent(string $name, string $plain): Student
    {
        $name = Str::squish($name);
        $key = mb_strtolower($name);

        return Student::create([
            'name' => $name,
            'name_key' => $key,
            'tag' => $this->uniqueTag($key),
            'session_token' => Student::hashToken($plain),
        ]);
    }

    private function uniqueTag(string $key): string
    {
        do {
            $tag = collect(range(1, 4))
                ->map(fn () => self::TAG_ALPHABET[random_int(0, strlen(self::TAG_ALPHABET) - 1)])
                ->implode('');
        } while (Student::where('name_key', $key)->where('tag', $tag)->exists());

        return $tag;
    }

    private function respond(Student $student, string $plain, bool $returning): array
    {
        $student->registerActivity();
        $student->save();

        return [
            'student' => $student->toProfile(),
            'session_token' => $plain,
            'progress' => $this->sync->handle($student),
            'returning' => $returning,
        ];
    }
}
