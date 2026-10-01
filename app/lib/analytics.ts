/**
 * Google Analytics 4, behind the analytics consent gate.
 *
 * The tag is loaded imperatively rather than rendered, for the same reason the
 * Maps loader is: consent is checked *before* the third party arrives, not
 * after. Nothing in this file runs on import — `Analytics` calls in only once
 * the visitor has actively turned the category on.
 *
 * Google Signals and ad personalisation are switched off. GA4 can feed
 * advertising audiences when they are on, which would make the cookie policy's
 * promise of no advertising or tracking cookies untrue.
 */

export const GA_MEASUREMENT_ID = 'G-V9SED276MZ'

const SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`

/** Google reads this off `window` on every hit, so a loaded tag can be silenced. */
const DISABLE_FLAG = `ga-disable-${GA_MEASUREMENT_ID}`

/** gtag writes `_ga` and `_ga_<id>`. Both are first party — ours to delete. */
const COOKIE_PREFIX = '_ga'

/**
 * Google's default is two years, which would leave the cookie alive long after
 * the consent that allowed it had expired. Kept in step with the six months in
 * `consent.ts` — deliberately duplicated rather than imported, so this module
 * stays safe to read from a server component.
 */
const COOKIE_LIFETIME_SECONDS = 182 * 24 * 60 * 60

type DataLayer = IArguments[]

function dataLayer(): DataLayer {
  const w = window as unknown as { dataLayer?: DataLayer }
  w.dataLayer ??= []
  return w.dataLayer
}

/**
 * Google's own snippet, kept verbatim in shape. gtag.js reads each queued entry
 * as an `arguments` object, so that is what goes in — rest parameters would push
 * a plain array and put us off Google's documented contract for no gain.
 */
const gtag: (...args: unknown[]) => void = function () {
  // eslint-disable-next-line prefer-rest-params
  dataLayer().push(arguments)
}

/**
 * The `Domain` values to try when deleting a cookie, host-only first. GA4 sets
 * `_ga` on the highest domain it can reach, so withdrawal has to name that
 * domain to match it — a host-only delete would miss. Public suffixes like
 * `co.uk` end up in the list too; the browser rejects those, which is harmless.
 */
export function cookieScopes(hostname: string): string[] {
  const labels = hostname.split('.')
  const scopes = ['']
  for (let i = 0; i <= labels.length - 2; i++) {
    scopes.push(labels.slice(i).join('.'))
  }
  return scopes
}

function setFlag(value: boolean): void {
  ;(window as unknown as Record<string, unknown>)[DISABLE_FLAG] = value
}

/** Loads the tag, or does nothing if it is already there. Safe to call again. */
export function loadAnalytics(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  // Consent can be given back after being withdrawn, so lift the kill switch.
  setFlag(false)

  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return

  const script = document.createElement('script')
  script.async = true
  script.src = SCRIPT_SRC
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_flags: 'SameSite=Lax;Secure',
    cookie_expires: COOKIE_LIFETIME_SECONDS,
  })
}

/**
 * Stops the tag sending and clears what it stored. The script itself cannot be
 * unloaded once it has run, which is why the kill switch exists.
 */
export function disableAnalytics(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  setFlag(true)

  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0].trim()
    if (!name.startsWith(COOKIE_PREFIX)) continue
    for (const scope of cookieScopes(window.location.hostname)) {
      const domain = scope ? `; Domain=${scope}` : ''
      document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${domain}`
    }
  }
}
