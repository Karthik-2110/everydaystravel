"use client";
import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Bus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  monthDays,
  shiftMonth,
  londonDate,
  inDay,
} from "@/app/lib/crm/calendar";
import type { Booking } from "@/app/lib/crm/bookings";
import { dateLabel, type Snapshot, type Action } from "./ui";

type Entry = {
  id: string;
  title: string;
  start: string;
  end?: string;
  booking?: Booking;
  url?: string;
};
export default function MonthCalendar({
  data,
  pending,
  act,
  onNew,
  onEdit,
  onVehicles,
}: {
  data: Snapshot;
  pending: boolean;
  act: Action;
  onNew: (day: string) => void;
  onEdit: (booking: Booking) => void;
  onVehicles: () => void;
}) {
  const [today] = useState(() => londonDate()),
    [month, setMonth] = useState(() => londonDate().slice(0, 7)),
    [day, setDay] = useState(() => londonDate()),
    [vehicle, setVehicle] = useState("all"),
    [status, setStatus] = useState("active");
  const bookings = data.bookings || [],
    vehicles = data.vehicles || [],
    google = data.calendarMonths?.[month];
  const knownIds = new Set(
    bookings.map((b) => b.googleEventId).filter(Boolean),
  );
  const entries: Entry[] = [
    ...bookings
      .filter(
        (b) =>
          (vehicle === "all" || b.vehicleId === vehicle) &&
          (status === "all" ||
            (status === "active"
              ? b.status !== "cancelled"
              : b.status === status)),
      )
      .map((b) => ({
        id: b.id,
        title: b.title,
        start: b.start,
        end: b.end,
        booking: b,
      })),
    ...(vehicle === "all" && status !== "cancelled"
      ? (google || [])
          .filter((e) => !knownIds.has(e.id))
          .map((e) => ({
            id: `google:${e.id}`,
            title: e.summary,
            start: e.start,
            end: e.end,
            url: e.url,
          }))
      : []),
  ];
  const days = monthDays(month),
    forDay = (key: string) =>
      entries
        .filter((e) => inDay(e, key))
        .sort((a, b) => a.start.localeCompare(b.start));
  function move(amount: number) {
    const next = shiftMonth(month, amount);
    setMonth(next);
    setDay(`${next}-01`);
  }
  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T12:00:00Z`));
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="outline"
            aria-label="Previous month"
            onClick={() => move(-1)}
          >
            <ChevronLeft />
          </Button>
          <h2
            className="min-w-40 text-center text-lg font-medium"
            aria-live="polite"
          >
            {monthLabel}
          </h2>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label="Next month"
            onClick={() => move(1)}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMonth(today.slice(0, 7));
              setDay(today);
            }}
          >
            Today
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onVehicles}>
            <Bus />
            Vehicles
          </Button>
          <Button onClick={() => onNew(day)}>
            <Plus />
            Reserve vehicle
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <NativeSelect
          aria-label="Calendar vehicle filter"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
        >
          <NativeSelectOption value="all">
            All vehicles & Google
          </NativeSelectOption>
          {vehicles.map((v) => (
            <NativeSelectOption key={v.id} value={v.id}>
              {v.registration}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Booking status filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <NativeSelectOption value="active">
            Holds & confirmed
          </NativeSelectOption>
          <NativeSelectOption value="hold">Holds only</NativeSelectOption>
          <NativeSelectOption value="confirmed">
            Confirmed only
          </NativeSelectOption>
          <NativeSelectOption value="cancelled">
            Cancelled only
          </NativeSelectOption>
          <NativeSelectOption value="all">All statuses</NativeSelectOption>
        </NativeSelect>
        {data.google.connected && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            disabled={pending}
            onClick={() =>
              void act({ action: "calendar-month", month }).catch(() => {})
            }
          >
            <RefreshCw />
            Sync displayed month
          </Button>
        )}
      </div>
      {!vehicles.length && (
        <Alert>
          <AlertDescription>
            Add your actual vehicle registrations using Vehicles before making a
            reservation.
          </AlertDescription>
        </Alert>
      )}
      <Card className="overflow-hidden py-0 shadow-none">
        <Table
          className="min-w-[630px] table-fixed"
          aria-label={`${monthLabel} booking calendar`}
        >
          <TableHeader>
            <TableRow>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <TableHead key={d} className="text-center text-xs">
                  {d}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }, (_, week) => (
              <TableRow key={week} className="hover:bg-transparent">
                {days.slice(week * 7, week * 7 + 7).map((key) => {
                  const items = forDay(key);
                  return (
                    <TableCell
                      key={key}
                      className={`h-28 border-r p-1 align-top whitespace-normal last:border-r-0 ${day === key ? "bg-accent/70" : ""}`}
                    >
                      <Button
                        variant={key === today ? "default" : "ghost"}
                        size="icon-sm"
                        className={
                          key.slice(0, 7) === month
                            ? ""
                            : "text-muted-foreground/60"
                        }
                        aria-label={`Select ${key}`}
                        aria-pressed={day === key}
                        onClick={() => setDay(key)}
                      >
                        {Number(key.slice(-2))}
                      </Button>
                      <div className="mt-1 space-y-1">
                        {items.slice(0, 2).map((entry) => (
                          <Button
                            key={entry.id}
                            variant="ghost"
                            className="h-auto min-h-6 w-full justify-start overflow-hidden rounded-sm bg-muted px-1.5 py-1 text-left text-[10px] font-normal"
                            onClick={() => {
                              setDay(key);
                              if (entry.booking) onEdit(entry.booking);
                            }}
                          >
                            <span className="truncate">
                              {entry.booking
                                ? `${entry.booking.status === "hold" ? "Hold · " : entry.booking.status === "cancelled" ? "Cancelled · " : ""}${entry.title}`
                                : `Google · ${entry.title}`}
                            </span>
                          </Button>
                        ))}
                        {items.length > 2 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-5 px-1 text-[10px]"
                            onClick={() => setDay(key)}
                          >
                            +{items.length - 2} more
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">London time</Badge>
        <span>Local reservations block vehicle availability.</span>
        {data.google.connected && (
          <span>
            {google
              ? `${google.length} Google events loaded.`
              : "Google events not loaded for this month."}
          </span>
        )}
      </div>
      <Card className="shadow-none">
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{dateLabel(day)}</CardTitle>
            <CardDescription>
              {forDay(day).length} calendar entries
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => onNew(day)}>
            <Plus />
            Reserve
          </Button>
        </CardHeader>
        <CardContent>
          {!forDay(day).length ? (
            <p className="py-3 text-sm text-muted-foreground">
              No calendar entries for this day.
            </p>
          ) : (
            <ItemGroup>
              {forDay(day).map((entry) => (
                <Item key={entry.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{entry.title}</ItemTitle>
                    <ItemDescription className="text-xs">
                      {entry.start.includes("T")
                        ? `${dateLabel(entry.start, true)}${entry.end ? ` – ${dateLabel(entry.end, true)}` : ""}`
                        : "All day"}
                      {entry.booking &&
                        ` · ${vehicles.find((v) => v.id === entry.booking?.vehicleId)?.registration} · ${entry.booking.customer}`}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {entry.booking ? (
                      <>
                        <Badge variant="secondary">
                          {entry.booking.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(entry.booking!)}
                        >
                          Manage
                        </Button>
                      </>
                    ) : entry.url ? (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={entry.url} target="_blank" rel="noreferrer">
                          Google
                          <ExternalLink />
                        </a>
                      </Button>
                    ) : (
                      <CalendarDays className="size-4 text-muted-foreground" />
                    )}
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
