export type Stage = "new" | "quoted" | "won" | "lost";
export type Channel = "website" | "phone" | "whatsapp" | "email" | "instagram";
export type Note = { id: string; body: string; createdAt: string };
export type Lead = {
  id: string;
  revision: number;
  name: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  channel: Channel;
  stage: Stage;
  pickup: string;
  destination: string;
  travelDate: string;
  passengers: string;
  vehicle: string;
  owner: string;
  quotedAmount: number;
  wonAmount: number;
  lostReason: string;
  nextAction: string;
  nextActionAt: string;
  createdAt: string;
  updatedAt: string;
  firstRespondedAt: string | null;
  notes: Note[];
  calendarEventId?: string;
  sourceMailIds?: string[];
  sourceThreadIds?: string[];
};
export type Mail = {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  messageId: string;
  unread: boolean;
};
export type CalendarItem = {
  id: string;
  summary: string;
  start: string;
  end?: string;
  allDay?: boolean;
  url?: string;
};
export const STAGES: { id: Stage; label: string }[] = [
  { id: "new", label: "New enquiry" },
  { id: "quoted", label: "Quote sent" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];
export const LOST_REASONS = [
  "Price",
  "Availability",
  "No reply",
  "Booked elsewhere",
  "Not genuine",
  "Other",
];
export const CHANNELS: Channel[] = [
  "website",
  "phone",
  "whatsapp",
  "email",
  "instagram",
];

function text(input: Record<string, unknown>, key: string, max = 500): string {
  if (input[key] === undefined) return "";
  if (typeof input[key] !== "string") throw new Error(`Invalid ${key}`);
  const value = input[key].trim();
  if (value.length > max) throw new Error(`${key} is too long`);
  return value;
}
export function validDate(value: string): boolean {
  return Boolean(value && Number.isFinite(new Date(value).getTime()));
}
export function createLead(
  input: Record<string, unknown>,
  now = new Date().toISOString(),
): Lead {
  const base: Lead = {
    id: crypto.randomUUID(),
    revision: 0,
    name: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    channel: "phone",
    stage: "new",
    pickup: "",
    destination: "",
    travelDate: "",
    passengers: "",
    vehicle: "",
    owner: "",
    quotedAmount: 0,
    wonAmount: 0,
    lostReason: "",
    nextAction: "Contact customer",
    nextActionAt: new Date(Date.parse(now) + 3600000).toISOString(),
    createdAt: now,
    updatedAt: now,
    firstRespondedAt: null,
    notes: [],
  };
  return updateLead(base, input, now);
}
export function updateLead(
  lead: Lead,
  input: Record<string, unknown>,
  now = new Date().toISOString(),
): Lead {
  const next: Lead = {
    ...lead,
    notes: [...lead.notes],
    updatedAt: now,
    revision: lead.revision + 1,
  };
  const keys = [
    "name",
    "phone",
    "email",
    "company",
    "title",
    "pickup",
    "destination",
    "travelDate",
    "passengers",
    "vehicle",
    "owner",
    "nextAction",
    "nextActionAt",
    "lostReason",
  ] as const;
  for (const key of keys)
    if (input[key] !== undefined) next[key] = text(input, key);
  if (!next.name) throw new Error("Name is required");
  if (!next.phone && !next.email)
    throw new Error("A phone number or email is required");
  if (next.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(next.email))
    throw new Error("Enter a valid email");
  if (!next.title) next.title = "Journey details to confirm";
  if (input.stage !== undefined) {
    if (!STAGES.some((s) => s.id === input.stage))
      throw new Error("Invalid pipeline stage");
    next.stage = input.stage as Stage;
  }
  if (input.channel !== undefined) {
    if (!CHANNELS.includes(input.channel as Channel))
      throw new Error("Invalid channel");
    next.channel = input.channel as Channel;
  }
  if (next.stage === "lost" && !LOST_REASONS.includes(next.lostReason))
    throw new Error("Choose a reason for the lost enquiry");
  if (next.stage !== "lost") next.lostReason = "";
  for (const key of ["quotedAmount", "wonAmount"] as const)
    if (input[key] !== undefined) {
      if (!Number.isSafeInteger(input[key]) || Number(input[key]) < 0)
        throw new Error("Invalid amount; use non-negative integer pence");
      next[key] = Number(input[key]);
    }
  for (const key of ["travelDate", "nextActionAt"] as const)
    if (next[key] && !validDate(next[key]))
      throw new Error("Enter a valid date");
  if (next.travelDate && !/^\d{4}-\d{2}-\d{2}$/.test(next.travelDate))
    throw new Error("Enter a valid travel date");
  if (
    next.passengers &&
    (!/^\d+$/.test(next.passengers) ||
      Number(next.passengers) < 1 ||
      Number(next.passengers) > 9999)
  )
    throw new Error("Enter a valid passenger count");
  const note = text(input, "note", 10000);
  if (note)
    next.notes.push({ id: crypto.randomUUID(), body: note, createdAt: now });
  if (!next.firstRespondedAt && (next.stage !== "new" || note))
    next.firstRespondedAt = now;
  return next;
}
export function buildReply(input: {
  to: string;
  subject: string;
  body: string;
  messageId?: string;
}): string {
  if (
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(input.to) ||
    /[\r\n]/.test(input.subject + input.to + (input.messageId || ""))
  )
    throw new Error("Invalid email headers");
  if (!input.body.trim() || input.body.length > 100000)
    throw new Error("Enter a reply of up to 100,000 characters");
  const headers = [
    `To: ${input.to}`,
    `Subject: =?UTF-8?B?${Buffer.from(input.subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
  ];
  if (input.messageId)
    headers.push(
      `In-Reply-To: ${input.messageId}`,
      `References: ${input.messageId}`,
    );
  return Buffer.from(
    `${headers.join("\r\n")}\r\n\r\n${Buffer.from(input.body).toString("base64")}`,
  ).toString("base64url");
}
export function calendarEvent(lead: Lead, start: string) {
  if (!validDate(start))
    throw new Error("Choose a valid date for the follow-up");
  return {
    summary: `${lead.nextAction || "Follow up"}: ${lead.name}`,
    description: `${lead.title}\n${lead.phone}\n${lead.email}\n${lead.pickup} → ${lead.destination}`,
    start: {
      dateTime: new Date(start).toISOString(),
      timeZone: "Europe/London",
    },
    end: {
      dateTime: new Date(Date.parse(start) + 1800000).toISOString(),
      timeZone: "Europe/London",
    },
  };
}
