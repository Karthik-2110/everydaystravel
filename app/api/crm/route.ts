import { repository } from "@/app/lib/crm/store";
import {
  connectionStatus,
  disconnectGoogle,
  fetchGoogleWorkspace,
  googleApi,
  fetchGoogleMonth,
} from "@/app/lib/crm/google";
import { assertLocalRequest } from "@/app/lib/crm/security";
import { buildReply, calendarEvent } from "@/app/lib/crm/model";
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
  const {
    leads,
    messages,
    events,
    syncedAt,
    bookings,
    vehicles,
    calendarMonths,
  } = await repository.read();
  return {
    leads,
    messages,
    events,
    syncedAt,
    bookings: bookings || [],
    vehicles: vehicles || [],
    calendarMonths: calendarMonths || {},
    google: await connectionStatus(),
  };
}
function allowed(request: Request) {
  try {
    assertLocalRequest(request);
    return null;
  } catch (error) {
    return json({ error: (error as Error).message }, 403);
  }
}
export async function GET(request: Request) {
  const denied = allowed(request);
  if (denied) return denied;
  try {
    return json(await snapshot());
  } catch {
    return json(
      {
        error:
          "Could not read the local workspace. Check local data files and retry.",
      },
      500,
    );
  }
}
export async function POST(request: Request) {
  const denied = allowed(request);
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
        const events = await fetchGoogleMonth(month);
        await repository.mutate((state) => {
          state.calendarMonths ||= {};
          state.calendarMonths[month] = events;
        });
        break;
      }
      case "booking-export": {
        await repository.mutate(async (state) => {
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
          )!;
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
            status: booking.status === "cancelled" ? "cancelled" : "confirmed",
          };
          let existing: { id: string; htmlLink?: string } | null = null;
          try {
            existing = await googleApi(`${path}/${id}`);
          } catch (error) {
            if (!(error as Error).message.includes("(404)")) throw error;
          }
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
          if (booking.status !== "cancelled") state.events.push(calendarItem);
          // Invalidate cached months after export. A fresh month sync includes the updated event.
          state.calendarMonths = {};
        });
        return json({
          ...(await snapshot()),
          notice:
            "Booking updated in Google Calendar. No invitations were sent.",
        });
      }
      case "update":
        await repository.edit(String(input.id), input);
        break;
      case "sync": {
        const fresh = await fetchGoogleWorkspace();
        await repository.mutate((state) => {
          state.messages = fresh.messages;
          state.events = fresh.events;
          state.syncedAt = new Date().toISOString();
        });
        break;
      }
      case "disconnect":
        await disconnectGoogle();
        await repository.mutate((state) => {
          state.messages = [];
          state.events = [];
          state.syncedAt = null;
          state.calendarMonths = {};
        });
        break;
      case "reply": {
        if (
          typeof input.requestId !== "string" ||
          !/^[a-f0-9-]{36}$/.test(input.requestId)
        )
          throw new Error("A valid reply request ID is required");
        const requestId = input.requestId;
        const state = await repository.read();
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
          sent = await googleApi(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ raw, threadId: message.threadId }),
            },
          );
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
        await repository.mutate(async (state) => {
          const index = state.leads.findIndex((l) => l.id === input.id);
          if (index < 0) throw new Error("Enquiry not found");
          const lead = state.leads[index];
          if (input.revision !== lead.revision)
            throw new Error("This enquiry changed. Refresh and try again.");
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
          const created =
            existing ||
            (await googleApi(path, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...event, id }),
            }));
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
        });
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
    return json({ error: message }, message.includes("changed") ? 409 : 400);
  }
}
