import { describe, expect, it } from "vitest";
import {
  createVehicle,
  makeBooking,
  checkAvailability,
} from "@/app/lib/crm/bookings";
import {
  londonToUtc,
  londonInput,
  monthDays,
  inDay,
} from "@/app/lib/crm/calendar";
import { suggestEmailIntake, findMailLead } from "@/app/lib/crm/intake";
import { createLead } from "@/app/lib/crm/model";

const vehicle = {
  id: "coach-1",
  name: "Tourismo",
  registration: "AB26 CDE",
  capacity: 53,
};
const input = {
  customer: "Sarah",
  title: "Windsor school trip",
  vehicleId: "coach-1",
  start: "2026-10-20T08:00:00.000Z",
  end: "2026-10-20T16:00:00.000Z",
  passengers: 49,
  status: "hold",
};
describe("vehicle reservations", () => {
  it("validates an actual vehicle and capacity", () => {
    expect(
      createVehicle({
        name: "Tourismo",
        registration: "ab26 cde",
        capacity: 53,
      }),
    ).toMatchObject({ registration: "AB26 CDE", capacity: 53 });
    expect(() => makeBooking({ ...input, passengers: 54 }, [vehicle])).toThrow(
      "capacity",
    );
    expect(() =>
      makeBooking({ ...input, vehicleId: "missing" }, [vehicle]),
    ).toThrow("vehicle");
    expect(() =>
      makeBooking({ ...input, end: input.start }, [vehicle]),
    ).toThrow("end");
  });
  it("blocks holds and confirmations but permits back-to-back and cancelled slots", () => {
    const a = makeBooking(input, [vehicle]);
    const b = makeBooking(
      {
        ...input,
        start: "2026-10-20T15:00:00.000Z",
        end: "2026-10-20T17:00:00.000Z",
      },
      [vehicle],
    );
    expect(() => checkAvailability(b, [a])).toThrow("already reserved");
    expect(() => checkAvailability({ ...b, start: a.end }, [a])).not.toThrow();
    expect(() =>
      checkAvailability(b, [{ ...a, status: "cancelled" }]),
    ).not.toThrow();
    expect(() => checkAvailability(a, [a])).not.toThrow();
  });
});
describe("London monthly calendar", () => {
  it("converts GMT and BST without depending on the machine timezone", () => {
    expect(londonToUtc("2026-07-10T09:00")).toBe("2026-07-10T08:00:00.000Z");
    expect(londonToUtc("2026-12-10T09:00")).toBe("2026-12-10T09:00:00.000Z");
    expect(londonInput("2026-07-10T08:00:00.000Z")).toBe("2026-07-10T09:00");
    expect(() => londonToUtc("2026-03-29T01:30")).toThrow();
    expect(() => londonToUtc("2026-10-25T01:30")).toThrow();
    expect(() => londonToUtc("2026-02-31T09:00")).toThrow();
  });
  it("uses 42 Monday-first cells and handles multi-day exclusive ends", () => {
    const days = monthDays("2026-10");
    expect(days).toHaveLength(42);
    expect(days[0]).toBe("2026-09-28");
    expect(
      inDay({ start: "2026-10-20", end: "2026-10-22" }, "2026-10-21"),
    ).toBe(true);
    expect(
      inDay({ start: "2026-10-20", end: "2026-10-22" }, "2026-10-22"),
    ).toBe(false);
    expect(
      inDay(
        { start: "2026-10-20T22:00:00Z", end: "2026-10-21T03:00:00Z" },
        "2026-10-21",
      ),
    ).toBe(true);
  });
});
describe("reviewed email intake", () => {
  it("prefers an exact message association over a shared email thread", () => {
    const exact = {
      ...createLead({ name: "Sarah", email: "sarah@example.com" }),
      sourceMailIds: ["message-one"],
      sourceThreadIds: ["shared-thread"],
    };
    const other = {
      ...createLead({ name: "Sarah", email: "sarah@example.com" }),
      sourceMailIds: ["message-two"],
      sourceThreadIds: ["shared-thread"],
    };
    expect(
      findMailLead(
        {
          id: "message-one",
          threadId: "shared-thread",
          from: "Sarah <sarah@example.com>",
        },
        [other, exact],
      )?.id,
    ).toBe(exact.id);
  });
  it("extracts structured request details while leaving pipeline decisions to staff", () => {
    const result = suggestEmailIntake({
      id: "m1",
      threadId: "t1",
      from: "Sarah <sarah@example.com>",
      subject: "Coach quote",
      body: "Name: Sarah Mitchell\nPhone: 07700900123\nPickup: Richmond\nDestination: Windsor\nTravel date: 20/10/2026\nPassengers: 49\nPlease send a quote.",
      date: "2026-10-19T09:00:00Z",
      snippet: "",
      to: "",
      messageId: "",
      unread: true,
    });
    expect(result.intent).toBe("quote-request");
    expect(result.fields).toMatchObject({
      name: "Sarah Mitchell",
      email: "sarah@example.com",
      phone: "07700900123",
      pickup: "Richmond",
      destination: "Windsor",
      travelDate: "2026-10-20",
      passengers: "49",
    });
    expect(result.fields).not.toHaveProperty("stage");
  });
  it("flags cancellation intent but never executes it or invents incomplete dates", () => {
    const result = suggestEmailIntake({
      id: "m1",
      threadId: "t1",
      from: "Sarah <sarah@example.com>",
      subject: "Please cancel our booking",
      body: "We no longer need the coach on Friday.",
      date: "2026-10-19T09:00:00Z",
      snippet: "",
      to: "",
      messageId: "",
      unread: true,
    });
    expect(result.intent).toBe("cancellation");
    expect(result.fields.travelDate).toBe("");
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
