import { describe, it, expect, vi, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRepository } from "@/app/lib/crm/store";
import { analyseConversation } from "@/app/lib/crm/whatsapp-analysis";
import type { WhatsAppMessage } from "@/app/lib/crm/whatsapp-model";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
const message: WhatsAppMessage = {
  id: "one",
  conversationId: "number:+447700900123",
  phone: "+447700900123",
  name: "Sam",
  body: "Need a quote",
  type: "text",
  businessId: "business",
  phoneId: "number",
  sentAt: "2026-10-19T10:00:00Z",
  receivedAt: "2026-10-19T10:01:00Z",
};
const result = {
  intent: "quote-request",
  summary: "A quote",
  title: "Quote",
  pickup: "",
  destination: "",
  travelDate: "",
  passengers: "",
  vehicle: "",
  company: "",
  missingDetails: ["Route"],
  nextAction: "Ask route",
  confidence: "low",
};
describe("durable Gemini conversation queue", () => {
  it("keeps messages on a failed analysis and does not overwrite newer queued messages with an old result", async () => {
    vi.stubEnv("GEMINI_API_KEY", "fake");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "number");
    vi.stubEnv("WHATSAPP_BUSINESS_ACCOUNT_ID", "business");
    const dir = await mkdtemp(join(tmpdir(), "crm-wa-analysis-"));
    try {
      const repo = createRepository(dir);
      await repo.receiveWhatsApp([message]);
      expect(
        (await repo.read()).whatsAppAnalyses?.[message.conversationId].status,
      ).toBe("queued");
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => {
          throw Error("network");
        }),
      );
      await analyseConversation(message.conversationId, repo);
      expect((await repo.read()).whatsAppMessages).toHaveLength(1);
      expect(
        (await repo.read()).whatsAppAnalyses?.[message.conversationId].status,
      ).toBe("failed");
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => {
          await repo.receiveWhatsApp([
            {
              ...message,
              id: "two",
              body: "Actually cancel that",
              sentAt: "2026-10-19T11:00:00Z",
            },
          ]);
          return {
            ok: true,
            json: async () => ({
              candidates: [
                { content: { parts: [{ text: JSON.stringify(result) }] } },
              ],
            }),
          };
        }),
      );
      await analyseConversation(message.conversationId, repo, true);
      expect(
        (await repo.read()).whatsAppAnalyses?.[message.conversationId].status,
      ).toBe("queued");
      expect(
        (await repo.read()).whatsAppAnalyses?.[message.conversationId].result,
      ).toBeUndefined();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
