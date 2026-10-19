import type { Workspace } from "./store";
export function assertConnectionGeneration(state: Workspace, expected: string) {
  if (
    state.connectionGeneration !== undefined &&
    state.connectionGeneration !== expected
  )
    throw new Error(
      "Google connection changed. Discarded the old sync; reconnect or retry.",
    );
}
