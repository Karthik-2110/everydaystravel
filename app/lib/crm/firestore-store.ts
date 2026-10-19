import { AsyncLocalStorage } from "node:async_hooks";
import { Timestamp } from "firebase-admin/firestore";
import { crmDatabase } from "./firebase-admin";
import {
  encodeWorkspace,
  decodeWorkspace,
  changesFor,
  type Records,
} from "./shared-records";
import type { Workspace } from "./store";
import type { Staff } from "./auth-policy";
export const actorContext = new AsyncLocalStorage<Staff>();
export function firestoreBackend() {
  const root = () => crmDatabase().collection("crmWorkspaces").doc("everydays");
  async function mutate<T>(
    fn: (state: Workspace) => T | Promise<T>,
    write = true,
  ): Promise<T> {
    const workspace = root();
    return crmDatabase().runTransaction(async (tx) => {
      const lock = await tx.get(workspace);
      const connection = await tx.get(
        crmDatabase().collection("crmPrivate").doc("google"),
      );
      const rows = await tx.get(workspace.collection("records").limit(4001));
      if (rows.size > 4000)
        throw new Error(
          "Workspace capacity reached. Contact an administrator.",
        );
      const before: Records = Object.fromEntries(
        rows.docs.map((row) => [
          row.id,
          row.data() as import("./shared-records").StoredRecord,
        ]),
      );
      const state = decodeWorkspace(before);
      state.connectionGeneration = connection.data()?.generation || "";
      const result = await fn(state);
      if (write) {
        const changes = changesFor(before, encodeWorkspace(state));
        if (changes.length > 450)
          throw new Error(
            "Too many records changed at once. Import smaller batches.",
          );
        for (const change of changes) {
          const ref = workspace.collection("records").doc(change.id);
          if (change.record) tx.set(ref, change.record);
          else tx.delete(ref);
        }
        tx.set(
          workspace,
          {
            revision: (lock.data()?.revision || 0) + 1,
            updatedAt: Timestamp.now(),
          },
          { merge: true },
        );
        const actor = actorContext.getStore();
        tx.create(workspace.collection("audit").doc(), {
          actorUid: actor?.uid || "system",
          actorEmail: actor?.email || "system",
          at: Timestamp.now(),
          deleteAfter: Timestamp.fromMillis(Date.now() + 730 * 86400000),
          changed: changes.map((c) => c.id),
        });
      }
      return result;
    });
  }
  return { read: () => mutate((state) => state, false), mutate };
}
