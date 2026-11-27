<?php

namespace App\Http\Requests;

use App\Support\ModuleRegistry;
use Illuminate\Validation\Rule;

/** Sama seperti CompleteModuleRequest (auth via session_token), tanpa xp_earned. */
class SkipModuleRequest extends CompleteModuleRequest
{
    public function rules(): array
    {
        return [
            'session_token' => ['required', 'string'],
            'module_slug' => ['required', 'string', Rule::in(ModuleRegistry::slugs())],
        ];
    }
}
