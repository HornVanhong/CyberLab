import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { getUserProgress } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ authenticated: false, progress: [] });
  }

  const progress = getUserProgress(user.id);
  return NextResponse.json({
    authenticated: true,
    userId: user.id,
    xp: user.xp,
    level: user.level,
    title: user.title,
    progress,
  });
}
