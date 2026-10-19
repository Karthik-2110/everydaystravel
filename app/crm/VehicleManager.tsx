"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { VehicleUnit } from "@/app/lib/crm/bookings";
import type { Action } from "./ui";
export default function VehicleManager({
  vehicles,
  act,
  onClose,
}: {
  vehicles: VehicleUnit[];
  act: Action;
  onClose: () => void;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="crm-theme gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none md:data-[side=right]:w-[35vw]">
        <SheetHeader className="p-6">
          <SheetTitle>Vehicles</SheetTitle>
          <SheetDescription>
            Add actual vehicle registrations. Each unit has its own
            availability.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 px-6 pb-6">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fields = new FormData(form);
                setBusy(true);
                setError("");
                void act({
                  action: "vehicle-create",
                  ...Object.fromEntries(fields),
                  capacity: Number(fields.get("capacity")),
                })
                  .then(() => form.reset())
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            >
              <Field>
                <FieldLabel htmlFor="unit-name">Vehicle name</FieldLabel>
                <Input
                  id="unit-name"
                  name="name"
                  required
                  placeholder="e.g. Tourismo 53-seat"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="unit-registration">
                  Registration
                </FieldLabel>
                <Input
                  id="unit-registration"
                  name="registration"
                  required
                  maxLength={20}
                  placeholder="AB26 CDE"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="unit-capacity">
                  Passenger capacity
                </FieldLabel>
                <Input
                  id="unit-capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  max="200"
                  required
                />
              </Field>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button disabled={busy}>
                {busy ? "Adding…" : "Add vehicle"}
              </Button>
            </form>
            <ItemGroup>
              {vehicles.map((v) => (
                <Item key={v.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{v.registration}</ItemTitle>
                    <ItemDescription>
                      {v.name} · {v.capacity} seats
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
