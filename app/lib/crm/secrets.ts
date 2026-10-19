import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
export type EncryptedSecret = { iv: string; tag: string; data: string };
function keyFrom(value: string) {
  const key = Buffer.from(value, "base64");
  if (key.length !== 32)
    throw new Error(
      "CRM_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key",
    );
  return key;
}
export function encryptSecret(value: unknown, key: string): EncryptedSecret {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFrom(key), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return {
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64"),
  };
}
export function decryptSecret(value: EncryptedSecret, key: string): unknown {
  const cipher = createDecipheriv(
    "aes-256-gcm",
    keyFrom(key),
    Buffer.from(value.iv, "base64"),
  );
  cipher.setAuthTag(Buffer.from(value.tag, "base64"));
  return JSON.parse(
    Buffer.concat([
      cipher.update(Buffer.from(value.data, "base64")),
      cipher.final(),
    ]).toString("utf8"),
  );
}
