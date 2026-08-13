import { NextResponse } from "next/server";
import { getUserProgress, saveUserProgress, upsertUser } from "@/lib/db";

// GET user progress from PostgreSQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId parameter is required" }, { status: 400 });
    }

    const dbProgress = await getUserProgress(userId);
    return NextResponse.json({ success: true, progress: dbProgress });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Database query failed" }, { status: 500 });
  }
}

// POST save / sync progress to PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, progress } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    // Ensure user exists in database
    if (email) {
      await upsertUser(userId, email);
    }

    const saved = await saveUserProgress(userId, progress || {});
    return NextResponse.json({ success: true, progress: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to save progress" }, { status: 500 });
  }
}
