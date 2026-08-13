import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, hashPassword } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role || "student" });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username || user.email.split("@")[0],
        email: user.email,
        role: user.role || "student",
        xp: user.xp || 0,
        level: user.level || 1,
        title: user.title || "Novice Hacker",
      },
      token,
    });

    response.cookies.set("cyberlab_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
