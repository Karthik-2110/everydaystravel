import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { authorize } from "@/app/lib/crm/auth";
import { AccessError } from "@/app/lib/crm/auth-policy";
import { finishGoogleConnection } from "@/app/lib/crm/google";

export async function GET(request: NextRequest) {
  let url: URL;
  let uid: string;
  try {
    const access = await authorize(request, true, true);
    url = access.url;
    uid = access.staff.uid;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sign-in required" },
      { status: error instanceof AccessError ? error.status : 403 },
    );
  }
  const target = new URL("/crm?view=integrations", url.origin);
  try {
    const cookie = request.cookies.get("crm-google-oauth")?.value;
    if (!cookie)
      throw new Error("Google sign-in expired. Please connect again.");
    const saved = JSON.parse(cookie);
    const state = url.searchParams.get("state") || "";
    if (
      saved.uid !== uid ||
      typeof saved.state !== "string" ||
      state.length !== saved.state.length ||
      !timingSafeEqual(Buffer.from(state), Buffer.from(saved.state)) ||
      Date.now() - saved.created > 600000 ||
      saved.redirect !== `${url.origin}/api/crm/google/callback`
    )
      throw new Error(
        "Google sign-in could not be verified. Please connect again.",
      );
    if (url.searchParams.has("error"))
      throw new Error(
        "Google connection was cancelled. You can reconnect anytime.",
      );
    const code = url.searchParams.get("code");
    if (!code) throw new Error("Google did not return an authorisation code.");
    await finishGoogleConnection(
      code,
      saved.verifier,
      saved.redirect,
      saved.generation,
    );
    target.searchParams.set("connected", "1");
  } catch (error) {
    target.searchParams.set(
      "error",
      error instanceof Error ? error.message : "Google connection failed",
    );
  }
  const response = NextResponse.redirect(target);
  response.cookies.delete({
    name: "crm-google-oauth",
    path: "/api/crm/google/callback",
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
