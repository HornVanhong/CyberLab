<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FlagController extends Controller
{
    private $flagsMap = [
        'msf2-01-vsftpd' => 'FLAG{VSFTPD_BACKDOOR_SUCCESS}',
        'msf2-02-distcc' => 'FLAG{DISTCC_RCE_ROOT_EXPLOIT}',
        'msf2-03-samba' => 'FLAG{SAMBA_USERMAP_SCRIPT_ROOT}',
        'msf2-04-unreal' => 'FLAG{UNREAL_IRC_BACKDOOR_EXPLOIT}',
        'msf2-05-phpcgi' => 'FLAG{PHP_CGI_ARG_INJECTION_FLAG}',
        'msf2-06-bind9' => 'FLAG{BIND9_DNS_ZONE_TRANSFER_OK}',
        'msf2-07-mysql' => 'FLAG{MYSQL_ROOT_EMPTY_PASS_DB}',
        'msf2-08-postgres' => 'FLAG{POSTGRES_DB_PWN_SUCCESS}',
        'msf2-09-tomcat' => 'FLAG{TOMCAT_WAR_DEPLOYER_SHELL}',
        'msf2-10-nfs' => 'FLAG{NFS_EXPORT_NO_ROOT_SQUASH}',
    ];

    public function submitFlag(Request $request)
    {
        $validated = $request->validate([
            'labId' => 'required|string',
            'challengeId' => 'required|string',
            'flag' => 'required|string',
        ]);

        $challengeId = $validated['challengeId'];
        $submittedFlag = trim($validated['flag']);

        $expectedFlag = $this->flagsMap[$challengeId] ?? 'FLAG{GENERIC_FLAG_2026}';
        $isCorrect = strtolower($submittedFlag) === strtolower($expectedFlag);

        // Record submission in PostgreSQL
        DB::table('submissions')->insert([
            'user_id' => 1,
            'lab_id' => $validated['labId'],
            'challenge_id' => $challengeId,
            'flag_submitted' => $submittedFlag,
            'is_correct' => $isCorrect,
            'submitted_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($isCorrect) {
            DB::table('progress')->updateOrInsert(
                ['user_id' => 1, 'challenge_id' => $challengeId],
                [
                    'lab_id' => $validated['labId'],
                    'solved' => true,
                    'flag_submitted' => $submittedFlag,
                    'solved_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // Award XP
            DB::table('users')->where('id', 1)->increment('xp', 100);

            return response()->json([
                'success' => true,
                'message' => 'Flag correct! + 100 XP (Recorded in PostgreSQL)',
                'xpEarned' => 100,
                'challengeId' => $challengeId,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Incorrect flag string. Check exploit output and retry.',
        ], 400);
    }
}
