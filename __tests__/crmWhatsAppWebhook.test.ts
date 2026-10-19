import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { createHmac } from "node:crypto";
const saved = vi.hoisted(() => vi.fn());
vi.mock("@/app/lib/crm/store", () => ({
  repository: { receiveWhatsApp: saved },
}));
vi.mock("@/app/lib/crm/whatsapp-analysis", () => ({
  drainWhatsAppQueue: vi.fn(),
}));
import { POST, GET } from "@/app/api/crm/whatsapp/webhook/route";
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("CRM_STORAGE", "");
  vi.stubEnv("GEMINI_API_KEY", "");
  vi.stubEnv("WHATSAPP_APP_SECRET", "secret");
  vi.stubEnv("WHATSAPP_VERIFY_TOKEN", "verify");
  vi.stubEnv("WHATSAPP_BUSINESS_ACCOUNT_ID", "business");
  vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "number");
  saved.mockReset();
});
afterEach(() => vi.unstubAllEnvs());
const raw = JSON.stringify({
  object: "whatsapp_business_account",
  entry: [
    {
      id: "business",
      changes: [
        {
          field: "messages",
          value: {
            metadata: { phone_number_id: "number" },
            messages: [
              {
                id: "wamid.one",
                from: "447700900123",
                timestamp: "1792400000",
                type: "text",
                text: { body: "Quote please" },
              },
            ],
          },
        },
      ],
    },
  ],
});
const request = (signature = true) =>
  new Request("http://localhost:3000/api/crm/whatsapp/webhook", {
    method: "POST",
    headers: signature
      ? {
          "x-hub-signature-256":
            "sha256=" +
            createHmac("sha256", "secret").update(raw).digest("hex"),
        }
      : {},
    body: raw,
  });
describe("WhatsApp provider boundary", () => {
  it("rejects unsigned notifications and returns valid verification challenges", async () => {
    expect((await POST(request(false))).status).toBe(403);
    expect(saved).not.toHaveBeenCalled();
    const response = await GET(
      new Request(
        "http://localhost:3000/api/crm/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=verify&hub.challenge=123",
      ),
    );
    expect(await response.text()).toBe("123");
  });
  it("acknowledges only after saving and returns a retryable failure if storage fails", async () => {
    saved.mockResolvedValue(undefined);
    expect((await POST(request())).status).toBe(200);
    saved.mockRejectedValue(Error("storage down"));
    expect((await POST(request())).status).toBe(503);
  });
});
