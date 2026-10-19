import { NextRequest, NextResponse } from "next/server";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { publicFirebaseConfig, staffAuth } from "@/app/lib/crm/firebase-admin";
import {
  AccessError,
  assertOrigin,
  staffFromClaims,
} from "@/app/lib/crm/auth-policy";
import { SESSION_COOKIE, SESSION_SECONDS } from "@/app/lib/crm/auth";
export const runtime = "nodejs";
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
});
function failure(error: unknown) {
  return NextResponse.json(
    {
      error:
        error instanceof AccessError
          ? error.message
          : "Sign-in is unavailable. Check the server configuration and try again.",
    },
    {
      status: error instanceof AccessError ? error.status : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
export async function GET(request: NextRequest) {
  try {
    assertOrigin(request);
    const csrf = randomBytes(32).toString("hex");
    const response = NextResponse.json(
      { csrf, config: publicFirebaseConfig() },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set("crm-login-csrf", csrf, {
      ...cookieOptions(),
      sameSite: "strict",
      maxAge: 600,
    });
    return response;
  } catch (e) {
    return failure(e);
  }
}
function checkCsrf(request: NextRequest) {
  assertOrigin(request);
  const saved = request.cookies.get("crm-login-csrf")?.value || "";
  const supplied = request.headers.get("x-crm-csrf") || "";
  if (
    !saved ||
    saved.length !== supplied.length ||
    !timingSafeEqual(Buffer.from(saved), Buffer.from(supplied))
  )
    throw new AccessError("Sign-in expired. Please try again.", 403);
}
export async function POST(request: NextRequest) {
  try {
    checkCsrf(request);
    const raw = await request.text();
    if (raw.length > 20000)
      throw new AccessError("Invalid sign-in request", 400);
    const { idToken } = JSON.parse(raw);
    if (typeof idToken !== "string")
      throw new AccessError("Invalid sign-in request", 400);
    const claims = await staffAuth().verifyIdToken(idToken, true);
    staffFromClaims(claims);
    if (
      !claims.auth_time ||
      Date.now() / 1000 - claims.auth_time > 300 ||
      claims.auth_time > Date.now() / 1000 + 30
    )
      throw new AccessError("Please sign in again to start a new session");
    const session = await staffAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_SECONDS * 1000,
    });
    const response = NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(SESSION_COOKIE, session, {
      ...cookieOptions(),
      maxAge: SESSION_SECONDS,
    });
    response.cookies.set("crm-login-csrf", "", {
      ...cookieOptions(),
      maxAge: 0,
    });
    return response;
  } catch (e) {
    return failure(e);
  }
}
export async function DELETE(request: NextRequest) {
  try {
    assertOrigin(request);
    const response = NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
    return response;
  } catch (e) {
    return failure(e);
  }
}
