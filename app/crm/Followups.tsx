"use client";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import {
  WorkspaceEmpty,
  dateLabel,
  isOpen,
  isDue,
  type Snapshot,
  type Action,
} from "./ui";
import type { Lead } from "@/app/lib/crm/model";

export default function Followups({
  data,
  pending,
  onOpen,
  onEdit,
  onNavigate,
  act,
}: {
  data: Snapshot;
  pending: boolean;
  onOpen: (id: string) => void;
  onEdit: (lead: Lead) => void;
  onNavigate: (view: "pipeline" | "integrations") => void;
  act: Action;
}) {
  const tasks = data.leads
    .filter((l) => isOpen(l) && l.nextActionAt)
    .sort((a, b) => Date.parse(a.nextActionAt) - Date.parse(b.nextActionAt));
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-medium">
            Next actions<Badge variant="secondary">{tasks.length}</Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Times shown in London time
          </p>
        </header>
        {!tasks.length ? (
          <WorkspaceEmpty
            icon={CheckCircle2}
            title="A clear desk."
            description="Schedule a next action on an enquiry and it will appear here. Won and lost enquiries are kept out of this list."
            action={
              <Button variant="outline" onClick={() => onNavigate("pipeline")}>
                Go to pipeline
                <ArrowRight />
              </Button>
            }
          />
        ) : (
          <ItemGroup className="gap-2">
            {tasks.map((lead) => (
              <Item key={lead.id} variant="outline" className="rounded-lg">
                <ItemMedia>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="rounded-full"
                    aria-label={`Complete follow-up for ${lead.name}`}
                    disabled={pending}
                    onClick={() =>
                      void act({
                        action: "update",
                        id: lead.id,
                        revision: lead.revision,
                        nextActionAt: "",
                        note: `Completed follow-up: ${lead.nextAction}`,
                      }).catch(() => {})
                    }
                  >
                    <Check />
                  </Button>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-foreground"
                      onClick={() => onOpen(lead.id)}
                    >
                      {lead.nextAction || "Follow up"}
                    </Button>
                  </ItemTitle>
                  <ItemDescription className="text-xs">
                    {lead.name} · {lead.title}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant={isDue(lead) ? "destructive" : "outline"}>
                    {isDue(lead) && "Overdue · "}
                    {dateLabel(lead.nextActionAt, true)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit follow-up for ${lead.name}`}
                    onClick={() => onEdit(lead)}
                  >
                    <ChevronRight />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </section>
      <Separator />
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-base font-medium">Google Calendar</h2>
          {data.google.connected && (
            <Badge variant="secondary">Connected</Badge>
          )}
        </header>
        {!data.google.connected ? (
          <WorkspaceEmpty
            icon={CalendarDays}
            title="Your calendar, alongside your work."
            description="Connect Google to see upcoming events and add follow-ups."
            action={
              <Button
                variant="outline"
                onClick={() => onNavigate("integrations")}
              >
                Set up Google
              </Button>
            }
          />
        ) : !data.events.length ? (
          <WorkspaceEmpty
            icon={CalendarDays}
            title="Your calendar is ready."
            description="Sync Google to load upcoming events from your primary calendar."
          />
        ) : (
          <ItemGroup>
            {data.events.map((event) => (
              <Item key={event.id} variant="outline">
                <ItemMedia variant="icon">
                  <CalendarDays />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{event.summary}</ItemTitle>
                  <ItemDescription>
                    {dateLabel(event.start, event.start.includes("T"))}
                  </ItemDescription>
                </ItemContent>
                {event.url && (
                  <ItemActions>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={event.url} target="_blank" rel="noreferrer">
                        Open in Calendar ↗
                      </a>
                    </Button>
                  </ItemActions>
                )}
              </Item>
            ))}
          </ItemGroup>
        )}
      </section>
    </div>
  );
}
