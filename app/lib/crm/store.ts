import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import {
  createVehicle,
  makeBooking,
  checkAvailability,
  type Booking,
  type VehicleUnit,
} from "./bookings";
import {
  createLead,
  updateLead,
  type CalendarItem,
  type Lead,
  type Mail,
} from "./model";

import { assertNoExternalUpdate, type ExternalOperation } from "./operations";
export type SendAttempt = {
  fingerprint: string;
  status: "pending" | "sent" | "unknown";
  gmailId?: string;
};
import { conversationFingerprint } from "./gemini";
import {
  compareWhatsAppMessages,
  type WhatsAppMessage,
} from "./whatsapp-model";
export type Workspace = {
  whatsAppMessages?: WhatsAppMessage[];
  whatsAppArchiveBefore?: Record<string, string>;
  whatsAppAnalyses?: Record<string, import("./gemini").ConversationAnalysis>;
  leads: Lead[];
  messages: Mail[];
  events: CalendarItem[];
  syncedAt: string | null;
  bookings: Booking[];
  vehicles: VehicleUnit[];
  calendarMonths?: Record<string, CalendarItem[]>;
  sendAttempts?: Record<string, SendAttempt>;
  operations?: Record<string, ExternalOperation>;
  importFingerprint?: string;
  connectionGeneration?: string;
  cacheGeneration?: string;
};
import { hostedStorage } from "./firebase-admin";
import { firestoreBackend } from "./firestore-store";

