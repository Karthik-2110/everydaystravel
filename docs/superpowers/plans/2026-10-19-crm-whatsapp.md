# WhatsApp Incoming Pipeline Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. User directed building the pipeline; builder selected inbound-only scope and stated it in chat.

**Goal:** Incoming WhatsApp conversations become reviewed CRM enquiries.
**Architecture:** Signed provider webhook, existing atomic repository with WhatsApp record families, authenticated shared inbox review/import. No outbound messages.
**Tech Stack:** Next 16, Node crypto, existing shadcn and Firestore/local adapters, Vitest.
**Spec:** docs/superpowers/specs/2026-10-19-crm-whatsapp-design.md

## Constraints and review focus
No browser use, no live account changes or message sends. Validate raw signatures/source IDs before storing. Production has no disk fallback. Deduplicate replayed/out-of-order notifications; whitelist metadata; no attachment/remote HTML rendering. Missing Firebase/Meta configuration is a live-activation prerequisite, not permission to fake incoming chats.

## Tasks
- [x] Write failing WhatsApp domain/webhook tests; implement HMAC, challenge, payload parsing and phone normalisation in app/lib/crm/whatsapp.ts.
- [x] Add WhatsApp persistence and reviewed idempotent import in store.ts/shared-records.ts and /api/crm/whatsapp/webhook; extend snapshot/action boundary. Test real local repository and protected API.
- [x] Add WhatsApp inbox tab/transcript and review-to-enquiry flow; preserve source metadata through LeadEditor. Show connection/activation state and no invented chats.
- [x] Document setup/history limits; full tests/type/scoped lint/build and independent review; preserve deferred Firebase work and unrelated website document.

## Execution ledger
- User selected existing Gemini API instead of OpenAI, then explicitly deferred all API and Firebase setup until tomorrow. Added Gemini structured conversation understanding, durable queued/pending/ready/failed receipts, stale-result guards, authenticated retries and a protected queue worker. No live keys configured or provider calls made.
- Added reviewed incoming conversation UI, source-aware enquiry import, admin archive batches and persisted replay boundaries. Unsupported events are ignored before raw message parsing.
- Independent review fixed unsupported notification intake, missing archive capacity recovery, mixed-case archive ordering and polling during archive confirmation. Each fix has a failing→passing regression; final reviewer reports no important remaining findings.
- Final verification: 377 tests across 46 files passed, TypeScript and scoped lint passed, production build passed using the existing nonworking build-only Resend placeholder. No browser interaction or real message send/analysis used.
- Activation remains intentionally deferred: Firebase, Meta number/WABA subscription, Gemini key/model access and recurring worker scheduler. Documentation: docs/crm-whatsapp.md.
