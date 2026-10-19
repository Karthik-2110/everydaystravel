import { suggestEmailIntake } from "./intake";
export type WhatsAppMessage = {
  id: string;
  conversationId: string;
  name: string;
  phone: string;
  sentAt: string;
  receivedAt: string;
  type: string;
  body: string;
  businessId: string;
  phoneId: string;
  media?: { id: string; mimeType: string; filename?: string };
};
export function normalisePhone(value: string) {
  let phone = value.trim().replace(/[\s().-]/g, "");
  if (/^0\d{10}$/.test(phone)) phone = "44" + phone.slice(1);
  phone = phone.replace(/^\+/, "");
  if (!/^[1-9]\d{7,14}$/.test(phone))
    throw new Error("Invalid WhatsApp sender number");
  return "+" + phone;
}
export function whatsAppIntake(message: WhatsAppMessage) {
  const suggestion = suggestEmailIntake({
    id: message.id,
    threadId: message.conversationId,
    from: message.name,
    to: "",
    subject: "WhatsApp enquiry",
    body: message.body,
    snippet: message.body,
    date: message.sentAt,
    messageId: message.id,
    unread: false,
  });
  return {
    ...suggestion,
    fields: {
      ...suggestion.fields,
      name: message.name || message.phone,
      phone: message.phone,
      email: "",
      channel: "whatsapp" as const,
    },
    warnings: [
      ...suggestion.warnings,
      ...(message.type !== "text"
        ? [
            "Only the caption is analysed. Review the attachment in WhatsApp before recording its details.",
          ]
        : []),
    ],
  };
}

export function compareWhatsAppMessages(
  a: WhatsAppMessage,
  b: WhatsAppMessage,
) {
  const left = `${a.sentAt}|${a.id}`,
    right = `${b.sentAt}|${b.id}`;
  return left < right ? -1 : left > right ? 1 : 0;
}
