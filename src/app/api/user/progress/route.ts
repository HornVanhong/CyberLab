import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { getUserProgress } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ authenticated: false, progress: [] });
  }

  const progress = await getUserProgress(user.id);
  return NextResponse.json({
    authenticated: true,
    userId: user.id,
    xp: user.xp || 0,
    level: user.level || 1,
    title: user.title || "Novice Hacker",
    progress,
  });
}
