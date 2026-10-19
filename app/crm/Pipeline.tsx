"use client";
import { useState } from "react";
import {
  Clock3,
  Columns3,
  LayoutList,
  MapPin,
  Search,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { SectionCards } from "@/components/section-cards";
import { STAGES, CHANNELS, type Lead, type Stage } from "@/app/lib/crm/model";
import {
  WorkspaceEmpty,
  StageBadge,
  dateLabel,
  money,
  isOpen,
  isDue,
  sourceLabel,
  sourceIcons,
} from "./ui";

export default function Pipeline({
  leads,
  onOpen,
  onCreate,
}: {
  leads: Lead[];
  onOpen: (id: string) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("all");
  const shown = leads.filter(
    (l) =>
      `${l.name} ${l.title} ${l.email} ${l.phone} ${l.company} ${l.pickup} ${l.destination}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (channel === "all" || l.channel === channel),
  );
  const value = (lead: Lead) =>
    lead.stage === "won" ? lead.wonAmount : lead.quotedAmount;
  return (
    <div className="space-y-7">
      <SectionCards
        openCount={leads.filter(isOpen).length}
        quotedValue={money(
          leads
            .filter((l) => l.stage === "quoted")
            .reduce((n, l) => n + l.quotedAmount, 0),
        )}
        overdue={leads.filter(isDue).length}
        wonCount={leads.filter((l) => l.stage === "won").length}
      />
      <Tabs defaultValue="board" className="gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-40 flex-1 sm:max-w-64">
            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              type="search"
              className="pl-9"
              aria-label="Search enquiries"
              placeholder="Search enquiries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <NativeSelect
            aria-label="Filter by source"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <NativeSelectOption value="all">All sources</NativeSelectOption>
            {CHANNELS.map((c) => (
              <NativeSelectOption key={c} value={c}>
                {sourceLabel(c)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <TabsList aria-label="Pipeline view">
            <TabsTrigger value="board" aria-label="Board view">
              <Columns3 />
            </TabsTrigger>
            <TabsTrigger value="list" aria-label="List view">
              <LayoutList />
            </TabsTrigger>
          </TabsList>
          <span className="ml-auto text-xs text-muted-foreground">
            {shown.length} {shown.length === 1 ? "enquiry" : "enquiries"}
          </span>
        </div>
        {!leads.length && (
          <WorkspaceEmpty
            icon={Columns3}
            title="Your next booking starts here."
            description="Add a phone enquiry or connect Gmail to bring in an email conversation."
          />
        )}
        <TabsContent value="board">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((stage) => {
              const items = shown.filter((l) => l.stage === stage.id);
              return (
                <section
                  key={stage.id}
                  className="min-w-0 space-y-3"
                  aria-label={stage.label}
                >
                  <header className="flex items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${stage.id === "won" ? "bg-primary" : stage.id === "quoted" ? "bg-foreground/60" : "bg-muted-foreground/50"}`}
                      />
                      <h2 className="text-sm font-medium">{stage.label}</h2>
                      <Badge variant="secondary" className="text-[10px]">
                        {items.length}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {items.length
                        ? money(items.reduce((n, l) => n + value(l), 0))
                        : "—"}
                    </span>
                  </header>
                  <div className="min-h-48 space-y-3 rounded-xl bg-muted/45 p-2.5 lg:min-h-72">
                    {items.map((lead) => {
                      const Icon = sourceIcons[lead.channel];
                      return (
                        <Card
                          key={lead.id}
                          size="sm"
                          className="relative gap-3 rounded-lg shadow-none transition-colors hover:ring-primary/40"
                        >
                          <CardHeader className="gap-2">
                            <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Icon className="size-3" />
                                {sourceLabel(lead.channel)}
                              </span>
                              {lead.owner && (
                                <Badge variant="outline">{lead.owner}</Badge>
                              )}
                            </div>
                            <CardTitle className="text-sm leading-relaxed">
                              <Button
                                variant="ghost"
                                className="absolute inset-0 h-full w-full rounded-lg p-0 hover:bg-primary/3"
                                aria-label={`${sourceLabel(lead.channel)} ${lead.title} ${lead.name}`}
                                onClick={() => onOpen(lead.id)}
                              />
                              <span>{lead.title}</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {lead.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="gap-1 text-[11px] text-muted-foreground">
                            {(lead.pickup || lead.destination) && (
                              <p className="flex items-start gap-1">
                                <MapPin className="mt-0.5 size-3 shrink-0" />
                                {[lead.pickup, lead.destination]
                                  .filter(Boolean)
                                  .join(" → ")}
                              </p>
                            )}
                            <p>
                              {lead.travelDate
                                ? dateLabel(lead.travelDate)
                                : "Date to confirm"}
                              {lead.passengers &&
                                ` · ${lead.passengers} passengers`}
                            </p>
                          </CardContent>
                          <CardFooter className="justify-between gap-2 border-t pt-3 text-[10px]">
                            <span
                              className={`flex items-center gap-1 ${isDue(lead) ? "text-foreground font-medium" : "text-muted-foreground"}`}
                            >
                              <Clock3 className="size-3" />
                              {isOpen(lead)
                                ? dateLabel(lead.nextActionAt, true)
                                : stage.label}
                            </span>
                            <span className="tabular-nums">
                              {value(lead) ? money(value(lead)) : "—"}
                            </span>
                          </CardFooter>
                        </Card>
                      );
                    })}
                    {!items.length && (
                      <LaneEmpty
                        stage={stage.id}
                        filtered={Boolean(search || channel !== "all")}
                        onCreate={onCreate}
                      />
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <Card className="overflow-hidden py-0 shadow-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enquiry</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Next action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-auto p-0"
                        onClick={() => onOpen(lead.id)}
                      >
                        {lead.title}
                      </Button>
                    </TableCell>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>
                      <StageBadge lead={lead} />
                    </TableCell>
                    <TableCell>
                      {value(lead) ? money(value(lead)) : "—"}
                    </TableCell>
                    <TableCell>{dateLabel(lead.nextActionAt, true)}</TableCell>
                  </TableRow>
                ))}
                {!shown.length && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No matching enquiries.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
function LaneEmpty({
  stage,
  filtered,
  onCreate,
}: {
  stage: Stage;
  filtered: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-9 text-center">
      <p className="text-xs text-muted-foreground">
        {filtered
          ? "No matching enquiries"
          : stage === "new"
            ? "Ready for new opportunities"
            : stage === "quoted"
              ? "Quotes awaiting a decision"
              : stage === "won"
                ? "Your confirmed bookings"
                : "Closed enquiries"}
      </p>
      {stage === "new" && !filtered && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={onCreate}
        >
          <Plus />
          Add enquiry
        </Button>
      )}
    </div>
  );
}
