<?php

namespace App\Http\Controllers\Admin;

use App\Actions\BuildLeaderboard;
use App\Http\Controllers\Controller;
use App\Models\ModuleProgress;
use App\Models\Student;
use App\Support\ModuleRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MonitorController extends Controller
{
    public function index(BuildLeaderboard $leaderboard): Response
    {
        $rows = $leaderboard->handle();
        $students = max(count($rows), 1);

        $moduleStats = ModuleRegistry::all()->map(fn ($m) => [
            ...$m,
            'completed' => $done = collect($rows)->where("statuses.{$m['slug']}", ModuleProgress::COMPLETED)->count(),
            'percent' => (int) round($done / $students * 100),
        ]);

        return Inertia::render('Admin/Monitor', [
            'modules' => $moduleStats,
            'leaderboard' => $rows,
            'stats' => [
                'students' => count($rows),
                'active_today' => Student::where('last_active_at', '>=', now(config('arena.timezone'))->startOfDay())->count(),
                'total_xp' => (int) Student::sum('total_xp'),
            ],
            'generated_at' => now()->toIso8601String(),
        ]);
    }

    public function reset(Request $request): RedirectResponse
    {
        $request->validate(['confirm' => ['required', 'in:RESET']], [
            'confirm.in' => 'Ketik RESET untuk mengonfirmasi.',
        ]);

        DB::transaction(function () {
            ModuleProgress::query()->delete();
            Student::query()->delete();
        });

        return back()->with('toast', ['type' => 'warning', 'message' => 'Semua data siswa & progres telah direset.']);
    }
}
