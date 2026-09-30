import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import CookieConsent from '@/app/components/CookieConsent'
import { readConsent, saveConsent, ALL_ON, openCookiePreferences } from '@/app/lib/consent'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

function clearCookies() {
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0].trim()
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`
  }
}

beforeEach(clearCookies)

const accept = () => screen.getByRole('button', { name: 'Accept all' })
const reject = () => screen.getByRole('button', { name: 'Reject all' })

describe('CookieConsent', () => {
  it('asks before anything optional is stored', async () => {
    render(<CookieConsent />)
    await waitFor(() => expect(accept()).toBeInTheDocument())
    expect(reject()).toBeInTheDocument()
  })

  it('gives refusing exactly the same prominence as accepting', async () => {
    render(<CookieConsent />)
    await waitFor(() => expect(accept()).toBeInTheDocument())

    // Same size, same weight, same shape — only the fill colour differs. A
    // reject that is smaller, quieter or buried is the usual ICO finding.
    const strip = (cls: string) =>
      cls.split(' ').filter((c) => !c.startsWith('bg-') && !c.startsWith('hover:') && !c.startsWith('text-[#')).sort()
    expect(strip(accept().className)).toEqual(strip(reject().className))
  })

  it('records a refusal and closes, without setting optional categories', async () => {
    render(<CookieConsent />)
    await waitFor(() => expect(reject()).toBeInTheDocument())

    fireEvent.click(reject())

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Reject all' })).not.toBeInTheDocument())
    expect(readConsent()).toMatchObject({ functional: false, analytics: false })
  })

  it('records acceptance of every category', async () => {
    render(<CookieConsent />)
    await waitFor(() => expect(accept()).toBeInTheDocument())

    fireEvent.click(accept())

    await waitFor(() => expect(readConsent()).toMatchObject({ functional: true, analytics: true }))
  })

  it('stays out of the way once a decision exists', async () => {
    saveConsent(ALL_ON)
    render(<CookieConsent />)
    await waitFor(() => expect(document.body).toBeTruthy())
    expect(screen.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument()
  })

  it('opens preferences with every optional toggle off — nothing pre-ticked', async () => {
    render(<CookieConsent />)
    await waitFor(() => expect(accept()).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Manage' }))

    const switches = await screen.findAllByRole('switch')
    const necessary = screen.getByRole('switch', { name: 'Strictly necessary' })
    const functional = screen.getByRole('switch', { name: 'Functional' })
    const analytics = screen.getByRole('switch', { name: 'Analytics' })

    expect(switches).toHaveLength(3)
    expect(necessary).toBeDisabled()
    expect(necessary).toHaveAttribute('aria-checked', 'true')
    expect(functional).toHaveAttribute('aria-checked', 'false')
    expect(analytics).toHaveAttribute('aria-checked', 'false')
  })

  it('saves a partial choice from the preferences panel', async () => {
    render(<CookieConsent />)
    await waitFor(() => expect(accept()).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'Manage' }))

    fireEvent.click(await screen.findByRole('switch', { name: 'Functional' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save my choices' }))

    await waitFor(() => expect(readConsent()).toMatchObject({ functional: true, analytics: false }))
  })

  it('offers both choices inside the preferences panel too', async () => {
    render(<CookieConsent />)
    await waitFor(() => expect(accept()).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'Manage' }))

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Accept all' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject all' })).toBeInTheDocument()
  })

  it('reopens from the footer so consent can be withdrawn as easily as given', async () => {
    saveConsent(ALL_ON)
    render(<CookieConsent />)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    openCookiePreferences()

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    // The panel opens showing what was actually chosen, not a reset.
    expect(screen.getByRole('switch', { name: 'Functional' })).toHaveAttribute('aria-checked', 'true')
  })

  it('does not treat dismissing the panel as a decision', async () => {
    render(<CookieConsent />)
    await waitFor(() => expect(accept()).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'Manage' }))

    fireEvent.click(await screen.findByRole('button', { name: /close cookie preferences/i }))

    // Back to the banner, still nothing stored.
    await waitFor(() => expect(accept()).toBeInTheDocument())
    expect(readConsent()).toBeNull()
  })
})
