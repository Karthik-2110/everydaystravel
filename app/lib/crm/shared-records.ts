import { createHash } from "node:crypto";
import type { Workspace } from "./store";
export type StoredRecord = { kind: string; key: string; value: unknown };
export type Records = Record<string, StoredRecord>;
export function emptyWorkspace(): Workspace {
  return {
    leads: [],
    messages: [],
    events: [],
    bookings: [],
    vehicles: [],
    syncedAt: null,
    calendarMonths: {},
    sendAttempts: {},
    operations: {},
  };
}
const families = {
  leads: "lead",
  messages: "mail",
  events: "event",
  bookings: "booking",
  vehicles: "vehicle",
} as const;
export function encodeWorkspace(state: Workspace): Records {
  const records: Records = {};
  const add = (kind: string, key: string, value: unknown) => {
    const clean = JSON.parse(JSON.stringify(value));
    if (Buffer.byteLength(JSON.stringify(clean)) > 500000)
      throw new Error(
        "CRM record is too large. Shorten the content before saving.",
      );
    records[`${kind}_${createHash("sha256").update(key).digest("hex")}`] = {
      kind,
      key,
      value: clean,
    };
  };
  for (const [field, kind] of Object.entries(families))
    for (const value of state[field as keyof typeof families])
      add(kind, value.id, value);
  for (const [key, value] of Object.entries(state.calendarMonths || {}))
    add("month", key, value);
  for (const [key, value] of Object.entries(state.sendAttempts || {}))
    add("attempt", key, value);
  for (const [key, value] of Object.entries(state.operations || {}))
    add("operation", key, value);
  if (state.cacheGeneration !== undefined)
    add("meta", "cacheGeneration", state.cacheGeneration);
  if (state.importFingerprint)
    add("meta", "importFingerprint", state.importFingerprint);
  add("meta", "syncedAt", state.syncedAt);
  if (Object.keys(records).length > 4000)
    throw new Error(
      "Workspace capacity reached. Archive old records before continuing.",
    );
  return records;
}
export function decodeWorkspace(records: Records): Workspace {
  const state = emptyWorkspace();
  for (const record of Object.values(records)) {
    const field = Object.entries(families).find(
      ([, kind]) => kind === record.kind,
    )?.[0];
    if (field)
      (state[field as keyof typeof families] as unknown[]).push(record.value);
    else if (record.kind === "month")
      state.calendarMonths![record.key] = record.value as Workspace["events"];
    else if (record.kind === "attempt")
      state.sendAttempts![record.key] = record.value as NonNullable<
        Workspace["sendAttempts"]
      >[string];
    else if (record.kind === "operation")
      state.operations![record.key] = record.value as NonNullable<
        Workspace["operations"]
      >[string];
    else if (record.kind === "meta" && record.key === "cacheGeneration")
      state.cacheGeneration = String(record.value);
    else if (record.kind === "meta" && record.key === "importFingerprint")
      state.importFingerprint = String(record.value);
    else if (record.kind === "meta" && record.key === "syncedAt")
      state.syncedAt = record.value as string | null;
  }
  state.leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  state.bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  state.messages.sort((a, b) => b.date.localeCompare(a.date));
  return state;
}
export function changesFor(before: Records, after: Records) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((id) => JSON.stringify(before[id]) !== JSON.stringify(after[id]))
    .map((id) => ({ id, record: after[id] || null }));
}
