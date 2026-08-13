import { NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";

export async function GET() {
  try {
    const result = await initDatabase();
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Database connected & schema initialized successfully!" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to connect to database" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
