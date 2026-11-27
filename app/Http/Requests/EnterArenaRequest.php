<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnterArenaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Token boleh dikirim lewat body atau header X-Arena-Token.
        $this->merge([
            'session_token' => $this->input('session_token') ?? $this->header('X-Arena-Token'),
            'name' => is_string($this->input('name')) ? trim($this->input('name')) : $this->input('name'),
        ]);
    }

    public function rules(): array
    {
        return [
            'session_token' => ['nullable', 'string', 'max:100'],
            'name' => ['nullable', 'string', 'min:2', 'max:40', "regex:/^[\pL\pN .'\-]+$/u"],
        ];
    }

    public function messages(): array
    {
        return [
            'name.min' => 'Nama minimal 2 karakter.',
            'name.max' => 'Nama maksimal 40 karakter.',
            'name.regex' => 'Nama hanya boleh huruf, angka, spasi, titik, apostrof, atau tanda hubung.',
        ];
    }
}
