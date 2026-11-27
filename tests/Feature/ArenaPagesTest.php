<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArenaPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_pages_render_with_curriculum(): void
    {
        $this->get('/')->assertOk()->assertInertia(fn ($p) => $p->component('Arena/Enter', false)->has('curriculum.0.chapters.0.lessons', 4));
        $this->get('/arena')->assertOk()->assertInertia(fn ($p) => $p->component('Arena/Map', false));
        $this->get('/arena/dom-event')->assertOk()
            ->assertInertia(fn ($p) => $p->component('Arena/Lesson', false)->where('lesson.chapter', 'bab-1'));
    }

    public function test_unknown_lesson_is_404(): void
    {
        $this->get('/arena/tidak-ada')->assertNotFound();
    }

    public function test_leaderboard_serves_page_for_browser_and_json_for_api(): void
    {
        $this->postJson('/enter-arena', ['name' => 'Budi']);

        $this->get('/leaderboard')->assertOk()
            ->assertInertia(fn ($p) => $p->component('Arena/Leaderboard', false)->has('leaderboard', 1));
        $this->getJson('/leaderboard')->assertOk()->assertJsonPath('data.0.name', 'Budi');
    }
}
