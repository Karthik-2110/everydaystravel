import { after } from "next/server";
import { drainWhatsAppQueue } from "@/app/lib/crm/whatsapp-analysis";
import {
  whatsAppChallenge,
  verifyWhatsAppSignature,
  parseWhatsAppPayload,
  whatsAppConfigured,
} from "@/app/lib/crm/whatsapp";
import { repository } from "@/app/lib/crm/store";
import { assertOrigin } from "@/app/lib/crm/auth-policy";
import { hostedStorage } from "@/app/lib/crm/firebase-admin";
import { assertLocalRequest } from "@/app/lib/crm/security";
export const runtime = "nodejs";
export const maxDuration = 60;
function origin(request: Request) {
  if (hostedStorage()) assertOrigin(request, true);
  else assertLocalRequest(request, true);
}
export async function GET(request: Request) {
  try {
    origin(request);
    return new Response(
      whatsAppChallenge(
        new URL(request.url),
        process.env.WHATSAPP_VERIFY_TOKEN || "",
      ),
      {
        headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
      },
    );
  } catch {
    return Response.json({ error: "Verification rejected" }, { status: 403 });
  }
}
export async function POST(request: Request) {
  try {
    origin(request);
  } catch {
    return Response.json({ error: "Invalid host" }, { status: 403 });
  }
  if (!whatsAppConfigured())
    return Response.json(
      { error: "WhatsApp is not configured" },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length")) > 1000000)
    return new Response(null, { status: 413 });
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 1000000)
    return new Response(null, { status: 413 });
  if (
    !verifyWhatsAppSignature(
      raw,
      request.headers.get("x-hub-signature-256"),
      process.env.WHATSAPP_APP_SECRET!,
    )
  )
    return new Response(null, { status: 403 });
  let messages: ReturnType<typeof parseWhatsAppPayload>;
  try {
    messages = parseWhatsAppPayload(JSON.parse(raw), {
      businessId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!,
      phoneId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    });
  } catch {
    return Response.json(
      { error: "Invalid WhatsApp notification" },
      { status: 400 },
    );
  }
  try {
    if (messages.length) {
      await repository.receiveWhatsApp(messages);
      if (process.env.GEMINI_API_KEY)
        after(async () => {
          await drainWhatsAppQueue().catch(() => {});
        });
    }
    return Response.json(
      { received: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Message storage unavailable. Retry delivery." },
      { status: 503 },
    );
  }
}
