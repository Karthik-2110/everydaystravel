import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assertOrigin,
  staffFromClaims,
  integrationAdmin,
  crmOrigin,
} from "@/app/lib/crm/auth-policy";
afterEach(() => vi.unstubAllEnvs());
describe("production CRM identity boundary", () => {
  it("accepts a verified Google account from any email domain", () => {
    expect(
      staffFromClaims({
        uid: "one",
        email: "person@gmail.com",
        email_verified: true,
        firebase: { sign_in_provider: "google.com" },
      }),
    ).toMatchObject({ uid: "one", email: "person@gmail.com" });
  });
  it("rejects unverified, missing-email and non-Google identities", () => {
    for (const claims of [
      {
        uid: "one",
        email: "x@gmail.com",
        email_verified: false,
        firebase: { sign_in_provider: "google.com" },
      },
      {
        uid: "one",
        email_verified: true,
        firebase: { sign_in_provider: "google.com" },
      },
      {
        uid: "one",
        email: "x@gmail.com",
        email_verified: true,
        firebase: { sign_in_provider: "password" },
      },
    ])
      expect(() => staffFromClaims(claims)).toThrow();
  });
  it("limits integration management to configured administrators", () => {
    vi.stubEnv(
      "CRM_INTEGRATION_ADMINS",
      "owner@example.com, OTHER@example.com",
    );
    expect(integrationAdmin("OWNER@example.com")).toBe(true);
    expect(integrationAdmin("outsider@gmail.com")).toBe(false);
  });
  it("rejects unsafe configured origins and cross-site writes", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CRM_ORIGIN", "https://everydaystravel.co.uk");
    expect(crmOrigin()).toBe("https://everydaystravel.co.uk");
    expect(() =>
      assertOrigin(
        new Request("https://everydaystravel.co.uk/api/crm", {
          method: "POST",
          headers: { origin: "https://evil.test" },
        }),
      ),
    ).toThrow();
    expect(() =>
      assertOrigin(
        new Request("https://everydaystravel.co.uk/api/crm", {
          method: "POST",
        }),
      ),
    ).toThrow();
    expect(() =>
      assertOrigin(
        new Request("https://everydaystravel.co.uk/api/crm", {
          method: "POST",
          headers: { origin: "https://everydaystravel.co.uk" },
        }),
      ),
    ).not.toThrow();
    vi.stubEnv("CRM_ORIGIN", "http://everydaystravel.co.uk");
    expect(() => crmOrigin()).toThrow();
  });
});
