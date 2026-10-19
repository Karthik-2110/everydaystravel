import { readFile, writeFile } from "node:fs/promises";
const source = JSON.parse(
  await readFile(
    new URL("../.crm-local/workspace.json", import.meta.url),
    "utf8",
  ),
);
const payload = {
  leads: source.leads || [],
  vehicles: source.vehicles || [],
  bookings: source.bookings || [],
};
await writeFile(
  new URL("../.crm-local/production-import.json", import.meta.url),
  JSON.stringify(payload, null, 2),
  { mode: 0o600 },
);
console.log(
  `Exported ${payload.leads.length} enquiries, ${payload.vehicles.length} vehicles and ${payload.bookings.length} bookings to .crm-local/production-import.json. No inbox cache or Google credentials included.`,
);
