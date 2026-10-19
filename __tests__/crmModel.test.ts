import { describe, expect, it } from "vitest";
import {
  createLead,
  updateLead,
  buildReply,
  calendarEvent,
} from "@/app/lib/crm/model";

const input = {
  name: "Sarah Mitchell",
  phone: "07700900123",
  channel: "phone",
  title: "Windsor school trip",
};
describe("CRM enquiry lifecycle", () => {
  it("captures a minimal enquiry with a scheduled follow-up", () => {
    const lead = createLead(input, "2026-10-19T09:00:00.000Z");
    expect(lead).toMatchObject({
      name: input.name,
      stage: "new",
      nextActionAt: "2026-10-19T10:00:00.000Z",
      revision: 1,
    });
    expect(() => createLead({ ...input, name: "" })).toThrow("Name");
  });
  it("requires a lost reason and preserves the first response timestamp", () => {
    const lead = createLead(input);
    expect(() => updateLead(lead, { stage: "lost" })).toThrow("reason");
    const quoted = updateLead(
      lead,
      { stage: "quoted", quotedAmount: 125050 },
      "2026-10-19T12:00:00.000Z",
    );
    const won = updateLead(
      quoted,
      { stage: "won" },
      "2026-10-20T12:00:00.000Z",
    );
    expect(won.firstRespondedAt).toBe(quoted.firstRespondedAt);
    expect(won.revision).toBe(3);
    expect(() => updateLead(lead, { quotedAmount: -1 })).toThrow("amount");
    expect(() => updateLead(lead, { stage: "arbitrary" })).toThrow("stage");
    expect(() => updateLead(lead, { travelDate: "not-a-date" })).toThrow(
      "date",
    );
  });
  it("adds a note as an immutable timeline entry and records the first response", () => {
    const lead = createLead(input);
    const edited = updateLead(lead, {
      note: "Customer asked for luggage space.",
    });
    expect(edited.notes[0].body).toBe("Customer asked for luggage space.");
    expect(lead.notes).toHaveLength(0);
    expect(edited.firstRespondedAt).toBeTruthy();
  });
});
describe("Google write payloads", () => {
  it("encodes a reply safely with its thread headers", () => {
    const raw = buildReply({
      to: "sarah@example.com",
      subject: "Re: Windsor",
      body: "Hello Sarah,\nHere is your quote.",
      messageId: "<original@example.com>",
    });
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    expect(decoded).toContain("In-Reply-To: <original@example.com>");
    expect(decoded).toContain("Content-Type: text/plain; charset=UTF-8");
    expect(() =>
      buildReply({
        to: "sarah@example.com\r\nBcc: bad@example.com",
        subject: "x",
        body: "x",
      }),
    ).toThrow();
  });
  it("makes a timed London follow-up and rejects invalid dates", () => {
    const lead = createLead(input);
    const event = calendarEvent(lead, "2026-10-19T14:00:00.000Z");
    expect(event.start).toEqual({
      dateTime: "2026-10-19T14:00:00.000Z",
      timeZone: "Europe/London",
    });
    expect(event.end.dateTime).toBe("2026-10-19T14:30:00.000Z");
    expect(() => calendarEvent(lead, "bad")).toThrow("date");
  });
});
