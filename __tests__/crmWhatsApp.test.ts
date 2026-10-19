import { describe, it, expect, vi, afterEach } from "vitest";
import { createHmac } from "node:crypto";
import {
  verifyWhatsAppSignature,
  whatsAppChallenge,
  parseWhatsAppPayload,
  normalisePhone,
  whatsAppIntake,
} from "@/app/lib/crm/whatsapp";
afterEach(() => vi.unstubAllEnvs());
const payload = (messages: unknown[]) => ({
  object: "whatsapp_business_account",
  entry: [
    {
      id: "business",
      changes: [
        {
          field: "messages",
          value: {
            metadata: { phone_number_id: "number" },
            contacts: [{ wa_id: "447700900123", profile: { name: "Sam" } }],
            messages,
          },
        },
      ],
    },
  ],
});
const message = {
  id: "wamid.one",
  from: "447700900123",
  timestamp: "1792400000",
  type: "text",
  text: {
    body: "Please quote from London to Oxford for 8 passengers on 24 October 2026",
  },
};
describe("WhatsApp signed intake", () => {
  it("verifies the exact raw body and rejects missing or tampered signatures", () => {
    const raw = JSON.stringify(payload([message]));
    const signature =
      "sha256=" + createHmac("sha256", "secret").update(raw).digest("hex");
    expect(verifyWhatsAppSignature(raw, signature, "secret")).toBe(true);
    expect(verifyWhatsAppSignature(raw + " ", signature, "secret")).toBe(false);
    expect(verifyWhatsAppSignature(raw, null, "secret")).toBe(false);
    expect(verifyWhatsAppSignature(raw, signature, "")).toBe(false);
  });
  it("only returns a challenge for an exact verification token", () => {
    expect(
      whatsAppChallenge(
        new URL(
          "https://example.com/?hub.mode=subscribe&hub.verify_token=token&hub.challenge=123",
        ),
        "token",
      ),
    ).toBe("123");
    expect(() =>
      whatsAppChallenge(
        new URL(
          "https://example.com/?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=123",
        ),
        "token",
      ),
    ).toThrow();
  });
  it("parses whitelisted incoming messages and rejects a different business account", () => {
    const result = parseWhatsAppPayload(payload([message]), {
      businessId: "business",
      phoneId: "number",
    });
    expect(result[0]).toMatchObject({
      id: "wamid.one",
      name: "Sam",
      phone: "+447700900123",
      type: "text",
      body: message.text.body,
    });
    expect(() =>
      parseWhatsAppPayload(payload([message]), {
        businessId: "other",
        phoneId: "number",
      }),
    ).toThrow();
  });
  it("preserves media metadata without downloading content, and ignores statuses", () => {
    const input = payload([
      {
        ...message,
        id: "wamid.image",
        type: "image",
        image: {
          id: "media",
          caption: "Journey itinerary",
          mime_type: "image/jpeg",
          sha256: "not-needed",
        },
      },
    ]);
    expect(
      parseWhatsAppPayload(input, {
        businessId: "business",
        phoneId: "number",
      })[0],
    ).toMatchObject({
      type: "image",
      body: "Journey itinerary",
      media: { id: "media", mimeType: "image/jpeg" },
    });
    expect(
      parseWhatsAppPayload(payload([]), {
        businessId: "business",
        phoneId: "number",
      }),
    ).toEqual([]);
  });
  it("normalises sender numbers and provides review-only enquiry suggestions", () => {
    expect(normalisePhone(" +44 7700 900123 ")).toBe("+447700900123");
    const parsed = parseWhatsAppPayload(payload([message]), {
      businessId: "business",
      phoneId: "number",
    })[0];
    expect(whatsAppIntake(parsed).fields).toMatchObject({
      name: "Sam",
      phone: "+447700900123",
      email: "",
      passengers: "8",
    });
  });
});
it("ignores reaction and unsupported notifications instead of replacing a business request", () => {
  const result = parseWhatsAppPayload(
    payload([
      {
        ...message,
        id: "reaction",
        type: "reaction",
        reaction: { message_id: "wamid.one", emoji: "👍" },
      },
    ]),
    { businessId: "business", phoneId: "number" },
  );
  expect(result).toEqual([]);
});
