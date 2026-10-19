"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CHANNELS,
  LOST_REASONS,
  STAGES,
  type Lead,
  type Stage,
} from "@/app/lib/crm/model";
import { sourceLabel } from "./ui";

export function localDateTime(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
function InputField({
  label,
  name,
  wide,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  name: string;
  wide?: boolean;
}) {
  return (
    <Field className={wide ? "sm:col-span-2" : ""}>
      <FieldLabel htmlFor={`edit-${name}`}>{label}</FieldLabel>
      <Input id={`edit-${name}`} name={name} {...props} />
    </Field>
  );
}
export default function LeadEditor({
  lead,
  onClose,
  onSave,
}: {
  lead?: Partial<Lead>;
  onClose: () => void;
  onSave: (input: Record<string, unknown>) => Promise<void>;
}) {
  const [stage, setStage] = useState<Stage>(lead?.stage || "new");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [defaultNextAction] = useState(() =>
    localDateTime(
      lead?.id
        ? lead.nextActionAt || ""
        : new Date(Date.now() + 3600000).toISOString(),
    ),
  );
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData(event.currentTarget);
      const input: Record<string, unknown> = Object.fromEntries(form);
      input.quotedAmount = Math.round(
        Number(form.get("quotedAmount") || 0) * 100,
      );
      input.wonAmount = Math.round(Number(form.get("wonAmount") || 0) * 100);
      input.nextActionAt = form.get("nextActionAt")
        ? new Date(String(form.get("nextActionAt"))).toISOString()
        : "";
      await onSave({
        ...input,
        ...(lead?.id ? { id: lead.id, revision: lead.revision } : {}),
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
          <SheetTitle className="text-xl">
            {lead?.id ? lead.name : "New enquiry"}
          </SheetTitle>
          <SheetDescription>
            Capture the essentials now. Journey details can follow.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <form
            onSubmit={save}
            id="enquiry-form"
            className="space-y-6 px-6 pb-6"
          >
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Customer</FieldLegend>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputField
                    label="Customer name"
                    name="name"
                    required
                    autoFocus
                    defaultValue={lead?.name}
                    placeholder="Full name"
                    maxLength={500}
                    wide
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    type="tel"
                    defaultValue={lead?.phone}
                    placeholder="Phone number"
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={lead?.email}
                    placeholder="name@company.com"
                  />
                  <InputField
                    label="Enquiry title"
                    name="title"
                    defaultValue={lead?.title}
                    placeholder="e.g. Wedding guest transport"
                    wide
                  />
                  <InputField
                    label="Company"
                    name="company"
                    defaultValue={lead?.company}
                    placeholder="Optional"
                  />
                  <Field>
                    <FieldLabel htmlFor="edit-channel">Source</FieldLabel>
                    <NativeSelect
                      className="w-full"
                      id="edit-channel"
                      name="channel"
                      defaultValue={lead?.channel || "phone"}
                    >
                      {CHANNELS.map((c) => (
                        <NativeSelectOption key={c} value={c}>
                          {sourceLabel(c)}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-stage">Stage</FieldLabel>
                    <NativeSelect
                      className="w-full"
                      id="edit-stage"
                      name="stage"
                      value={stage}
                      onChange={(e) => setStage(e.target.value as Stage)}
                    >
                      {STAGES.map((s) => (
                        <NativeSelectOption key={s.id} value={s.id}>
                          {s.label}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                  <InputField
                    label="Owner"
                    name="owner"
                    defaultValue={lead?.owner}
                    placeholder="Team member"
                  />
                  {stage === "lost" && (
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="edit-lostReason">
                        Reason lost
                      </FieldLabel>
                      <NativeSelect
                        className="w-full"
                        id="edit-lostReason"
                        name="lostReason"
                        required
                        defaultValue={lead?.lostReason || ""}
                      >
                        <NativeSelectOption value="">
                          Choose a reason
                        </NativeSelectOption>
                        {LOST_REASONS.map((r) => (
                          <NativeSelectOption key={r}>{r}</NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </Field>
                  )}
                </div>
                <FieldDescription>
                  A phone number or email is required.
                </FieldDescription>
              </FieldSet>
              <Separator />
              <FieldSet>
                <FieldLegend>Journey</FieldLegend>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputField
                    label="Pickup"
                    name="pickup"
                    defaultValue={lead?.pickup}
                    placeholder="Pickup location"
                  />
                  <InputField
                    label="Destination"
                    name="destination"
                    defaultValue={lead?.destination}
                    placeholder="Destination"
                  />
                  <InputField
                    label="Travel date"
                    name="travelDate"
                    type="date"
                    defaultValue={lead?.travelDate}
                  />
                  <InputField
                    label="Passengers"
                    name="passengers"
                    type="number"
                    min="1"
                    max="9999"
                    defaultValue={lead?.passengers}
                  />
                  <InputField
                    label="Vehicle"
                    name="vehicle"
                    defaultValue={lead?.vehicle}
                    placeholder="e.g. 53-seat coach"
                  />
                  <InputField
                    label="Quoted amount (£)"
                    name="quotedAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={
                      lead?.quotedAmount ? lead.quotedAmount / 100 : ""
                    }
                  />
                  {stage === "won" && (
                    <InputField
                      label="Booking value (£)"
                      name="wonAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={lead?.wonAmount ? lead.wonAmount / 100 : ""}
                    />
                  )}
                </div>
              </FieldSet>
              <Separator />
              <FieldSet>
                <FieldLegend>Next action</FieldLegend>
                <InputField
                  label="What happens next?"
                  name="nextAction"
                  defaultValue={lead?.nextAction || "Contact customer"}
                  placeholder="e.g. Call to discuss the quote"
                />
                <InputField
                  label="Follow-up date and time (your local time)"
                  name="nextActionAt"
                  type="datetime-local"
                  defaultValue={defaultNextAction}
                />
                <Field>
                  <FieldLabel htmlFor="edit-note">Add a note</FieldLabel>
                  <Textarea
                    id="edit-note"
                    name="note"
                    rows={3}
                    maxLength={10000}
                    placeholder="Anything the team should know…"
                  />
                </Field>
              </FieldSet>
            </FieldGroup>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end border-t p-4">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button form="enquiry-form" type="submit" disabled={busy}>
            {busy ? "Saving…" : lead?.id ? "Save changes" : "Create enquiry"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
