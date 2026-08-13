<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FlagController;

/*
|--------------------------------------------------------------------------
| CyberLab API Routes for Laravel & Render & PostgreSQL
|--------------------------------------------------------------------------
*/

Route::get('/auth/me', [AuthController::class, 'me']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::post('/flags/submit', [FlagController::class, 'submitFlag']);

Route::get('/health', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'Laravel REST API on Render',
        'database' => 'PostgreSQL Managed',
        'timestamp' => now()->toIso8601String(),
    ]);
});
