import { authorize } from "@/app/lib/crm/auth";
import { AccessError } from "@/app/lib/crm/auth-policy";
import { actorContext } from "@/app/lib/crm/firestore-store";
import { repository } from "@/app/lib/crm/store";
import { validateImport, importRecords } from "@/app/lib/crm/migration";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const { staff } = await authorize(request, true);
    if (Number(request.headers.get("content-length")) > 4000000)
      throw new Error("Import file exceeds 4 MB");
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 4000000)
      throw new Error("Import file exceeds 4 MB");
    const { confirm, data } = JSON.parse(raw);
    const valid = validateImport(data);
    const summary = {
      enquiries: valid.leads.length,
      vehicles: valid.vehicles.length,
      bookings: valid.bookings.length,
    };
    if (confirm !== true)
      return Response.json(
        { summary },
        { headers: { "Cache-Control": "no-store" } },
      );
    await actorContext.run(staff, () =>
      repository.mutate((state) => importRecords(state, valid)),
    );
    return Response.json(
      {
        summary,
        notice:
          "Records imported. Existing email caches and Google credentials were not copied.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof AccessError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Import failed",
      },
      {
        status: error instanceof AccessError ? error.status : 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
