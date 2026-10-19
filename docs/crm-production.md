# Production CRM setup

## Access policy

The owner explicitly selected immediate shared access for any verified Google account. Signing in grants read/write access to the same customer enquiries, vehicle reservations and connected business inbox, including the existing reviewed reply action. Personal accounts do not create isolated workspaces. Only addresses in `CRM_INTEGRATION_ADMINS` may connect/disconnect the shared business Gmail/Calendar account or import existing records. The initial administrator is `web@everydaystravel.co.uk`.

## Firebase

Project: **everydays-travel-crm**.

1. Create the default Firestore database in **europe-west2 (London)**. Choose locked/production rules, then publish the included `firestore.rules`. All browser reads/writes must remain denied, even for authenticated users; Next.js accesses Firestore through the service account.
2. Enable **Authentication → Sign-in method → Google**. Add `everydaystravel.co.uk` to Authentication's authorised domains; add `localhost` for development testing. The public Firebase `authDomain` should remain the Firebase-provided `everydays-travel-crm.firebaseapp.com`, unless a custom Firebase Auth domain has separately been configured.
For the selected any-Google-account login policy, the Firebase project’s Google OAuth consent audience must allow external Google accounts. This applies to the sign-in project, separately from the business mailbox OAuth client.

3. Register a Firebase web app and obtain its `apiKey` and `authDomain`.
4. Generate a service-account private key and save it locally at `.crm-local/firebase-service-account.json`. Do not commit or paste this key into chat. Run `node scripts/crm-configure.mjs` to populate the server settings in ignored `.env.local` without displaying them. Add the public web settings below. Restrict service-account permissions to the Firebase Auth and Firestore operations required by this CRM; keep its key in the hosting secret store.

## Hosting environment

Configure these values in the **production** environment of the existing Everydays Travel Vercel project, then redeploy:

```dotenv
FIREBASE_PROJECT_ID=everydays-travel-crm
FIREBASE_CLIENT_EMAIL=<service account client_email>
FIREBASE_PRIVATE_KEY=<complete PEM private key, real newlines or escaped newline sequences>
NEXT_PUBLIC_FIREBASE_API_KEY=<Firebase web app apiKey>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=everydays-travel-crm.firebaseapp.com
CRM_ORIGIN=https://everydaystravel.co.uk
CRM_INTEGRATION_ADMINS=web@everydaystravel.co.uk
CRM_TOKEN_ENCRYPTION_KEY=<base64 encoding of 32 random bytes>
CRM_GOOGLE_CLIENT_ID=<business mailbox OAuth client ID>
CRM_GOOGLE_CLIENT_SECRET=<business mailbox OAuth client secret>
```

Keep the encryption key stable across deployments and back it up securely. Rotating it without migrating ciphertext requires reconnecting the shared Google account. Firebase web configuration is public; service-account credentials and the token encryption key are server-only secrets. Production always selects Firestore and never falls back to disk. Missing configuration leaves CRM unavailable while the marketing site continues working.

For localhost shared-database testing only, set `CRM_STORAGE=firestore` and `CRM_ORIGIN=http://localhost:3000` in `.env.local`. Without `CRM_STORAGE`, development keeps using the existing local data and Google connection. Avoid pointing a preview deployment at the live database: provision a separate staging project and configure its exact origin and auth domains.

## Business Google integration

Staff login is separate from connecting the shared mailbox. Enable Gmail API and Calendar API in the existing mailbox OAuth project's Google Cloud settings. Add this authorised redirect URI to that web OAuth client:

`https://everydaystravel.co.uk/api/crm/google/callback`

Sign in as the integration administrator, open Integrations and connect the verified `everydaystravel.co.uk` mailbox again. Local tokens are not copied. All signed-in users share this mailbox's cached messages and calendar actions. Google tokens are encrypted in the server-only `crmPrivate/google` document and never returned to the browser. Reconnects/disconnects change credential generation so an older refresh cannot overwrite a newer connection.

## Import existing records

Run `node scripts/crm-export.mjs` on the Mac to create `.crm-local/production-import.json`. It contains enquiries, vehicles and bookings, without Gmail cache, access tokens or the local encryption key.

Sign in as administrator, open Integrations → Import existing records, select that file and review the counts. **Confirm import** validates the records and overlaps again, preserves IDs and refuses to overwrite a populated shared workspace. Repeating the exact same import is idempotent. The current small-workspace import limit is 400 records and 4 MB. Import into the empty workspace before creating vehicles/enquiries online.

## Operations and retention

Server sessions expire after eight hours. Every CRM request verifies the Firebase session, revocation status, verified email and Google sign-in provider. Disable a Firebase user and revoke their refresh tokens to revoke access; under the selected open-access policy another verified Google account can still sign in. Sign out clears this browser's session cookie. No private workspace data is cached by the API or persisted in browser storage.

Bookings, edits, vehicle registration uniqueness and mail import use Firestore transactions with a shared workspace revision lock. Pending or unconfirmed Calendar operations prevent changes to their associated records. Mail send attempts are claimed before sending. An interrupted request is not blindly repeated. An administrator must check Gmail Sent/Google Calendar before resolving an unknown operation: for a Calendar operation, inspect the source record's expected revision and deterministic Google event, reconcile those, then use Integrations → Review unfinished Calendar updates → Release record. Release requires explicit review, a matching operation token, and two minutes since the latest operation write start; it rotates ownership so a delayed worker cannot resume. For email, reconcile the Gmail sent message and receipt; never clear an unknown attempt merely to retry.

The small-workspace backend has explicit limits of 4,000 records, 450 changed records per write and 500 KB per record. It fails visibly rather than truncating records. Six month caches are retained; synced inbox contents are bounded by the existing Gmail query. Queries read the shared workspace, so monitor reads/costs as the team grows and replace snapshots with paginated collections before approaching the limit.

Configure Firestore TTL on **audit.deleteAfter** (24 months). Before collecting live customer records, apply the business's retention schedule to enquiries/bookings and inbox caches, update the published privacy information as needed and enable encrypted managed backups with a tested restore procedure in London. The current application does not automatically purge customer/booking records, because linked reservations and enquiry relationships must be reconciled together; do not enable a blind per-document TTL on linked records. Schedule that coordinated retention process operationally before launch. Cache refresh replaces old inbox snapshots rather than preserving entire mailbox history.

## Release verification

Automated checks cover any-domain Google access, revoked/missing/expired identity, recent-auth session creation, login CSRF, cross-origin writes, admin-only integration management, encryption integrity, independent repository overlap checks, durable operation receipts and import safeguards. No browser use was performed, per the owner's instruction.

Activation still requires a successful Google sign-in and shared record read/write on the deployed domain, two-device booking-conflict verification, and shared mailbox reconnect/sync. Do not describe the CRM as live or cloud-independent until those checks have succeeded. Once activated, the CRM runs on Vercel and Firestore with the laptop closed; local coding sessions still need the Mac awake.

The repository's production install command is explicitly `npm ci`, using `package-lock.json`; the historical Bun lockfile is not used for deployment. Node.js 22 or newer is required by the current Firebase Admin SDK.
