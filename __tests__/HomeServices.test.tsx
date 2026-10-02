import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomeServices, { HOME_SERVICES } from '@/app/components/HomeServices'
import { SERVICES } from '@/app/components/ServiceList'

describe('HomeServices', () => {
  it('renders the section heading', () => {
    render(<HomeServices />)
    expect(
      screen.getByRole('heading', { name: /coach hire for every kind of journey/i }),
    ).toBeInTheDocument()
  })

  it('renders a card for each of the six services', () => {
    render(<HomeServices />)
    expect(HOME_SERVICES).toHaveLength(6)
    for (const service of HOME_SERVICES) {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument()
    }
  })

  // The homepage is the most-linked page on the site, so a card pointing at a
  // route that was never built would be the most expensive dead link we could
  // ship. Every href is checked against the real service catalogue.
  it('links every card to a service that exists', () => {
    render(<HomeServices />)
    const slugs = SERVICES.map((s) => s.slug)

    for (const service of HOME_SERVICES) {
      const link = screen.getByRole('link', { name: new RegExp(service.name, 'i') })
      expect(link).toHaveAttribute('href', `/services/${service.slug}`)
      expect(slugs).toContain(service.slug)
    }
  })

  it('gives each card its own photo', () => {
    const images = HOME_SERVICES.map((s) => s.image)
    expect(new Set(images).size).toBe(images.length)
  })

  it('offers a quote as the closing call to action', () => {
    render(<HomeServices />)
    expect(screen.getByRole('link', { name: /get a free quote/i })).toHaveAttribute(
      'href',
      '/book',
    )
  })
})
