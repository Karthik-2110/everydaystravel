import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HeroQuoteForm from '@/app/components/HeroQuoteForm'

vi.mock('@/app/components/QuoteForm', () => ({
  default: ({ onMinimize }: { onMinimize: () => void }) => <div>
    <input role="combobox" aria-label="Journey details" defaultValue="London" />
    <button onClick={onMinimize}>Minimize quote form</button>
  </div>,
}))

describe('Hero quote dock', () => {
  it('keeps journey details when minimized and restored in the hero', async () => {
    render(<section aria-label="hero"><HeroQuoteForm /></section>)
    vi.spyOn(screen.getByRole('region', { name: 'hero' }), 'getBoundingClientRect').mockReturnValue({ top: 0, bottom: 900, height: 900 } as DOMRect)
    fireEvent.change(screen.getByLabelText('Journey details'), { target: { value: 'Heathrow' } })
    fireEvent.click(screen.getByRole('button', { name: 'Minimize quote form' }))
    const restore = await screen.findByRole('button', { name: 'Get an Instant quote' })
    fireEvent.click(restore)
    await waitFor(() => expect(screen.getByLabelText('Journey details')).toBeVisible())
    expect(screen.getByLabelText('Journey details')).toHaveValue('Heathrow')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens as a dialog away from the hero and minimizes on Escape', async () => {
    render(<section aria-label="hero"><HeroQuoteForm /></section>)
    const hero = screen.getByRole('region', { name: 'hero' })
    vi.spyOn(hero, 'getBoundingClientRect').mockReturnValue({ top: -1000, bottom: -100, height: 900 } as DOMRect)
    fireEvent.click(screen.getByRole('button', { name: 'Minimize quote form' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Get an Instant quote' }))
    expect(await screen.findByRole('dialog', { name: 'Get an instant quote' })).toBeVisible()
    expect(document.body.style.overflow).toBe('hidden')
    const location = screen.getByLabelText('Journey details')
    location.setAttribute('aria-expanded', 'true')
    fireEvent.keyDown(location, { key: 'Escape' })
    expect(screen.getByRole('dialog')).toBeVisible()
    location.setAttribute('aria-expanded', 'false')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(await screen.findByRole('button', { name: 'Get an Instant quote' })).toBeVisible()
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})

// These tests cover the form's own fields. Cloudflare lifecycle and server
// enforcement are exercised separately in the verification tests.
vi.mock('@/app/components/HumanVerification', () => ({
  default: () => null,
  useHumanVerification: () => ({ token: 'verified-test-token', setToken: () => {}, resetKey: 0, reset: () => {} }),
}))
