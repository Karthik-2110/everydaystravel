import { describe, it, expect, vi, afterEach } from "vitest";
import {
  analyseWhatsAppConversation,
  conversationFingerprint,
} from "@/app/lib/crm/gemini";
import type { WhatsAppMessage } from "@/app/lib/crm/whatsapp-model";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
const message: WhatsAppMessage = {
  id: "a",
  conversationId: "n:+447700900123",
  phone: "+447700900123",
  name: "Sam",
  body: "Need a minibus to Oxford",
  type: "text",
  businessId: "b",
  phoneId: "n",
  sentAt: "2026-10-19T10:00:00Z",
  receivedAt: "2026-10-19T10:00:01Z",
};
describe("Gemini business request understanding", () => {
  it("sends chronological conversation text and validates structured suggestions without actions", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-secret");
    vi.stubEnv("GEMINI_MODEL", "gemini-3.8-flash");
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    intent: "quote-request",
                    summary: "Minibus quote to Oxford for eight people",
                    pickup: "London",
                    destination: "Oxford",
                    travelDate: "",
                    passengers: "8",
                    vehicle: "Minibus",
                    company: "",
                    title: "Oxford minibus quote",
                    missingDetails: ["Travel date", "Pickup time"],
                    nextAction: "Confirm date and pickup time",
                    confidence: "medium",
                  }),
                },
              ],
            },
          },
        ],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await analyseWhatsAppConversation([
      message,
      {
        ...message,
        id: "b",
        sentAt: "2026-10-19T11:00:00Z",
        body: "Eight of us from London",
      },
    ]);
    expect(result.intent).toBe("quote-request");
    expect(result.missingDetails).toContain("Travel date");
    const request = JSON.parse(
      (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
        .body as string,
    );
    expect(JSON.stringify(request)).toContain("Eight of us");
    expect(JSON.stringify(request)).not.toContain("test-secret");
    expect(result).not.toHaveProperty("stage");
  });
  it("does not pretend analysis succeeded without credentials", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    await expect(analyseWhatsAppConversation([message])).rejects.toThrow(
      /Gemini/,
    );
  });
  it("fingerprints ordered messages independently of delivery order", () => {
    const later = { ...message, id: "b", sentAt: "2026-10-19T11:00:00Z" };
    expect(conversationFingerprint([message, later])).toBe(
      conversationFingerprint([later, message]),
    );
  });
});
it("rejects model output that attempts to apply a CRM stage", async () => {
  vi.stubEnv("GEMINI_API_KEY", "fake");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    intent: "booking-request",
                    summary: "Confirm",
                    title: "Trip",
                    pickup: "",
                    destination: "",
                    travelDate: "",
                    passengers: "",
                    vehicle: "",
                    company: "",
                    missingDetails: [],
                    nextAction: "Review",
                    confidence: "high",
                    stage: "won",
                  }),
                },
              ],
            },
          },
        ],
      }),
    })),
  );
  await expect(analyseWhatsAppConversation([message])).rejects.toThrow();
});
