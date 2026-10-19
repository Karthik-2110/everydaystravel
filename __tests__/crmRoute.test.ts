import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  read: vi.fn(),
  add: vi.fn(),
  status: vi.fn(),
}));
vi.mock("@/app/lib/crm/store", () => ({
  repository: { read: mocks.read, add: mocks.add },
}));
vi.mock("@/app/lib/crm/google", () => ({ connectionStatus: mocks.status }));
import { GET, POST } from "@/app/api/crm/route";
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development");
  mocks.read.mockResolvedValue({
    leads: [],
    messages: [],
    events: [],
    syncedAt: null,
  });
  mocks.status.mockResolvedValue({
    connected: false,
    configured: false,
    email: null,
  });
});
describe("CRM API boundary", () => {
  it("returns an empty workspace and actual Google connection status", async () => {
    const response = await GET(new Request("http://localhost:3000/api/crm"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      leads: [],
      google: { connected: false },
    });
  });
  it("rejects cross-origin writes before reaching storage", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/crm", {
        method: "POST",
        headers: { origin: "https://evil.test" },
        body: "{}",
      }),
    );
    expect(response.status).toBe(403);
    expect(mocks.add).not.toHaveBeenCalled();
  });
  it("reports malformed JSON instead of crashing", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/crm", {
        method: "POST",
        body: "{broken",
      }),
    );
    expect(response.status).toBe(400);
  });
});
