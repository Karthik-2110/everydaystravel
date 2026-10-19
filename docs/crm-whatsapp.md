# WhatsApp incoming request pipeline

The pipeline is implemented for future messages from one connected business number. Today’s work does not connect a number, configure API keys, migrate the phone app, send messages or activate Firebase. Those steps are deferred by the owner until tomorrow.

## CRM workflow

Open Shared inbox → WhatsApp. Incoming customer conversations appear separately from Gmail. Each conversation shows its incoming messages and a Business request panel. With Gemini configured, the panel shows a reviewable intent, summary, pickup, destination, travel date, passengers, requested vehicle, missing details and suggested next action. Without Gemini, clearly labelled local extraction remains available.

Review & create enquiry opens the existing editable enquiry sheet. Saving creates a New-stage WhatsApp enquiry with source message identity. Repeated imports of that message return the same enquiry. A matching customer phone offers attaching the request to an existing enquiry; phone matches are suggestions, never automatic merges. From the enquiry use the existing quote, won/lost, vehicle reservation and follow-up workflow. No message analysis automatically confirms, cancels, reserves, edits an existing enquiry or sends a reply.

This milestone handles new incoming text messages and media captions/metadata for images, documents, video, audio and stickers. It does not download attachments, transcribe voice notes, read images/documents, sync old phone chat history or receive the business app’s outgoing-message echoes. Reactions and unsupported notification types are ignored so they cannot replace a business request. Any extension to coexistence/history import must follow the actual account's supported Meta onboarding route. Do not delete or deregister the phone account as part of this code setup.

## Saved analysis queue

A signed incoming notification is acknowledged only after the messages and queued analysis jobs have been committed. Duplicate provider IDs do not duplicate messages or restart an unchanged job. Out-of-order messages are sorted by their original timestamp. Gemini reads the latest 40 incoming messages in chronological order, with up to 4,000 characters per message; requests use text/captions only and may need staff review where earlier context or attachment content is missing. Model results are schema-validated suggestions, not executable actions. No tools are exposed to the model. Invalid/refused responses become visible analysis failures without losing messages.

Webhook background processing handles a bounded six conversations per run, three in parallel, with a 25-second API timeout. Claims and source fingerprints prevent concurrent workers or stale responses from overwriting a newer conversation. Automatic failures are retried up to three times per transcript; the inbox provides an authenticated retry. Queued work survives a stopped background process and must have a recurring worker invocation configured before live activation, as well as the webhook fast path. Pending jobs become eligible again after 90 seconds. Failed automatic jobs back off for at least 60 seconds.

An administrator can Archive conversation after explicit review. Up to 200 messages are removed per confirmed batch, enquiries remain, and a timestamp/message-ID boundary prevents archived messages from reappearing on webhook redelivery. Repeat for larger conversations. Newer messages beyond the reviewed boundary remain. This provides a way to free space before the explicit small-workspace limit of 2,000 WhatsApp messages or 4,000 total shared records is reached. Configure monitoring and a business retention process before launch; archive boundaries also require periodic operational review as the business grows.

## Tomorrow’s configuration

Set these server-only environment values locally/for the intended deployment:

```dotenv
WHATSAPP_APP_SECRET=<Meta app secret>
WHATSAPP_VERIFY_TOKEN=<long random webhook verification token>
WHATSAPP_BUSINESS_ACCOUNT_ID=<WABA ID>
WHATSAPP_PHONE_NUMBER_ID=<business phone number ID>
GEMINI_API_KEY=<existing Gemini API key>
GEMINI_MODEL=gemini-3.8-flash
CRON_SECRET=<long random analysis-worker bearer secret>
```

The Gemini model is configurable; the documented default uses Google’s structured-output REST API. Confirm the account's model access and data-processing/billing settings before using customer chats. Credentials are never returned to the browser or embedded in a URL. No live key or real conversation was used during implementation tests.

Webhook verification and incoming messages:

`https://everydaystravel.co.uk/api/crm/whatsapp/webhook`

Subscribe the Meta app to the configured WABA/phone's message notifications. Verification uses the configured verify token; every POST verifies HMAC-SHA256 over the exact raw body with the app secret, then checks WABA and phone IDs. Unknown senders are normal customers; an unknown **source business account or business phone** is rejected. Storage failures return retryable errors. The hosted route never falls back to Mac storage.

Worker endpoint:

`GET https://everydaystravel.co.uk/api/crm/whatsapp/process`

Invoke with `Authorization: Bearer <CRON_SECRET>`. Configure an appropriate recurring scheduler tomorrow (for example a Vercel cron at the frequency supported by the hosting plan). No cron schedule has been enabled today. This endpoint processes at most six eligible conversations per invocation; monitor backlog and increase worker capacity before higher volume. The server session route and ordinary CRM actions do not authorise the worker; its bearer secret does. Missing configuration leaves it unavailable.

Firebase and production CRM sign-in must be activated using `docs/crm-production.md` before public webhook storage works. Verify first delivery, duplicate redelivery, analysis completion and reviewed import using authorised test messages before calling the integration live. Staff sign-in retains the owner’s previously selected any-verified-Google-account shared access policy.

## Verification

Tests exercise raw signature tampering, challenge verification, wrong source accounts, media metadata without downloads, unsupported event rejection, persistence failures, replay dedupe, out-of-order messages, source import idempotency, archive/redelivery, stale Gemini result prevention, strict result schema, missing API configuration and the reviewed inbox draft. No browser interaction was used.
