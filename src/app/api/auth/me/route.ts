import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json({
      status: "online",
      authenticated: false,
      user: {
        id: "guest",
        username: "Guest Pentester",
        email: "guest@cyberlab.local",
        role: "guest",
        xp: 0,
        level: 1,
        title: "Novice Hacker",
      },
      message: "API endpoint is working. You are currently browsing as Guest. Click 'Log In' in the top navbar or send POST /api/auth/login to authenticate.",
      demoCredentials: {
        studentAccount: "student@cyberlab.local / student123",
        adminAccount: "admin@cyberlab.local / admin123",
      },
      endpoints: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
        submitFlag: "POST /api/flags/submit",
        userProgress: "GET /api/user/progress",
        executeTool: "POST /api/tools/execute",
        submitExam: "POST /api/exam/submit",
      },
    });
  }

  return NextResponse.json({
    status: "online",
    authenticated: true,
    user: {
      id: user.id,
      username: user.username || user.display_name || user.email.split("@")[0],
      email: user.email,
      role: user.role || "student",
      xp: user.xp || 0,
      level: user.level || 1,
      title: user.title || "Novice Hacker",
    },
    message: `Authenticated successfully as ${user.username || user.email}`,
  });
}
