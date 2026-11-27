<?php

namespace App\Http\Requests;

use App\Models\Student;
use App\Support\ModuleRegistry;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteModuleRequest extends FormRequest
{
    private ?Student $student = null;

    protected function prepareForValidation(): void
    {
        $this->merge([
            'session_token' => $this->input('session_token') ?? $this->header('X-Arena-Token'),
        ]);
    }

    public function authorize(): bool
    {
        $this->student = Student::findByToken($this->input('session_token'));

        return $this->student !== null;
    }

    protected function failedAuthorization(): void
    {
        throw new AuthorizationException('Sesi tidak valid. Silakan masuk arena lagi.');
    }

    public function rules(): array
    {
        $max = ModuleRegistry::find((string) $this->input('module_slug'))['max_xp'] ?? 0;

        return [
            'session_token' => ['required', 'string'],
            'module_slug' => ['required', 'string', Rule::in(ModuleRegistry::slugs())],
            'xp_earned' => ['required', 'integer', 'min:0', "max:{$max}"],
        ];
    }

    public function messages(): array
    {
        return [
            'module_slug.in' => 'Modul tidak dikenal.',
            'xp_earned.max' => 'XP melebihi batas modul ini (:max).',
        ];
    }

    public function student(): Student
    {
        return $this->student;
    }
}
