import { describe, it, expect } from "vitest";
import {
  externalOperation,
  assertNoExternalUpdate,
} from "@/app/lib/crm/operations";
import { emptyWorkspace } from "@/app/lib/crm/shared-records";
import { domainRepository, type WorkspaceBackend } from "@/app/lib/crm/store";
// A shared transactional memory backend exercises the domain contract across repositories.
function shared() {
  let state = emptyWorkspace();
  let queue = Promise.resolve();
  const backend: WorkspaceBackend = {
    read: async () => structuredClone(state),
    mutate: (fn) => {
      const run = queue.then(async () => {
        const draft = structuredClone(state);
        const result = await fn(draft);
        state = draft;
        return result;
      });
      queue = run.then(
        () => {},
        () => {},
      );
      return run;
    },
  };
  return backend;
}
describe("durable external operation claims", () => {
  it("does not repeat a completed side effect on retry", async () => {
    const backend = shared();
    let count = 0;
    const run = () =>
      externalOperation(
        backend,
        "booking:a",
        "r1",
        () => 1,
        async () => ++count,
        () => {},
      );
    await run();
    await run();
    expect(count).toBe(1);
  });
  it("blocks concurrent updates and leaves an interrupted update unknown", async () => {
    const backend = shared();
    await expect(
      externalOperation(
        backend,
        "lead:a",
        "r1",
        () => 1,
        async (_value, markWrite) => {
          await markWrite();
          throw Error("network");
        },
        () => {},
      ),
    ).rejects.toThrow("network");
    expect((await backend.read()).operations?.["lead:a"].status).toBe(
      "unknown",
    );
    await expect(
      externalOperation(
        backend,
        "lead:a",
        "r1",
        () => 1,
        async () => 1,
        () => {},
      ),
    ).rejects.toThrow(/unconfirmed/);
    expect(() =>
      assertNoExternalUpdate(
        {
          ...emptyWorkspace(),
          operations: {
            "lead:a": {
              fingerprint: "r1",
              token: "x",
              status: "pending",
              at: "",
            },
          },
        },
        "lead:a",
      ),
    ).toThrow();
  });
  it("serializes independent repositories and rejects a concurrent vehicle overlap", async () => {
    const backend = shared();
    const a = domainRepository(backend),
      b = domainRepository(backend);
    const v = await a.addVehicle({
      name: "Sprinter",
      registration: "AB12 CDE",
      capacity: 16,
    });
    const input = {
      title: "Airport",
      customer: "Sam",
      vehicleId: v.id,
      start: "2026-11-01T10:00:00Z",
      end: "2026-11-01T12:00:00Z",
      passengers: 4,
      status: "hold",
    };
    const result = await Promise.allSettled([
      a.saveBooking(input),
      b.saveBooking(input),
    ]);
    expect(result.filter((x) => x.status === "fulfilled")).toHaveLength(1);
    expect((await backend.read()).bookings).toHaveLength(1);
  });
});
