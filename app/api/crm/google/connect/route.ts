import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { authorize } from "@/app/lib/crm/auth";
import { AccessError } from "@/app/lib/crm/auth-policy";
import {
  googleAuthorizationUrl,
  googleConfigured,
  pkce,
  googleConnectionGeneration,
} from "@/app/lib/crm/google";

export async function POST(request: Request) {
  let url: URL;
  let uid: string;
  try {
    const access = await authorize(request, true);
    url = access.url;
    uid = access.staff.uid;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sign-in required" },
      { status: error instanceof AccessError ? error.status : 403 },
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
    JSON.stringify({
      state,
      verifier,
      created: Date.now(),
      redirect,
      uid,
      generation: await googleConnectionGeneration(),
    }),
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
