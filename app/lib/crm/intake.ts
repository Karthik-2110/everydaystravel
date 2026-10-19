import type { Lead, Mail } from "./model";
export function findMailLead(
  mail: Pick<Mail, "id" | "threadId" | "from">,
  leads: Lead[],
) {
  const email = mail.from.match(/<([^<>]+)>/)?.[1] || mail.from.trim();
  return (
    leads.find((lead) => lead.sourceMailIds?.includes(mail.id)) ||
    leads.find((lead) => lead.sourceThreadIds?.includes(mail.threadId)) ||
    leads.find((lead) => lead.email.toLowerCase() === email.toLowerCase())
  );
}
export type Intake = {
  intent:
    | "quote-request"
    | "booking-request"
    | "change-request"
    | "cancellation"
    | "other";
  fields: Partial<Lead>;
  warnings: string[];
  evidence: { label: string; value: string }[];
};
const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
export function suggestEmailIntake(mail: Mail): Intake {
  // Incoming text is source data, never executable instructions. Quoted history is not a new request.
  const body = mail.body
    .slice(0, 18000)
    .split(/^On .+wrote:|^-{2,}\s*Original Message/im)[0];
  const content = `${mail.subject}\n${body}`;
  const intent = /\b(cancel(?:led|lation)?|no longer need)\b/i.test(content)
    ? "cancellation"
    : /\b(amend|reschedule|change (?:our|the|my) booking)\b/i.test(content)
      ? "change-request"
      : /\b(book(?:ing)? confirm(?:ed|ation)|confirm (?:our|the|my) booking|please book|accept (?:your|the) quote)\b/i.test(
            content,
          )
        ? "booking-request"
        : /\b(quote|quotation|availability|enquiry|price|hire)\b/i.test(content)
          ? "quote-request"
          : "other";
  const labelled = (label: string) =>
    body
      .match(new RegExp(`^(?:${label})\\s*[:=]\\s*(.+)$`, "im"))?.[1]
      .trim()
      .slice(0, 500) || "";
  const sender = mail.from.match(/<([^<>]+)>/)?.[1] || mail.from.trim();
  const phone =
    labelled("phone|telephone|mobile|contact number") ||
    body.match(/(?:\+44\s?\(?0?\)?\s?|0)(?:\d[\s()-]?){9,10}\d/)?.[0].trim() ||
    "";
  const passengers =
    labelled("passengers|pax|number of passengers").match(/\d+/)?.[0] ||
    body.match(/\b(\d{1,3})\s*(?:passengers|people|pax)\b/i)?.[1] ||
    "";
  const route = body.match(
    /\bfrom\s+([^\n]{2,80}?)\s+to\s+([^\n]{2,80}?)(?=\s+on\s|\s+for\s|[.!?\n]|$)/i,
  );
  let travelDate = "";
  const numericDate = (
    labelled("travel date|journey date|date") || content
  ).match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/);
  const namedDate = content.match(
    /\b(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d{2})\b/i,
  );
  if (numericDate)
    travelDate = `${numericDate[3]}-${numericDate[2].padStart(2, "0")}-${numericDate[1].padStart(2, "0")}`;
  else if (namedDate)
    travelDate = `${namedDate[3]}-${String(monthNames.indexOf(namedDate[2].toLowerCase()) + 1).padStart(2, "0")}-${namedDate[1].padStart(2, "0")}`;
  if (
    travelDate &&
    (!Number.isFinite(Date.parse(`${travelDate}T12:00:00Z`)) ||
      new Date(`${travelDate}T12:00:00Z`).toISOString().slice(0, 10) !==
        travelDate)
  )
    travelDate = "";
  const fields: Partial<Lead> = {
    name:
      labelled("name|full name|customer name") ||
      mail.from.replace(/<.*>/, "").replace(/"/g, "").trim() ||
      sender,
    email: /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(sender) ? sender : "",
    phone,
    title: mail.subject,
    channel: "email",
    pickup:
      labelled("pickup|pick up|pickup location|pick-up|from") ||
      route?.[1].trim() ||
      "",
    destination:
      labelled("destination|drop off|drop-off|to") || route?.[2].trim() || "",
    travelDate,
    passengers,
    company: labelled("company|organisation"),
    vehicle: labelled("vehicle|vehicle required"),
  };
  const warnings = [
    "Suggestions use local text patterns. Review the original email and every field before saving.",
  ];
  if (!travelDate)
    warnings.push(
      "No complete travel date found. Confirm the date with the customer.",
    );
  if (["booking-request", "change-request", "cancellation"].includes(intent))
    warnings.push(
      "This message may affect a booking. No reservation or status change has been made.",
    );
  if (intent === "other") warnings.push("This may not be a travel enquiry.");
  const evidence = [
    "phone",
    "pickup",
    "destination",
    "travelDate",
    "passengers",
  ]
    .filter((key) => fields[key as keyof Lead])
    .map((key) => ({ label: key, value: String(fields[key as keyof Lead]) }));
  return { intent, fields, warnings, evidence };
}
