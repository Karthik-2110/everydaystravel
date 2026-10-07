# CRM core engine — design

**Status:** approved for implementation planning
**Date:** 2026-10-07
**Scope:** Phase 1 of four. Data layer and capture paths only — no admin UI.

## Why this exists

Today a quote request becomes a Resend email and nothing else. There is no
database in the project. That means the business cannot answer how many
enquiries arrived last month, how many became bookings, whether any went
unanswered, or which marketing produced the ones that paid.

The last question is the expensive one. Everydays Travel does not currently rank
for its main commercial term and will need to spend on visibility to fix that —
but without stored leads, every pound of that spend is unmeasurable. **This
system is the instrument that makes marketing improvable.** It is being built
before the spend, not after.

### Success criteria

1. Every web enquiry is stored, with its marketing source, automatically.
2. A phone or WhatsApp enquiry can be recorded in under 30 seconds.
3. Response time and win rate are derivable without anyone entering a statistic.
4. No enquiry is ever lost because the new system failed.

### What works when this phase ships

Stated plainly, because the phase delivers an engine and not a product:

- **Web capture is live and complete.** The public quote form already exists, so
  from the day this deploys every web enquiry is stored with full attribution,
  with no screen needed. This is real value on day one — data that cannot be
  collected retroactively.
- **Manual entry has an endpoint but no way to use it.** Logging a phone call
  needs a form, and the form is the UI phase. Until then, phone and WhatsApp
  enquiries continue to go unrecorded.
- **Nothing can be read back without a UI.** The data accrues; viewing it means
  the Firebase console until the admin surface is built.

The UI phase is therefore not optional polish. It is what turns this from a
recorder into a tool, and the gap between the two should be short.

### What we know about the operating context

Gathered during design, and it shapes several decisions:

- **Nobody tracks enquiries today.** Volume is unknown. We design for the small
  case and instrument it so the real figure is known within a month. No feature
  is justified by an assumed volume.
- **There is no system of record.** Bookings are agreed over email and WhatsApp.
  This is a clean slate — nothing to migrate, no parity to match.
- **Most enquiries probably never touch the web form.** Phone and WhatsApp are
  the easiest actions on every page. A system fed only by the form would capture
  a fraction of reality and mis-attribute the rest, which is worse than no data
  because it would be trusted.
- **Email is on Google Workspace**, which makes the later Gmail phase viable and
  lets authentication use domain-restricted Google sign-in.

## Design principles

The failure mode for a CRM at this size is not technical. It is abandonment: the
team keeps using the inbox, the data goes half-complete, and the system becomes
worse than nothing because its numbers are wrong. Six rules exist to prevent it.

1. **Nothing depends on memory.** Every lead carries `nextActionAt`.
2. **Timing is computed, never typed.** Response time derives from stored
   timestamps, so it cannot be forgotten or massaged.
3. **Statuses oblige behaviour.** `lostReason` is mandatory when a lead is marked
   lost. It is the only field that explains why business is being lost, and it is
   the field most often made optional and most regretted.
4. **Capture is automatic wherever possible.** Nobody retypes anything the
   website already knows.
5. **Measurement is a by-product.** Every figure falls out of stored fields. No
   one ever compiles a report.
6. **Extend the existing habit rather than replacing it.** The team already reads
   the quote notification email. That email gains a link to the lead, so the CRM
   is one click inside something already opened daily.

## Architecture

Built into the existing Next.js application rather than as a separate service.
Firestore for data, Firebase Auth for sign-in.

### The browser never touches Firestore

All reads and writes go through Next.js server code using `firebase-admin` with
a service account. Firestore security rules deny client access outright.

This is deliberate and non-negotiable. Firestore rules are the only thing between
customer personal data and the public internet when a browser talks to the
database directly, and a misconfigured rule on a database of names, phone numbers
and travel dates is a reportable data breach. Denying client access entirely
removes the whole category of mistake rather than trying to get it right.

Firebase Auth still runs in the browser to obtain an ID token; the server
verifies that token and checks the Workspace domain before any data access.

### Authentication

Google sign-in restricted to the `everydaystravel.co.uk` Workspace domain.
Staff use the account they already have and nobody provisions anything. The
domain claim is verified server-side on every request — never trusted from the
client.

## Data model

Two collections. One does the real work.

```
leads/{leadId}
leads/{leadId}/notes/{noteId}
```

### `leads/{leadId}`

**Contact.** `name` (required), `phone` (required), `email`, `company`.

Only name and phone are required, because a lead captured during a live phone
call must be recordable in seconds. Everything else is filled in later.

**Journey.** `tripType` (`one-way` | `return`), `pickup`, `destination`,
`travelDate`, `pickupTime`, `returnDate`, `returnTime`, `passengers`, `vehicle`,
`message`. All optional. These mirror the existing quote form exactly, so a web
enquiry maps across with no translation step.

**Source.** `channel` (`web-form` | `phone` | `whatsapp` | `email`, required),
`servicePage`, `landingPage`, `referrer`, `utmSource`, `utmMedium`,
`utmCampaign`, `utmTerm`, `utmContent`, `gclid`.

`servicePage` is quietly valuable: it reveals which service pages produce
enquiries, which feeds the SEO work directly.

**Pipeline.** `status` (`new` | `quoted` | `won` | `lost`, defaults to `new`),
`ownerUid`, `ownerName`, `quotedAmount`, `wonAmount`, `lostReason`.

