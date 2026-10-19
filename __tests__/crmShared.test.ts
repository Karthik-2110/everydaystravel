import { describe, expect, it } from "vitest";
import {
  encodeWorkspace,
  decodeWorkspace,
  changesFor,
  emptyWorkspace,
} from "@/app/lib/crm/shared-records";
import { encryptSecret, decryptSecret } from "@/app/lib/crm/secrets";
describe("shared workspace records", () => {
  it("round trips separate records without growing a single workspace document", () => {
    const state = emptyWorkspace();
    state.calendarMonths = { "2026-10": [] };
    state.sendAttempts = { abc: { fingerprint: "x", status: "pending" } };
    const encoded = encodeWorkspace(state);
    expect(decodeWorkspace(encoded)).toEqual(state);
    expect(Object.keys(encoded).some((k) => k.startsWith("attempt_"))).toBe(
      true,
    );
  });
  it("only writes changed records and rejects oversized documents", () => {
    const before = encodeWorkspace(emptyWorkspace());
    expect(changesFor(before, before)).toEqual([]);
    expect(() =>
      encodeWorkspace({
        ...emptyWorkspace(),
        messages: [{ id: "a", body: "x".repeat(600000) } as never],
      }),
    ).toThrow(/large/);
  });
  it("encrypts with a stable server key and detects tampering", () => {
    const key = Buffer.alloc(32, 7).toString("base64");
    const value = encryptSecret({ refreshToken: "private" }, key);
    expect(JSON.stringify(value)).not.toContain("private");
    expect(decryptSecret(value, key)).toEqual({ refreshToken: "private" });
    expect(() =>
      decryptSecret(
        { ...value, tag: Buffer.alloc(16).toString("base64") },
        key,
      ),
    ).toThrow();
    expect(() => encryptSecret({}, "invalid")).toThrow();
  });
});
