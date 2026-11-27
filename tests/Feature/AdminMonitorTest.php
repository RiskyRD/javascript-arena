<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMonitorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['arena.admin_pin' => '2026']);
    }

    public function test_monitor_requires_pin(): void
    {
        $this->get('/admin/monitor')->assertRedirect('/admin/login');
    }

    public function test_wrong_pin_is_rejected(): void
    {
        $this->post('/admin/login', ['pin' => '0000'])->assertSessionHasErrors('pin');
        $this->get('/admin/monitor')->assertRedirect('/admin/login');
    }

    public function test_correct_pin_opens_monitor(): void
    {
        $this->postJson('/enter-arena', ['name' => 'Budi']);

        $this->post('/admin/login', ['pin' => '2026'])->assertRedirect('/admin/monitor');
        $this->get('/admin/monitor')->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Monitor', false)
                ->where('stats.students', 1)
                ->has('leaderboard', 1)
                ->has('modules', \App\Support\ModuleRegistry::count()));
    }

    public function test_reset_requires_confirmation_and_wipes_data(): void
    {
        $this->postJson('/enter-arena', ['name' => 'Budi']);
        $this->post('/admin/login', ['pin' => '2026']);

        $this->post('/admin/reset', ['confirm' => 'nope'])->assertSessionHasErrors('confirm');
        $this->assertSame(1, Student::count());

        $this->post('/admin/reset', ['confirm' => 'RESET'])->assertRedirect();
        $this->assertSame(0, Student::count());
        $this->assertDatabaseCount('module_progress', 0);
    }
}
