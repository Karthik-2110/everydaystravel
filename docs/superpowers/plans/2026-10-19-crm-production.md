# Production CRM Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement task by task. User approved the design and explicitly requested building it in this session.

**Goal:** Enable authenticated shared CRM use on everydaystravel.co.uk/crm.
**Architecture:** Firebase Google identity and secure server sessions; server-only Firestore with transactions across instances; encrypted shared integration credentials and explicit migration. Preserve localhost development mode.
**Tech Stack:** Next 16, firebase-admin, Firebase browser auth, Firestore, shadcn, Vitest.
**Spec:** docs/superpowers/specs/2026-10-19-crm-production-design.md

## Global Constraints
- Any verified Google account gains immediate shared access; only configured admins can manage the shared business connection.
- No browser use. No private records/tokens in output. Production fails closed without configuration.
- Database transaction callbacks have no external side effects; booking conflict checks remain atomic.
- Public marketing forms unchanged. No implicit import of local records.

## Review Focus
- Concurrent booking/edit/export requests across instances and transaction retries.
- Revoked/unverified/wrong-provider sessions, CSRF and host manipulation.
- Interrupted integration writes, rotated credentials and ambiguous delivery.
- Oversized documents, historical cache growth and populated-target imports.
- Missing production configuration does not break marketing build or expose local files.

## Tasks
- [x] 1. Auth boundary: tests for session claims, origins, production denial; implement lazy Firebase admin, Google login/session/logout routes, protected page/API and shadcn login. Verify targeted tests.
- [x] 2. Shared persistence: abstract existing domain repository over read/mutate backend. Firestore separate documents, atomic workspace version, bounded writes, actor audit. Test independent-instance conflicts/stale edits and import refusal/idempotency.
- [x] 3. Integration persistence: encrypted server key/ciphertext in Firestore, admin OAuth initiation and session binding, generation-safe credential updates. Move Calendar side effects out of retry callbacks; operation claims and durable reply IDs. Test encryption and claim behavior.
- [x] 4. Shared UI refresh/signout/session expiry handling; migration tool, deny-client rules, configuration template, retention/activation guide. Test private-state clearing and import validation.
- [x] 5. Run full tests, TypeScript, scoped lint and build; independent code review and fixes. Document external setup still needed; do not claim live deployment success without credentials.

## Execution
Native execution in current checkout; existing unrelated untracked website design document stays untouched. Authentication and database are deliberately lazy so builds work before provisioning. The approved design supplies product decisions; remaining configuration values are activation prerequisites.

### Execution ledger
- Auth policy accepts any verified Google provider account as explicitly requested; admin-only integration actions enforced server-side.
- Shared per-record storage uses workspace-lock Firestore transactions; external Calendar operations moved outside retried transactions and guarded by durable pending/done/unknown claims.
- Controlled import is previewed, admin-only, idempotent, and rejects populated targets or invalid/conflicting records.
- User supplied Firebase project everydays-travel-crm and integration administrator web@everydaystravel.co.uk; waiting for service account and public web app settings.
- Located existing Vercel everydaystravel project through saved login; no hosting changes made yet.
- Ruling: update Next.js and vulnerable dependencies before releasing authenticated customer data, because production audit found existing critical advisories. Move shadcn generator to devDependencies; preserve installed UI components.

- Verification complete: 358 tests across 40 files, TypeScript, scoped lint, diff whitespace and Next 16.4.2 production build passed. Build used the existing nonworking build-only Resend placeholder; no messages sent. Production npm audit reports zero vulnerabilities; remaining development-tool advisories are separate.
- Independent review completed with no remaining critical/important findings after fixes for disconnected-cache races, pre-write operation failures, recovery ownership, and account-specific export idempotency. Additional UI regression proves an open private draft disappears on session expiry.
- Hosted project runtime verified Node 24.x. vercel.json uses npm ci so deployments use the tested npm lockfile instead of the historical Bun lockfile.

## Activation pending
- [ ] User resolves organisation policy permissions and saves Firebase service account at .crm-local/firebase-service-account.json.
- [ ] Firebase Google provider, external sign-in audience, authorised domain, London Firestore and deny-client rules are enabled and verified.
- [ ] Public Firebase web app settings and encrypted server settings are placed in production hosting.
- [ ] Deploy and verify live sign-in/shared record access; administrator reconnects business mailbox. No local records or tokens have been uploaded automatically.
