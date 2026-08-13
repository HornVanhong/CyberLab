import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "DATABASE_URL is not set" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // Query table rows
      const usersRes = await client.query("SELECT * FROM users ORDER BY created_at DESC LIMIT 50;");
      const progressRes = await client.query("SELECT * FROM user_progress ORDER BY updated_at DESC LIMIT 50;");
      const logsRes = await client.query("SELECT * FROM challenge_logs ORDER BY created_at DESC LIMIT 50;");
      const quizRes = await client.query("SELECT * FROM quiz_results ORDER BY created_at DESC LIMIT 50;");

      return NextResponse.json({
        success: true,
        summary: {
          totalUsers: usersRes.rowCount,
          totalProgressRecords: progressRes.rowCount,
          totalChallengeLogs: logsRes.rowCount,
          totalQuizResults: quizRes.rowCount,
        },
        tables: {
          users: usersRes.rows,
          user_progress: progressRes.rows,
          challenge_logs: logsRes.rows,
          quiz_results: quizRes.rows,
        },
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to query database" },
      { status: 500 }
    );
  }
}
