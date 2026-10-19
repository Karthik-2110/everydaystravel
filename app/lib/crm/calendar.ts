const parts = (date: Date) =>
  Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
export function londonInput(iso: string) {
  const p = parts(new Date(iso));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
export function londonDate(iso = new Date().toISOString()) {
  return londonInput(iso).slice(0, 10);
}
export function londonToUtc(local: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local))
    throw new Error("Enter a valid London date and time");
  const raw = Date.parse(`${local}:00Z`);
  if (!Number.isFinite(raw)) throw new Error("Enter a valid date");
  const candidates = [raw, raw - 3600000].filter(
    (value) => londonInput(new Date(value).toISOString()) === local,
  );
  if (candidates.length !== 1)
    throw new Error(
      candidates.length
        ? "This London time occurs twice when the clocks change. Choose an unambiguous time."
        : "This London date/time does not exist. Check the date and clock-change time.",
    );
  return new Date(candidates[0]).toISOString();
}
export function shiftDay(day: string, count: number) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}
export function shiftMonth(month: string, count: number) {
  validateMonth(month);
  const date = new Date(`${month}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + count);
  return date.toISOString().slice(0, 7);
}
export function validateMonth(month: string) {
  if (!/^(20\d\d)-(0[1-9]|1[0-2])$/.test(month))
    throw new Error("Invalid calendar month");
}
export function monthDays(month: string): string[] {
  validateMonth(month);
  const first = `${month}-01`;
  const weekday = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => shiftDay(first, i - weekday));
}
export function inDay(event: { start: string; end?: string }, day: string) {
  if (!event.start) return false;
  if (!event.end)
    return (
      (event.start.includes("T") ? londonDate(event.start) : event.start) ===
      day
    );
  if (!event.start.includes("T")) return event.start <= day && event.end > day;
  return (
    Date.parse(event.start) <
      Date.parse(londonToUtc(`${shiftDay(day, 1)}T00:00`)) &&
    Date.parse(event.end) > Date.parse(londonToUtc(`${day}T00:00`))
  );
}
