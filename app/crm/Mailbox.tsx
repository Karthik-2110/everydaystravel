"use client";
import EmailIntakeReview from "./EmailIntakeReview";
import { findMailLead } from "@/app/lib/crm/intake";
import type { LeadDraft } from "./ui";
import { useState } from "react";
import { Inbox, Mail, Search, Plus, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WorkspaceEmpty, dateLabel, type Snapshot, type Action } from "./ui";
import type { Lead, Mail as MailItem } from "@/app/lib/crm/model";

export default function Mailbox({
  data,
  pending,
  act,
  onSetup,
  onCreate,
  onOpen,
}: {
  data: Snapshot;
  pending: boolean;
  act: Action;
  onSetup: () => void;
  onCreate: (lead: LeadDraft) => void;
  onOpen: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const message = data.messages.find((m) => m.id === selected);
  const messages = data.messages.filter((m) =>
    `${m.from} ${m.subject} ${m.body}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  if (!data.google.connected && !data.messages.length)
    return (
      <WorkspaceEmpty
        icon={Mail}
        title="Bring your conversations together."
        description="Connect the team’s Google Workspace account to read incoming email, reply through Gmail and turn a conversation into an enquiry."
        action={
          <Button onClick={onSetup}>
            Set up Google
            <ArrowRight />
          </Button>
        }
      />
    );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-72">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            aria-label="Search inbox"
            placeholder="Search inbox…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Latest 30 inbox messages
          {data.syncedAt && ` · Synced ${dateLabel(data.syncedAt, true)}`}
        </p>
      </div>
      {!messages.length ? (
        <WorkspaceEmpty
          icon={Inbox}
          title="Your inbox is ready."
          description="Sync Google to load incoming messages. Only you decide which messages become enquiries."
        />
      ) : (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(250px,.85fr)_minmax(0,1.2fr)]">
          <Card className="gap-0 overflow-hidden py-0 shadow-none">
            <div className="divide-y">
              {messages.map((m) => (
                <Button
                  variant="ghost"
                  key={m.id}
                  className={`h-auto w-full justify-start gap-3 rounded-none px-4 py-5 text-left whitespace-normal ${selected === m.id ? "bg-accent" : ""}`}
                  onClick={() => setSelected(m.id)}
                >
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="text-xs">
                      {m.from.replace(/"/g, "").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-medium">
                        {m.from.replace(/<.*>/, "").replace(/"/g, "").trim() ||
                          m.from}
                      </span>
                      <time className="shrink-0 text-[10px] text-muted-foreground">
                        {dateLabel(m.date)}
                      </time>
                    </span>
                    <span className="mt-1 block truncate text-xs font-medium">
                      {m.subject}
                    </span>
                    <span className="mt-1 line-clamp-2 text-xs font-normal text-muted-foreground">
                      {m.snippet}
                    </span>
                  </span>
                  {m.unread && (
                    <Badge
                      className="size-1.5 shrink-0 rounded-full p-0"
                      aria-label="Unread in Gmail"
                    />
                  )}
                </Button>
              ))}
            </div>
          </Card>
          {message ? (
            <MessageDetail
              key={message.id}
              message={message}
              leads={data.leads}
              pending={pending}
              act={act}
              onCreate={onCreate}
              onOpen={onOpen}
            />
          ) : (
            <Card className="shadow-none">
              <WorkspaceEmpty
                icon={Mail}
                title="Select a conversation"
                description="Read the message, reply or create an enquiry."
              />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
function MessageDetail({
  message,
  leads,
  pending,
  act,
  onCreate,
  onOpen,
}: {
  message: MailItem;
  leads: Lead[];
  pending: boolean;
  act: Action;
  onCreate: (lead: LeadDraft) => void;
  onOpen: (id: string) => void;
}) {
  const [reviewIntake, setReviewIntake] = useState(false);
  const [reply, setReply] = useState("");
  const [review, setReview] = useState(false);
  const [attempt, setAttempt] = useState("");
  const email = message.from.match(/<([^<>]+)>/)?.[1] || message.from.trim();
  const matched = findMailLead(message, leads);
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!review) {
      setReview(true);
      if (!attempt) setAttempt(crypto.randomUUID());
      return;
    }
    try {
      await act({
        action: "reply",
        messageId: message.id,
        body: reply,
        requestId: attempt,
      });
      setReply("");
      setReview(false);
      setAttempt("");
    } catch {
      setReview(false);
    }
  }
  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader>
        <Badge variant="outline" className="mb-2 w-fit">
          Gmail
        </Badge>
        <CardTitle className="text-lg leading-relaxed break-words">
          {message.subject}
        </CardTitle>
        <CardDescription className="break-all">
          {message.from}
          <br />
          {dateLabel(message.date, true)}
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-6">
        <p className="max-h-96 overflow-auto text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.body}
        </p>
        <div>
          {matched ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpen(matched.id)}
            >
              Open enquiry
              <ArrowRight />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onCreate({
                  name:
                    message.from.replace(/<.*>/, "").replace(/"/g, "").trim() ||
                    email,
                  email,
                  phone: "",
                  title: message.subject,
                  channel: "email",
                })
              }
            >
              <Plus />
              Create enquiry from email
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setReviewIntake(!reviewIntake)}
        >
          {reviewIntake ? "Hide request review" : "Review request"}
        </Button>
        {reviewIntake && (
          <EmailIntakeReview
            mail={message}
            matched={matched}
            onCreate={onCreate}
            onOpen={onOpen}
            act={act}
            pending={pending}
          />
        )}
        <Separator />
        <form onSubmit={send} className="space-y-3">
          <Label htmlFor="gmail-reply">Reply through Gmail</Label>
          <Textarea
            id="gmail-reply"
            rows={5}
            value={reply}
            required
            maxLength={100000}
            disabled={pending}
            placeholder="Write your reply…"
            onChange={(e) => {
              setReply(e.target.value);
              setReview(false);
              setAttempt("");
            }}
          />
          {review && (
            <Alert>
              <AlertDescription>
                Send this reply to {message.from}?
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end">
            <Button disabled={pending || !reply.trim()}>
              <Send />
              {pending
                ? "Sending…"
                : review
                  ? "Confirm & send"
                  : "Review reply"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Replies are sent from the connected Workspace account.
      </CardFooter>
    </Card>
  );
}
