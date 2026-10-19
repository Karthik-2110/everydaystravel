# CRM Workspace Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. The user approved the light concept and explicitly requested implementation at `/crm`.

**Goal:** A usable local CRM with persistent enquiries, pipeline, shared Gmail inbox, follow-ups and Google Calendar integration.

**Architecture:** Next.js App Router, React and scoped light CSS. Server-only local JSON repository with atomic writes and encrypted Google credentials. Local-only development access; production APIs fail closed until staff authentication and a hosted database are implemented. Google OAuth uses state and PKCE, company domain verification, refresh tokens, and granular Gmail/read/send and Calendar permissions. No change to public enquiry delivery in this local milestone.

**Tech Stack:** Next.js 16.2.6, React 19, TypeScript, Lucide, Node crypto/fs, Vitest.

**Spec:** Approved interface in this conversation; `docs/superpowers/specs/2026-10-07-crm-core-engine-design.md` provides the pipeline model. Ruling: implement a local usable milestone rather than pretend Firestore/auth are provisioned. Existing environment has no Firebase or Google OAuth credentials.

## Global Constraints

- Pure light theme; Inter; no marketing chrome or Analytics on `/crm`.
- New, quoted, won, lost; lost requires a reason; money in integer pence.
- Explicit local workspace notice; no fabricated connected accounts or live messages.
- Google secrets stay server-side, encrypted on disk, ignored by Git.
- Inbox replies and Calendar event writes require an explicit action in the interface.
- Enquiries and notes persist across refresh/restart on the same machine.

## Review Focus

- Reject public hosts, cross-origin mutations, and production access.
- Validate stages, monetary values, dates and required lost reasons server-side.
- Failed Google sync preserves previously downloaded records and surfaces an error.
- OAuth validates state, PKCE, granted scopes and the verified Workspace domain.
- Concurrent edits do not silently overwrite different records; reject stale revisions.

### Task 1: Local repository and validation
- [x] Write failing tests for lead creation, stage validation, notes, revisions and persistence.
- [x] Implement `app/lib/crm/model.ts`, `store.ts`, `security.ts`; run targeted tests.

### Task 2: Google integration and protected API
- [x] Write failing tests for local access, OAuth parameters, MIME encoding and Calendar payloads.
- [x] Implement `google.ts`, Google OAuth routes and CRM data/actions route with input validation.
- [x] Document setup and credentials; verify tests and TypeScript.

### Task 3: Light CRM interface
- [x] Add meaningful interaction tests for enquiry capture, notes, stale edits and lost-reason validation.
- [x] Implement `/crm`, scoped CSS, enquiry editor, pipeline/list, inbox, follow-ups, integrations.
- [x] Isolate marketing chrome and exclude CRM from robots indexing.
- [x] Run suite, lint, production compilation and local browser checks at desktop/mobile widths.

## Execution ledger

- Planning: complete. Native execution in current checkout on `codex/crm-workspace`; preserve unrelated untracked spec. No deployment, cloud setup, sending mail or event creation performed by the agent.
- Tasks 1–2: implemented; repository/model/API tests pass. Final review identified send receipt ambiguity, note draft isolation, and conflict recovery; corrected with regression coverage.
- User steering: installed the exact requested `npx shadcn@latest add dashboard-01` block, preserving existing button/input/select files. Use the shadcn component system throughout the CRM; replace bespoke structural CSS and controls with Sidebar, Card, Sheet, Field, Input, NativeSelect, Textarea, Button, Badge, Alert, Empty, Table, Tabs, Item and Skeleton. `/dashboard` redirects to `/crm` rather than publishing the sample dashboard data.
- Verification: 325 tests passing; TypeScript and scoped lint passing; production build passed with a non-working temporary build-only Resend key (existing environment has an empty website key). Full repository lint retains unrelated pre-existing errors. Browser verified creation, reload persistence, quoted stage/value, follow-up completion and mobile sidebar. Removed only the agent-created browser test enquiry. Independent final review: no additional actionable findings.
- Google limitation: no OAuth client credentials are available, so real-account consent, inbox sync, sending and Calendar writes await setup. No external emails or events were created. The local server remains running on port 3000; `/crm` is open in the browser.
