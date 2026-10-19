import { AsyncLocalStorage } from "node:async_hooks";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { mkdir, readFile, writeFile, rename, unlink } from "node:fs/promises";
import { join } from "node:path";
import { localDirectory } from "./store";
import type { CalendarItem, Mail } from "./model";
import { londonToUtc, monthDays, shiftDay } from "./calendar";

import { hostedStorage } from "./firebase-admin";
import {
  connectionEnvelope,
  readHostedConnection,
  writeHostedConnection,
  clearHostedConnection,
} from "./connection-store";

export const googleContext = new AsyncLocalStorage<string>();
class GoogleRequestError extends Error {
  noExternalWrite = true;
}
const SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar.events",
];
type GoogleConnection = {
  generation?: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
  scopes: string[];
};
const tokenPath = join(localDirectory, "google.enc");
let tokenQueue: Promise<unknown> = Promise.resolve();
export function googleAuthorizationUrl(
  clientId: string,
  redirect: string,
  state: string,
  challenge: string,
) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirect,
    response_type: "code",
    scope: SCOPES.join(" "),
    state,
    access_type: "offline",
    prompt: "consent",
    code_challenge: challenge,
    code_challenge_method: "S256",
    hd: "everydaystravel.co.uk",
  }).toString();
  return url.toString();
}
export function googleConfigured() {
  return Boolean(
    process.env.CRM_GOOGLE_CLIENT_ID && process.env.CRM_GOOGLE_CLIENT_SECRET,
  );
}
export function pkce() {
  const verifier = randomBytes(32).toString("base64url");
  return {
    verifier,
    challenge: createHash("sha256").update(verifier).digest("base64url"),
  };
}
async function encryptionKey() {
  await mkdir(localDirectory, { recursive: true, mode: 0o700 });
  const file = join(localDirectory, "encryption.key");
  try {
    return await readFile(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  try {
    await writeFile(file, randomBytes(32), { flag: "wx", mode: 0o600 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
  return readFile(file);
}
async function readConnection(): Promise<GoogleConnection | null> {
  if (hostedStorage()) return readHostedConnection<GoogleConnection>();
  let bytes: Buffer;
  try {
    bytes = await readFile(tokenPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    await encryptionKey(),
    bytes.subarray(0, 12),
  );
  decipher.setAuthTag(bytes.subarray(12, 28));
  return JSON.parse(
    Buffer.concat([
      decipher.update(bytes.subarray(28)),
      decipher.final(),
    ]).toString("utf8"),
  );
}
async function saveConnection(
  connection: GoogleConnection,
  expected = connection.generation || "",
  reconnect = false,
) {
  if (hostedStorage()) {
    await writeHostedConnection(connection, expected, reconnect);
    return;
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", await encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(connection)),
    cipher.final(),
  ]);
  const temp = `${tokenPath}.${randomBytes(8).toString("hex")}.tmp`;
  await writeFile(temp, Buffer.concat([iv, cipher.getAuthTag(), encrypted]), {
    mode: 0o600,
  });
  await rename(temp, tokenPath);
}
async function googleFetch(url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    const failure = await response.json().catch(() => null);
    const disabled = failure?.error?.details?.find(
      (detail: { reason?: string }) => detail.reason === "SERVICE_DISABLED",
    );
    if (disabled)
      throw new GoogleRequestError(
        `${disabled.metadata?.service === "gmail.googleapis.com" ? "Gmail API" : "Google Calendar API"} is disabled in your Google Cloud project. Enable it, wait a few minutes, then sync again.`,
      );
    const Failure =
      response.status >= 400 && response.status < 500 && response.status !== 408
        ? GoogleRequestError
        : Error;
    throw new Failure(
      response.status === 401 || response.status === 403
        ? "Google access was denied. Check API permissions or reconnect your account."
        : `Google request failed (${response.status}). Please try again.`,
    );
  }
  return response.json();
}
export async function finishGoogleConnection(
  code: string,
  verifier: string,
  redirect: string,
  generation = "",
) {
  if (!googleConfigured())
    throw new Error("Google OAuth credentials have not been configured");
  const token = await googleFetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.CRM_GOOGLE_CLIENT_ID!,
      client_secret: process.env.CRM_GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirect,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });
  const user = await googleFetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    { headers: { Authorization: `Bearer ${token.access_token}` } },
  );
  if (
    !user.email_verified ||
    user.hd !== "everydaystravel.co.uk" ||
    !String(user.email).endsWith("@everydaystravel.co.uk")
  )
    throw new Error(
      "Connect a verified everydaystravel.co.uk Google Workspace account",
    );
  const scopes: string[] = String(token.scope || "").split(" ");
  if (
    SCOPES.filter((s) => s.startsWith("https://")).some(
      (s) => !scopes.includes(s),
    )
  )
    throw new Error(
      "Allow both Gmail and Calendar permissions, then reconnect",
    );
  if (!token.refresh_token)
    throw new Error(
      "Google did not provide offline access. Reconnect and grant consent.",
    );
  await saveConnection(
    {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + token.expires_in * 1000,
      email: user.email,
      scopes,
    },
    generation,
    true,
  );
}
async function accessToken(): Promise<string> {
  const operation = tokenQueue
    .catch(() => {})
    .then(async () => {
      const connection = await readConnection();
      if (!connection)
        throw new GoogleRequestError(
          "Connect your Google account in Integrations first",
        );
      const expected = googleContext.getStore();
      if (expected !== undefined && (connection.generation || "") !== expected)
        throw new GoogleRequestError(
          "Google connection changed. Please retry.",
        );
      if (connection.expiresAt > Date.now() + 60000)
        return connection.accessToken;
      const token = await googleFetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.CRM_GOOGLE_CLIENT_ID!,
          client_secret: process.env.CRM_GOOGLE_CLIENT_SECRET!,
          refresh_token: connection.refreshToken,
          grant_type: "refresh_token",
        }),
      });
      connection.accessToken = token.access_token;
      connection.expiresAt = Date.now() + token.expires_in * 1000;
      await saveConnection(connection);
      return connection.accessToken;
    });
  tokenQueue = operation;
  return operation;
}
export async function connectionStatus() {
  const connection = await readConnection();
  return {
    configured: googleConfigured(),
    connected: Boolean(connection),
    email: connection?.email || null,
  };
}
export async function disconnectGoogle() {
  const envelope = hostedStorage() ? await connectionEnvelope() : null;
  const connection = envelope?.secret
    ? await readHostedConnection<GoogleConnection>()
    : hostedStorage()
      ? null
      : await readConnection();
  if (envelope && connection && envelope.generation !== connection.generation)
    throw new Error("Google connection changed. Refresh before disconnecting.");
  // Revoke first; if Google is unavailable retain the connection and show an error.
  if (connection) {
    const result = await fetch("https://oauth2.googleapis.com/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: connection.refreshToken }),
      signal: AbortSignal.timeout(20000),
    });
    if (!result.ok && result.status !== 400)
      throw new Error("Google could not revoke access. Please try again.");
  }
  if (hostedStorage()) {
    return clearHostedConnection(envelope!.generation);
  }
  await unlink(tokenPath).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  return "";
}
export async function googleApi(path: string, init: RequestInit = {}) {
  if (
    !path.startsWith("https://gmail.googleapis.com/") &&
    !path.startsWith("https://www.googleapis.com/calendar/")
  )
    throw new Error("Unsupported Google endpoint");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${await accessToken()}`);
  return googleFetch(path, { ...init, headers });
}
type MimePart = {
  mimeType?: string;
  body?: { data?: string };
  parts?: MimePart[];
  headers?: { name: string; value: string }[];
};
function plainText(part: MimePart): string {
  if (part.mimeType === "text/plain" && part.body?.data)
    return Buffer.from(part.body.data, "base64url").toString("utf8");
  return (part.parts || []).map(plainText).filter(Boolean).join("\n");
}
export async function fetchGoogleWorkspace(): Promise<{
  messages: Mail[];
  events: CalendarItem[];
}> {
  const [list, calendar] = await Promise.all([
    googleApi(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=30&q=in%3Ainbox",
    ),
    googleApi(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=30&singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(new Date().toISOString())}`,
    ),
  ]);
  const messages: Mail[] = [];
  // Bound concurrency; avoid a burst of 30 token refreshes/API requests.
  const ids: { id: string }[] = list.messages || [];
  for (let i = 0; i < ids.length; i += 5) {
    const batch = await Promise.all(
      ids.slice(i, i + 5).map(async ({ id }) => {
        const mail = await googleApi(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(id)}?format=full`,
        );
        const headers: { name: string; value: string }[] =
          mail.payload?.headers || [];
        const header = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name)?.value || "";
        return {
          id: mail.id,
          threadId: mail.threadId,
          from: header("from"),
          to: header("to"),
          subject: header("subject") || "(No subject)",
          snippet: mail.snippet || "",
          body: plainText(mail.payload || {}) || mail.snippet || "",
          date: new Date(Number(mail.internalDate)).toISOString(),
          messageId: header("message-id"),
          unread: (mail.labelIds || []).includes("UNREAD"),
        };
      }),
    );
    messages.push(...batch);
  }
  const events: CalendarItem[] = (calendar.items || []).map(
    (e: {
      id: string;
      summary?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
      htmlLink?: string;
    }) => ({
      id: e.id,
      summary: e.summary || "(Untitled event)",
      start: e.start?.dateTime || e.start?.date || "",
      end: e.end?.dateTime || e.end?.date || "",
      allDay: Boolean(e.start?.date),
      url: e.htmlLink,
    }),
  );
  return { messages, events };
}

export async function fetchGoogleMonth(month: string): Promise<CalendarItem[]> {
  const days = monthDays(month);
  const query = new URLSearchParams({
    maxResults: "2500",
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: londonToUtc(`${days[0]}T00:00`),
    timeMax: londonToUtc(`${shiftDay(days[41], 1)}T00:00`),
  });
  const events: CalendarItem[] = [];
  let page = "";
  for (let i = 0; i < 10; i++) {
    if (page) query.set("pageToken", page);
    const result = await googleApi(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${query}`,
    );
    for (const event of result.items || []) {
      if (event.status === "cancelled" || !event.start) continue;
      events.push({
        id: event.id,
        summary: event.summary || "(Untitled event)",
        start: event.start.dateTime || event.start.date || "",
        end: event.end?.dateTime || event.end?.date || "",
        allDay: Boolean(event.start.date),
        url: event.htmlLink,
      });
    }
    page = result.nextPageToken || "";
    if (!page) return events;
  }
  throw new Error(
    "This calendar month has too many events to load completely. Narrow the connected calendar before retrying.",
  );
}

export async function googleConnectionGeneration() {
  return hostedStorage() ? (await connectionEnvelope()).generation : "";
}
