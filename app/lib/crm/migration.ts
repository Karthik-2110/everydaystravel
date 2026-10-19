import { z } from "zod";
import { createHash } from "node:crypto";
import { updateLead, type Lead } from "./model";
import {
  createVehicle,
  makeBooking,
  checkAvailability,
  type Booking,
} from "./bookings";
import { emptyWorkspace, encodeWorkspace } from "./shared-records";
import type { Workspace } from "./store";
const text = z.string().max(10000),
  short = z.string().max(500),
  id = z.string().regex(/^[a-zA-Z0-9_-]{1,160}$/),
  date = z.iso.datetime();
const leadSchema = z
  .object({
    id,
    revision: z.number().int().nonnegative(),
    name: short,
    phone: short,
    email: short,
    company: short,
    title: short,
    channel: z.enum(["website", "phone", "whatsapp", "email", "instagram"]),
    stage: z.enum(["new", "quoted", "won", "lost"]),
    pickup: short,
    destination: short,
    travelDate: short,
    passengers: short,
    vehicle: short,
    owner: short,
    quotedAmount: z.number().int().nonnegative(),
    wonAmount: z.number().int().nonnegative(),
    lostReason: short,
    nextAction: short,
    nextActionAt: short,
    createdAt: date,
    updatedAt: date,
    firstRespondedAt: date.nullable(),
    notes: z
      .array(z.object({ id, body: text, createdAt: date }).strict())
      .max(500),
    calendarEventId: short.optional(),
    sourceMailIds: z.array(id).max(500).optional(),
    sourceThreadIds: z.array(id).max(500).optional(),
  })
  .strict();
const vehicleSchema = z
  .object({ id, name: short, registration: short, capacity: z.number().int() })
  .strict();
const bookingSchema = z
  .object({
    id,
    revision: z.number().int().nonnegative(),
    title: short,
    customer: short,
    vehicleId: id,
    leadId: short,
    start: date,
    end: date,
    status: z.enum(["hold", "confirmed", "cancelled"]),
    passengers: z.number().int(),
    amount: z.number().int(),
    notes: text,
    createdAt: date,
    updatedAt: date,
    googleEventId: short.optional(),
    googleEventUrl: z.url().startsWith("https://").optional(),
    googleSyncedRevision: z.number().int().optional(),
  })
  .strict();
const payloadSchema = z
  .object({
    leads: z.array(leadSchema).max(400),
    vehicles: z.array(vehicleSchema).max(400),
    bookings: z.array(bookingSchema).max(400),
  })
  .strict();
export function validateImport(input: unknown) {
  const data = payloadSchema.parse(input);
  if (data.leads.length + data.vehicles.length + data.bookings.length > 400)
    throw new Error(
      "Import supports up to 400 records. Contact an administrator for a larger migration.",
    );
  for (const group of [data.leads, data.vehicles, data.bookings])
    if (new Set(group.map((x) => x.id)).size !== group.length)
      throw new Error("Duplicate record IDs in import");
  for (const lead of data.leads) updateLead(lead as Lead, lead, lead.updatedAt);
  for (const vehicle of data.vehicles) createVehicle(vehicle);
  if (
    new Set(
      data.vehicles.map((v) =>
        v.registration.replace(/[\s-]/g, "").toUpperCase(),
      ),
    ).size !== data.vehicles.length
  )
    throw new Error("Duplicate vehicle registrations in import");
  for (const booking of data.bookings) {
    makeBooking(booking, data.vehicles, booking as Booking);
    if (booking.leadId && !data.leads.some((l) => l.id === booking.leadId))
      throw new Error("Imported booking references a missing enquiry");
    checkAvailability(booking as Booking, data.bookings as Booking[]);
  }
  encodeWorkspace({ ...emptyWorkspace(), ...data });
  return data;
}
export function importRecords(
  state: Workspace,
  data: ReturnType<typeof validateImport>,
) {
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
  if (state.importFingerprint === fingerprint) return;
  if (
    state.leads.length ||
    state.vehicles.length ||
    state.bookings.length ||
    state.messages.length ||
    state.events.length ||
    Object.keys(state.sendAttempts || {}).length ||
    Object.keys(state.operations || {}).length
  )
    throw new Error(
      "The shared workspace is populated. Import refused to protect existing records.",
    );
  Object.assign(state, data, { importFingerprint: fingerprint });
}
