import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
const mocked = vi.hoisted(() => ({ api: vi.fn(), dir: "" }));
vi.mock("@/app/lib/crm/google", () => ({ googleApi: mocked.api }));
vi.mock("@/app/lib/crm/store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/app/lib/crm/store")>();
  return {
    ...actual,
    get repository() {
      return actual.createRepository(mocked.dir);
    },
  };
});
import { POST } from "@/app/api/crm/route";
import { createRepository } from "@/app/lib/crm/store";
const id = "12345678-1234-1234-1234-123456789012";
const request = (body = "Thank you for your enquiry.") =>
  POST(
    new Request("http://localhost:3000/api/crm", {
      method: "POST",
      body: JSON.stringify({
        action: "reply",
        messageId: "mail-1",
        requestId: id,
        body,
      }),
    }),
  );
beforeEach(async () => {
  vi.stubEnv("NODE_ENV", "development");
  mocked.dir = await mkdtemp(join(tmpdir(), "crm-reply-test-"));
  mocked.api.mockReset();
  await createRepository(mocked.dir).mutate((state) => {
    state.messages = [
      {
        id: "mail-1",
        threadId: "thread-1",
        from: "Sarah <sarah@example.com>",
        to: "info@everydaystravel.co.uk",
        subject: "Windsor quote",
        body: "",
        snippet: "",
        date: new Date().toISOString(),
        unread: true,
        messageId: "<original@example.com>",
      },
    ];
  });
});
afterEach(async () => {
  await rm(mocked.dir, { recursive: true, force: true });
  vi.unstubAllEnvs();
});
describe("Gmail send receipts", () => {
  it("returns success without reading connection state after Gmail accepts the reply", async () => {
    mocked.api.mockResolvedValue({ id: "sent-1" });
    const response = await request();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      notice: "Reply sent through Gmail.",
    });
    expect(
      (await createRepository(mocked.dir).read()).sendAttempts?.[id],
    ).toMatchObject({ status: "sent", gmailId: "sent-1" });
  });
  it("does not send a successful request twice", async () => {
    mocked.api.mockResolvedValue({ id: "sent-1" });
    expect((await request()).status).toBe(200);
    expect((await request()).status).toBe(200);
    expect(mocked.api).toHaveBeenCalledTimes(1);
  });
  it("does not resend an ambiguous timeout", async () => {
    mocked.api.mockRejectedValue(new Error("timeout"));
    expect((await request()).status).toBe(400);
    const retry = await request();
    expect(retry.status).toBe(400);
    expect((await retry.json()).error).toContain("Check Gmail Sent");
    expect(mocked.api).toHaveBeenCalledTimes(1);
  });
});
