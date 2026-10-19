import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  verify: vi.fn(),
  create: vi.fn(),
  id: vi.fn(),
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => (mocks.cookie ? { value: mocks.cookie } : undefined),
  }),
}));
vi.mock("@/app/lib/crm/firebase-admin", () => ({
  hostedStorage: () => true,
  staffAuth: () => ({
    verifySessionCookie: mocks.verify,
    verifyIdToken: mocks.id,
    createSessionCookie: mocks.create,
  }),
  publicFirebaseConfig: () => ({
    apiKey: "public",
    authDomain: "test.firebaseapp.com",
    projectId: "test",
  }),
}));
import { authorize } from "@/app/lib/crm/auth";
import {
  POST as login,
  GET as setup,
  DELETE as logout,
} from "@/app/api/crm/session/route";
import { NextRequest } from "next/server";
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("CRM_ORIGIN", "https://everydaystravel.co.uk");
  vi.stubEnv("CRM_INTEGRATION_ADMINS", "owner@example.com");
  mocks.cookie = undefined;
  vi.clearAllMocks();
});
afterEach(() => vi.unstubAllEnvs());
const url = "https://everydaystravel.co.uk";
const claims = {
  uid: "one",
  email: "anyone@gmail.com",
  email_verified: true,
  auth_time: Date.now() / 1000,
  firebase: { sign_in_provider: "google.com" },
};
describe("server sessions", () => {
  it("rejects missing and revoked sessions", async () => {
    await expect(authorize(new Request(url + "/api/crm"))).rejects.toThrow(
      /session/,
    );
    mocks.cookie = "revoked";
    mocks.verify.mockRejectedValue(Error("revoked"));
    await expect(authorize(new Request(url + "/api/crm"))).rejects.toThrow(
      /session/,
    );
    expect(mocks.verify).toHaveBeenCalledWith("revoked", true);
  });
  it("allows other-domain verified Google accounts and denies integration admin changes", async () => {
    mocks.cookie = "good";
    mocks.verify.mockResolvedValue(claims);
    expect((await authorize(new Request(url + "/api/crm"))).staff.email).toBe(
      "anyone@gmail.com",
    );
    await expect(
      authorize(new Request(url + "/api/crm/google/connect"), true),
    ).rejects.toThrow(/administrator/);
  });
  it("rejects login CSRF before accepting a token", async () => {
    const res = await login(
      new NextRequest(url + "/api/crm/session", {
        method: "POST",
        headers: { origin: url },
        body: JSON.stringify({ idToken: "x" }),
      }),
    );
    expect(res.status).toBe(403);
  });
  it("creates a secure session only after recent verified Google sign-in", async () => {
    const init = await setup(new NextRequest(url + "/api/crm/session"));
    const { csrf } = await init.json();
    mocks.id.mockResolvedValue(claims);
    mocks.create.mockResolvedValue("server-session");
    const req = () =>
      new NextRequest(url + "/api/crm/session", {
        method: "POST",
        headers: {
          origin: url,
          cookie: `crm-login-csrf=${csrf}`,
          "x-crm-csrf": csrf,
        },
        body: JSON.stringify({ idToken: "fresh" }),
      });
    const result = await login(req());
    expect(result.status).toBe(200);
    expect(result.headers.get("set-cookie")).toContain("HttpOnly");
    expect(result.headers.get("set-cookie")).toContain("Secure");
    mocks.id.mockResolvedValue({
      ...claims,
      auth_time: Date.now() / 1000 - 1000,
    });
    expect((await login(req())).status).toBe(401);
    expect(
      (
        await logout(
          new NextRequest(url + "/api/crm/session", {
            method: "DELETE",
            headers: { origin: "https://evil.test" },
          }),
        )
      ).status,
    ).toBe(403);
  });
});
