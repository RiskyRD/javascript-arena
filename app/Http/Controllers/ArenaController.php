<?php

namespace App\Http\Controllers;

use App\Actions\BuildLeaderboard;
use App\Actions\CompleteModule;
use App\Actions\EnterArena;
use App\Actions\SkipModule;
use App\Http\Requests\CompleteModuleRequest;
use App\Http\Requests\EnterArenaRequest;
use App\Http\Requests\SkipModuleRequest;
use App\Support\ModuleRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Endpoint siswa. Auth berbasis session_token (localStorage), bukan cookie,
 * sehingga halaman hanya kerangka; data profil dimuat client via /enter-arena.
 */
class ArenaController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Arena/Enter');
    }

    public function map(): Response
    {
        return Inertia::render('Arena/Map');
    }

    public function lesson(string $slug): Response
    {
        $lesson = ModuleRegistry::find($slug) ?? abort(404);

        return Inertia::render('Arena/Lesson', ['lesson' => $lesson]);
    }

    public function enter(EnterArenaRequest $request, EnterArena $action): JsonResponse
    {
        $result = $action->handle($request->validated('session_token'), $request->validated('name'));

        return response()->json($result, $result['returning'] ? 200 : 201);
    }

    public function complete(CompleteModuleRequest $request, CompleteModule $action): JsonResponse
    {
        return response()->json($action->handle(
            $request->student(),
            $request->validated('module_slug'),
            (int) $request->validated('xp_earned'),
        ));
    }

    public function skip(SkipModuleRequest $request, SkipModule $action): JsonResponse
    {
        return response()->json($action->handle($request->student(), $request->validated('module_slug')));
    }

    /** Halaman Inertia untuk browser; JSON untuk fetch dengan Accept: application/json. */
    public function leaderboard(Request $request, BuildLeaderboard $action): JsonResponse|Response
    {
        $data = $action->handle();

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json(['modules' => ModuleRegistry::all(), 'data' => $data]);
        }

        return Inertia::render('Arena/Leaderboard', [
            'leaderboard' => $data,
            'generated_at' => now()->toIso8601String(),
        ]);
    }
}
