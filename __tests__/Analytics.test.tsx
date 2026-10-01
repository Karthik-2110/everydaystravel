import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import Analytics from '@/app/components/Analytics'
import { saveConsent, withdrawConsent, ALL_ON, ALL_OFF } from '@/app/lib/consent'
import { GA_MEASUREMENT_ID } from '@/app/lib/analytics'

/**
 * The gate itself. Nothing here checks that Google works — only that Google
 * never arrives before the visitor has said yes, and leaves when they say no.
 */

function clearCookies() {
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0].trim()
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`
  }
}

const tag = () =>
  document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)

const killSwitch = () =>
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]

beforeEach(() => {
  clearCookies()
  document.querySelectorAll('script[src*="googletagmanager"]').forEach((s) => s.remove())
  delete (window as unknown as Record<string, unknown>).dataLayer
  delete (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]
})

describe('Analytics', () => {
  it('loads nothing while the visitor has not decided — silence is not consent', async () => {
    render(<Analytics />)
    await waitFor(() => expect(killSwitch()).toBe(true))
    expect(tag()).toBeNull()
  })

  it('loads nothing when analytics was refused', async () => {
    saveConsent(ALL_OFF)
    render(<Analytics />)
    await waitFor(() => expect(killSwitch()).toBe(true))
    expect(tag()).toBeNull()
  })

  it('loads nothing when only the functional category was agreed to', async () => {
    saveConsent({ functional: true, analytics: false })
    render(<Analytics />)
    await waitFor(() => expect(killSwitch()).toBe(true))
    expect(tag()).toBeNull()
  })

  it('loads the tag once analytics is agreed to', async () => {
    saveConsent(ALL_ON)
    render(<Analytics />)
    await waitFor(() => expect(tag()).not.toBeNull())
  })

  it('stops sending the moment consent is withdrawn, without a reload', async () => {
    saveConsent(ALL_ON)
    render(<Analytics />)
    await waitFor(() => expect(tag()).not.toBeNull())

    saveConsent({ functional: true, analytics: false })
    await waitFor(() => expect(killSwitch()).toBe(true))
  })

  it('stops sending when the decision is forgotten entirely', async () => {
    saveConsent(ALL_ON)
    render(<Analytics />)
    await waitFor(() => expect(killSwitch()).toBe(false))

    withdrawConsent()
    await waitFor(() => expect(killSwitch()).toBe(true))
  })

  it('renders no markup of its own', async () => {
    const { container } = render(<Analytics />)
    expect(container).toBeEmptyDOMElement()
  })
})
