import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { recordSubmission, updateUserXp } from "@/lib/db";
import { CHALLENGES } from "@/data/challenges";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { labId, challengeId, flag } = body;

    if (!labId || !challengeId || !flag) {
      return NextResponse.json({ error: "labId, challengeId, and flag are required" }, { status: 400 });
    }

    const user = getAuthenticatedUser(req) || { id: "guest-user", xp: 0, level: 1, title: "Guest Pentester" };

    const challenge = CHALLENGES.find((c) => c.id === challengeId && c.labId === labId);
    if (!challenge) {
      return NextResponse.json({ error: "Challenge target not found" }, { status: 404 });
    }

    const isCorrect = challenge.expectedFlag.trim().toLowerCase() === flag.trim().toLowerCase();

    const { progress, submission } = recordSubmission(user.id, labId, challengeId, flag.trim(), isCorrect);

    if (isCorrect) {
      let updatedUser = user;
      if (user.id !== "guest-user") {
        updatedUser = updateUserXp(user.id, challenge.points) || user;
      }

      return NextResponse.json({
        success: true,
        message: "Flag correct! + " + challenge.points + " XP",
        xpEarned: challenge.points,
        challengeId: challenge.id,
        user: updatedUser,
        progress,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Incorrect flag string. Verify your exploit output and try again.",
        submissionId: submission.id,
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Flag submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
