import { timingSafeEqual } from "node:crypto";
import { drainWhatsAppQueue } from "@/app/lib/crm/whatsapp-analysis";
import { assertOrigin } from "@/app/lib/crm/auth-policy";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET || "",
    actual = request.headers.get("authorization") || "",
    expected = "Bearer " + secret;
  if (!secret) return new Response(null, { status: 503 });
  const a = Buffer.from(actual),
    b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return new Response(null, { status: 403 });
  try {
    assertOrigin(request, true);
    return Response.json(
      { processed: await drainWhatsAppQueue() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Analysis worker unavailable" },
      { status: 503 },
    );
  }
}
