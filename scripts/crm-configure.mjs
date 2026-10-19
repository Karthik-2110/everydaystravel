import { readFile, writeFile, rename } from "node:fs/promises";
import { randomBytes } from "node:crypto";
const root = new URL("../", import.meta.url);
try {
  const service = JSON.parse(
    await readFile(
      new URL(".crm-local/firebase-service-account.json", root),
      "utf8",
    ),
  );
  if (
    service.project_id !== "everydays-travel-crm" ||
    typeof service.client_email !== "string" ||
    !service.private_key?.startsWith("-----BEGIN PRIVATE KEY-----")
  )
    throw Error("Invalid Firebase service account for this project");
  const path = new URL(".env.local", root);
  let source = await readFile(path, "utf8").catch(() => "");
  const existing = Object.fromEntries(
    source
      .split("\n")
      .filter((l) => /^[A-Z_]+=/.test(l))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1)];
      }),
  );
  const entries = {
    FIREBASE_PROJECT_ID: service.project_id,
    FIREBASE_CLIENT_EMAIL: service.client_email,
    FIREBASE_PRIVATE_KEY: JSON.stringify(service.private_key),
    CRM_INTEGRATION_ADMINS: "web@everydaystravel.co.uk",
  };
  if (!existing.CRM_TOKEN_ENCRYPTION_KEY)
    entries.CRM_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("base64");
  source =
    source
      .split("\n")
      .filter((l) => !Object.keys(entries).some((k) => l.startsWith(k + "=")))
      .join("\n")
      .trimEnd() + "\n";
  for (const [key, value] of Object.entries(entries))
    source += `${key}=${value}\n`;
  const temp = new URL(".env.local.crm-tmp", root);
  await writeFile(temp, source, { mode: 0o600 });
  await rename(temp, path);
  console.log(
    "Firebase server credentials configured locally. No secret values displayed. Add the public Firebase web app settings, then restart the development server.",
  );
} catch {
  console.error(
    "Configuration not changed. Save a valid everydays-travel-crm service account at .crm-local/firebase-service-account.json and retry.",
  );
  process.exitCode = 1;
}
