import { randomUUID } from "node:crypto";
import type { WorkspaceBackend, Workspace } from "./store";
export type ExternalOperation = {
  fingerprint: string;
  token: string;
  status: "pending" | "done" | "unknown";
  at: string;
  writeStarted?: boolean;
};
export async function externalOperation<T>(
  repository: WorkspaceBackend,
  key: string,
  fingerprint: string,
  prepare: (state: Workspace) => T,
  perform: (prepared: T, markWrite: () => Promise<void>) => Promise<unknown>,
  commit: (state: Workspace, result: unknown) => void,
) {
  const token = randomUUID();
  const prepared = await repository.mutate((state) => {
    state.operations ||= {};
    const old = state.operations[key];
    if (old && old.status !== "done")
      throw new Error(
        "A previous Google update is pending or unconfirmed. Check Google before retrying; an administrator must resolve the operation.",
      );
    if (old?.fingerprint === fingerprint && old.status === "done")
      return { done: true as const };
    const value = prepare(state);
    state.operations[key] = {
      token,
      fingerprint,
      status: "pending",
      at: new Date().toISOString(),
    };
    return { done: false as const, value: structuredClone(value) };
  });
  if (prepared.done) return;
  let writeStarted = false;
  try {
    const result = await perform(prepared.value, async () => {
      await repository.mutate((state) => {
        if (
          state.operations?.[key]?.token !== token ||
          state.operations[key].status !== "pending"
        )
          throw new Error("Google update ownership changed");
        state.operations[key].writeStarted = true;
        state.operations[key].at = new Date().toISOString();
      });
      writeStarted = true;
    });
    await repository.mutate((state) => {
      if (
        state.operations?.[key]?.token !== token ||
        state.operations[key].status !== "pending"
      )
        throw new Error(
          "Google update ownership changed. Check Google before retrying.",
        );
      commit(state, result);
      state.operations[key].status = "done";
    });
  } catch (error) {
    await repository
      .mutate((state) => {
        if (
          state.operations?.[key]?.token === token &&
          state.operations[key].status === "pending"
        ) {
          if (
            !writeStarted ||
            (error as { noExternalWrite?: boolean })?.noExternalWrite
          )
            delete state.operations[key];
          else state.operations[key].status = "unknown";
        }
      })
      .catch(() => {});
    throw error;
  }
}
export function assertNoExternalUpdate(state: Workspace, key: string) {
  if (state.operations?.[key] && state.operations[key].status !== "done")
    throw new Error(
      "This record has an unconfirmed Google update. Ask an administrator to check Google before changing it.",
    );
}
