<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($uri === '/api/auth/me') {
    echo json_encode([
        'status' => 'online',
        'authenticated' => true,
        'backend' => 'Laravel 11 PHP API (Port 8000)',
        'user' => [
            'id' => 1,
            'username' => 'student',
            'email' => 'student@cyberlab.local',
            'role' => 'student',
            'xp' => 450,
            'level' => 2,
            'title' => 'Security Trainee'
        ]
    ]);
    exit;
}

if ($uri === '/api/health') {
    echo json_encode([
        'status' => 'online',
        'service' => 'Laravel REST API on Port 8000',
        'timestamp' => date('c')
    ]);
    exit;
}

if ($uri === '/api/flags/submit') {
    $input = json_decode(file_get_contents('php://input'), true);
    $flag = $input['flag'] ?? '';
    $isCorrect = (strtolower(trim($flag)) === 'flag{vsftpd_backdoor_success}');

    if ($isCorrect) {
        echo json_encode([
            'success' => true,
            'message' => 'Flag correct! + 100 XP (Recorded via Laravel API)',
            'xpEarned' => 100
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Incorrect flag string'
        ]);
    }
    exit;
}

echo json_encode([
    'status' => 'online',
    'service' => 'CyberLab Laravel API Server',
    'endpoints' => [
        'GET /api/auth/me',
        'POST /api/flags/submit',
        'GET /api/health'
    ]
]);
