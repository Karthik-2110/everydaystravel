"use client";
import { Checkbox } from "@/components/ui/checkbox";
import ImportRecords from "./ImportRecords";
import { useState } from "react";
import {
  Globe,
  Mail,
  CalendarDays,
  MessageCircle,
  ArrowRight,
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
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Snapshot, Action } from "./ui";

export default function Integrations({
  data,
  pending,
  act,
  onConnect,
}: {
  data: Snapshot;
  pending: boolean;
  act: Action;
  onConnect: () => void;
}) {
  const [reviewOperation, setReviewOperation] = useState<string | null>(null);
  const [checkedGoogle, setCheckedGoogle] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="max-w-4xl space-y-7">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Globe className="size-5 text-primary" />
            Google Workspace
          </CardTitle>
          <CardDescription>
            One connection for your email and calendar.
          </CardDescription>
          <CardAction>
            <Badge variant={data.google.connected ? "secondary" : "outline"}>
              {data.google.connected ? "Connected" : "Not connected"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          {data.staff?.admin === false && (
            <p className="mb-4 text-sm text-muted-foreground">
              An integration administrator manages this shared connection.
            </p>
          )}
          <ItemGroup>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <Mail />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Gmail</ItemTitle>
                <ItemDescription>
                  Read incoming messages, reply and capture enquiries.
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <CalendarDays />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Google Calendar</ItemTitle>
                <ItemDescription>
                  See upcoming events and add enquiry follow-ups.
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          {data.google.connected ? (
            <>
              <p className="text-xs text-muted-foreground">
                {data.google.email}
              </p>
              {confirm ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Revoke access and clear cached mail?
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                      void act({ action: "disconnect" })
                        .then(() => setConfirm(false))
                        .catch(() => {})
                    }
                  >
                    Confirm disconnect
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.staff?.admin === false}
                  onClick={() => setConfirm(true)}
                >
                  Disconnect
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {data.google.configured
                  ? "Use your everydaystravel.co.uk account."
                  : "Complete the one-time Google OAuth setup below."}
              </p>
              <Button
                disabled={
                  pending ||
                  !data.google.configured ||
                  data.staff?.admin === false
                }
                onClick={onConnect}
              >
                Connect Google
                <ArrowRight />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      {!data.google.configured && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Finish the Google setup</CardTitle>
            <CardDescription>
              The website’s Maps key is separate from this connection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-4 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                Enable the <b>Gmail API</b> and <b>Google Calendar API</b> in
                Google Cloud.
              </li>
              <li>
                Configure Google Auth for the Workspace organisation and create
                a <b>Web application</b> OAuth client.
              </li>
              <li>
                Add this authorised redirect URI:
                <code className="mt-2 block rounded-md bg-muted px-3 py-2 text-xs break-all text-foreground">
                  {typeof window !== "undefined"
                    ? window.location.origin
                    : "http://localhost:3000"}
                  /api/crm/google/callback
                </code>
              </li>
              <li>
                Add <code>CRM_GOOGLE_CLIENT_ID</code> and{" "}
                <code>CRM_GOOGLE_CLIENT_SECRET</code> to your local environment,
                then restart the server.
              </li>
            </ol>
            <Alert className="mt-3">
              <AlertDescription>
                Full setup instructions are in <code>docs/crm-setup.md</code>.
                No Google account is connected yet.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
              >
                Open Google Cloud
                <ExternalLink />
              </a>
            </Button>
          </CardFooter>
        </Card>
      )}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="size-5" />
            WhatsApp Business
          </CardTitle>
          <CardDescription>
            Incoming messages become reviewed enquiries in the shared inbox.
          </CardDescription>
          <CardAction>
            <Badge variant="outline">
              {data.whatsapp?.configured
                ? "Webhook configured"
                : "Setup tomorrow"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Messages → Gemini request analysis → review → enquiry → quote →
            vehicle reservation.
          </p>
          <p className="text-muted-foreground">
            Gemini:{" "}
            {data.whatsapp?.geminiConfigured
              ? "configured"
              : "not configured yet"}
            . Number onboarding, public message delivery and Firebase activation
            must be completed before live use.
          </p>
          <p className="text-muted-foreground">
            New incoming texts and captions are supported. Older chat history
            and attachment contents are not imported or read automatically. No
            replies or booking changes are sent automatically.
          </p>
        </CardContent>
      </Card>
      {data.staff?.admin && Boolean(data.operations?.length) && (
        <section className="space-y-4 border-t pt-6">
          <h2 className="font-semibold">Review unfinished Calendar updates</h2>
          <p className="text-sm text-muted-foreground">
            Check the matching event in Google Calendar before releasing its
            record for editing. Releasing a record does not change Google
            Calendar.
          </p>
          {data.operations?.map((operation) => (
            <div
              key={operation.key}
              className="space-y-3 rounded-md border p-4"
            >
              <p className="text-sm font-medium">
                {data.bookings?.find((b) => `booking:${b.id}` === operation.key)
                  ?.title ||
                  data.leads.find((l) => `lead:${l.id}` === operation.key)
                    ?.title ||
                  "Calendar update"}
              </p>
              {reviewOperation === operation.key ? (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={checkedGoogle}
                      onCheckedChange={(value) =>
                        setCheckedGoogle(value === true)
                      }
                    />
                    I checked this update in Google Calendar
                  </label>
                  <Button
                    size="sm"
                    disabled={!checkedGoogle || pending}
                    onClick={() =>
                      void act({
                        action: "operation-resolve",
                        key: operation.key,
                        token: operation.token,
                        checked: true,
                      })
                        .then(() => {
                          setReviewOperation(null);
                          setCheckedGoogle(false);
                        })
                        .catch(() => {})
                    }
                  >
                    Release record
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => {
                    setReviewOperation(operation.key);
                    setCheckedGoogle(false);
                  }}
                >
                  Review update
                </Button>
              )}
            </div>
          ))}
        </section>
      )}
      {data.staff?.admin && <ImportRecords />}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Room to grow</CardTitle>
          <CardDescription>Planned integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {[
              {
                icon: MessageCircle,
                title: "Instagram",
                text: "Capture enquiries from direct messages.",
              },
              {
                icon: Globe,
                title: "Google Analytics & advertising",
                text: "Understand which campaigns lead to bookings.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Item key={title} variant="outline">
                <ItemMedia variant="icon">
                  <Icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{title}</ItemTitle>
                  <ItemDescription>{text}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant="outline">Planned</Badge>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  );
}
