<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $userId = DB::table('users')->insertGetId([
            'username' => $validated['username'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'xp' => 0,
            'level' => 1,
            'title' => 'Novice Hacker',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $user = DB::table('users')->where('id', $userId)->first();

        return response()->json([
            'message' => 'Registration successful on PostgreSQL',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'xp' => $user->xp,
                'level' => $user->level,
                'title' => $user->title,
            ],
            'token' => Str::random(60),
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = DB::table('users')->where('email', strtolower($validated['email']))->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['error' => 'Invalid email or password'], 401);
        }

        return response()->json([
            'message' => 'Login successful on PostgreSQL',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'xp' => $user->xp,
                'level' => $user->level,
                'title' => $user->title,
            ],
            'token' => Str::random(60),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => 'online',
            'authenticated' => true,
            'user' => [
                'id' => 1,
                'username' => 'student',
                'email' => 'student@cyberlab.local',
                'role' => 'student',
                'xp' => 450,
                'level' => 2,
                'title' => 'Security Trainee',
            ],
            'database' => 'PostgreSQL (Render Managed)',
        ]);
    }
}
