export type VehicleUnit = {
  id: string;
  name: string;
  registration: string;
  capacity: number;
};
export type Booking = {
  id: string;
  revision: number;
  title: string;
  customer: string;
  vehicleId: string;
  leadId: string;
  start: string;
  end: string;
  status: "hold" | "confirmed" | "cancelled";
  passengers: number;
  amount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  googleEventId?: string;
  googleEventUrl?: string;
  googleSyncedRevision?: number;
};
const str = (input: Record<string, unknown>, key: string, max = 500) => {
  if (input[key] === undefined) return "";
  if (typeof input[key] !== "string" || input[key].length > max)
    throw new Error(`Invalid ${key}`);
  return input[key].trim();
};
export function createVehicle(input: Record<string, unknown>): VehicleUnit {
  const name = str(input, "name");
  const registration = str(input, "registration")
    .toUpperCase()
    .replace(/\s+/g, " ");
  const capacity = Number(input.capacity);
  if (!name || !/^[A-Z0-9][A-Z0-9 -]{1,19}$/.test(registration))
    throw new Error("Enter a vehicle name and registration");
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 200)
    throw new Error("Enter vehicle capacity between 1 and 200");
  return { id: crypto.randomUUID(), name, registration, capacity };
}
export function makeBooking(
  input: Record<string, unknown>,
  vehicles: VehicleUnit[],
  previous?: Booking,
): Booking {
  const value = { ...(previous || {}), ...input };
  const title = str(value, "title"),
    customer = str(value, "customer"),
    vehicleId = str(value, "vehicleId");
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) throw new Error("Select a registered vehicle");
  if (!title || !customer) throw new Error("Enter a title and customer name");
  const start = str(value, "start"),
    end = str(value, "end");
  for (const date of [start, end])
    if (
      !/^20\d\d-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date.slice(0, 10)
    )
      throw new Error("Enter valid start and end dates");
  if (Date.parse(end) <= Date.parse(start))
    throw new Error("The booking end must be after the start");
  const status = value.status || "hold";
  if (!["hold", "confirmed", "cancelled"].includes(String(status)))
    throw new Error("Invalid booking status");
  const passengers = Number(value.passengers || 0),
    amount = Number(value.amount || 0);
  if (
    !Number.isInteger(passengers) ||
    passengers < 0 ||
    passengers > vehicle.capacity
  )
    throw new Error("Passenger count exceeds vehicle capacity or is invalid");
  if (!Number.isSafeInteger(amount) || amount < 0)
    throw new Error("Enter a valid amount in pence");
  const now = new Date().toISOString();
  return {
    id: previous?.id || crypto.randomUUID(),
    revision: (previous?.revision || 0) + 1,
    title,
    customer,
    vehicleId,
    leadId: str(value, "leadId"),
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    status: status as Booking["status"],
    passengers,
    amount,
    notes: str(value, "notes", 10000),
    createdAt: previous?.createdAt || now,
    updatedAt: now,
    ...(previous?.googleEventId
      ? {
          googleEventId: previous.googleEventId,
          googleEventUrl: previous.googleEventUrl,
          googleSyncedRevision: previous.googleSyncedRevision,
        }
      : {}),
  };
}
export function checkAvailability(booking: Booking, bookings: Booking[]) {
  if (booking.status === "cancelled") return;
  const conflict = bookings.find(
    (other) =>
      other.id !== booking.id &&
      other.vehicleId === booking.vehicleId &&
      other.status !== "cancelled" &&
      Date.parse(booking.start) < Date.parse(other.end) &&
      Date.parse(booking.end) > Date.parse(other.start),
  );
  if (conflict)
    throw new Error(
      `Vehicle already reserved for “${conflict.title}”. Choose another vehicle or time.`,
    );
}
