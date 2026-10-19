import { describe, it, expect } from "vitest";
import { assertConnectionGeneration } from "@/app/lib/crm/connection-policy";
import { emptyWorkspace } from "@/app/lib/crm/shared-records";
import { externalOperation } from "@/app/lib/crm/operations";
describe("Google operation recovery", () => {
  it("rejects stale sync results after disconnect or reconnect", () => {
    expect(() =>
      assertConnectionGeneration(
        { ...emptyWorkspace(), connectionGeneration: "new" },
        "old",
      ),
    ).toThrow(/connection changed/i);
    expect(() =>
      assertConnectionGeneration(
        { ...emptyWorkspace(), connectionGeneration: "new" },
        "new",
      ),
    ).not.toThrow();
  });
  it("allows local edits after an error before any external write", async () => {
    const state = emptyWorkspace();
    const repo = {
      read: async () => state,
      mutate: async <T>(fn: (s: typeof state) => T | Promise<T>) => fn(state),
    };
    await expect(
      externalOperation(
        repo,
        "booking:a",
        "r1",
        () => 1,
        async () => {
          throw Error("API disabled");
        },
        () => {},
      ),
    ).rejects.toThrow();
    expect(state.operations?.["booking:a"]).toBeUndefined();
  });
  it("retains an ambiguous write claim until administrator review", async () => {
    const state = emptyWorkspace();
    const repo = {
      read: async () => state,
      mutate: async <T>(fn: (s: typeof state) => T | Promise<T>) => fn(state),
    };
    await expect(
      externalOperation(
        repo,
        "booking:a",
        "r1",
        () => 1,
        async (_value, markWrite) => {
          await markWrite();
          throw Error("timeout");
        },
        () => {},
      ),
    ).rejects.toThrow();
    expect(state.operations?.["booking:a"].status).toBe("unknown");
  });
});

describe("released operation ownership", () => {
  it("prevents an old worker from writing after an administrator releases its claim", async () => {
    const state = emptyWorkspace();
    const repo = {
      read: async () => state,
      mutate: async <T>(fn: (s: typeof state) => T | Promise<T>) => fn(state),
    };
    let writes = 0;
    await expect(
      externalOperation(
        repo,
        "booking:a",
        "old",
        () => 1,
        async (_value, markWrite) => {
          const claim = state.operations!["booking:a"];
          claim.status = "done";
          await markWrite();
          writes++;
          return 1;
        },
        () => {},
      ),
    ).rejects.toThrow(/ownership/);
    expect(writes).toBe(0);
  });
});