`lostReason` is one of `price` | `availability` | `no-reply` | `booked-elsewhere`
| `not-genuine` | `other`, and is **required whenever `status` is `lost`**. This
is enforced in the write path, not merely in a form.

Money is stored as integer pence. Never floats.

**Timing.** `createdAt`, `updatedAt`, `statusChangedAt`, `firstRespondedAt`,
`nextActionAt`, `deleteAfter`. Server timestamps throughout — never client clocks.

`firstRespondedAt` is set once, the first time a lead moves off `new` or gains a
note. Response time is `firstRespondedAt - createdAt`, computed on read.

**Housekeeping.** `duplicateOf` — set when a possible duplicate is detected.

### `leads/{leadId}/notes/{noteId}`

`body`, `authorUid`, `authorName`, `createdAt`. A subcollection rather than an
array so the timeline grows without rewriting the lead document.

### Deliberate omissions

- **No `customers` collection.** A repeat booker is found by matching phone or
  email. A join table is premature at unknown volume.
- **No aggregate counters.** Figures are computed by reading matching documents,
  which costs pennies at this scale. Counters are the right answer at ten times
  the volume and the wrong answer now.

### Indexes

Three composite indexes cover every planned view:

- `status` ASC, `nextActionAt` ASC — the "needs attention" view
- `createdAt` DESC — the chronological list
- `channel` ASC, `createdAt` DESC — source breakdowns

## Capture paths

### 1. Web form — automatic

`app/api/quote/route.ts` already sends a Resend email. It now also writes a lead.

**A Firestore failure must never prevent the email.** Email is what works today;
this system is new and unproven. An enquiry lost because a database hiccuped is a
lost booking. Therefore:

- Each side gets its own `try`/`catch`.
- The route returns success if **either** path succeeded, and an error only when
  **both** failed — at which point the enquiry genuinely has not been captured and
  the visitor must be told to call instead.
- Either failure logs loudly rather than failing silently.

The notification email gains an **"Open in CRM"** link to the new lead. This is
principle 6 made concrete and is the main lever for adoption.

### 2. Manual entry — phone and WhatsApp

A server route accepting a minimal payload: name and phone required, everything
else optional. `channel` defaults to `phone`. `nextActionAt` pre-fills to one
hour out.

This path carries most of the real volume, so it is designed for a ten-second
capture during a live call. Demanding full journey details here is the single
most likely way to end up with an empty database.

### 3. Attribution — automatic and invisible

First-touch source is captured on arrival and read at submit, so a visitor who
lands on `/coach-hire-london?gclid=…` and submits from `/contact` still
attributes to that ad.

Stored in `sessionStorage` at session start: landing path, referrer, all five
`utm_*` values and `gclid`. Read by the quote form and posted with the enquiry.

This is nearly free to build now and genuinely painful to retrofit, which is why
it belongs in Phase 1 rather than with the later analytics work.

### Duplicates

A matching phone or email within 24 hours sets `duplicateOf` on the new lead.
**Never auto-merged** — merging is a judgement a human makes. This phase only
sets the flag; displaying and resolving it belongs to the UI phase.

## Data protection

The system stores names, phone numbers, email addresses and travel plans, so UK
GDPR applies.

- **Residency.** Firestore in `europe-west2` (London).
- **Retention.** `deleteAfter` is set to `createdAt + 24 months`. Enforced by a
  native Firestore TTL policy on that field, so deletion needs no scheduled job
  and cannot be forgotten.
- **Privacy policy.** Needs a clause covering enquiry storage, the retention
  period, and attribution data. Required before launch, not after.

## Testing

- Unit tests for the payload-to-lead mapper, including every optional field absent.
- Unit tests for attribution extraction and the first-touch persistence rule.
- A test asserting **the quote email is still sent when the Firestore write
  throws** — the most important test in the phase, because it protects the thing
  that already works.
- A test asserting a `lost` status without a `lostReason` is rejected by the
  write path, not merely by a form.
- Firestore is reached through a narrow interface so unit tests need no emulator.

Follows existing project conventions: Vitest, one test file per unit, in
`__tests__/`.

## Prerequisites

To be completed in the Firebase console before implementation:

1. Create the Firebase project.
2. Enable Firestore in **native mode, `europe-west2`**.
3. Enable the Google authentication provider.
4. Create a service account and download its key.
5. Set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` in
   the local environment and in Vercel.
6. Publish Firestore rules denying all client access.
7. Add a TTL policy on `leads.deleteAfter`.

## Out of scope

Deferred by explicit decision, each to its own spec:

- **Admin UI** — deferred to the start of development work. Typography is already
  settled: Inter only, in a shell that opts out of the marketing chrome,
  `FloatingContactBar`, `CookieConsent` and Google Analytics. Staff sessions must
  not pollute the marketing analytics this system exists to make trustworthy.
- **Phase 2 — Google Analytics Data API.** Service account, read-only. Note that
  GA is consent-gated on this site and therefore a lossy denominator against an
  accurate lead count.
- **Phase 3 — Gmail.** Viable as an Internal OAuth app on Workspace, so no Google
  verification or security assessment is required.
- **Phase 4 — WhatsApp Cloud API.** Blocked on a business decision: a number
  registered to the Cloud API cannot be used in the WhatsApp phone app, so the
  existing mobile (+44 7538 724000) would have to be surrendered or a second
  number obtained. Meta business verification has weeks of lead time and should
  be started well before the build.

## Open questions

None blocking. Two to settle before the UI phase:

- Who receives the daily digest of overdue leads, and at what time?
- Does a won lead need a booking reference that ties to invoicing later?
