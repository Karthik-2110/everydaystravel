import { randomUUID } from "node:crypto";
import { crmDatabase } from "./firebase-admin";
import { encryptSecret, decryptSecret, type EncryptedSecret } from "./secrets";
export type HostedConnection = { generation: string; secret?: EncryptedSecret };
const ref = () => crmDatabase().collection("crmPrivate").doc("google");
function key() {
  const value = process.env.CRM_TOKEN_ENCRYPTION_KEY;
  if (!value) throw new Error("CRM token encryption is not configured");
  return value;
}
export async function connectionEnvelope(): Promise<HostedConnection> {
  const saved = await ref().get();
  return saved.exists ? (saved.data() as HostedConnection) : { generation: "" };
}
export async function readHostedConnection<T>(): Promise<
  (T & { generation: string }) | null
> {
  const saved = await connectionEnvelope();
  return saved.secret
    ? {
        ...(decryptSecret(saved.secret, key()) as T),
        generation: saved.generation,
      }
    : null;
}
export async function writeHostedConnection(
  value: unknown,
  expected: string,
  reconnect = false,
) {
  const secret = encryptSecret(value, key());
  await crmDatabase().runTransaction(async (tx) => {
    const current = await tx.get(ref());
    if ((current.data()?.generation || "") !== expected)
      throw new Error("Google connection changed. Please reconnect or retry.");
    tx.set(ref(), { generation: reconnect ? randomUUID() : expected, secret });
  });
}
export async function clearHostedConnection(expected: string) {
  const generation = randomUUID();
  await crmDatabase().runTransaction(async (tx) => {
    const current = await tx.get(ref());
    if ((current.data()?.generation || "") !== expected)
      throw new Error(
        "Google connection changed. Refresh before disconnecting.",
      );
    tx.set(ref(), { generation });
  });
  return generation;
}
