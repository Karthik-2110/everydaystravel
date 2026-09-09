import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import FloatingContactBar from '@/app/components/FloatingContactBar'
import { FACEBOOK_HREF, WHATSAPP_HREF, INSTAGRAM_HREF } from '@/app/components/icons/social'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

/** The bar only appears once the reader has scrolled clear of the hero. */
function scrollPastHero() {
  Object.defineProperty(window, 'scrollY', { value: 5000, writable: true, configurable: true })
}

describe('FloatingContactBar', () => {
  beforeEach(scrollPastHero)

  it('stays hidden while the hero is still on screen', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    render(<FloatingContactBar />)
    expect(screen.queryByRole('link', { name: /whatsapp/i })).not.toBeInTheDocument()
  })

  it('shows call and email actions once scrolled past the hero', () => {
    render(<FloatingContactBar />)
    expect(screen.getByRole('link', { name: /call \+44 7538 724000/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email info@everydaystravel\.co\.uk/i })).toBeInTheDocument()
  })

  it('places Facebook third, ahead of WhatsApp and Instagram', () => {
    render(<FloatingContactBar />)
    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'))
    expect(hrefs).toEqual([
      'tel:+447538724000',
      'mailto:info@everydaystravel.co.uk',
      FACEBOOK_HREF,
      WHATSAPP_HREF,
      INSTAGRAM_HREF,
    ])
  })

  it('opens every social link in a new tab safely', () => {
    render(<FloatingContactBar />)
    for (const name of [/facebook/i, /whatsapp/i, /instagram/i]) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
