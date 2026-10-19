"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Clock3,
  CalendarDays,
  Columns3,
  Inbox,
  Plug,
  Plus,
  RefreshCw,
  CheckCircle2,
  X,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertAction } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import MonthCalendar from "./MonthCalendar";
import BookingEditor from "./BookingEditor";
import VehicleManager from "./VehicleManager";
import { londonDate } from "@/app/lib/crm/calendar";
import type { LeadDraft } from "./ui";
import Pipeline from "./Pipeline";
import Mailbox from "./Mailbox";
import Followups from "./Followups";
import Integrations from "./Integrations";
import LeadDetails from "./LeadDetails";
import LeadEditor from "./LeadEditor";
import { isDue, type View, type Snapshot } from "./ui";

const navigation = [
  { id: "pipeline", label: "Sales pipeline", icon: Columns3 },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "inbox", label: "Shared inbox", icon: Inbox },
  { id: "followups", label: "Follow-ups", icon: Clock3 },
  { id: "integrations", label: "Integrations", icon: Plug },
];
const descriptions: Record<View, string> = {
  calendar: "Plan journeys, reserve vehicles and manage availability.",
  pipeline: "Every enquiry, and what happens next.",
  inbox: "Keep the conversation connected to the customer.",
  followups: "A clear next step for every open enquiry.",
  integrations: "Bring the tools you use into one workspace.",
};
export default function CrmWorkspace({
  initialView = "pipeline",
  initialError = "",
  initialConnected = false,
}: {
  initialView?: View;
  initialError?: string;
  initialConnected?: boolean;
}) {
  const [data, setData] = useState<Snapshot | null>(null);
  const [view, setView] = useState<View>(initialView);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState(
    initialConnected
      ? "Google connected. Sync your inbox and calendar to get started."
      : "",
  );
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<LeadDraft | "new" | null>(null);
  const [bookingDraft, setBookingDraft] = useState<{
    id?: string;
    day: string;
    leadId?: string;
  } | null>(null);
  const [vehiclesOpen, setVehiclesOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const refresh = useCallback(async () => {
    const response = await fetch("/api/crm", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Could not load the workspace");
    setData(result);
    return result as Snapshot;
  }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/crm", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Could not load the workspace");
        if (active) setData(result);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function act(input: Record<string, unknown>) {
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          const latest = await refresh();
          setEditing((previous) =>
            previous && previous !== "new"
              ? {
                  ...previous,
                  revision:
                    latest.leads.find((l) => l.id === previous.id)?.revision ||
                    previous.revision,
                }
              : previous,
          );
          throw new Error(
            "Another tab changed this record. Latest data loaded; review your draft before saving again.",
          );
        }
        throw new Error(result.error || "The action failed");
      }
      if (result.leads) setData(result);
      if (result.notice) setNotice(result.notice);
    } catch (e) {
      setError((e as Error).message);
      throw e;
    } finally {
      setPending(false);
    }
  }
  function navigate(next: View) {
    setView(next);
    setSelected(null);
    setNotice("");
    setError("");
    const url = new URL(window.location.href);
    url.search = next === "pipeline" ? "" : `view=${next}`;
    window.history.replaceState(null, "", url);
  }
  async function connect() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/crm/google/connect", {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      window.location.assign(result.url);
    } catch (e) {
      setError((e as Error).message);
      setPending(false);
    }
  }
  const currentBooking = data?.bookings?.find((b) => b.id === bookingDraft?.id);
  const current = data?.leads.find((l) => l.id === selected);
  const title = navigation.find((n) => n.id === view)?.label || "CRM";
  return (
    <TooltipProvider>
      <SidebarProvider
        className="crm-shell"
        style={
          {
            "--sidebar-width": "16rem",
            "--header-height": "3.5rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          items={navigation}
          active={view}
          overdue={data?.leads.filter(isDue).length || 0}
          onNavigate={(id) => navigate(id as View)}
          onCreate={() => setEditing("new")}
        />
        <SidebarInset className="min-w-0">
          <SiteHeader title={title} />
          <div className="mx-auto w-full max-w-[1700px] space-y-7 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
            <header className="flex flex-wrap items-center justify-between gap-5">
              <div className="space-y-2">
                <Badge variant="outline" className="text-[9px] tracking-widest">
                  EVERYDAYS TRAVEL CRM
                </Badge>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {descriptions[view]}
                </p>
              </div>
              <div className="flex gap-2">
                {data?.google.connected &&
                  view !== "pipeline" &&
                  view !== "calendar" && (
                    <Button
                      variant="outline"
                      disabled={pending}
                      onClick={() =>
                        void act({ action: "sync" }).catch(() => {})
                      }
                    >
                      <RefreshCw
                        className={
                          pending
                            ? "animate-spin motion-reduce:animate-none"
                            : ""
                        }
                      />
                      {pending ? "Working…" : "Sync Google"}
                    </Button>
                  )}
                {view === "pipeline" && (
                  <Button onClick={() => setEditing("new")}>
                    <Plus />
                    New enquiry
                  </Button>
                )}
              </div>
            </header>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
                <AlertAction>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Dismiss error"
                    onClick={() => setError("")}
                  >
                    <X />
                  </Button>
                </AlertAction>
              </Alert>
            )}
            {notice && (
              <Alert role="status">
                <CheckCircle2 />
                <AlertDescription>{notice}</AlertDescription>
                <AlertAction>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Dismiss notification"
                    onClick={() => setNotice("")}
                  >
                    <X />
                  </Button>
                </AlertAction>
              </Alert>
            )}
            {!data && !error && (
              <div
                className="grid grid-cols-2 gap-4"
                role="status"
                aria-label="Loading workspace"
              >
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="col-span-2 h-72" />
              </div>
            )}
            {!data && error && (
              <Button
                variant="outline"
                onClick={() => {
                  setError("");
                  void refresh().catch((e) => setError(e.message));
                }}
              >
                Try again
              </Button>
            )}
            {data && view === "calendar" && (
              <MonthCalendar
                data={data}
                pending={pending}
                act={act}
                onNew={(day) => setBookingDraft({ day })}
                onEdit={(booking) =>
                  setBookingDraft({
                    id: booking.id,
                    day: londonDate(booking.start),
                  })
                }
                onVehicles={() => setVehiclesOpen(true)}
              />
            )}
            {data && view === "pipeline" && (
              <Pipeline
                leads={data.leads}
                onOpen={setSelected}
                onCreate={() => setEditing("new")}
              />
            )}
            {data && view === "inbox" && (
              <Mailbox
                data={data}
                pending={pending}
                act={act}
                onSetup={() => navigate("integrations")}
                onCreate={setEditing}
                onOpen={(id) => {
                  navigate("pipeline");
                  setSelected(id);
                }}
              />
            )}
            {data && view === "followups" && (
              <Followups
                data={data}
                pending={pending}
                act={act}
                onOpen={setSelected}
                onEdit={setEditing}
                onNavigate={navigate}
              />
            )}
            {data && view === "integrations" && (
              <Integrations
                data={data}
                pending={pending}
                act={act}
                onConnect={() => void connect()}
              />
            )}
          </div>
        </SidebarInset>
        {current && (
          <LeadDetails
            lead={current}
            bookings={(data?.bookings || []).filter(
              (booking) => booking.leadId === current.id,
            )}
            onManageBooking={(booking) => {
              navigate("calendar");
              setBookingDraft({
                id: booking.id,
                day: londonDate(booking.start),
              });
            }}
            open={!editing}
            onClose={() => setSelected(null)}
            onEdit={() => setEditing(current)}
            onReserve={() => {
              navigate("calendar");
              setBookingDraft({
                day: current.travelDate || londonDate(),
                leadId: current.id,
              });
            }}
            connected={Boolean(data?.google.connected)}
            pending={pending}
            note={noteDrafts[current.id] || ""}
            setNote={(value) =>
              setNoteDrafts((drafts) => ({ ...drafts, [current.id]: value }))
            }
            act={act}
          />
        )}
        {data && bookingDraft && (
          <BookingEditor
            key={bookingDraft.id || bookingDraft.day}
            booking={currentBooking}
            day={bookingDraft.day}
            lead={data.leads.find(
              (l) => l.id === (currentBooking?.leadId || bookingDraft.leadId),
            )}
            leads={data.leads}
            vehicles={data.vehicles || []}
            connected={data.google.connected}
            act={act}
            onClose={() => setBookingDraft(null)}
          />
        )}
        {data && vehiclesOpen && (
          <VehicleManager
            vehicles={data.vehicles || []}
            act={act}
            onClose={() => setVehiclesOpen(false)}
          />
        )}
        {editing && (
          <LeadEditor
            lead={editing === "new" ? undefined : editing}
            onClose={() => setEditing(null)}
            onSave={async (input) => {
              const existing = editing !== "new" && Boolean(editing.id);
              await act({
                ...input,
                ...(editing !== "new" && editing.sourceMailId
                  ? { sourceMailId: editing.sourceMailId }
                  : {}),
                action: existing
                  ? "update"
                  : editing !== "new" && editing.sourceMailId
                    ? "mail-import"
                    : "create",
              });
              setNotice(existing ? "Enquiry updated." : "Enquiry created.");
            }}
          />
        )}
      </SidebarProvider>
    </TooltipProvider>
  );
}
