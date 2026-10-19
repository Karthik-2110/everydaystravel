import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import CrmWorkspace from "@/app/crm/CrmWorkspace";
import { createLead } from "@/app/lib/crm/model";
const empty = {
  leads: [],
  messages: [],
  events: [],
  syncedAt: null,
  google: { connected: false, configured: false, email: null },
};
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => empty })),
  );
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
});
it("loads an honest empty workspace and opens quick enquiry capture", async () => {
  render(<CrmWorkspace />);
  await screen.findByText("Your next booking starts here.");
  fireEvent.click(screen.getByRole("button", { name: /new enquiry/i }));
  expect(screen.getByLabelText("Customer name")).toBeVisible();
  expect(screen.getByLabelText("Phone")).toBeVisible();
});
it("shows integration setup instead of fabricated inbox messages", async () => {
  render(<CrmWorkspace />);
  await screen.findByText("Your next booking starts here.");
  fireEvent.click(screen.getByRole("button", { name: /shared inbox/i }));
  await waitFor(() =>
    expect(
      screen.getByText("Bring your conversations together."),
    ).toBeVisible(),
  );
  expect(screen.getByRole("button", { name: "Set up Google" })).toBeVisible();
  expect(screen.queryByText("Sarah Mitchell")).not.toBeInTheDocument();
});
it("shows a monthly calendar and submits a vehicle reservation", async () => {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    json: async () => ({
      ...empty,
      bookings: [],
      vehicles: [
        {
          id: "unit-one",
          name: "Coach",
          registration: "AB26 CDE",
          capacity: 53,
        },
      ],
      calendarMonths: {},
    }),
  }));
  vi.stubGlobal("fetch", fetchMock);
  render(<CrmWorkspace />);
  await screen.findByText("Your next booking starts here.");
  fireEvent.click(screen.getByRole("button", { name: "Calendar" }));
  expect(screen.getAllByRole("cell")).toHaveLength(42);
  const previousLabel = screen.getByRole("table").getAttribute("aria-label");
  fireEvent.click(screen.getByRole("button", { name: "Next month" }));
  expect(screen.getByRole("table").getAttribute("aria-label")).not.toBe(
    previousLabel,
  );
  fireEvent.click(screen.getByRole("button", { name: "Reserve vehicle" }));
  fireEvent.change(screen.getByLabelText("Customer", { exact: true }), {
    target: { value: "Sarah" },
  });
  fireEvent.change(screen.getByLabelText("Booking title"), {
    target: { value: "School trip" },
  });
  fireEvent.change(screen.getByLabelText("Vehicle", { exact: true }), {
    target: { value: "unit-one" },
  });
  fireEvent.submit(
    (
      screen.getByRole("button", {
        name: "Reserve vehicle",
      }) as HTMLButtonElement
    ).form!,
  );
  await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(1));
  const post = (
    fetchMock.mock.calls as unknown as [string, RequestInit][]
  ).find(([, options]) => options?.method === "POST");
  expect(JSON.parse(String(post?.[1].body))).toMatchObject({
    action: "booking-save",
    vehicleId: "unit-one",
    customer: "Sarah",
    status: "hold",
  });
});
it("reviews email suggestions before importing a request to the pipeline", async () => {
  const message = {
    id: "m1",
    threadId: "t1",
    from: "Sarah <sarah@example.com>",
    subject: "Coach quote",
    body: "Pickup: Richmond\nDestination: Windsor\nPassengers: 49\nTravel date: 20/10/2026",
    snippet: "Coach quote",
    date: "2026-10-19T09:00:00Z",
    messageId: "",
    to: "",
    unread: true,
  };
  const fetchMock = vi.fn(async () => ({
    ok: true,
    json: async () => ({
      ...empty,
      messages: [message],
      google: {
        connected: true,
        configured: true,
        email: "web@everydaystravel.co.uk",
      },
    }),
  }));
  vi.stubGlobal("fetch", fetchMock);
  render(<CrmWorkspace />);
  await screen.findByText("Your next booking starts here.");
  fireEvent.click(screen.getByRole("button", { name: "Shared inbox" }));
  fireEvent.click(screen.getByRole("button", { name: /Sarah.*Coach quote/ }));
  fireEvent.click(screen.getByRole("button", { name: "Review request" }));
  expect(screen.getByText("Quote request", { exact: true })).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Review & create enquiry" }),
  );
  expect(screen.getByLabelText("Pickup", { exact: true })).toHaveValue(
    "Richmond",
  );
  expect(screen.getByLabelText("Travel date", { exact: true })).toHaveValue(
    "2026-10-20",
  );
  fireEvent.submit(
    (
      screen.getByRole("button", {
        name: "Create enquiry",
      }) as HTMLButtonElement
    ).form!,
  );
  await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(1));
  const post = (
    fetchMock.mock.calls as unknown as [string, RequestInit][]
  ).find(([, options]) => options?.method === "POST");
  expect(JSON.parse(String(post?.[1].body))).toMatchObject({
    action: "mail-import",
    sourceMailId: "m1",
    pickup: "Richmond",
  });
});
it("keeps a note draft with its enquiry when switching customers", async () => {
  const a = createLead({
    name: "Sarah",
    phone: "07700900123",
    title: "Windsor trip",
  });
  const b = createLead({
    name: "James",
    phone: "07700900124",
    title: "Oxford trip",
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({ ...empty, leads: [a, b] }),
    })),
  );
  render(<CrmWorkspace />);
  fireEvent.click(
    await screen.findByRole("button", { name: /Windsor trip Sarah/ }),
  );
  fireEvent.change(screen.getByLabelText("New enquiry note"), {
    target: { value: "Private to Sarah" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Oxford trip James/ }));
  expect(screen.getByLabelText("New enquiry note")).toHaveValue("");
  fireEvent.click(screen.getByRole("button", { name: /Windsor trip Sarah/ }));
  expect(screen.getByLabelText("New enquiry note")).toHaveValue(
    "Private to Sarah",
  );
});
it("refreshes a stale revision while keeping the user’s draft for an explicit retry", async () => {
  const lead = createLead({
    name: "Sarah",
    phone: "07700900123",
    title: "Windsor trip",
  });
  let postCount = 0;
  let getCount = 0;
  const fetchMock = vi.fn(async (_url: string, options?: RequestInit) => {
    if (options?.method === "POST") {
      postCount++;
      if (postCount === 1)
        return {
          ok: false,
          status: 409,
          json: async () => ({ error: "This enquiry changed." }),
        };
      return {
        ok: true,
        status: 200,
        json: async () => ({ ...empty, leads: [{ ...lead, revision: 3 }] }),
      };
    }
    getCount++;
    return {
      ok: true,
      status: 200,
      json: async () => ({
        ...empty,
        leads: [{ ...lead, revision: getCount > 1 ? 2 : 1 }],
      }),
    };
  });
  vi.stubGlobal("fetch", fetchMock);
  render(<CrmWorkspace />);
  fireEvent.click(
    await screen.findByRole("button", { name: /Windsor trip Sarah/ }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Edit enquiry" }));
  fireEvent.change(screen.getByLabelText("Enquiry title"), {
    target: { value: "My updated trip" },
  });
  fireEvent.submit(
    (screen.getByRole("button", { name: "Save changes" }) as HTMLButtonElement)
      .form!,
  );
  await waitFor(() => expect(getCount).toBe(2));
  expect(screen.getByLabelText("Enquiry title")).toHaveValue("My updated trip");
  fireEvent.submit(
    (screen.getByRole("button", { name: "Save changes" }) as HTMLButtonElement)
      .form!,
  );
  await waitFor(() => expect(postCount).toBe(2));
  const posts = fetchMock.mock.calls.filter(
    ([, options]) => options?.method === "POST",
  );
  expect(JSON.parse(String(posts[1][1]?.body))).toMatchObject({
    revision: 2,
    title: "My updated trip",
  });
});
