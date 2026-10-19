import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import WhatsAppInbox from "@/app/crm/WhatsAppInbox";
import type { Snapshot } from "@/app/crm/ui";
const base: Snapshot = {
  leads: [],
  messages: [],
  events: [],
  syncedAt: null,
  google: { configured: false, connected: false, email: null },
};
it("shows honest setup state without invented conversations", () => {
  render(
    <WhatsAppInbox
      data={base}
      pending={false}
      act={vi.fn()}
      onCreate={vi.fn()}
      onOpen={vi.fn()}
      onSetup={vi.fn()}
    />,
  );
  expect(
    screen.getByText("Bring WhatsApp requests into your pipeline."),
  ).toBeVisible();
});
it("reviews a Gemini suggestion and carries source identity into an enquiry draft", () => {
  const create = vi.fn();
  const id = "number:+447700900123";
  const data: Snapshot = {
    ...base,
    whatsapp: { configured: true, geminiConfigured: true },
    whatsAppMessages: [
      {
        id: "wamid.one",
        conversationId: id,
        name: "Sam",
        phone: "+447700900123",
        body: "Eight passengers to Oxford please",
        type: "text",
        sentAt: "2026-10-19T10:00:00Z",
        receivedAt: "2026-10-19T10:00:01Z",
        phoneId: "number",
        businessId: "business",
      },
    ],
    whatsAppAnalyses: {
      [id]: {
        status: "ready",
        updatedAt: "2026-10-19T10:01:00Z",
        result: {
          intent: "quote-request",
          summary: "Minibus request for Oxford",
          title: "Oxford quote",
          pickup: "London",
          destination: "Oxford",
          travelDate: "",
          passengers: "8",
          vehicle: "Minibus",
          company: "",
          missingDetails: ["Travel date"],
          nextAction: "Confirm date",
          confidence: "medium",
        },
      },
    },
  };
  render(
    <WhatsAppInbox
      data={data}
      pending={false}
      act={vi.fn()}
      onCreate={create}
      onOpen={vi.fn()}
      onSetup={vi.fn()}
    />,
  );
  expect(screen.getByText("Minibus request for Oxford")).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: /review & create enquiry/i }),
  );
  expect(create).toHaveBeenCalledWith(
    expect.objectContaining({
      sourceWhatsAppId: "wamid.one",
      phone: "+447700900123",
      destination: "Oxford",
      passengers: "8",
    }),
  );
});
it("freezes the reviewed archive boundary when new messages arrive during confirmation", async () => {
  const act = vi.fn(async () => {});
  const original = {
    id: "one",
    conversationId: "number:+447700900123",
    name: "Sam",
    phone: "+447700900123",
    body: "Reviewed request",
    type: "text",
    sentAt: "2026-10-19T10:00:00Z",
    receivedAt: "2026-10-19T10:01:00Z",
    phoneId: "number",
    businessId: "business",
  };
  const data = {
    ...base,
    staff: { email: "admin@example.com", admin: true },
    whatsAppMessages: [original],
  };
  const props = {
    pending: false,
    act,
    onCreate: vi.fn(),
    onOpen: vi.fn(),
    onSetup: vi.fn(),
  };
  const view = render(<WhatsAppInbox data={data} {...props} />);
  fireEvent.click(screen.getByRole("button", { name: "Archive conversation" }));
  view.rerender(
    <WhatsAppInbox
      data={{
        ...data,
        whatsAppMessages: [
          {
            ...original,
            id: "two",
            body: "Unreviewed change",
            sentAt: "2026-10-19T11:00:00Z",
          },
          original,
        ],
      }}
      {...props}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
  await waitFor(() =>
    expect(act).toHaveBeenCalledWith(
      expect.objectContaining({ through: original.sentAt + "|one" }),
    ),
  );
});
