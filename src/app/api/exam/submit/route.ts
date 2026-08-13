import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { saveCertificate } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateName, score, tasksCompleted, totalTasks } = body;

    const user = (await getAuthenticatedUser(req)) || { id: "guest-user" };

    const cert = saveCertificate(
      user.id,
      candidateName || "CyberLab Operator",
      score || 1050,
      tasksCompleted || 6,
      totalTasks || 6
    );

    return NextResponse.json({
      success: true,
      certificate: cert,
    });
  } catch (error) {
    console.error("Exam submit API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