export type WorkspaceBackend = {
  read: () => Promise<Workspace>;
  mutate: <T>(fn: (state: Workspace) => T | Promise<T>) => Promise<T>;
};
const queues = new Map<string, Promise<unknown>>();
export function createRepository(directory: string) {
  const file = join(directory, "workspace.json");
  async function read(): Promise<Workspace> {
    try {
      const saved = JSON.parse(await readFile(file, "utf8"));
      return {
        ...saved,
        bookings: saved.bookings || [],
        vehicles: saved.vehicles || [],
        calendarMonths: saved.calendarMonths || {},
        whatsAppMessages: saved.whatsAppMessages || [],
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      return {
        leads: [],
        messages: [],
        events: [],
        syncedAt: null,
        bookings: [],
        vehicles: [],
        calendarMonths: {},
      };
    }
  }
  function mutate<T>(fn: (state: Workspace) => T | Promise<T>): Promise<T> {
    const operation = (queues.get(file) || Promise.resolve())
      .catch(() => {})
      .then(async () => {
        await mkdir(directory, { recursive: true, mode: 0o700 });
        const state = await read();
        const result = await fn(state);
        const temp = `${file}.${crypto.randomUUID()}.tmp`;
        await writeFile(temp, JSON.stringify(state, null, 2), { mode: 0o600 });
        await rename(temp, file);
        return result;
      });
    queues.set(file, operation);
    return operation;
  }
  return domainRepository({ read, mutate });
}
export function domainRepository({ read, mutate }: WorkspaceBackend) {
  return {
    read,
    mutate,
    receiveWhatsApp: (messages: WhatsAppMessage[]) =>
      mutate((state) => {
        state.whatsAppMessages ||= [];
        const known = new Map(state.whatsAppMessages.map((m) => [m.id, m]));
        const changed = new Set<string>();
        for (const message of messages)
          if (
            `${message.sentAt}|${message.id}` >
              (state.whatsAppArchiveBefore?.[message.conversationId] || "") &&
            !known.has(message.id)
          ) {
            known.set(message.id, message);
            changed.add(message.conversationId);
          }
        if (known.size > 2000)
          throw new Error(
            "WhatsApp message capacity reached. Archive conversations before continuing.",
          );
        state.whatsAppMessages = [...known.values()].sort((a, b) =>
          compareWhatsAppMessages(b, a),
        );
        state.whatsAppAnalyses ||= {};
        for (const id of changed)
          state.whatsAppAnalyses[id] = {
            id,
            token: crypto.randomUUID(),
            fingerprint: conversationFingerprint(
              state.whatsAppMessages.filter((m) => m.conversationId === id),
            ),
            status: "queued",
            updatedAt: new Date().toISOString(),
            attempts: 0,
          };
      }),
    archiveWhatsApp: (id: string, through: string) =>
      mutate((state) => {
        const candidates = (state.whatsAppMessages || [])
          .filter(
            (m) => m.conversationId === id && `${m.sentAt}|${m.id}` <= through,
          )
          .sort((a, b) => compareWhatsAppMessages(a, b))
          .slice(0, 200);
        if (!candidates.length) throw new Error("No messages to archive");
        const remove = new Set(candidates.map((m) => m.id));
        state.whatsAppMessages = (state.whatsAppMessages || []).filter(
          (m) => !remove.has(m.id),
        );
        const last = candidates[candidates.length - 1];
        state.whatsAppArchiveBefore ||= {};
        state.whatsAppArchiveBefore[id] = `${last.sentAt}|${last.id}`;
        const remaining = state.whatsAppMessages.filter(
          (m) => m.conversationId === id,
        );
        state.whatsAppAnalyses ||= {};
        if (!remaining.length) delete state.whatsAppAnalyses[id];
        else
          state.whatsAppAnalyses[id] = {
            id,
            token: crypto.randomUUID(),
            fingerprint: conversationFingerprint(remaining),
            status: "queued",
            updatedAt: new Date().toISOString(),
            attempts: 0,
          };
        return candidates.length;
      }),
    importWhatsApp: (input: Record<string, unknown>) =>
      mutate((state) => {
        const message = state.whatsAppMessages?.find(
          (m) => m.id === input.sourceWhatsAppId,
        );
        if (!message) throw new Error("WhatsApp source message not found");
        if (
          (process.env.WHATSAPP_PHONE_NUMBER_ID &&
            message.phoneId !== process.env.WHATSAPP_PHONE_NUMBER_ID) ||
          (process.env.WHATSAPP_BUSINESS_ACCOUNT_ID &&
            message.businessId !== process.env.WHATSAPP_BUSINESS_ACCOUNT_ID)
        )
          throw new Error("WhatsApp source account changed");
        const existing = state.leads.find((l) =>
          l.sourceWhatsAppIds?.includes(message.id),
        );
        if (existing) return existing;
        const target = input.targetLeadId
          ? state.leads.find((l) => l.id === input.targetLeadId)
          : undefined;
        if (input.targetLeadId && !target)
          throw new Error("Target enquiry not found");
        if (target) assertNoExternalUpdate(state, `lead:${target.id}`);
        const note = `WhatsApp request from ${message.name} (${message.phone}):\n${message.body.slice(0, 5000) || "[" + message.type + " message; review in WhatsApp]"}`;
        const lead = target
          ? updateLead(target, { note })
          : createLead({
              ...input,
              phone: message.phone,
              channel: "whatsapp",
              stage: "new",
              note,
            });
        lead.sourceWhatsAppIds = [
          ...(lead.sourceWhatsAppIds || []),
          message.id,
        ];
        state.leads = [lead, ...state.leads.filter((l) => l.id !== lead.id)];
        return lead;
      }),
    addVehicle: (input: Record<string, unknown>) =>
      mutate((state) => {
        const vehicle = createVehicle(input);
        if (
          state.vehicles.some(
            (v) =>
              v.registration.replace(/[\s-]/g, "") ===
              vehicle.registration.replace(/[\s-]/g, ""),
          )
        )
          throw new Error("This registration already exists");
        state.vehicles.push(vehicle);
        return vehicle;
      }),
    saveBooking: (input: Record<string, unknown>) =>
      mutate((state) => {
        if (input.id) assertNoExternalUpdate(state, `booking:${input.id}`);
        const previous = input.id
          ? state.bookings.find((b) => b.id === input.id)
          : undefined;
        if (input.id && !previous) throw new Error("Booking not found");
        if (previous && previous.revision !== input.revision)
          throw new Error("This booking changed. Refresh and try again.");
        const booking = makeBooking(input, state.vehicles, previous);
        if (booking.leadId && !state.leads.some((l) => l.id === booking.leadId))
          throw new Error("Linked enquiry not found");
        checkAvailability(booking, state.bookings);
        state.bookings = [
          booking,
          ...state.bookings.filter((b) => b.id !== booking.id),
        ];
        for (const leadId of new Set(
          [booking.leadId, previous?.leadId].filter(Boolean),
        )) {
          assertNoExternalUpdate(state, `lead:${leadId}`);
          const index = state.leads.findIndex((l) => l.id === leadId);
          if (index < 0) continue;
          const lead = state.leads[index];
          const confirmed = state.bookings.filter(
            (b) => b.leadId === leadId && b.status === "confirmed",
          );
          const leftConfirmed =
            previous &&
            previous.leadId === leadId &&
            previous.status === "confirmed" &&
            (booking.status !== "confirmed" || booking.leadId !== leadId);
          if (confirmed.length)
            state.leads[index] = updateLead(lead, {
              stage: "won",
              wonAmount: confirmed.reduce((sum, b) => sum + b.amount, 0),
              note: `Booking ${booking.status}: ${booking.title}`,
            });
          else if (leftConfirmed)
            state.leads[index] = updateLead(lead, {
              wonAmount: 0,
              ...(lead.stage === "won"
                ? {
                    stage: lead.quotedAmount ? "quoted" : "new",
                    nextAction: "Review cancelled booking",
                    nextActionAt: new Date(Date.now() + 3600000).toISOString(),
                  }
                : {}),
              note: `Confirmed reservation removed: ${booking.title}`,
            });
        }
        return booking;
      }),
    importMail: (input: Record<string, unknown>) =>
      mutate((state) => {
        if (
          state.connectionGeneration !== undefined &&
          state.cacheGeneration !== state.connectionGeneration
        )
          throw new Error(
            "Google connection changed. Sync the inbox before importing.",
          );
        const mail = state.messages.find((m) => m.id === input.sourceMailId);
        if (!mail)
          throw new Error("Source email not found. Sync Gmail and try again.");
        const existing = state.leads.find((l) =>
          l.sourceMailIds?.includes(mail.id),
        );
        if (existing) return existing;
        const target = input.targetLeadId
          ? state.leads.find((l) => l.id === input.targetLeadId)
          : undefined;
        if (input.targetLeadId && !target)
          throw new Error("Target enquiry not found");
        if (target) assertNoExternalUpdate(state, `lead:${target.id}`);
        const lead = target
          ? updateLead(target, {
              note: `Email linked: ${mail.subject}\n${mail.body.slice(0, 5000)}`,
            })
          : createLead({
              ...input,
              channel: "email",
              stage: "new",
              note: `Imported from Gmail: ${mail.subject}\n${mail.body.slice(0, 5000)}`,
            });
        lead.sourceMailIds = [...(lead.sourceMailIds || []), mail.id];
        lead.sourceThreadIds = [
          ...new Set([...(lead.sourceThreadIds || []), mail.threadId]),
        ];
        state.leads = [lead, ...state.leads.filter((l) => l.id !== lead.id)];
        return lead;
      }),
    add: (input: Record<string, unknown>) =>
      mutate((state) => {
        const lead = createLead(input);
        state.leads.unshift(lead);
        return lead;
      }),
    edit: (id: string, input: Record<string, unknown>) =>
      mutate((state) => {
        assertNoExternalUpdate(state, `lead:${id}`);
        const index = state.leads.findIndex((l) => l.id === id);
        if (index < 0) throw new Error("Enquiry not found");
        if (input.revision !== state.leads[index].revision)
          throw new Error("This enquiry changed. Refresh and try again.");
        const lead = updateLead(state.leads[index], input);
        state.leads[index] = lead;
        return lead;
      }),
  };
}
export const localDirectory = join(process.cwd(), ".crm-local");
const localRepository = createRepository(localDirectory);
const sharedRepository = domainRepository(firestoreBackend());
export const repository = new Proxy(localRepository, {
  get(_target, key) {
    return Reflect.get(
      hostedStorage() ? sharedRepository : localRepository,
      key,
    );
  },
});
