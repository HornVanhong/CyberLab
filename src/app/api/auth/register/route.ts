import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const newUser = createUser(username, email, password);
    const token = signToken({ userId: newUser.id, email: newUser.email, role: newUser.role || "student" });

    const response = NextResponse.json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username || username,
        email: newUser.email,
        role: newUser.role || "student",
        xp: newUser.xp || 0,
        level: newUser.level || 1,
        title: newUser.title || "Novice Hacker",
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
    console.error("Register API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
