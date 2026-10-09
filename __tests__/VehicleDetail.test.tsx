import { render, screen, within } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import React from 'react'
import VehicleDetail from '@/app/components/VehicleDetail'
import { SERVICES } from '@/app/components/ServiceList'
import { EXECUTIVE_COACHES } from '@/app/data/fleet'

// Same stand-ins the Navbar tests use: no router, no image optimiser in jsdom.
vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

type NextImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean; priority?: boolean; unoptimized?: boolean; quality?: number
}

vi.mock('next/image', () => ({
  default: ({ alt, src, fill, priority, unoptimized, quality, ...props }: NextImageProps) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src as string} {...props} />,
}))

/**
 * The title row, which every fleet vehicle and every service page shares.
 *
 * The rating used to sit under the title in a row of chips, set smaller and
 * dimmer than the body copy beneath it — the one piece of third-party proof on
 * the page, styled as the least important thing on it. It now ends the title
 * row, and the chips that crowded it are gone.
 */

const coach   = EXECUTIVE_COACHES[0]
const service = SERVICES.find((s) => s.slug === 'corporate')!

const renderFleet = () =>
  render(
    <VehicleDetail
      vehicle={coach}
      category="executive-coaches"
      categoryLabel="Executive Coaches"
      otherVehicles={EXECUTIVE_COACHES.slice(1)}
    />,
  )

const renderService = () =>
  render(
    <VehicleDetail
      vehicle={service}
      category="services"
      categoryLabel="Services"
      otherVehicles={SERVICES.filter((s) => s.slug !== service.slug)}
      hrefBase="/services"
      preselectVehicle={false}
    />,
  )

describe('VehicleDetail title row', () => {
  it('ends the title row with the rating rather than stacking it underneath', () => {
    const { container } = renderFleet()
    const row = container.querySelector('[data-title-row]')!
    expect(row, 'no title row').toBeTruthy()

    // Heading and rating are siblings in one row, pushed to opposite ends.
    expect(within(row as HTMLElement).getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('4.4')).toBeInTheDocument()
    expect(row.className).toContain('justify-between')
  })

  it('announces the rating it actually shows', () => {
    // The stars image said "5 stars" beside a 4.4 rating. The cluster carries
    // the rating now, and the image is decorative.
    const { container } = renderFleet()
    const rating = screen.getByLabelText(/rated 4\.4 out of 5 on trustpilot/i)
    expect(rating).toBeInTheDocument()
    expect(within(rating).queryByAltText(/star/i)).toBeNull()
    expect(container.querySelector('[data-title-row] img')).toHaveAttribute('aria-hidden')
  })

  it('sets the rating above the body copy rather than below it', () => {
    // It is the page's only third-party proof. It was 12.5px at 40% opacity,
    // quieter than the description under it.
    renderFleet()
    const score = screen.getByText('4.4')
    expect(score.className).toMatch(/text-white\b/)
    expect(score.className).not.toMatch(/text-white\/\d/)
  })

  it('sets Trustpilot to match the score beside it', () => {
    // One fact, one treatment: the source is not a footnote to the number.
    renderFleet()
    expect(screen.getByText('Trustpilot').className)
      .toBe(screen.getByText('4.4').className)
  })

  it('drops the Most Popular chip', () => {
    renderFleet()
    expect(screen.queryByText(/most popular/i)).toBeNull()
  })

  it('drops the category chip from the title row', () => {
    // The badge still belongs on the cards; it was redundant beside a heading
    // that already names the thing.
    const { container } = renderFleet()
    const row = container.querySelector('[data-title-row]') as HTMLElement
    expect(within(row).queryByText(coach.badge)).toBeNull()
  })

  it('treats a service page exactly the same way', () => {
    const { container } = renderService()
    const row = container.querySelector('[data-title-row]') as HTMLElement

    expect(within(row).getByRole('heading', { level: 1, name: service.name })).toBeInTheDocument()
    expect(within(row).getByText('4.4')).toBeInTheDocument()
    expect(within(row).queryByText(service.badge)).toBeNull()
    expect(screen.queryByText(/most popular/i)).toBeNull()
  })
})
