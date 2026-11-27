<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgressSkipTest extends TestCase
{
    use RefreshDatabase;

    private function token(): string
    {
        return $this->postJson('/enter-arena', ['name' => 'Sari'])->json('session_token');
    }

    public function test_skip_marks_skipped_without_xp_and_moves_recommendation(): void
    {
        $t = $this->token();

        $this->postJson('/progress/skip', ['session_token' => $t, 'module_slug' => 'variabel-tipe-data-objek'])
            ->assertOk()
            ->assertJsonPath('student.total_xp', 0)
            ->assertJsonPath('progress.0.status', 'skipped')
            ->assertJsonPath('progress.1.status', 'in_progress');
    }

    public function test_skipped_stage_can_be_completed_later_for_xp(): void
    {
        $t = $this->token();
        $this->postJson('/progress/skip', ['session_token' => $t, 'module_slug' => 'variabel-tipe-data-objek']);

        $this->postJson('/progress/complete', ['session_token' => $t, 'module_slug' => 'variabel-tipe-data-objek', 'xp_earned' => 100])
            ->assertOk()
            ->assertJsonPath('xp_awarded', 100)
            ->assertJsonPath('progress.0.status', 'completed');
    }

    public function test_skipping_completed_stage_keeps_it_completed(): void
    {
        $t = $this->token();
        $this->postJson('/progress/complete', ['session_token' => $t, 'module_slug' => 'variabel-tipe-data-objek', 'xp_earned' => 100]);

        $this->postJson('/progress/skip', ['session_token' => $t, 'module_slug' => 'variabel-tipe-data-objek'])
            ->assertOk()
            ->assertJsonPath('already_completed', true)
            ->assertJsonPath('progress.0.status', 'completed')
            ->assertJsonPath('student.total_xp', 100);
    }

    public function test_skip_requires_valid_token_and_known_module(): void
    {
        $t = $this->token();
        $this->postJson('/progress/skip', ['session_token' => 'nope', 'module_slug' => 'variabel-tipe-data-objek'])->assertForbidden();
        $this->postJson('/progress/skip', ['session_token' => $t, 'module_slug' => 'tidak-ada'])->assertUnprocessable();
    }

    public function test_leaderboard_exposes_skipped_status_for_monitor(): void
    {
        $t = $this->token();
        $this->postJson('/progress/skip', ['session_token' => $t, 'module_slug' => 'dom-event']);

        $this->getJson('/leaderboard')
            ->assertJsonPath('data.0.statuses.dom-event', 'skipped')
            ->assertJsonPath('data.0.skipped_count', 1)
            ->assertJsonPath('data.0.completed_count', 0);
    }
}
