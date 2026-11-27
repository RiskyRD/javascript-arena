<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name', 40);
            // Nama lowercase untuk pencocokan case-insensitive yang portabel SQLite/MySQL.
            $table->string('name_key', 40);
            // Kode sesi singkat pembeda nama kembar, mis. "Budi #K7Q2".
            $table->string('tag', 4);
            // Hash SHA-256 dari token di localStorage; token mentah tidak pernah disimpan.
            $table->string('session_token', 64)->unique();
            $table->unsignedInteger('total_xp')->default(0);
            $table->unsignedInteger('current_streak')->default(0);
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();

            $table->unique(['name_key', 'tag']);
            $table->index('total_xp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
