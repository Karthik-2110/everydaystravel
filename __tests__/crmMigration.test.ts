import { describe, it, expect } from "vitest";
import { validateImport, importRecords } from "@/app/lib/crm/migration";
import { emptyWorkspace } from "@/app/lib/crm/shared-records";
import { createLead } from "@/app/lib/crm/model";
describe("controlled CRM import", () => {
  it("validates existing records and refuses customer data outside the explicit payload", () => {
    const lead = createLead({ name: "Sam", phone: "123" });
    const saved = validateImport({ leads: [lead], vehicles: [], bookings: [] });
    expect(saved.leads[0].id).toBe(lead.id);
    expect(() =>
      validateImport({
        leads: [{ ...lead, email: "invalid" }],
        vehicles: [],
        bookings: [],
      }),
    ).toThrow();
    expect(() =>
      validateImport({
        leads: [],
        vehicles: [],
        bookings: [],
        messages: [{ body: "secret" }],
      }),
    ).toThrow();
  });
  it("refuses populated targets and is idempotent for the same import", () => {
    const imported = validateImport({
      leads: [createLead({ name: "Sam", phone: "123" })],
      vehicles: [],
      bookings: [],
    });
    const target = emptyWorkspace();
    importRecords(target, imported);
    expect(target.leads).toHaveLength(1);
    importRecords(target, imported);
    expect(target.leads).toHaveLength(1);
    expect(() =>
      importRecords(
        target,
        validateImport({
          leads: [createLead({ name: "Other", phone: "321" })],
          vehicles: [],
          bookings: [],
        }),
      ),
    ).toThrow(/populated/);
  });
});
