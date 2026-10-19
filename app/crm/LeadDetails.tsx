"use client";
import { Phone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
} from "@/components/ui/item";
import type { Lead } from "@/app/lib/crm/model";
import type { Booking } from "@/app/lib/crm/bookings";
import {
  StageBadge,
  dateLabel,
  money,
  sourceLabel,
  isOpen,
  type Action,
} from "./ui";

export default function LeadDetails({
  lead,
  open,
  onClose,
  onEdit,
  onReserve,
  bookings = [],
  onManageBooking,
  connected,
  pending,
  note,
  setNote,
  act,
}: {
  lead: Lead;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onReserve: () => void;
  bookings?: Booking[];
  onManageBooking: (booking: Booking) => void;
  connected: boolean;
  pending: boolean;
  note: string;
  setNote: (value: string) => void;
  act: Action;
}) {
  const facts = [
    ["Email", lead.email || "Not provided"],
    ["Phone", lead.phone || "Not provided"],
    [
      "Journey",
      [lead.pickup, lead.destination].filter(Boolean).join(" → ") ||
        "To confirm",
    ],
    ["Travel date", dateLabel(lead.travelDate)],
    ["Passengers", lead.passengers || "To confirm"],
    ["Quoted value", money(lead.quotedAmount)],
    ["Booking value", money(lead.wonAmount)],
    ["Owner", lead.owner || "Unassigned"],
    ["Source", sourceLabel(lead.channel)],
    ...(lead.lostReason ? [["Reason lost", lead.lostReason]] : []),
  ];
  return (
    <Sheet
      open={open}
      modal={false}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <SheetContent className="crm-theme gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none md:data-[side=right]:w-[35vw]">
        <SheetHeader className="gap-2 p-6 pr-12">
          <SheetTitle className="text-xl leading-relaxed">
            {lead.title}
          </SheetTitle>
          <SheetDescription>{lead.name}</SheetDescription>
          <div className="pt-1">
            <StageBadge lead={lead} />
          </div>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 px-6 pb-8">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={onEdit}>
                Edit enquiry
              </Button>
              <Button variant="outline" onClick={onReserve}>
                <CalendarDays />
                Reserve vehicle
              </Button>
              {lead.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${lead.phone}`}>
                    <Phone />
                    Call
                  </a>
                </Button>
              )}
            </div>
            {bookings.length > 0 && (
              <Card size="sm" className="shadow-none">
                <CardHeader>
                  <CardTitle>Linked bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ItemGroup>
                    {bookings.map((booking) => (
                      <Item key={booking.id} variant="outline" size="sm">
                        <ItemContent>
                          <ItemTitle>{booking.title}</ItemTitle>
                          <ItemDescription className="text-xs">
                            {booking.status} · {dateLabel(booking.start, true)}
                          </ItemDescription>
                          <Button
                            size="sm"
                            variant="link"
                            className="h-auto w-fit p-0"
                            onClick={() => onManageBooking(booking)}
                          >
                            Manage booking
                          </Button>
                        </ItemContent>
                      </Item>
                    ))}
                  </ItemGroup>
                </CardContent>
              </Card>
            )}
            <Separator />
            <dl className="grid grid-cols-[100px_minmax(0,1fr)] gap-x-4 gap-y-4 text-xs">
              {facts.map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="break-words">{value}</dd>
                </div>
              ))}
            </dl>
            <Card className="shadow-none" size="sm">
              <CardHeader>
                <Badge variant="outline" className="mb-1 w-fit">
                  Next action
                </Badge>
                <CardTitle>{lead.nextAction || "No action set"}</CardTitle>
                <CardDescription>
                  {dateLabel(lead.nextActionAt, true)}
                </CardDescription>
              </CardHeader>
              {connected && lead.nextActionAt && isOpen(lead) && (
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                      void act({
                        action: "calendar",
                        id: lead.id,
                        revision: lead.revision,
                      }).catch(() => {})
                    }
                  >
                    <CalendarDays />
                    Add follow-up to Calendar
                  </Button>
                </CardContent>
              )}
            </Card>
            <section className="space-y-4">
              <h3 className="text-sm font-medium">Notes & activity</h3>
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void act({
                    action: "update",
                    id: lead.id,
                    revision: lead.revision,
                    note,
                  })
                    .then(() => setNote(""))
                    .catch(() => {});
                }}
              >
                <Label htmlFor="lead-note" className="sr-only">
                  New enquiry note
                </Label>
                <Textarea
                  id="lead-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={10000}
                  placeholder="Add a note for the team…"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pending || !note.trim()}
                >
                  Add note
                </Button>
              </form>
              <ItemGroup>
                {[...lead.notes].reverse().map((n) => (
                  <Item key={n.id} variant="muted" size="sm">
                    <ItemContent>
                      <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">
                        {n.body}
                      </p>
                      <ItemDescription className="text-[10px]">
                        {dateLabel(n.createdAt, true)}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <ItemTitle className="text-xs">Enquiry created</ItemTitle>
                    <ItemDescription className="text-[10px]">
                      {dateLabel(lead.createdAt, true)}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
