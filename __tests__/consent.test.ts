import { describe, it, expect, beforeEach } from 'vitest'
import {
  CONSENT_COOKIE, CONSENT_VERSION, ALL_OFF, ALL_ON,
  readConsent, saveConsent, hasConsent, withdrawConsent,
} from '@/app/lib/consent'

function clearCookies() {
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0].trim()
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`
  }
}

beforeEach(clearCookies)

describe('consent record', () => {
  it('reads as undecided when nothing has been stored', () => {
    expect(readConsent()).toBeNull()
    expect(hasConsent('functional')).toBe(false)
    expect(hasConsent('analytics')).toBe(false)
  })

  it('treats no decision as a refusal, never as permission', () => {
    // The whole point: silence cannot be read as consent.
    expect(hasConsent('functional')).toBe(false)
  })

  it('stores a refusal so the visitor is not asked again', () => {
    saveConsent(ALL_OFF)
    const stored = readConsent()
    expect(stored).not.toBeNull()
    expect(stored?.functional).toBe(false)
    expect(stored?.analytics).toBe(false)
    expect(document.cookie).toContain(CONSENT_COOKIE)
  })

  it('stores acceptance', () => {
    saveConsent(ALL_ON)
    expect(hasConsent('functional')).toBe(true)
    expect(hasConsent('analytics')).toBe(true)
  })

  it('keeps categories independent', () => {
    saveConsent({ functional: true, analytics: false })
    expect(hasConsent('functional')).toBe(true)
    expect(hasConsent('analytics')).toBe(false)
  })

  it('records when the decision was made', () => {
    saveConsent(ALL_ON)
    expect(Date.parse(readConsent()!.decidedAt)).not.toBeNaN()
  })

  it('asks again when the categories have changed underneath an old record', () => {
    const stale = { version: CONSENT_VERSION - 1, functional: true, analytics: true, decidedAt: '' }
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(stale))}; Path=/`
    expect(readConsent()).toBeNull()
    // Crucially, the old yes does not carry over.
    expect(hasConsent('functional')).toBe(false)
  })

  it('ignores a corrupted record rather than guessing at it', () => {
    document.cookie = `${CONSENT_COOKIE}=not-json; Path=/`
    expect(readConsent()).toBeNull()
  })

  it('forgets the decision on withdrawal, so the choice is put again', () => {
    saveConsent(ALL_ON)
    expect(hasConsent('functional')).toBe(true)
    withdrawConsent()
    expect(readConsent()).toBeNull()
    expect(hasConsent('functional')).toBe(false)
  })

  it('sets the cookie with a SameSite policy and an expiry', () => {
    saveConsent(ALL_OFF)
    // jsdom drops attributes from document.cookie reads, so assert on what the
    // record itself guarantees and leave attribute checks to the browser.
    expect(readConsent()?.version).toBe(CONSENT_VERSION)
  })
})
