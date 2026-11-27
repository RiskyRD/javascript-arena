<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArenaApiTest extends TestCase
{
    use RefreshDatabase;

    private function enter(string $name): array
    {
        return $this->postJson('/enter-arena', ['name' => $name])->assertCreated()->json();
    }

    public function test_new_student_gets_token_and_first_module_unlocked(): void
    {
        $res = $this->enter('Budi');

        $this->assertSame(48, strlen($res['session_token']));
        $this->assertSame('Budi', $res['student']['name']);
        $this->assertSame(1, $res['student']['current_streak']);
        $this->assertSame(0, $res['student']['total_xp']);
        $this->assertSame('in_progress', $res['progress'][0]['status']);
        $this->assertSame('locked', $res['progress'][1]['status']);
        // Token mentah tidak disimpan di DB.
        $this->assertDatabaseMissing('students', ['session_token' => $res['session_token']]);
    }

    public function test_existing_token_reloads_same_profile(): void
    {
        $first = $this->enter('Budi');

        $this->postJson('/enter-arena', ['session_token' => $first['session_token']])
            ->assertOk()
            ->assertJsonPath('returning', true)
            ->assertJsonPath('student.id', $first['student']['id']);

        $this->assertSame(1, Student::count());
    }

    public function test_same_name_case_insensitive_gets_different_tag(): void
    {
        $a = $this->enter('Budi');
        $b = $this->enter('BUDI');

        $this->assertNotSame($a['student']['id'], $b['student']['id']);
        $this->assertNotSame($a['student']['tag'], $b['student']['tag']);
    }

    public function test_invalid_token_without_name_is_rejected(): void
    {
        $this->postJson('/enter-arena', ['session_token' => str_repeat('x', 48)])
            ->assertUnprocessable()->assertJsonValidationErrors('name');
    }

    public function test_complete_awards_xp_once_and_unlocks_next(): void
    {
        $token = $this->enter('Sari')['session_token'];
        $payload = ['session_token' => $token, 'module_slug' => 'variabel-tipe-data-objek', 'xp_earned' => 40];

        $this->postJson('/progress/complete', $payload)->assertOk()
            ->assertJsonPath('xp_awarded', 40)
            ->assertJsonPath('student.total_xp', 40)
            ->assertJsonPath('progress.1.status', 'in_progress');

        $this->postJson('/progress/complete', $payload)->assertOk()
            ->assertJsonPath('xp_awarded', 0)
            ->assertJsonPath('already_completed', true)
            ->assertJsonPath('student.total_xp', 40);
    }

    public function test_any_stage_can_be_completed_out_of_order(): void
    {
        $token = $this->enter('Sari')['session_token'];

        $this->postJson('/progress/complete', ['session_token' => $token, 'module_slug' => 'state-render-storage', 'xp_earned' => 10])
            ->assertOk()->assertJsonPath('xp_awarded', 10)
            ->assertJsonPath('progress.0.status', 'in_progress')
            ->assertJsonPath('progress.3.status', 'completed');
    }

    public function test_complete_rejects_unknown_module_bad_xp_and_bad_token(): void
    {
        $token = $this->enter('Sari')['session_token'];

        $this->postJson('/progress/complete', ['session_token' => $token, 'module_slug' => 'tidak-ada', 'xp_earned' => 10])
            ->assertUnprocessable()->assertJsonValidationErrors('module_slug');
        $this->postJson('/progress/complete', ['session_token' => $token, 'module_slug' => 'variabel-tipe-data-objek', 'xp_earned' => 9999])
            ->assertUnprocessable()->assertJsonValidationErrors('xp_earned');
        $this->postJson('/progress/complete', ['session_token' => 'nope', 'module_slug' => 'variabel-tipe-data-objek', 'xp_earned' => 10])
            ->assertForbidden();
    }

    public function test_leaderboard_orders_by_xp_then_earliest_finish(): void
    {
        $slow = $this->enter('Lambat')['session_token'];
        $fast = $this->enter('Cepat')['session_token'];
        $this->enter('Pemula');

        $this->travel(-10)->minutes();
        $this->postJson('/progress/complete', ['session_token' => $fast, 'module_slug' => 'variabel-tipe-data-objek', 'xp_earned' => 50]);
        $this->travelBack();
        $this->postJson('/progress/complete', ['session_token' => $slow, 'module_slug' => 'variabel-tipe-data-objek', 'xp_earned' => 50]);

        $this->getJson('/leaderboard')->assertOk()
            ->assertJsonPath('data.0.name', 'Cepat')
            ->assertJsonPath('data.1.name', 'Lambat')
            ->assertJsonPath('data.2.name', 'Pemula')
            ->assertJsonPath('data.0.completed_modules.0.module_slug', 'variabel-tipe-data-objek')
            ->assertJsonMissingPath('data.0.session_token');
    }
}
