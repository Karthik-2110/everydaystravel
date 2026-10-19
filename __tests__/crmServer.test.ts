import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertLocalRequest } from "@/app/lib/crm/security";
import { createRepository } from "@/app/lib/crm/store";
import { googleAuthorizationUrl } from "@/app/lib/crm/google";

afterEach(() => vi.unstubAllEnvs());
describe("local CRM access", () => {
  it("denies production, non-local hosts and cross-site writes", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(() =>
      assertLocalRequest(new Request("http://localhost:3000/api/crm")),
    ).not.toThrow();
    expect(() =>
      assertLocalRequest(new Request("http://example.com/api/crm")),
    ).toThrow();
    expect(() =>
      assertLocalRequest(
        new Request("http://localhost:3000/api/crm", {
          method: "POST",
          headers: { origin: "https://evil.com" },
        }),
      ),
    ).toThrow();
    vi.stubEnv("NODE_ENV", "production");
    expect(() =>
      assertLocalRequest(new Request("http://localhost:3000/api/crm")),
    ).toThrow();
  });
});
describe("local repository", () => {
  it("keeps linked deal value consistent when confirmed reservations are cancelled", async () => {
    const dir = await mkdtemp(join(tmpdir(), "et-linked-booking-"));
    try {
      const repo = createRepository(dir),
        lead = await repo.add({
          name: "Sarah",
          phone: "07700900123",
          quotedAmount: 100000,
        });
      const unit = await repo.addVehicle({
        name: "Coach",
        registration: "AB26 CDE",
        capacity: 53,
      });
      const input = {
        title: "Trip",
        customer: "Sarah",
        vehicleId: unit.id,
        leadId: lead.id,
        start: "2026-10-20T08:00:00.000Z",
        end: "2026-10-20T16:00:00.000Z",
        status: "confirmed",
        amount: 100000,
      };
      const first = await repo.saveBooking(input);
      const second = await repo.saveBooking({
        ...input,
        start: "2026-10-21T08:00:00.000Z",
        end: "2026-10-21T16:00:00.000Z",
        amount: 50000,
      });
      expect((await repo.read()).leads[0].wonAmount).toBe(150000);
      await repo.saveBooking({
        id: first.id,
        revision: first.revision,
        status: "cancelled",
      });
      expect((await repo.read()).leads[0]).toMatchObject({
        stage: "won",
        wonAmount: 50000,
      });
      await repo.saveBooking({
        id: second.id,
        revision: second.revision,
        status: "cancelled",
      });
      expect((await repo.read()).leads[0]).toMatchObject({
        stage: "quoted",
        wonAmount: 0,
        nextAction: "Review cancelled booking",
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
  it("serializes overlapping reservations and releases a cancelled booking", async () => {
    const dir = await mkdtemp(join(tmpdir(), "et-booking-test-"));
    try {
      const repo = createRepository(dir);
      const vehicle = await repo.addVehicle({
        name: "Coach",
        registration: "AB26 CDE",
        capacity: 53,
      });
      const input = {
        title: "School trip",
        customer: "Sarah",
        vehicleId: vehicle.id,
        start: "2026-10-20T08:00:00.000Z",
        end: "2026-10-20T16:00:00.000Z",
        status: "hold",
        passengers: 49,
      };
      const results = await Promise.allSettled([
        repo.saveBooking(input),
        repo.saveBooking(input),
      ]);
      expect(
        results.filter((result) => result.status === "fulfilled"),
      ).toHaveLength(1);
      const [booking] = (await repo.read()).bookings;
      await repo.saveBooking({
        id: booking.id,
        revision: booking.revision,
        status: "cancelled",
      });
      await expect(repo.saveBooking(input)).resolves.toMatchObject({
        status: "hold",
      });
      await expect(
        repo.addVehicle({
          name: "Other",
          registration: "AB26CDE",
          capacity: 53,
        }),
      ).rejects.toThrow("registration");
      await expect(
        repo.addVehicle({
          name: "Other",
          registration: "AB26-CDE",
          capacity: 53,
        }),
      ).rejects.toThrow("registration");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
  it("imports an email once and links its reviewed details to the funnel", async () => {
    const dir = await mkdtemp(join(tmpdir(), "et-intake-test-"));
    try {
      const repo = createRepository(dir);
      await repo.mutate((state) => {
        state.messages = [
          {
            id: "mail-one",
            threadId: "thread-one",
            from: "Sarah <sarah@example.com>",
            to: "",
            subject: "Quote request",
            body: "Please quote",
            snippet: "",
            date: new Date().toISOString(),
            unread: true,
            messageId: "",
          },
        ];
      });
      const input = {
        sourceMailId: "mail-one",
        name: "Sarah",
        email: "sarah@example.com",
        title: "Reviewed trip",
      };
      const a = await repo.importMail(input);
      const b = await repo.importMail(input);
      expect(a.id).toBe(b.id);
      expect((await repo.read()).leads).toHaveLength(1);
      expect(a.sourceMailIds).toContain("mail-one");
      expect(a.stage).toBe("new");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
  it("persists concurrent additions and rejects stale edits", async () => {
    const dir = await mkdtemp(join(tmpdir(), "et-crm-test-"));
    try {
      const repo = createRepository(dir);
      const [a] = await Promise.all([
        repo.add({ name: "Sarah", phone: "07700900123" }),
        repo.add({ name: "James", phone: "07700900124" }),
      ]);
      expect((await createRepository(dir).read()).leads).toHaveLength(2);
      await repo.edit(a.id, { revision: 1, stage: "quoted" });
      await expect(
        repo.edit(a.id, { revision: 1, stage: "won" }),
      ).rejects.toThrow("changed");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
describe("Google consent", () => {
  it("uses an exact callback, state and PKCE with offline consent", () => {
    const url = new URL(
      googleAuthorizationUrl(
        "client",
        "http://localhost:3000/api/crm/google/callback",
        "state-value",
        "challenge",
      ),
    );
    expect(url.searchParams.get("state")).toBe("state-value");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("access_type")).toBe("offline");
    expect(url.searchParams.get("scope")).toContain("gmail.send");
  });
});
