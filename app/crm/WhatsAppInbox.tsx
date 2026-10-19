"use client";
import { useState } from "react";
import { MessageCircle, ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  whatsAppIntake,
  normalisePhone,
  compareWhatsAppMessages,
} from "@/app/lib/crm/whatsapp-model";
import {
  WorkspaceEmpty,
  dateLabel,
  type Snapshot,
  type LeadDraft,
  type Action,
} from "./ui";
export default function WhatsAppInbox({
  data,
  pending,
  act,
  onCreate,
  onOpen,
  onSetup,
}: {
  data: Snapshot;
  pending: boolean;
  act: Action;
  onCreate: (draft: LeadDraft) => void;
  onOpen: (id: string) => void;
  onSetup: () => void;
}) {
  const [archive, setArchive] = useState<{
    conversationId: string;
    through: string;
  } | null>(null);
  const [selected, setSelected] = useState<string | null>(null),
    [search, setSearch] = useState("");
  const messages = [...(data.whatsAppMessages || [])].sort((a, b) =>
    compareWhatsAppMessages(b, a),
  );
  const conversations = [
    ...new Map(
      [...messages].reverse().map((m) => [m.conversationId, m]),
    ).values(),
  ].sort((a, b) => compareWhatsAppMessages(b, a));
  const filtered = conversations.filter((m) =>
    `${m.name} ${m.phone} ${m.body}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const current =
    conversations.find((m) => m.conversationId === selected) || filtered[0];
  if (!messages.length)
    return (
      <WorkspaceEmpty
        icon={MessageCircle}
        title={
          data.whatsapp?.configured
            ? "Waiting for your first WhatsApp message."
            : "Bring WhatsApp requests into your pipeline."
        }
        description="New messages from your connected business number will appear here. Review the request, link an enquiry and arrange the booking. Number connection, Gemini and Firebase setup are pending; existing phone chats are not imported automatically."
        action={
          <Button variant="outline" onClick={onSetup}>
            View integration setup
            <ArrowRight />
          </Button>
        }
      />
    );
  const transcript = current
    ? messages
        .filter((m) => m.conversationId === current.conversationId)
        .reverse()
    : [];
  const local = current
    ? whatsAppIntake({
        ...current,
        body: transcript
          .slice(-40)
          .map((m) => m.body)
          .join("\n"),
      })
    : null;
  const analysis = current
    ? data.whatsAppAnalyses?.[current.conversationId]
    : undefined;
  const ai = analysis?.status === "ready" ? analysis.result : undefined;
  const source = current;
  const matched = source
    ? data.leads.find((l) => l.sourceWhatsAppIds?.includes(source.id)) ||
      data.leads.find((l) => {
        try {
          return l.phone && normalisePhone(l.phone) === source.phone;
        } catch {
          return false;
        }
      })
    : undefined;
  const imported = source && matched?.sourceWhatsAppIds?.includes(source.id);
  const fields = ai
    ? {
        ...local!.fields,
        title: ai.title,
        pickup: ai.pickup,
        destination: ai.destination,
        travelDate: ai.travelDate,
        passengers: ai.passengers,
        vehicle: ai.vehicle,
        company: ai.company,
        nextAction: ai.nextAction,
      }
    : local?.fields;
  const intentLabels = {
    "quote-request": "Quote request",
    "booking-request": "Booking request",
    "change-request": "Change request",
    cancellation: "Cancellation request",
    other: "General message",
  };
  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-3">
        <Input
          aria-label="Search WhatsApp"
          placeholder="Search WhatsApp…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea className="max-h-[650px]">
          <div className="space-y-1">
            {filtered.map((message) => (
              <Button
                key={message.conversationId}
                variant={
                  current?.conversationId === message.conversationId
                    ? "secondary"
                    : "ghost"
                }
                className="h-auto w-full justify-start px-3 py-3 text-left"
                onClick={() => {
                  setSelected(message.conversationId);
                  setArchive(null);
                }}
              >
                <span className="min-w-0 space-y-1">
                  <span className="block truncate text-sm font-medium">
                    {message.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {message.body || `[${message.type} message]`}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    {dateLabel(message.sentAt, true)}
                  </span>
                </span>
              </Button>
            ))}
            {!filtered.length && (
              <p className="p-3 text-sm text-muted-foreground">
                No matching conversations.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
      {current && (
        <div className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{current.name}</CardTitle>
              <CardDescription>
                {current.phone} · New incoming messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.staff?.admin && (
                <div className="mb-4 space-y-2">
                  {archive ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Archive up to 200 reviewed messages. Saved enquiries
                        remain. Archived messages will not return if Meta
                        redelivers them. Larger conversations need more than one
                        batch.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                          void act({
                            action: "whatsapp-archive",
                            conversationId: archive.conversationId,
                            through: archive.through,
                            confirm: true,
                          })
                            .then(() => setArchive(null))
                            .catch(() => {})
                        }
                      >
                        Confirm archive
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setArchive(null)}
                      >
                        Keep messages
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setArchive({
                          conversationId: current.conversationId,
                          through: current.sentAt + "|" + current.id,
                        })
                      }
                    >
                      Archive conversation
                    </Button>
                  )}
                </div>
              )}
              <ScrollArea className="h-72 pr-4">
                <div className="space-y-5">
                  {transcript.map((message) => (
                    <div
                      key={message.id}
                      className="space-y-2 border-b pb-4 last:border-0"
                    >
                      <p className="text-xs text-muted-foreground">
                        {dateLabel(message.sentAt, true)}
                      </p>
                      {message.type !== "text" && (
                        <Badge variant="outline">
                          <FileText className="mr-1 size-3" />
                          {message.type}
                          {message.media?.filename
                            ? `: ${message.media.filename}`
                            : ""}
                        </Badge>
                      )}
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.body ||
                          "No text available. Review this message in WhatsApp."}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4" />
                  Business request
                </CardTitle>
                <Badge variant="secondary">
                  {intentLabels[ai?.intent || local!.intent]}
                </Badge>
              </div>
              <CardDescription>
                {ai
                  ? "Gemini suggestion, review before saving."
                  : data.whatsapp?.geminiConfigured
                    ? `Analysis ${analysis?.status || "queued"}. You can review the original messages now.`
                    : "Local suggestions only. Gemini will understand the conversation once the API is configured."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ai && <p className="text-sm leading-relaxed">{ai.summary}</p>}
              <dl className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                {(
                  [
                    "pickup",
                    "destination",
                    "travelDate",
                    "passengers",
                    "vehicle",
                  ] as const
                ).map((key) => (
                  <div className="contents" key={key}>
                    <dt className="capitalize text-muted-foreground">
                      {key === "travelDate" ? "Travel date" : key}
                    </dt>
                    <dd className="break-words">
                      {String(fields?.[key] || "Needs confirmation")}
                    </dd>
                  </div>
                ))}
              </dl>
              {ai?.missingDetails.length ? (
                <Alert>
                  <AlertDescription>
                    Confirm: {ai.missingDetails.join(", ")}.
                  </AlertDescription>
                </Alert>
              ) : null}
              {analysis?.error && (
                <Alert>
                  <AlertDescription>{analysis.error}</AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-muted-foreground">
                No booking, cancellation or reply is applied automatically.
                Attachments have not been read.
              </p>
            </CardContent>
            <CardFooter className="flex-wrap gap-2">
              {imported ? (
                <Button variant="outline" onClick={() => onOpen(matched!.id)}>
                  Open linked enquiry
                  <ArrowRight />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() =>
                      onCreate({ ...fields, sourceWhatsAppId: source!.id })
                    }
                  >
                    Review & create enquiry
                    <ArrowRight />
                  </Button>
                  {matched && (
                    <Button
                      variant="outline"
                      disabled={pending}
                      onClick={() =>
                        void act({
                          action: "whatsapp-import",
                          sourceWhatsAppId: source!.id,
                          targetLeadId: matched.id,
                        }).catch(() => {})
                      }
                    >
                      Attach to {matched.name}
                    </Button>
                  )}
                </>
              )}
              {data.whatsapp?.geminiConfigured &&
                analysis?.status !== "ready" && (
                  <Button
                    variant="outline"
                    disabled={pending}
                    onClick={() =>
                      void act({
                        action: "whatsapp-analyse",
                        conversationId: current.conversationId,
                      }).catch(() => {})
                    }
                  >
                    Analyse conversation
                  </Button>
                )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
