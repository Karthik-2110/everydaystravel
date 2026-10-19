import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { normalisePhone, type WhatsAppMessage } from "./whatsapp-model";
export { normalisePhone, whatsAppIntake } from "./whatsapp-model";
export type { WhatsAppMessage } from "./whatsapp-model";
export function whatsAppConfigured() {
  return Boolean(
    process.env.WHATSAPP_APP_SECRET &&
    process.env.WHATSAPP_VERIFY_TOKEN &&
    process.env.WHATSAPP_BUSINESS_ACCOUNT_ID &&
    process.env.WHATSAPP_PHONE_NUMBER_ID,
  );
}
export function verifyWhatsAppSignature(
  raw: string,
  signature: string | null,
  secret: string,
) {
  if (!secret || !signature || !/^sha256=[a-f0-9]{64}$/.test(signature))
    return false;
  const expected = createHmac("sha256", secret).update(raw).digest();
  return timingSafeEqual(expected, Buffer.from(signature.slice(7), "hex"));
}
export function whatsAppChallenge(url: URL, token: string) {
  const supplied = url.searchParams.get("hub.verify_token") || "",
    challenge = url.searchParams.get("hub.challenge") || "";
  const a = Buffer.from(supplied),
    b = Buffer.from(token);
  if (
    !token ||
    url.searchParams.get("hub.mode") !== "subscribe" ||
    a.length !== b.length ||
    !timingSafeEqual(a, b) ||
    !/^\d{1,1000}$/.test(challenge)
  )
    throw new Error("Invalid webhook verification");
  return challenge;
}
const str = z.string().max(200);
const rawMessage = z.object({
  id: str.min(1),
  from: str,
  timestamp: z.string().regex(/^\d{1,12}$/),
  type: str,
  text: z.object({ body: z.string().max(10000) }).optional(),
  image: z.unknown().optional(),
  document: z.unknown().optional(),
  audio: z.unknown().optional(),
  video: z.unknown().optional(),
  sticker: z.unknown().optional(),
});
const payloadSchema = z.object({
  object: z.literal("whatsapp_business_account"),
  entry: z
    .array(
      z.object({
        id: str,
        changes: z
          .array(
            z.object({
              field: str,
              value: z.object({
                metadata: z.object({ phone_number_id: str }).optional(),
                contacts: z
                  .array(
                    z.object({
                      wa_id: str,
                      profile: z
                        .object({ name: z.string().max(500) })
                        .optional(),
                    }),
                  )
                  .max(100)
                  .optional(),
                messages: z.array(z.unknown()).max(100).optional(),
              }),
            }),
          )
          .max(20),
      }),
    )
    .max(20),
});
const mediaSchema = z.object({
  id: str.min(1),
  mime_type: str.optional(),
  filename: z.string().max(500).optional(),
  caption: z.string().max(10000).optional(),
});
export function parseWhatsAppPayload(
  input: unknown,
  config: { businessId: string; phoneId: string },
): WhatsAppMessage[] {
  const payload = payloadSchema.parse(input);
  const result: WhatsAppMessage[] = [];
  for (const entry of payload.entry) {
    if (entry.id !== config.businessId)
      throw new Error("Unexpected WhatsApp business account");
    for (const change of entry.changes) {
      if (change.field !== "messages") continue;
      if (change.value.metadata?.phone_number_id !== config.phoneId)
        throw new Error("Unexpected WhatsApp phone number");
      for (const candidate of change.value.messages || []) {
        if (
          !candidate ||
          typeof candidate !== "object" ||
          !["text", "image", "document", "audio", "video", "sticker"].includes(
            String((candidate as { type?: unknown }).type),
          )
        )
          continue;
        const message = rawMessage.parse(candidate);
        const phone = normalisePhone(message.from),
          sentAt = new Date(Number(message.timestamp) * 1000).toISOString();
        const contact = change.value.contacts?.find(
          (c) => c.wa_id === message.from,
        );
        let body = message.type === "text" ? message.text?.body || "" : "";
        let media: WhatsAppMessage["media"];
        if (
          ["image", "document", "audio", "video", "sticker"].includes(
            message.type,
          )
        ) {
          const asset = mediaSchema.parse(message[message.type as "image"]);
          body = asset.caption || "";
          media = {
            id: asset.id,
            mimeType: asset.mime_type || "",
            ...(asset.filename ? { filename: asset.filename } : {}),
          };
        }
        result.push({
          id: message.id,
          conversationId: config.phoneId + ":" + phone,
          name: contact?.profile?.name || phone,
          phone,
          sentAt,
          receivedAt: new Date().toISOString(),
          type: message.type,
          body,
          businessId: config.businessId,
          phoneId: config.phoneId,
          ...(media ? { media } : {}),
        });
        if (result.length > 100) throw new Error("WhatsApp batch is too large");
      }
    }
  }
  return result;
}
