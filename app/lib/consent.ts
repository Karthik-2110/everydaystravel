'use client'

import { useSyncExternalStore } from 'react'

/**
 * Cookie consent, to the rules the ICO enforces under PECR and UK GDPR.
 *
 * The parts that shape this file:
 *
 *  - Nothing non-essential may be stored on, or read from, a device before the
 *    visitor agrees. So consent is checked *before* a third party loads, not
 *    after — see `MapEmbed` for the map and `Analytics` for the GA4 tag.
 *  - Refusing has to be as easy as agreeing: one click either way, no extra
 *    screens on the refusal path, no pre-ticked boxes. Hence `ALL_OFF` is the
 *    default state and every optional category starts false.
 *  - Consent must be as easy to withdraw as it was to give, so the choice is
 *    re-openable from the footer on every page.
 *  - Silence is not consent. No decision means no optional storage, and the
 *    banner stays until the visitor actually picks something.
 *
 * The record itself is a strictly necessary cookie: it exists only to remember
 * a refusal, which is why it may be written without asking first.
 */

export const CONSENT_COOKIE = 'et_cookie_consent'

/**
 * Bump when the categories change meaning, or when a new third party lands in
 * one. An unrecognised version reads as "not asked yet", so the banner returns
 * and consent is taken again rather than assumed to carry over.
 */
export const CONSENT_VERSION = 2

/** Roughly six months. The ICO expects consent to be refreshed, not banked forever. */
const MAX_AGE_SECONDS = 182 * 24 * 60 * 60

/** Fired on this window whenever the stored decision changes. */
export const CONSENT_CHANGED_EVENT = 'et:consent-changed'

/** Fired to re-open the preferences panel from anywhere on the page. */
export const OPEN_PREFERENCES_EVENT = 'et:open-cookie-preferences'

export interface ConsentChoice {
  /** Google Maps — address autocomplete on the forms, the map on Contact. */
  functional: boolean
  /** Google Analytics 4 — visit counts and which pages get used. */
  analytics: boolean
}

export interface ConsentRecord extends ConsentChoice {
  version: number
  /** ISO timestamp, so we can evidence when consent was given if asked. */
  decidedAt: string
}

export const ALL_OFF: ConsentChoice = { functional: false, analytics: false }
export const ALL_ON:  ConsentChoice = { functional: true,  analytics: true  }

/**
 * What the preferences panel shows before the visitor touches anything.
 *
 * Analytics is pre-selected by decision of the business, so measurement is the
 * default outcome for someone who opens the panel and saves. The ICO's position
 * is that consent cannot be pre-ticked, so this is a known departure from it —
 * see the note in `/cookies`.
 *
 * This is a pre-selection in the UI only. `ALL_OFF` is still what *no decision*
 * means: until a button is pressed nothing is stored and nothing optional
 * loads, so silence is never read as a yes.
 */
export const DEFAULT_CHOICE: ConsentChoice = { functional: false, analytics: true }

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * The stored decision, or null when the visitor has not made one — which is
 * the same thing as refusing, until they say otherwise.
 */
export function readConsent(): ConsentRecord | null {
  const raw = readCookie(CONSENT_COOKIE)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>
    // A record from an older set of categories cannot speak for the current
    // ones, so it is treated as no decision at all.
    if (parsed.version !== CONSENT_VERSION) return null
    return {
      version:    CONSENT_VERSION,
      functional: parsed.functional === true,
      analytics:  parsed.analytics === true,
      decidedAt:  typeof parsed.decidedAt === 'string' ? parsed.decidedAt : '',
    }
  } catch {
    return null
  }
}

/** True only for a category the visitor has actively turned on. */
export function hasConsent(category: keyof ConsentChoice): boolean {
  return readConsent()?.[category] === true
}

export function saveConsent(choice: ConsentChoice): ConsentRecord {
  const record: ConsentRecord = {
    version:    CONSENT_VERSION,
    functional: choice.functional,
    analytics:  choice.analytics,
    decidedAt:  new Date().toISOString(),
  }

  if (typeof document !== 'undefined') {
    const value = encodeURIComponent(JSON.stringify(record))
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie =
      `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: record }))
  }

  return record
}

/**
 * Forgets the decision entirely, so the banner asks again. `Analytics` sees the
 * change and clears the GA4 cookies, which are first party and so ours to
 * delete; the Maps cookies sit on Google's own domain and cannot be cleared
 * from here — the cookie policy tells visitors how to clear those themselves.
 */
export function withdrawConsent(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${CONSENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: null }))
}

/** Re-opens the preferences panel — wired to the footer link on every page. */
export function openCookiePreferences(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))
}

/** Subscribe to decisions made elsewhere on the page. Returns an unsubscribe. */
export function onConsentChanged(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(CONSENT_CHANGED_EVENT, handler)
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handler)
}

// ── Reading consent from a component ────────────────────────────────────────

/**
 * The cookie is state owned outside React, so components subscribe to it
 * rather than copying it into their own state on mount. `getSnapshot` has to
 * be referentially stable between changes or React re-renders forever, hence
 * the parse cache keyed on the raw cookie string.
 */
let cachedRaw: string | null | undefined
let cachedRecord: ConsentRecord | null = null

function getSnapshot(): ConsentRecord | null {
  const raw = readCookie(CONSENT_COOKIE)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedRecord = readConsent()
  }
  return cachedRecord
}

/**
 * On the server nobody has decided anything yet, which is exactly the state
 * that keeps optional third parties out of the first render.
 */
function getServerSnapshot(): ConsentRecord | null {
  return null
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange)
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange)
}

/** The current decision, re-rendering whenever it changes anywhere on the page. */
export function useConsent(): ConsentRecord | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** True for `category` only once the visitor has actively agreed to it. */
export function useHasConsent(category: keyof ConsentChoice): boolean {
  return useConsent()?.[category] === true
}

const noopSubscribe = () => () => {}

/**
 * False through the server render and the hydration pass, true afterwards.
 * Anything that depends on the cookie waits for this, so the markup React
 * hydrates always matches what the server sent.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}
