# Cloudflare Turnstile setup

The code is ready, but protection cannot be activated until a real widget is configured. Do not deploy this change without the keys: missing configuration deliberately blocks submissions and shows a telephone contact option. No bypass is enabled.

## Create the widget

1. Open Cloudflare Dashboard → Turnstile → Add widget.
2. Choose **Managed** mode. It may show a human-verification checkbox when needed; it is not an always-visible checkbox.
3. Allow `everydaystravel.co.uk` and `www.everydaystravel.co.uk`. Add your own staging hostname to a separate staging widget if required. Keep pre-clearance disabled; this integration does not request clearance cookies.
4. Save the public site key and server secret in the hosting environment, not in source control or chat.

## Configure hosting

Set these variables in the deployment environment:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<public site key>
TURNSTILE_SECRET_KEY=<private secret key>
TURNSTILE_HOSTNAMES=everydaystravel.co.uk,www.everydaystravel.co.uk
```

Rebuild/redeploy after setting the public key, because Next.js includes it at build time. Keep the secret server-only. No Cloudflare proxy or DNS migration is required.

## Coverage

- Homepage and shared hero quote forms (including their floating/modal variants).
- Service and fleet detail quote forms.
- The full booking/quote form at `/book`.
- The contact enquiry form.
- `/api/quote` and `/api/contact` independently validate tokens before sending email.

Internal authenticated CRM operations are not public enquiries and are unchanged.

The browser uses explicit rendering for route changes and multiple widgets. Tokens are cleared on expiry and refreshed after every attempted submission. The server verifies success, the expected action (`quote` or `contact`) and a configured hostname. Verification errors and outages fail closed. No credentials or verification tokens are written to logs or emails.

## Development and verification

Cloudflare publishes dummy keys for local testing. Use only locally:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
TURNSTILE_HOSTNAMES=localhost,127.0.0.1
```

Production rejects these dummy secret keys. Never use them to protect a live site.

After configuring a real widget, check contact, booking, hero and fleet forms; test an expired token and a retry after a server error. Confirm successful token validations in Cloudflare. Real enquiry submission testing sends email and should be performed deliberately with test enquiry details.

References:
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/turnstile/troubleshooting/testing/
