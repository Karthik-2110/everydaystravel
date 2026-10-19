import { randomUUID } from "node:crypto";
import { repository } from "./store";
import { analyseWhatsAppConversation, conversationFingerprint } from "./gemini";
import type { WorkspaceBackend } from "./store";
export async function analyseConversation(
  id: string,
  repo: WorkspaceBackend = repository,
  force = false,
) {
  if (!process.env.GEMINI_API_KEY) return;
  const token = randomUUID();
  const prepared = await repo.mutate((state) => {
    const messages = (state.whatsAppMessages || []).filter(
      (m) =>
        m.conversationId === id &&
        m.phoneId === process.env.WHATSAPP_PHONE_NUMBER_ID &&
        m.businessId === process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    );
    if (!messages.length) throw new Error("WhatsApp conversation not found");
    state.whatsAppAnalyses ||= {};
    const fingerprint = conversationFingerprint(messages),
      previous = state.whatsAppAnalyses[id];
    if (
      !force &&
      previous?.status === "failed" &&
      (previous.attempts || 0) >= 3
    )
      return null;
    if (
      previous?.fingerprint === fingerprint &&
      (previous.status === "ready" ||
        (previous.status === "pending" &&
          Date.now() - Date.parse(previous.updatedAt) < 90000))
    )
      return null;
    state.whatsAppAnalyses[id] = {
      id,
      token,
      fingerprint,
      status: "pending",
      updatedAt: new Date().toISOString(),
      attempts: (previous?.attempts || 0) + 1,
    };
    return { messages, fingerprint };
  });
  if (!prepared) return;
  try {
    const result = await analyseWhatsAppConversation(prepared.messages);
    await repo.mutate((state) => {
      const current = state.whatsAppAnalyses?.[id];
      if (current?.token !== token) return;
      const latest = (state.whatsAppMessages || []).filter(
        (m) => m.conversationId === id,
      );
      if (conversationFingerprint(latest) !== prepared.fingerprint) {
        current.status = "failed";
        current.error =
          "New messages arrived. Analyse the updated conversation.";
        return;
      }
      Object.assign(current, {
        status: "ready",
        result,
        updatedAt: new Date().toISOString(),
      });
    });
  } catch {
    await repo.mutate((state) => {
      const current = state.whatsAppAnalyses?.[id];
      if (current?.token === token)
        Object.assign(current, {
          status: "failed",
          error:
            "Analysis unavailable. Messages are saved; review manually or retry.",
          updatedAt: new Date().toISOString(),
        });
    });
  }
}

export async function drainWhatsAppQueue(repo: WorkspaceBackend = repository) {
  if (!process.env.GEMINI_API_KEY) return 0;
  const state = await repo.read();
  const ids = [
    ...new Set(
      (state.whatsAppMessages || [])
        .filter(
          (m) =>
            m.phoneId === process.env.WHATSAPP_PHONE_NUMBER_ID &&
            m.businessId === process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
        )
        .map((m) => m.conversationId),
    ),
  ]
    .filter((id) => {
      const job = state.whatsAppAnalyses?.[id];
      return (
        !job ||
        job.status === "queued" ||
        (job.status === "failed" &&
          (job.attempts || 0) < 3 &&
          Date.now() - Date.parse(job.updatedAt) > 60000) ||
        (job.status === "pending" &&
          Date.now() - Date.parse(job.updatedAt) > 90000)
      );
    })
    .slice(0, 6);
  for (let i = 0; i < ids.length; i += 3)
    await Promise.all(
      ids
        .slice(i, i + 3)
        .map((id) => analyseConversation(id, repo).catch(() => {})),
    );
  return ids.length;
}
