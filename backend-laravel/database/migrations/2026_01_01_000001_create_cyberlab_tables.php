<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role')->default('student');
            $table->integer('xp')->default(0);
            $table->integer('level')->default(1);
            $table->string('title')->default('Novice Hacker');
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. User Progress Table
        Schema::create('progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('lab_id');
            $table->string('challenge_id');
            $table->boolean('solved')->default(true);
            $table->text('flag_submitted');
            $table->timestamp('solved_at')->useCurrent();
            $table->timestamps();
        });

        // 3. Flag Submissions Log Table
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('lab_id');
            $table->string('challenge_id');
            $table->text('flag_submitted');
            $table->boolean('is_correct');
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });

        // 4. Certificates Table
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_id')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('candidate_name');
            $table->integer('score');
            $table->integer('tasks_completed');
            $table->integer('total_tasks');
            $table->timestamp('issued_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('progress');
        Schema::dropIfExists('users');
    }
};
