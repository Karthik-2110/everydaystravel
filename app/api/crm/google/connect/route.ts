import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { assertLocalRequest } from "@/app/lib/crm/security";
import {
  googleAuthorizationUrl,
  googleConfigured,
  pkce,
} from "@/app/lib/crm/google";

export async function POST(request: Request) {
  let url: URL;
  try {
    url = assertLocalRequest(request);
  } catch {
    return NextResponse.json(
      { error: "Local access required" },
      { status: 403 },
    );
  }
  if (!googleConfigured())
    return NextResponse.json(
      {
        error:
          "Add CRM_GOOGLE_CLIENT_ID and CRM_GOOGLE_CLIENT_SECRET to .env.local, then restart the development server. See docs/crm-setup.md.",
      },
      { status: 400 },
    );
  const state = randomBytes(32).toString("hex");
  const { verifier, challenge } = pkce();
  const redirect = `${url.origin}/api/crm/google/callback`;
  const response = NextResponse.json(
    {
      url: googleAuthorizationUrl(
        process.env.CRM_GOOGLE_CLIENT_ID!,
        redirect,
        state,
        challenge,
      ),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(
    "crm-google-oauth",
    JSON.stringify({ state, verifier, created: Date.now(), redirect }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: url.protocol === "https:",
      path: "/api/crm/google/callback",
      maxAge: 600,
    },
  );
  return response;
}
