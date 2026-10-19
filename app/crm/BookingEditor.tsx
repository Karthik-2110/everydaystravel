"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, ExternalLink } from "lucide-react";
import { londonInput, londonToUtc } from "@/app/lib/crm/calendar";
import type { Booking, VehicleUnit } from "@/app/lib/crm/bookings";
import type { Lead } from "@/app/lib/crm/model";
import type { Action } from "./ui";

export default function BookingEditor({
  booking,
  day,
  lead,
  leads,
  vehicles,
  onClose,
  act,
  connected,
}: {
  booking?: Booking;
  day: string;
  lead?: Lead;
  leads: Lead[];
  vehicles: VehicleUnit[];
  onClose: () => void;
  act: Action;
  connected: boolean;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [dirty, setDirty] = useState(false);
  const [linked, setLinked] = useState(booking?.leadId || lead?.id || "");
  const [customer, setCustomer] = useState(
    booking?.customer || lead?.name || "",
  );
  const [title, setTitle] = useState(booking?.title || lead?.title || "");
  const [status, setStatus] = useState(booking?.status || "hold");
  function link(id: string) {
    setLinked(id);
    const found = leads.find((l) => l.id === id);
    if (found) {
      setCustomer(found.name);
      setTitle(found.title);
    }
    setDirty(true);
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData(event.currentTarget);
      await act({
        action: "booking-save",
        ...Object.fromEntries(form),
        ...(booking ? { id: booking.id, revision: booking.revision } : {}),
        start: londonToUtc(String(form.get("start"))),
        end: londonToUtc(String(form.get("end"))),
        passengers: Number(form.get("passengers") || 0),
        amount: Math.round(Number(form.get("amount") || 0) * 100),
      });
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <SheetContent className="crm-theme gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none md:data-[side=right]:w-[35vw]">
        <SheetHeader className="p-6">
          <SheetTitle>
            {booking ? "Edit booking" : "Reserve a vehicle"}
          </SheetTitle>
          <SheetDescription>
            London time. Holds and confirmed bookings both block this vehicle.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <form
            id="booking-form"
            onSubmit={save}
            onChange={() => setDirty(true)}
            className="space-y-5 px-6 pb-6"
          >
            <Field>
              <FieldLabel htmlFor="booking-lead">Linked enquiry</FieldLabel>
              <NativeSelect
                className="w-full"
                id="booking-lead"
                name="leadId"
                value={linked}
                onChange={(e) => link(e.target.value)}
              >
                <NativeSelectOption value="">
                  Standalone reservation
                </NativeSelectOption>
                {leads.map((l) => (
                  <NativeSelectOption key={l.id} value={l.id}>
                    {l.name} · {l.title}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-customer">Customer</FieldLabel>
              <Input
                id="booking-customer"
                name="customer"
                required
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-title">Booking title</FieldLabel>
              <Input
                id="booking-title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-vehicle">Vehicle</FieldLabel>
              <NativeSelect
                className="w-full"
                id="booking-vehicle"
                name="vehicleId"
                required
                defaultValue={booking?.vehicleId || ""}
              >
                <NativeSelectOption value="">
                  Select an actual vehicle
                </NativeSelectOption>
                {vehicles.map((v) => (
                  <NativeSelectOption key={v.id} value={v.id}>
                    {v.registration} · {v.name} ({v.capacity} seats)
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {!vehicles.length && (
                <FieldDescription>
                  Add a vehicle in Calendar → Vehicles first.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-start">
                Start (London time)
              </FieldLabel>
              <Input
                id="booking-start"
                type="datetime-local"
                name="start"
                required
                defaultValue={
                  booking ? londonInput(booking.start) : `${day}T09:00`
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-end">End (London time)</FieldLabel>
              <Input
                id="booking-end"
                type="datetime-local"
                name="end"
                required
                defaultValue={
                  booking ? londonInput(booking.end) : `${day}T17:00`
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-status">
                Reservation status
              </FieldLabel>
              <NativeSelect
                className="w-full"
                id="booking-status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Booking["status"])}
              >
                <NativeSelectOption value="hold">
                  Provisional hold
                </NativeSelectOption>
                <NativeSelectOption value="confirmed">
                  Confirmed booking
                </NativeSelectOption>
                {booking && (
                  <NativeSelectOption value="cancelled">
                    Cancelled (releases vehicle)
                  </NativeSelectOption>
                )}
              </NativeSelect>
            </Field>
            {status === "confirmed" && linked && (
              <Alert>
                <AlertDescription>
                  Confirming this reservation marks the linked enquiry won.
                </AlertDescription>
              </Alert>
            )}
            <Field>
              <FieldLabel htmlFor="booking-passengers">Passengers</FieldLabel>
              <Input
                id="booking-passengers"
                name="passengers"
                type="number"
                min="0"
                max="200"
                defaultValue={booking?.passengers || lead?.passengers || ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-amount">
                Booking value (£)
              </FieldLabel>
              <Input
                id="booking-amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  booking
                    ? booking.amount / 100
                    : lead
                      ? (lead.wonAmount || lead.quotedAmount) / 100
                      : ""
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-notes">Journey and notes</FieldLabel>
              <Textarea
                id="booking-notes"
                name="notes"
                rows={4}
                maxLength={10000}
                defaultValue={
                  booking?.notes ||
                  [lead?.pickup, lead?.destination].filter(Boolean).join(" → ")
                }
              />
            </Field>
            <Alert>
              <AlertDescription>
                Availability checks cover CRM reservations only. General Google
                events do not reserve a vehicle.
              </AlertDescription>
            </Alert>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
          {booking && (
            <div className="space-y-3 px-6 pb-6">
              <Separator />
              <p className="text-xs text-muted-foreground">
                {booking.googleEventId
                  ? booking.googleSyncedRevision === booking.revision
                    ? "This version has been exported to Google."
                    : "Local changes have not been exported to Google."
                  : "This reservation is saved locally. Exporting is optional."}
              </p>
              {connected && (
                <Button
                  variant="outline"
                  disabled={
                    busy ||
                    dirty ||
                    (booking.status === "cancelled" && !booking.googleEventId)
                  }
                  onClick={() => {
                    setBusy(true);
                    void act({
                      action: "booking-export",
                      id: booking.id,
                      revision: booking.revision,
                    })
                      .catch((e) => setError(e.message))
                      .finally(() => setBusy(false));
                  }}
                >
                  <CalendarDays />
                  {booking.googleEventId
                    ? "Update Google Calendar"
                    : "Export to Google Calendar"}
                </Button>
              )}
              {dirty && (
                <p className="text-xs text-muted-foreground">
                  Save your changes before exporting.
                </p>
              )}
              {booking.googleEventUrl && (
                <Button variant="link" size="sm" asChild>
                  <a
                    href={booking.googleEventUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Google event
                    <ExternalLink />
                  </a>
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
        <SheetFooter className="flex-row justify-end border-t p-4">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Close
          </Button>
          <Button
            type="submit"
            form="booking-form"
            disabled={busy || !vehicles.length}
          >
            {busy ? "Saving…" : booking ? "Save booking" : "Reserve vehicle"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
