import { repository } from "@/app/lib/crm/store";
import {
  connectionStatus,
  disconnectGoogle,
  fetchGoogleWorkspace,
  googleApi,
  fetchGoogleMonth,
  googleConnectionGeneration,
  googleContext,
} from "@/app/lib/crm/google";
import { currentStaff } from "@/app/lib/crm/auth";
import { hostedStorage } from "@/app/lib/crm/firebase-admin";
import { authorize } from "@/app/lib/crm/auth";
import { AccessError } from "@/app/lib/crm/auth-policy";
import { actorContext } from "@/app/lib/crm/firestore-store";
import { buildReply, calendarEvent } from "@/app/lib/crm/model";
import { assertConnectionGeneration } from "@/app/lib/crm/connection-policy";
import { randomUUID } from "node:crypto";
import { externalOperation } from "@/app/lib/crm/operations";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (value: unknown, status = 200) =>
  Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
async function snapshot() {
  const state = await repository.read();
  const {
    leads,
    messages,
    events,
    syncedAt,
    bookings,
    vehicles,
    calendarMonths,
  } = state;
  const staff = hostedStorage() ? await currentStaff() : null;
  const cacheCurrent =
    !hostedStorage() || state.cacheGeneration === state.connectionGeneration;
  return {
    leads,
    messages: cacheCurrent ? messages : [],
    events: cacheCurrent ? events : [],
    syncedAt: cacheCurrent ? syncedAt : null,
    bookings: bookings || [],
    vehicles: vehicles || [],
    calendarMonths: cacheCurrent ? calendarMonths || {} : {},
    google: await connectionStatus(),
    staff: staff
      ? { email: staff.email, admin: staff.admin }
      : hostedStorage()
        ? null
        : { email: "local", admin: true },
    operations: staff?.admin
      ? Object.entries(state.operations || {})
          .map(([key, value]) => ({
            key,
            token: value.token,
            status: value.status,
            at: value.at,
          }))
          .filter((op) => op.status !== "done")
      : [],
  };
}
async function allowed(request: Request) {
  try {
    await authorize(request);
    return null;
  } catch (error) {
    return json(
      { error: (error as Error).message },
      error instanceof AccessError ? error.status : 403,
    );
  }
}
export async function GET(request: Request) {
  const denied = await allowed(request);
  if (denied) return denied;
  try {
    return json(await snapshot());
  } catch {
    return json(
      {
        error:
          "Could not read the workspace. Check the storage configuration and retry.",
      },
      500,
    );
  }
}
export async function POST(request: Request) {
  const denied = await allowed(request);
  if (denied) return denied;
  const { staff } = await authorize(request);
  return actorContext.run(staff, () => performPost(request));
}
async function performPost(request: Request) {
  const denied = await allowed(request);
  if (denied) return denied;
  let input: Record<string, unknown>;
  try {
    if (Number(request.headers.get("content-length")) > 200000)
      throw new Error();
    const raw = await request.text();
    if (raw.length > 200000) throw new Error();
    input = JSON.parse(raw);
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }
  try {
    switch (input.action) {
      case "create":
        await repository.add(input);
        break;
      case "vehicle-create":
        await repository.addVehicle(input);
        break;
      case "booking-save":
        await repository.saveBooking(input);
        break;
      case "mail-import":
        await repository.importMail(input);
        break;
      case "calendar-month": {
        const month = typeof input.month === "string" ? input.month : "";
        const generation = await googleConnectionGeneration();
        const events = await googleContext.run(generation, () =>
          fetchGoogleMonth(month),
        );
        await repository.mutate((state) => {
          assertConnectionGeneration(state, generation);
          if (state.cacheGeneration !== generation) {
            state.messages = [];
            state.events = [];
            state.calendarMonths = {};
            state.syncedAt = null;
          }
          state.cacheGeneration = generation;
          state.calendarMonths ||= {};
          delete state.calendarMonths[month];
          state.calendarMonths[month] = events;
          for (const stale of Object.keys(state.calendarMonths).slice(0, -6))
            delete state.calendarMonths[stale];
        });
        break;
      }
      case "booking-export": {
        const generation = await googleConnectionGeneration();
        await googleContext.run(generation, () =>
          externalOperation(
            repository,
            `booking:${input.id}`,
            `export:${generation}:${input.revision}`,
            (state) => {
              assertConnectionGeneration(state, generation);
              const booking = state.bookings.find((b) => b.id === input.id);
              if (!booking) throw new Error("Booking not found");
              if (booking.revision !== input.revision)
                throw new Error("This booking changed. Refresh and try again.");
              if (booking.status === "cancelled" && !booking.googleEventId)
                throw new Error(
                  "This cancelled booking has no Google event to update",
                );
              const vehicle = state.vehicles.find(
                (v) => v.id === booking.vehicleId,
              );
              if (!vehicle) throw new Error("Vehicle not found");
              return { booking, vehicle };
            },
            async ({ booking, vehicle }, markWrite) => {
              const id = createHash("sha256")
                .update(`crm-booking:${booking.id}`)
                .digest("hex");
              const path =
                "https://www.googleapis.com/calendar/v3/calendars/primary/events";
              const event = {
                summary: `[${booking.status === "hold" ? "HOLD" : booking.status === "cancelled" ? "CANCELLED" : "BOOKED"}] ${booking.title} · ${vehicle.registration}`,
                description: `${booking.customer}\n${vehicle.name} (${vehicle.registration})\n${booking.passengers} passengers\n${booking.notes}`,
                start: { dateTime: booking.start, timeZone: "Europe/London" },
                end: { dateTime: booking.end, timeZone: "Europe/London" },
                transparency:
                  booking.status === "cancelled" ? "transparent" : "opaque",
                status:
                  booking.status === "cancelled" ? "cancelled" : "confirmed",
              };
              let existing: { id: string; htmlLink?: string } | null = null;
              try {
                existing = await googleApi(`${path}/${id}`);
              } catch (error) {
                if (!(error as Error).message.includes("(404)")) throw error;
              }
              await markWrite();
              const result = await googleApi(
                existing
                  ? `${path}/${id}?sendUpdates=none`
                  : `${path}?sendUpdates=none`,
                {
                  method: existing ? "PATCH" : "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(existing ? event : { ...event, id }),
                },
              );
              return { id, result, event, booking };
            },
            (state, exported) => {
              assertConnectionGeneration(state, generation);
              const {
                id,
                result,
                event,
                booking: sent,
              } = exported as {
                id: string;
                result: { htmlLink?: string };
                event: { summary: string };
                booking: { id: string; revision: number };
              };
              const booking = state.bookings.find((b) => b.id === sent.id)!;
              if (booking.revision !== sent.revision)
                throw new Error(
                  "Booking changed during Google export. Check Google before retrying.",
                );
              booking.googleEventId = id;
              booking.googleEventUrl = result.htmlLink;
              booking.googleSyncedRevision = booking.revision;
              const calendarItem = {
                id,
                summary: event.summary,
                start: booking.start,
                end: booking.end,
                url: result.htmlLink,
              };
              state.events = state.events.filter((e) => e.id !== id);
              if (booking.status !== "cancelled")
                state.events.push(calendarItem);
              // Invalidate cached months after export. A fresh month sync includes the updated event.
              state.calendarMonths = {};
            },
          ),
        );
        return json({
          ...(await snapshot()),
          notice:
            "Booking updated in Google Calendar. No invitations were sent.",
        });
      }
      case "operation-resolve": {
        await authorize(request, true);
        if (input.checked !== true)
          throw new Error("Check Google before releasing this record");
        await repository.mutate((state) => {
          const key = String(input.key);
          const operation = state.operations?.[key];
          if (!operation || operation.token !== input.token)
            throw new Error("Operation changed. Refresh and review again.");
          if (Date.now() - Date.parse(operation.at) < 120000)
            throw new Error(
              "Allow two minutes for the running update to finish before reviewing it.",
            );
          operation.token = randomUUID();
          operation.status = "done";
          operation.fingerprint = `resolved:${randomUUID()}`;
        });
        return json({
          ...(await snapshot()),
          notice:
            "Record released after your Google review. You can edit or export it again.",
        });
      }
      case "update":
        await repository.edit(String(input.id), input);
        break;
      case "sync": {
        const generation = await googleConnectionGeneration();
        const fresh = await googleContext.run(generation, () =>
          fetchGoogleWorkspace(),
        );
        await repository.mutate((state) => {
          assertConnectionGeneration(state, generation);
          if (state.cacheGeneration !== generation) state.calendarMonths = {};
          state.cacheGeneration = generation;
          state.messages = fresh.messages;
          state.events = fresh.events;
          state.syncedAt = new Date().toISOString();
        });
        break;
      }
      case "disconnect": {
        await authorize(request, true);
        const generation = await disconnectGoogle();
        await repository.mutate((state) => {
          assertConnectionGeneration(state, generation || "");
          state.cacheGeneration = generation || "";
          state.messages = [];
          state.events = [];
          state.syncedAt = null;
          state.calendarMonths = {};
        });
        break;
      }
      case "reply": {
        if (
          typeof input.requestId !== "string" ||
          !/^[a-f0-9-]{36}$/.test(input.requestId)
        )
          throw new Error("A valid reply request ID is required");
        const requestId = input.requestId;
        const state = await repository.read();
        if (
          hostedStorage() &&
          state.cacheGeneration !== state.connectionGeneration
        )
          throw new Error(
            "Google connection changed. Sync the inbox before replying.",
          );
        const generation = state.connectionGeneration;
        const message = state.messages.find((m) => m.id === input.messageId);
        if (!message)
          throw new Error("Message not found. Sync your inbox and try again.");
        const to = message.from.match(/<([^<>]+)>/)?.[1] || message.from.trim();
        const raw = buildReply({
          to,
          subject: /^re:/i.test(message.subject)
            ? message.subject
            : `Re: ${message.subject}`,
          body: typeof input.body === "string" ? input.body : "",
          messageId: message.messageId,
        });
        const fingerprint = createHash("sha256")
          .update(`${message.id}:${raw}`)
          .digest("hex");
        const alreadySent = await repository.mutate((workspace) => {
          if (generation !== undefined)
            assertConnectionGeneration(workspace, generation);
          workspace.sendAttempts ||= {};
          const previous = workspace.sendAttempts[requestId];
          if (previous) {
            if (previous.fingerprint !== fingerprint)
              throw new Error(
                "This reply request was already used for different content",
              );
            if (previous.status === "sent") return true;
            throw new Error(
              "Delivery is not confirmed. Check Gmail Sent before composing another reply; this attempt will not be sent again.",
            );
          }
          workspace.sendAttempts[requestId] = {
            fingerprint,
            status: "pending",
          };
          return false;
        });
        if (alreadySent)
          return json({ notice: "Reply already sent through Gmail." });
        let sent: { id: string };
        try {
          const send = () =>
            googleApi(
              "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ raw, threadId: message.threadId }),
              },
            );
          sent =
            generation !== undefined
              ? await googleContext.run(generation, send)
              : await send();
        } catch {
          await repository
            .mutate((workspace) => {
              workspace.sendAttempts![requestId].status = "unknown";
            })
            .catch(() => {});
          throw new Error(
            "Google could not confirm delivery. Check Gmail Sent before composing another reply; this attempt will not be sent again.",
          );
        }
        await repository
          .mutate((workspace) => {
            workspace.sendAttempts![requestId] = {
              fingerprint,
              status: "sent",
              gmailId: sent.id,
            };
          })
          .catch(() => {});
        // Gmail has accepted the message. A failing workspace read must not invite a resend.
        return json({ notice: "Reply sent through Gmail." });
      }
      case "calendar": {
        const generation = await googleConnectionGeneration();
        await googleContext.run(generation, () =>
          externalOperation(
            repository,
            `lead:${input.id}`,
            `followup:${generation}:${input.revision}`,
            (state) => {
              assertConnectionGeneration(state, generation);
              const lead = state.leads.find((l) => l.id === input.id);
              if (!lead) throw new Error("Enquiry not found");
              if (lead.revision !== input.revision)
                throw new Error("This enquiry changed. Refresh and try again.");
              return lead;
            },
            async (lead, markWrite) => {
              const event = calendarEvent(lead, lead.nextActionAt);
              // Stable ID makes retries safe after a network interruption.
              const id = createHash("sha256")
                .update(`${lead.id}:${lead.nextActionAt}`)
                .digest("hex");
              const path =
                "https://www.googleapis.com/calendar/v3/calendars/primary/events";
              // GET before insert also handles a retry after the previous save was interrupted.
              let existing: { id: string; htmlLink?: string } | null = null;
              try {
                existing = await googleApi(`${path}/${id}`);
              } catch (error) {
                if (!(error as Error).message.includes("(404)")) throw error;
              }
              if (!existing) await markWrite();
              const created =
                existing ||
                (await googleApi(path, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...event, id }),
                }));
              return { lead, id, event, created };
            },
            (state, result) => {
              assertConnectionGeneration(state, generation);
              const { lead, id, event, created } = result as {
                lead: import("@/app/lib/crm/model").Lead;
                id: string;
                event: ReturnType<typeof calendarEvent>;
                created: { htmlLink?: string };
              };
              const index = state.leads.findIndex((l) => l.id === lead.id);
              if (state.leads[index]?.revision !== lead.revision)
                throw new Error(
                  "Enquiry changed during Google update. Check Google before retrying.",
                );
              state.leads[index] = {
                ...lead,
                calendarEventId: id,
                revision: lead.revision + 1,
                updatedAt: new Date().toISOString(),
              };
              state.events = [
                {
                  id,
                  summary: event.summary,
                  start: event.start.dateTime,
                  url: created.htmlLink,
                },
                ...state.events.filter((e) => e.id !== id),
              ];
            },
          ),
        );
        return json({
          ...(await snapshot()),
          notice: "Follow-up added to Google Calendar.",
        });
      }
      default:
        return json({ error: "Unknown CRM action" }, 400);
    }
    return json(await snapshot());
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The action failed. Please try again.";
    return json(
      { error: message },
      error instanceof AccessError
        ? error.status
        : message.includes("changed")
          ? 409
          : 400,
    );
  }
}
