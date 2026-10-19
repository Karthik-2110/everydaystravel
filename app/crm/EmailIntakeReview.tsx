"use client";
import { FileInput, ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { suggestEmailIntake } from "@/app/lib/crm/intake";
import type { Lead, Mail } from "@/app/lib/crm/model";
import type { LeadDraft, Action } from "./ui";
const intents = {
  "quote-request": "Quote request",
  "booking-request": "Booking intent",
  "change-request": "Booking change",
  cancellation: "Cancellation request",
  other: "Needs classification",
};
export default function EmailIntakeReview({
  mail,
  matched,
  onCreate,
  onOpen,
  act,
  pending,
}: {
  mail: Mail;
  matched?: Lead;
  onCreate: (draft: LeadDraft) => void;
  onOpen: (id: string) => void;
  act: Action;
  pending: boolean;
}) {
  const intake = suggestEmailIntake(mail),
    imported = matched?.sourceMailIds?.includes(mail.id);
  const labels: { key: keyof Lead; label: string }[] = [
    { key: "name", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "pickup", label: "Pickup" },
    { key: "destination", label: "Destination" },
    { key: "travelDate", label: "Travel date (UK)" },
    { key: "passengers", label: "Passengers" },
    { key: "vehicle", label: "Vehicle requested" },
  ];
  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileInput className="size-4" />
            Review email request
          </CardTitle>
          <Badge variant="secondary">{intents[intake.intent]}</Badge>
        </div>
        <CardDescription>
          Suggested fields, not an automatic booking. Edit the details in the
          next step.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-3 text-xs">
          {labels.map(({ key, label }) => (
            <div key={key} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="break-words">
                {intake.fields[key]
                  ? String(intake.fields[key])
                  : "Needs review"}
              </dd>
            </div>
          ))}
        </dl>
        <Alert>
          <AlertDescription>
            <ul className="list-disc space-y-1 pl-4 text-xs">
              {intake.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        {imported ? (
          <Button variant="outline" onClick={() => onOpen(matched!.id)}>
            Open imported enquiry
            <ArrowRight />
          </Button>
        ) : (
          <>
            <Button
              onClick={() =>
                onCreate({ ...intake.fields, sourceMailId: mail.id })
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
                    action: "mail-import",
                    sourceMailId: mail.id,
                    targetLeadId: matched.id,
                  }).catch(() => {})
                }
              >
                <Link2 />
                Attach to {matched.name}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
