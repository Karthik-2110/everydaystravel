import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * Google Analytics is the first third party to land in the `analytics`
 * consent category, so the thing worth testing is restraint: the module may
 * not touch the page, the dataLayer or the cookie jar until it is asked to.
 */

function clearCookies() {
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0].trim()
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`
  }
}

function gtagScripts() {
  return Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[src*="googletagmanager.com/gtag/js"]'),
  )
}

/** gtag pushes an `arguments` object per call, so read them back as arrays. */
function dataLayerCalls(): unknown[][] {
  const layer = (window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? []
  return Array.from(layer).map((entry) => Array.from(entry) as unknown[])
}

beforeEach(() => {
  vi.resetModules()
  clearCookies()
  gtagScripts().forEach((script) => script.remove())
  delete (window as unknown as Record<string, unknown>).dataLayer
  delete (window as unknown as Record<string, unknown>).gtag
})

describe('analytics loader', () => {
  it('touches nothing on import, so the gate decides when it runs', async () => {
    await import('@/app/lib/analytics')
    expect(gtagScripts()).toHaveLength(0)
    expect((window as unknown as Record<string, unknown>).dataLayer).toBeUndefined()
  })

  it('loads the tag for the measurement id it was given', async () => {
    const { loadAnalytics, GA_MEASUREMENT_ID } = await import('@/app/lib/analytics')
    loadAnalytics()

    const scripts = gtagScripts()
    expect(scripts).toHaveLength(1)
    expect(scripts[0].src).toContain(`id=${GA_MEASUREMENT_ID}`)
    expect(scripts[0].async).toBe(true)
  })

  it('loads the tag once, however many times consent is re-confirmed', async () => {
    const { loadAnalytics } = await import('@/app/lib/analytics')
    loadAnalytics()
    loadAnalytics()
    loadAnalytics()
    expect(gtagScripts()).toHaveLength(1)
  })

  it('configures the property and keeps the data out of ad personalisation', async () => {
    // The cookie policy promises no advertising or tracking cookies, so the
    // Google Signals and ad-personalisation switches have to be off.
    const { loadAnalytics, GA_MEASUREMENT_ID } = await import('@/app/lib/analytics')
    loadAnalytics()

    const config = dataLayerCalls().find((call) => call[0] === 'config')
    expect(config?.[1]).toBe(GA_MEASUREMENT_ID)
    expect(config?.[2]).toMatchObject({
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
  })

  it('expires the cookies no later than the consent that allowed them', async () => {
    // Consent is re-asked after six months. A GA cookie on Google's two-year
    // default would outlive the permission it was set under, so the lifetime is
    // pulled back to match the consent window.
    const { loadAnalytics } = await import('@/app/lib/analytics')
    loadAnalytics()

    const config = dataLayerCalls().find((call) => call[0] === 'config')
    const expires = (config?.[2] as { cookie_expires?: number })?.cookie_expires
    expect(expires).toBe(182 * 24 * 60 * 60)
  })

  it('withdrawal flips Google’s own kill switch, so a loaded tag stops sending', async () => {
    const { loadAnalytics, disableAnalytics, GA_MEASUREMENT_ID } = await import('@/app/lib/analytics')
    loadAnalytics()
    disableAnalytics()

    const flag = (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]
    expect(flag).toBe(true)
  })

  it('withdrawal deletes the cookies the tag set, which are ours to delete', async () => {
    // _ga and _ga_<id> are first party, on our own domain — unlike the Maps
    // cookies, these we can and must clear when consent is taken back.
    const { loadAnalytics, disableAnalytics, GA_MEASUREMENT_ID } = await import('@/app/lib/analytics')
    loadAnalytics()

    document.cookie = '_ga=GA1.1.1234567890.1700000000; Path=/'
    document.cookie = `_ga_${GA_MEASUREMENT_ID.replace(/^G-/, '')}=GS1.1.1700000000; Path=/`
    expect(document.cookie).toContain('_ga=')

    disableAnalytics()

    expect(document.cookie).not.toContain('_ga=')
    expect(document.cookie).not.toContain('_ga_')
  })

  it('re-consenting after a withdrawal lifts the kill switch again', async () => {
    const { loadAnalytics, disableAnalytics, GA_MEASUREMENT_ID } = await import('@/app/lib/analytics')
    const key = `ga-disable-${GA_MEASUREMENT_ID}`

    loadAnalytics()
    disableAnalytics()
    loadAnalytics()

    expect((window as unknown as Record<string, unknown>)[key]).toBe(false)
  })
})

describe('cookie scopes used on withdrawal', () => {
  it('names the parent domain, because that is where Google put the cookie', async () => {
    // GA4 sets `_ga` on the highest domain it can reach — on the live site that
    // is `.everydaystravel.co.uk`, not the exact host. Deleting a cookie means
    // matching its domain, so a host-only delete would leave it sitting there.
    // jsdom runs on single-label `localhost` and cannot hold a parent-domain
    // cookie at all, so the scopes are checked as a function instead.
    const { cookieScopes } = await import('@/app/lib/analytics')

    const scopes = cookieScopes('www.everydaystravel.co.uk')
    expect(scopes).toContain('')
    expect(scopes).toContain('everydaystravel.co.uk')
  })

  it('tries the host on its own first', async () => {
    const { cookieScopes } = await import('@/app/lib/analytics')
    expect(cookieScopes('everydaystravel.co.uk')[0]).toBe('')
  })

  it('offers no domain for a single-label host, where one is meaningless', async () => {
    const { cookieScopes } = await import('@/app/lib/analytics')
    expect(cookieScopes('localhost')).toEqual([''])
  })
})
