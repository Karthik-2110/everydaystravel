import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import ServiceSections from '@/app/components/service/ServiceSections'
import ServiceSpecBlocks from '@/app/components/service/ServiceSpecBlocks'
import { SERVICE_CONTENT } from '@/app/data/service-content'

// `AnimatePresence mode="wait"` holds the incoming slide until the outgoing one
// finishes exiting. In jsdom that exit never completes, so the crossfade is
// stubbed out here the same way the cookie-banner tests stub it — these tests
// are about which photo is shown, not how it arrives.
type MotionDivProps = React.ComponentProps<'div'> & {
  initial?:    unknown
  animate?:    unknown
  exit?:       unknown
  transition?: unknown
}

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: MotionDivProps) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

/**
 * The content sections that sit between a service's spec and its explore cards.
 *
 * Services land one at a time, so the behaviour that matters most is the one
 * nobody would notice going wrong: a service nobody has written yet must render
 * the page it rendered before, not an empty heading.
 */

/**
 * A real service whose copy nobody has written yet, which is what the
 * renders-nothing tests need. When this one lands, point them at another
 * unwritten slug; the assertion below says so rather than failing obscurely.
 */
const UNWRITTEN = 'private-hire'

describe('ServiceSections', () => {
  it('renders nothing for a service with no content written yet', () => {
    expect(
      SERVICE_CONTENT[UNWRITTEN],
      `"${UNWRITTEN}" has copy now — point this test at a service that has none`,
    ).toBeUndefined()

    const { container } = render(<ServiceSections slug={UNWRITTEN} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing for a slug that is not a service at all', () => {
    const { container } = render(<ServiceSections slug="not-a-service" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('keeps a space between heading parts in the accessible name', () => {
    // The accessible-name algorithm trims each element before joining, so a
    // trailing space inside a span renders fine and then vanishes from the
    // name. This asserts the name a screen reader actually announces.
    render(<ServiceSpecBlocks slug="airport-transfers" />)
    const heading = screen.getByRole('heading', { level: 2, name: /^Why choose Everydays Travel$/ })
    expect(heading).toBeInTheDocument()
  })

  describe('ServiceSpecBlocks', () => {
    it('renders nothing for a service with no content written yet', () => {
      const { container } = render(<ServiceSpecBlocks slug={UNWRITTEN} />)
      expect(container).toBeEmptyDOMElement()
    })

    it('reads as a sibling of the spec headings rather than a band of its own', () => {
      const { container } = render(<ServiceSpecBlocks slug="airport-transfers" />)
      // No <section> wrapper: it sits inside the specification column.
      expect(container.querySelector('section')).toBeNull()

      // Same size and weight as "Features & Amenities" and "Preferred for".
      // These values are copied from VehicleDetail's own headings; if that file
      // restyles them, this fails and the two are meant to move together.
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveStyle({ fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: '500' })
    })

    it('carries the opening argument as points', () => {
      render(<ServiceSpecBlocks slug="airport-transfers" />)
      expect(screen.getByText(/pickups timed to your flight, not your booking/i)).toBeInTheDocument()
      expect(screen.getByText(/a price agreed before you travel/i)).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(6)
    })

    it('marks the icons decorative, since the text beside them already says it', () => {
      const { container } = render(<ServiceSpecBlocks slug="airport-transfers" />)
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBe(6)
      for (const icon of icons) expect(icon).toHaveAttribute('aria-hidden')
    })
  })

  describe('airport transfers', () => {
    it('leaves the opening argument to the spec column', () => {
      render(<ServiceSections slug="airport-transfers" />)
      expect(
        screen.queryByRole('heading', { name: /^why choose everydays travel$/i }),
      ).not.toBeInTheDocument()
    })

    it('puts the kinds of transfer in an accordion, first row open', () => {
      const { container } = render(<ServiceSections slug="airport-transfers" />)
      const rows = container.querySelectorAll('details[name="transfer-kinds"]')
      expect(rows.length).toBe(9)

      // Only the first is open, so the pattern is legible without a click.
      expect(rows[0]).toHaveAttribute('open')
      expect([...rows].filter((r) => r.hasAttribute('open'))).toHaveLength(1)

      expect(screen.getByText('Business travel')).toBeInTheDocument()
      expect(screen.getByText('Staff and crew moves')).toBeInTheDocument()
    })

    it('keeps every row readable without JavaScript', () => {
      // Native disclosures: keyboard operable and found by in-page search even
      // when closed, which a div-and-state accordion would not be.
      const { container } = render(<ServiceSections slug="airport-transfers" />)
      expect(screen.getByText(/a team collected from three addresses/i)).toBeInTheDocument()
      expect(container.querySelectorAll('details > summary').length).toBe(9)
    })

    it('names the airports it covers, which the spec above never does', () => {
      render(<ServiceSections slug="airport-transfers" />)
      expect(screen.getByText(/Heathrow, Gatwick, Stansted, Luton, City and Southend/)).toBeInTheDocument()
    })

    it('shows a photo carousel with working controls', () => {
      render(<ServiceSections slug="airport-transfers" />)
      expect(screen.getByRole('button', { name: /next photo/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous photo/i })).toBeInTheDocument()

      // One dot per slide, the first marked current.
      const dots = screen.getAllByRole('button', { name: /^show photo/i })
      expect(dots).toHaveLength(4)
      expect(dots[0]).toHaveAttribute('aria-current', 'true')
    })

    it('advances the carousel when asked', async () => {
      const user = userEvent.setup()
      render(<ServiceSections slug="airport-transfers" />)

      expect(screen.getByAltText(/an everydays travel airport transfer/i)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /next photo/i }))
      expect(screen.getByAltText(/mercedes-benz v-class/i)).toBeInTheDocument()
    })

    it('wraps from the first photo back to the last', async () => {
      const user = userEvent.setup()
      render(<ServiceSections slug="airport-transfers" />)
      await user.click(screen.getByRole('button', { name: /previous photo/i }))
      expect(screen.getByAltText(/^an everydays travel vehicle$/i)).toBeInTheDocument()
    })

    it('gives every vehicle-list item an icon', () => {
      const { included, extras } = SERVICE_CONTENT['airport-transfers'].fleet!
      for (const { icon, text } of [...included, ...extras]) {
        expect(icon, `"${text}" has no icon`).toBeTruthy()
      }
    })

    it('separates what is included from what you ask for', () => {
      render(<ServiceSections slug="airport-transfers" />)
      expect(screen.getByRole('heading', { name: /every transfer includes/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /you can also ask for/i })).toBeInTheDocument()

      // Compare the text, not the objects — `includes` on the objects would
      // always pass and quietly assert nothing.
      const { included, extras } = SERVICE_CONTENT['airport-transfers'].fleet!
      const extraText = extras.map(({ text }) => text.toLowerCase())
      const overlap = included.filter(({ text }) => extraText.includes(text.toLowerCase()))
      expect(overlap, 'an item cannot be both standard and an optional extra').toEqual([])
    })

    it('offers a quote and the fleet, with exactly one primary action', () => {
      render(<ServiceSections slug="airport-transfers" />)
      expect(screen.getByRole('link', { name: /get a quote/i })).toHaveAttribute('href', '/book')
      expect(screen.getByRole('link', { name: /view our fleet/i })).toHaveAttribute('href', '/fleet')

      const { ctas } = SERVICE_CONTENT['airport-transfers'].fleet!
      expect(ctas.filter((c) => c.primary)).toHaveLength(1)
    })

    it('gives the photo real alt text rather than leaving it decorative', () => {
      render(<ServiceSections slug="airport-transfers" />)
      expect(screen.getByAltText(/everydays travel vehicle on an airport transfer/i)).toBeInTheDocument()
    })
  })

  /**
   * Corporate renders through the same components as the transfers page, so
   * these assert the shape rather than the prose: the same bands, the same
   * counts, the same one-primary-action rule. A band that went missing or a
   * list that lost its pair would be a page that stops reading like the other.
   */
  describe('corporate', () => {
    it('leaves the opening argument to the spec column', () => {
      render(<ServiceSections slug="corporate" />)
      expect(
        screen.queryByRole('heading', { name: /^why choose everydays travel$/i }),
      ).not.toBeInTheDocument()
    })

    it('opens the spec column with the same six-point argument', () => {
      render(<ServiceSpecBlocks slug="corporate" />)
      expect(
        screen.getByRole('heading', { level: 2, name: /^Why choose Everydays Travel$/ }),
      ).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(6)
    })

    it('puts the kinds of business journey in an accordion, first row open', () => {
      const { container } = render(<ServiceSections slug="corporate" />)
      const rows = container.querySelectorAll('details[name="transfer-kinds"]')
      expect(rows.length).toBe(9)

      expect(rows[0]).toHaveAttribute('open')
      expect([...rows].filter((r) => r.hasAttribute('open'))).toHaveLength(1)

      expect(screen.getByText('Conferences and exhibitions')).toBeInTheDocument()
      expect(screen.getByText('Staff shuttles')).toBeInTheDocument()
    })

    it('keeps every row readable without JavaScript', () => {
      const { container } = render(<ServiceSections slug="corporate" />)
      expect(screen.getByText(/a standing run between the office, the station and the site/i)).toBeInTheDocument()
      expect(container.querySelectorAll('details > summary').length).toBe(9)
    })

    it('names the venues it serves, which the spec above never does', () => {
      render(<ServiceSections slug="corporate" />)
      expect(screen.getByText(/ExCeL, Olympia and the QEII Centre/)).toBeInTheDocument()
    })

    it('shows a photo carousel with working controls', () => {
      render(<ServiceSections slug="corporate" />)
      expect(screen.getByRole('button', { name: /next photo/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous photo/i })).toBeInTheDocument()

      const dots = screen.getAllByRole('button', { name: /^show photo/i })
      expect(dots).toHaveLength(4)
      expect(dots[0]).toHaveAttribute('aria-current', 'true')
    })

    it('advances the carousel when asked', async () => {
      const user = userEvent.setup()
      render(<ServiceSections slug="corporate" />)

      expect(screen.getByAltText(/^an everydays travel coach on corporate work$/i)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /next photo/i }))
      expect(screen.getByAltText(/mercedes-benz s-class/i)).toBeInTheDocument()
    })

    it('gives every vehicle-list item an icon', () => {
      const { included, extras } = SERVICE_CONTENT['corporate'].fleet!
      for (const { icon, text } of [...included, ...extras]) {
        expect(icon, `"${text}" has no icon`).toBeTruthy()
      }
    })

    it('separates what is included from what you ask for', () => {
      render(<ServiceSections slug="corporate" />)
      expect(screen.getByRole('heading', { name: /every corporate journey includes/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /you can also ask for/i })).toBeInTheDocument()
    })

    it('offers a quote and the fleet, with exactly one primary action', () => {
      render(<ServiceSections slug="corporate" />)
      expect(screen.getByRole('link', { name: /get a quote/i })).toHaveAttribute('href', '/book')
      expect(screen.getByRole('link', { name: /view our fleet/i })).toHaveAttribute('href', '/fleet')

      const { ctas } = SERVICE_CONTENT['corporate'].fleet!
      expect(ctas.filter((c) => c.primary)).toHaveLength(1)
    })

    it('gives the photo real alt text rather than leaving it decorative', () => {
      // Distinct from the carousel's opening slide: two images announcing the
      // same words is what a screen reader hears as one picture twice.
      render(<ServiceSections slug="corporate" />)
      expect(screen.getByAltText(/everydays travel vehicle on a corporate booking/i)).toBeInTheDocument()
    })
  })
})
