import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import SiteLink from '@/app/components/SiteLink'
import { UNAVAILABLE_ROUTES, isUnavailable, isExternal } from '@/app/lib/routes'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('isUnavailable', () => {
  it('flags every route we have not built yet', () => {
    for (const route of UNAVAILABLE_ROUTES) {
      expect(isUnavailable(route)).toBe(true)
    }
  })

  it('flags placeholder and empty hrefs', () => {
    expect(isUnavailable('#')).toBe(true)
    expect(isUnavailable('')).toBe(true)
  })

  it('ignores trailing slashes, query strings and fragments', () => {
    expect(isUnavailable('/faqs/')).toBe(true)
    expect(isUnavailable('/faqs#pricing')).toBe(true)
    expect(isUnavailable('/terms?ref=footer')).toBe(true)
  })

  it('leaves real routes alone', () => {
    for (const route of ['/', '/about', '/fleet', '/services/corporate', '/contact']) {
      expect(isUnavailable(route)).toBe(false)
    }
  })

  it('does not treat a route that merely starts with a dead one as dead', () => {
    expect(isUnavailable('/team-building')).toBe(false)
  })
})

describe('isExternal', () => {
  it('recognises off-site and device-handler links', () => {
    expect(isExternal('https://www.linkedin.com/company/everydays-travel-limited/')).toBe(true)
    expect(isExternal('tel:02089418354')).toBe(true)
    expect(isExternal('mailto:info@everydaystravel.co.uk')).toBe(true)
  })

  it('does not flag internal paths', () => {
    expect(isExternal('/fleet')).toBe(false)
  })
})

describe('SiteLink', () => {
  it('renders a real route as a link', () => {
    render(<SiteLink href="/fleet">Our Fleet</SiteLink>)
    expect(screen.getByRole('link', { name: 'Our Fleet' })).toHaveAttribute('href', '/fleet')
  })

  it('renders an unbuilt route as an inert, non-navigating element', () => {
    render(<SiteLink href="/faqs">FAQs</SiteLink>)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()

    const inert = screen.getByText('FAQs')
    expect(inert.tagName).toBe('SPAN')
    expect(inert).not.toHaveAttribute('href')
    expect(inert).toHaveAttribute('aria-disabled', 'true')
    // pointer-events-none guarantees a click never reaches the element at all.
    expect(inert.className).toContain('pointer-events-none')
  })

  it('keeps the caller styling on an inert link so layout does not shift', () => {
    render(<SiteLink href="/terms" className="text-[12px] font-medium">Terms of Use</SiteLink>)
    const inert = screen.getByText('Terms of Use')
    expect(inert.className).toContain('text-[12px]')
    expect(inert.className).toContain('font-medium')
  })

  it('opens an external link in a new tab with a safe rel', () => {
    render(<SiteLink href="https://www.facebook.com/p/Everydays-Luxury-Travel-100063491714841/">Facebook</SiteLink>)
    const link = screen.getByRole('link', { name: 'Facebook' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not open tel: links in a new tab', () => {
    render(<SiteLink href="tel:02089418354">Call us</SiteLink>)
    const link = screen.getByRole('link', { name: 'Call us' })
    expect(link).not.toHaveAttribute('target')
  })
})
