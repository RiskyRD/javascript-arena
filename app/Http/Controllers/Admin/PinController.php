<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Middleware\EnsureAdminPin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PinController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        if ($request->session()->get(EnsureAdminPin::SESSION_KEY) === true) {
            return redirect()->route('admin.monitor');
        }

        return Inertia::render('Admin/Login', [
            'enabled' => filled(config('arena.admin_pin')),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate(['pin' => ['required', 'string', 'max:32']]);
        $expected = (string) config('arena.admin_pin');

        if ($expected === '' || ! hash_equals($expected, (string) $request->input('pin'))) {
            throw ValidationException::withMessages(['pin' => 'PIN salah.']);
        }

        $request->session()->regenerate();
        $request->session()->put(EnsureAdminPin::SESSION_KEY, true);

        return redirect()->intended(route('admin.monitor'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->session()->forget(EnsureAdminPin::SESSION_KEY);
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
