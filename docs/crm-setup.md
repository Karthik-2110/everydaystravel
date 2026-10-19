# CRM setup

For hosted sign-in and shared storage, follow [Production CRM setup](crm-production.md). The instructions below describe localhost development.

## Everydays Travel CRM, local milestone

The interface uses the official shadcn/ui `dashboard-01` structure. Sidebar, header, cards, tables, tabs, buttons, inputs, native selects, field groups, sheets, scroll areas, badges, alerts, empty states and loading skeletons use shadcn components. `app/crm/crm.css` contains only scoped light-theme tokens; the public site's theme is unchanged. `/dashboard` redirects to `/crm`.

Run `npm run dev -- --hostname 127.0.0.1`, then open `http://localhost:3000/crm`.

The CRM starts empty. Create an enquiry, open its card, edit its stage, schedule a next action or add notes. Pipeline and follow-ups persist across page refreshes and server restarts. A lost enquiry requires a reason. Follow-ups show only open enquiries. Completing a follow-up records a note and clears the due date; use Edit enquiry to schedule the next one.

## Storage and access

This milestone is a **single-machine development workspace**, not a deployed multi-user CRM. It accepts localhost development requests only. Production access is disabled. `.crm-local/workspace.json` stores enquiries and downloaded inbox/calendar records. Google credentials are encrypted in `.crm-local/google.enc`, using a local file key. This folder is excluded from Git; keep it private and back it up if its records matter. It is not suitable for serverless deployment or multiple server processes.

Website quote/contact forms continue delivering emails as before. Automatic website-to-CRM capture, Firestore, staff login, retention automation and shared team access are the next milestone. Manual phone/WhatsApp/email enquiry capture works now. Instagram and WhatsApp APIs are not connected.

## Connect Gmail and Google Calendar

1. Choose or create a Google Cloud project owned by Everydays Travel.
2. Enable **Gmail API** and **Google Calendar API**.
3. Configure Google Auth Platform / OAuth consent for the company Workspace organisation. Use an Internal audience if available; if testing as an External app, explicitly allow the staff test account.
4. Create an OAuth client of type **Web application**.
5. Add this authorised redirect URI exactly:

   `http://localhost:3000/api/crm/google/callback`

   If you use a different host or port, register that exact origin and callback as well.
6. Add the following to `.env.local` (never commit it):

   ```text
   CRM_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   CRM_GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   ```

7. Restart the development server. Open **CRM → Integrations → Connect Google**. Sign in with a verified `@everydaystravel.co.uk` Workspace account and grant both Gmail and Calendar permissions.
8. Select **Sync Google**. The CRM loads the latest 30 inbox messages and up to 30 future primary-calendar events. Sync is manual in this milestone; no webhooks or background polling.

Permissions: OpenID/email identity, `gmail.readonly`, `gmail.send`, `calendar.events`. Google tokens remain on the server and refresh automatically when needed. Google Auth review or Workspace administrator approval may be necessary depending on your organisation's policies.

## Inbox and calendar behaviour

- The inbox displays plain text email (or the message preview for HTML-only messages); it never renders remote email HTML or images. It does not download attachments or mark Gmail messages as read. Clicking a message opens that individual incoming message, not the full Gmail thread history.
- **Create enquiry from email** prefills the customer name, email and subject. You review and save it. Existing enquiries with a matching email can be opened directly.
- Write a reply, choose **Review reply**, then **Confirm & send**. This sends a real message through the connected Gmail account, in the original thread.
- The follow-ups screen shows upcoming primary-calendar events. On an enquiry, **Add follow-up to Calendar** creates a 30-minute event at its next-action time, with no attendees and no invitations. Repeating the same action reuses the event ID. Rescheduling an enquiry does not change an existing Google event automatically; manage that event in Calendar.
- Disconnect revokes the Google grant and clears locally cached messages/events. Manually created CRM enquiries remain.

Hosted staff sessions and the shared Firestore repository are implemented. Activate them using [Production CRM setup](crm-production.md), including London database provisioning and the documented retention/access settings before collecting shared production data.

## Calendar and vehicle reservations

Open **Calendar** in the CRM sidebar. The Monday-first monthly view shows CRM bookings and, after **Sync displayed month**, the connected primary Google calendar's events across the full visible six-week grid. Previous/next month and Today change the view. Select a day for its agenda; use the vehicle/status filters to find a reservation. Google all-day events use exclusive end dates, and multi-day reservations appear on every affected day. Times are London time regardless of the computer's timezone.

1. Open **Vehicles** and add each real vehicle's name, registration and passenger capacity. Marketing vehicle types are not physical inventory. Duplicate registration formatting is normalised.
2. Select **Reserve vehicle**, or open an enquiry and select **Reserve vehicle** there. Choose the actual vehicle, start, end, customer and optional linked enquiry.
3. Both a **provisional hold** and a **confirmed booking** block the vehicle. Server-side, atomic overlap checks reject conflicting reservations. A reservation ending exactly when the next one starts is allowed; turnaround time must be included in the blocked period if needed. Capacity is checked against the selected vehicle.
4. Confirming linked reservations marks the enquiry won and totals its confirmed booking values. Cancelling releases the vehicle immediately; cancelling the last confirmed reservation clears the linked won value and reopens a won enquiry for review, with a next-action reminder.
5. To send a saved reservation to Google, reopen it and choose **Export to Google Calendar**. After edits or cancellation, use **Update Google Calendar** explicitly. Saving locally does not update Google automatically. Export uses a stable event ID and sends no invitations. Google failures do not discard the local reservation. Cancelled bookings can be found through the status filter.

Google events are displayed for context; they do not reserve a vehicle or participate in local conflict checks. Availability is based on CRM reservations, so create local reservations for any externally agreed booking. DST times which do not exist or occur twice are rejected rather than guessed.

## Email request review and funnel

In **Shared inbox**, select a message and choose **Review request**. The local suggestion engine identifies quote requests, booking intent, changes or cancellations and extracts common labelled/natural-language contact and journey details. It is pattern-based, not an external AI model; no email is sent to an AI provider. Unrecognised fields stay blank and incomplete dates require review.

Choose **Review & create enquiry**, edit the prefilled fields and save to put the request into the New stage. The source message and thread are attached to the enquiry; repeated imports of the same message do not duplicate it. Alternatively attach the email to the suggested existing enquiry. Exact message associations take priority over shared-thread or sender matches. Email content never automatically confirms/cancels a booking or reserves a vehicle. From the enquiry, create the reviewed reservation; linked bookings can be managed from its details panel.

## Verification results

`npm test`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`.

The current milestone passed 337 tests across 34 files, TypeScript, scoped CRM lint and the production build. Calendar verification covers concurrent overlaps, registration duplicates, cancellations, linked deal totals, London DST, multi-day event dates, reviewed email extraction and source matching. The production build uses a temporary build-only Resend placeholder when the existing local website email key is empty; no email is sent. Repository-wide lint retains unrelated errors in website components and older tests. No browser interaction was used for verification.

Live Google sign-in/sync/send/event creation requires your OAuth credentials and account consent; it cannot be verified with the website Maps API key.
