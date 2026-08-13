import { NextResponse } from "next/server";
import { logChallengeAttempt } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, challengeId, submittedFlag, isCorrect, pointsEarned } = body;

    if (!userId || !challengeId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const log = await logChallengeAttempt(userId, challengeId, submittedFlag, isCorrect, pointsEarned || 0);
    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to log attempt" }, { status: 500 });
  }
}
