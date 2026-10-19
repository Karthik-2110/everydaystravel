import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Clock3, FileText, Inbox, CheckCircle2 } from "lucide-react";

export function SectionCards({
  openCount,
  quotedValue,
  overdue,
  wonCount,
}: {
  openCount: number;
  quotedValue: string;
  overdue: number;
  wonCount: number;
}) {
  const cards = [
    {
      label: "Open enquiries",
      value: openCount,
      detail: "In your pipeline",
      icon: Inbox,
    },
    {
      label: "Quoted value",
      value: quotedValue,
      detail: "Awaiting a decision",
      icon: FileText,
    },
    {
      label: "Follow-ups overdue",
      value: overdue,
      detail: overdue ? "Ready for your attention" : "All caught up",
      icon: Clock3,
    },
    {
      label: "Won bookings",
      value: wonCount,
      detail: "All time",
      icon: CheckCircle2,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 min-[450px]:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, detail, icon: Icon }) => (
        <Card
          key={label}
          className="gap-4 rounded-lg shadow-none py-4 [--card-spacing:--spacing(4)]"
        >
          <CardHeader>
            <CardDescription className="text-xs">{label}</CardDescription>
            <CardTitle className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
              {value}
            </CardTitle>
            <CardAction>
              <Icon className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="text-[11px] text-muted-foreground">
            {detail}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
