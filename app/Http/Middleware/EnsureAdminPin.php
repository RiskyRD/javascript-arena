<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminPin
{
    public const SESSION_KEY = 'arena_admin';

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->session()->get(self::SESSION_KEY) !== true) {
            return redirect()->guest(route('admin.login'));
        }

        return $next($request);
    }
}
