import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getUserById, UserRecord } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "cyberlab_jwt_secret_key_2026_super_secure";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

// Generate Auth Token
export function signToken(payload: { userId: string; email: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

// Verify Auth Token
export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

// Extract Authenticated User from API Request
export function getAuthenticatedUser(req: NextRequest): UserRecord | null {
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get("cyberlab_session")?.value;
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = getUserById(payload.userId);
  return user || null;
}
