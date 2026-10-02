import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FleetCarousel from '@/app/components/FleetCarousel'

describe('FleetCarousel', () => {
  it('renders the section heading', () => {
    render(<FleetCarousel />)
    expect(
      screen.getByRole('heading', { name: /our luxury coach fleet/i }),
    ).toBeInTheDocument()
  })

  // The card looked clickable long before it was — it carried `cursor-pointer`
  // while only the small Explore pill actually navigated.
  it('makes the whole card a link to the vehicle', () => {
    const { container } = render(<FleetCarousel />)
    const cards = container.querySelectorAll('[data-fleet-card]')

    expect(cards.length).toBeGreaterThan(0)
    for (const card of cards) {
      expect(card.tagName).toBe('A')
      expect(card.getAttribute('href')).toMatch(/^\/fleet\/[a-z-]+\/[a-z0-9-]+$/)
    }
  })

  it('keeps the Explore pill inside the card link rather than nesting a second one', () => {
    const { container } = render(<FleetCarousel />)
    for (const card of container.querySelectorAll('[data-fleet-card]')) {
      expect(card.querySelector('a')).toBeNull()
      expect(card.textContent).toContain('Explore')
    }
  })
})
