import {
  Mail,
  Phone,
  Globe,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { STAGES, type Lead, type Channel } from "@/app/lib/crm/model";

export type View =
  "pipeline" | "inbox" | "followups" | "integrations" | "calendar";
export type Snapshot = {
  whatsAppMessages?: import("@/app/lib/crm/whatsapp-model").WhatsAppMessage[];
  whatsAppAnalyses?: Record<
    string,
    Pick<
      import("@/app/lib/crm/gemini").ConversationAnalysis,
      "status" | "result" | "error" | "updatedAt"
    >
  >;
  whatsapp?: { configured: boolean; geminiConfigured: boolean };
  leads: Lead[];
  bookings?: import("@/app/lib/crm/bookings").Booking[];
  vehicles?: import("@/app/lib/crm/bookings").VehicleUnit[];
  calendarMonths?: Record<string, import("@/app/lib/crm/model").CalendarItem[]>;
  messages: import("@/app/lib/crm/model").Mail[];
  events: import("@/app/lib/crm/model").CalendarItem[];
  syncedAt: string | null;
  operations?: { key: string; token: string; status: string; at: string }[];
  staff?: { email: string; admin: boolean } | null;
  google: { configured: boolean; connected: boolean; email: string | null };
  notice?: string;
};
export type LeadDraft = Partial<Lead> & {
  sourceMailId?: string;
  sourceWhatsAppId?: string;
};
export type Action = (input: Record<string, unknown>) => Promise<void>;
export const money = (pence: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: pence % 100 ? 2 : 0,
  }).format(pence / 100);
export const dateLabel = (date: string, time = false) =>
  date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
        timeZone: "Europe/London",
      }).format(new Date(date))
    : "Not scheduled";
export const isOpen = (lead: Lead) =>
  lead.stage === "new" || lead.stage === "quoted";
export const isDue = (lead: Lead) =>
  isOpen(lead) &&
  Boolean(lead.nextActionAt) &&
  Date.parse(lead.nextActionAt) <= Date.now();
export const sourceIcons: Record<Channel, LucideIcon> = {
  website: Globe,
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  instagram: MessageCircle,
};
export const sourceLabel = (channel: Channel) =>
  ({
    website: "Website",
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
  })[channel];
export function StageBadge({ lead }: { lead: Lead }) {
  return (
    <Badge
      variant="secondary"
      className={lead.stage === "won" ? "bg-primary/10 text-primary" : ""}
    >
      {STAGES.find((s) => s.id === lead.stage)?.label}
    </Badge>
  );
}
export function WorkspaceEmpty({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Empty className="min-h-72 px-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
