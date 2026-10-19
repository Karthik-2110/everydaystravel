import { describe, it, expect } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRepository } from "@/app/lib/crm/store";
import type { WhatsAppMessage } from "@/app/lib/crm/whatsapp-model";
const message: WhatsAppMessage = {
  id: "wamid.test",
  conversationId: "number:+447700900123",
  phone: "+447700900123",
  name: "Sam",
  body: "Quote please",
  type: "text",
  businessId: "business",
  phoneId: "number",
  sentAt: "2026-10-19T10:00:00Z",
  receivedAt: "2026-10-19T10:01:00Z",
};
describe("WhatsApp persistent enquiry intake", () => {
  it("deduplicates notifications, preserves earlier messages, and imports only once", async () => {
    const dir = await mkdtemp(join(tmpdir(), "crm-wa-"));
    try {
      const repo = createRepository(dir);
      await repo.receiveWhatsApp([message]);
      await repo.receiveWhatsApp([
        message,
        { ...message, id: "wamid.older", sentAt: "2026-10-18T10:00:00Z" },
      ]);
      expect((await repo.read()).whatsAppMessages).toHaveLength(2);
      const lead = await repo.importWhatsApp({
        sourceWhatsAppId: message.id,
        name: "Sam",
        phone: message.phone,
        title: "Airport enquiry",
      });
      const again = await repo.importWhatsApp({
        sourceWhatsAppId: message.id,
        name: "Other",
        phone: message.phone,
      });
      expect(again.id).toBe(lead.id);
      expect(lead.channel).toBe("whatsapp");
      expect(lead.sourceWhatsAppIds).toEqual([message.id]);
      expect((await repo.read()).leads).toHaveLength(1);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
it("archives reviewed messages without deleting enquiries and ignores their redelivery", async () => {
  const dir = await mkdtemp(join(tmpdir(), "crm-wa-archive-"));
  try {
    const repo = createRepository(dir);
    await repo.receiveWhatsApp([message]);
    await repo.importWhatsApp({
      sourceWhatsAppId: message.id,
      name: "Sam",
      phone: message.phone,
    });
    await repo.archiveWhatsApp(
      message.conversationId,
      message.sentAt + "|" + message.id,
    );
    await repo.receiveWhatsApp([
      message,
      { ...message, id: "later", sentAt: "2026-10-20T10:00:00Z" },
    ]);
    expect((await repo.read()).whatsAppMessages?.map((m) => m.id)).toEqual([
      "later",
    ]);
    expect((await repo.read()).leads).toHaveLength(1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
it("uses the same ordering for mixed-case message IDs at an archive boundary", async () => {
  const dir = await mkdtemp(join(tmpdir(), "crm-wa-boundary-"));
  try {
    const repo = createRepository(dir);
    const batch = [
      { ...message, id: "wamid.a" },
      { ...message, id: "wamid.Z" },
    ];
    await repo.receiveWhatsApp(batch);
    await repo.archiveWhatsApp(
      message.conversationId,
      message.sentAt + "|wamid.a",
    );
    await repo.receiveWhatsApp(batch);
    expect((await repo.read()).whatsAppMessages).toHaveLength(0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
