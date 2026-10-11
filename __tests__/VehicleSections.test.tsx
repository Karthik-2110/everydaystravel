import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import VehicleSections from '@/app/components/vehicle/VehicleSections'
import VehicleSpecBlocks from '@/app/components/vehicle/VehicleSpecBlocks'
import { VEHICLE_CONTENT } from '@/app/data/vehicle-content'

// `AnimatePresence mode="wait"` holds the incoming slide until the outgoing one
// finishes exiting. In jsdom that exit never completes, so the crossfade is
// stubbed out the same way the service-section tests stub it — these tests are
// about which photo is shown, not how it arrives.
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
 * The content sections on a fleet page.
 *
 * Vehicles land one at a time, so the behaviour that matters most is the one
 * nobody would notice going wrong: a vehicle nobody has written yet must render
 * the page it rendered before, not an empty heading.
 */

/**
 * A real vehicle whose copy nobody has written yet, which is what the
 * renders-nothing tests need. When this one lands, point them at another
 * unwritten slug; the assertion below says so rather than failing obscurely.
 */
const UNWRITTEN = 'bmw-x7'

describe('VehicleSections', () => {
  it('renders nothing for a vehicle with no content written yet', () => {
    expect(
      VEHICLE_CONTENT[UNWRITTEN],
      `"${UNWRITTEN}" has copy now — point this test at a vehicle that has none`,
    ).toBeUndefined()

    const { container } = render(<VehicleSections slug={UNWRITTEN} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing for a slug that is not a vehicle at all', () => {
    const { container } = render(<VehicleSections slug="not-a-vehicle" />)
    expect(container).toBeEmptyDOMElement()
  })

  describe('VehicleSpecBlocks', () => {
    it('renders nothing for a vehicle with no content written yet', () => {
      const { container } = render(<VehicleSpecBlocks slug={UNWRITTEN} />)
      expect(container).toBeEmptyDOMElement()
    })

    it('reads as a sibling of the spec headings rather than a band of its own', () => {
      const { container } = render(<VehicleSpecBlocks slug="mercedes-v-class" />)
      // No <section> wrapper: it sits inside the specification column beneath
      // "Features & Amenities" and "Preferred for".
      expect(container.querySelector('section')).toBeNull()

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveStyle({ fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: '500' })
    })

    it('keeps a space between heading parts in the accessible name', () => {
      render(<VehicleSpecBlocks slug="mercedes-v-class" />)
      expect(
        screen.getByRole('heading', { level: 2, name: /^Why hire the V-Class$/ }),
      ).toBeInTheDocument()
    })

    it('marks the icons decorative, since the text beside them already says it', () => {
      const { container } = render(<VehicleSpecBlocks slug="mercedes-v-class" />)
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBe(6)
      for (const icon of icons) expect(icon).toHaveAttribute('aria-hidden')
    })
  })

  describe('the chauffeur-driven V-Class', () => {
    it('leaves the opening argument to the spec column', () => {
      render(<VehicleSections slug="mercedes-v-class" />)
      expect(
        screen.queryByRole('heading', { name: /^why hire the v-class$/i }),
      ).not.toBeInTheDocument()
    })

    it('puts the kinds of journey in an accordion, first row open', () => {
      const { container } = render(<VehicleSections slug="mercedes-v-class" />)
      const rows = container.querySelectorAll('details[name="transfer-kinds"]')
      expect(rows.length).toBe(8)

      expect(rows[0]).toHaveAttribute('open')
      expect([...rows].filter((r) => r.hasAttribute('open'))).toHaveLength(1)

      expect(screen.getByText('Executive airport transfers')).toBeInTheDocument()
      expect(screen.getByText('Weddings')).toBeInTheDocument()
    })

    it('keeps every row readable without JavaScript', () => {
      // Native disclosures: keyboard operable and found by in-page search even
      // when closed, which a div-and-state accordion would not be.
      const { container } = render(<VehicleSections slug="mercedes-v-class" />)
      expect(screen.getByText(/the rear seats run on rails and lift out/i)).toBeInTheDocument()
      expect(container.querySelectorAll('details > summary').length).toBe(8)
    })

    it('names where it runs, which the spec above never does', () => {
      render(<VehicleSections slug="mercedes-v-class" />)
      expect(screen.getByText(/Heathrow, Gatwick, Stansted, Luton and City/)).toBeInTheDocument()
    })

    it('names its bands for a screen reader rather than calling them transfers', () => {
      render(<VehicleSections slug="mercedes-v-class" />)
      expect(screen.getByRole('region', { name: /what the v-class is used for/i })).toBeInTheDocument()
      expect(screen.getByRole('region', { name: /what a v-class booking includes/i })).toBeInTheDocument()
      expect(screen.queryByRole('region', { name: /kinds of transfer/i })).not.toBeInTheDocument()
    })

    it('shows a photo carousel with working controls', () => {
      render(<VehicleSections slug="mercedes-v-class" />)
      const dots = screen.getAllByRole('button', { name: /^show photo/i })
      expect(dots).toHaveLength(4)
      expect(dots[0]).toHaveAttribute('aria-current', 'true')
    })

    it('advances the carousel when asked', async () => {
      const user = userEvent.setup()
      render(<VehicleSections slug="mercedes-v-class" />)

      expect(screen.getByAltText(/ready for a chauffeur booking/i)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /next photo/i }))
      expect(screen.getByAltText(/individual reclining leather seats/i)).toBeInTheDocument()
    })

    it('separates what is included from what you ask for', () => {
      render(<VehicleSections slug="mercedes-v-class" />)
      expect(screen.getByRole('heading', { name: /every v-class booking includes/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /you can also ask for/i })).toBeInTheDocument()
    })

    it('offers a quote and the fleet, with exactly one primary action', () => {
      render(<VehicleSections slug="mercedes-v-class" />)
      expect(screen.getByRole('link', { name: /get a quote/i })).toHaveAttribute('href', '/book')
      expect(screen.getByRole('link', { name: /view our fleet/i })).toHaveAttribute('href', '/fleet')

      const { ctas } = VEHICLE_CONTENT['mercedes-v-class'].fleet!
      expect(ctas.filter((c) => c.primary)).toHaveLength(1)
    })
  })

  /**
   * The 7-seater renders through the same components, so these assert the shape
   * rather than the prose: the same bands, the same counts, the same
   * one-primary-action rule. What they do check in words is the framing — this
   * page exists to answer a different search than the chauffeur one.
   */
  describe('the 7-seater MPV', () => {
    it('opens the spec column with its own six-point argument', () => {
      render(<VehicleSpecBlocks slug="7-seater-mpv-v-class" />)
      expect(
        screen.getByRole('heading', { level: 2, name: /^Why the 7-seater V-Class$/ }),
      ).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(6)
    })

    it('puts the kinds of journey in an accordion, first row open', () => {
      const { container } = render(<VehicleSections slug="7-seater-mpv-v-class" />)
      const rows = container.querySelectorAll('details[name="transfer-kinds"]')
      expect(rows.length).toBe(8)

      expect(rows[0]).toHaveAttribute('open')
      expect([...rows].filter((r) => r.hasAttribute('open'))).toHaveLength(1)
    })

    it('sends a group too big for it to the next vehicle up', () => {
      render(<VehicleSections slug="7-seater-mpv-v-class" />)
      expect(screen.getByText(/eight or nine and we move you to the 16-seater/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /see the minibuses/i }))
        .toHaveAttribute('href', '/fleet/luxury-minibuses')
    })

    it('offers a quote, with exactly one primary action', () => {
      render(<VehicleSections slug="7-seater-mpv-v-class" />)
      expect(screen.getByRole('link', { name: /get a quote/i })).toHaveAttribute('href', '/book')

      const { ctas } = VEHICLE_CONTENT['7-seater-mpv-v-class'].fleet!
      expect(ctas.filter((c) => c.primary)).toHaveLength(1)
    })

    it('names the band clip rather than leaving it decorative', () => {
      // The band runs a clip here, so the accessible name is on the <video>
      // and the still underneath it is only the poster.
      const { container } = render(<VehicleSections slug="7-seater-mpv-v-class" />)
      const clip = container.querySelector('video')
      expect(clip).toHaveAttribute('aria-label', 'The cabin of an Everydays Travel 7-seater V-Class')
      expect(clip).toHaveAttribute('poster')
      expect(clip).not.toHaveAttribute('controls')
    })
  })
})
