<?php

use App\Http\Controllers\Admin\MonitorController;
use App\Http\Controllers\Admin\PinController;
use App\Http\Controllers\ArenaController;
use App\Http\Middleware\EnsureAdminPin;
use Illuminate\Support\Facades\Route;

// ── Siswa (auth via session_token dari localStorage) ─────────────
Route::get('/', [ArenaController::class, 'home'])->name('home');
Route::get('/arena', [ArenaController::class, 'map'])->name('arena.map');
Route::get('/arena/{slug}', [ArenaController::class, 'lesson'])
    ->where('slug', '[a-z0-9-]+')->name('arena.lesson');
Route::post('/enter-arena', [ArenaController::class, 'enter'])
    ->middleware('throttle:20,1')->name('arena.enter');
Route::post('/progress/complete', [ArenaController::class, 'complete'])
    ->middleware('throttle:60,1')->name('progress.complete');
Route::post('/progress/skip', [ArenaController::class, 'skip'])
    ->middleware('throttle:60,1')->name('progress.skip');
Route::get('/leaderboard', [ArenaController::class, 'leaderboard'])->name('leaderboard');

// ── Guru / Admin (PIN dari .env ADMIN_PIN) ───────────────────────
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [PinController::class, 'show'])->name('login');
    Route::post('/login', [PinController::class, 'store'])->middleware('throttle:5,1');

    Route::middleware(EnsureAdminPin::class)->group(function () {
        Route::get('/monitor', [MonitorController::class, 'index'])->name('monitor');
        Route::post('/reset', [MonitorController::class, 'reset'])->name('reset');
        Route::post('/logout', [PinController::class, 'destroy'])->name('logout');
    });
});
