import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ServicesGrid, { DEFAULT_SERVICES } from '@/app/components/ServicesGrid'
import { SERVICES } from '@/app/components/ServiceList'
import { sitemapEntries } from '@/app/lib/seo'

describe('ServicesGrid', () => {
  it('renders a card for every default service', () => {
    render(<ServicesGrid />)
    for (const service of DEFAULT_SERVICES) {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument()
    }
  })

  // '/services/race-days' was listed here for a page that was never built, and
  // nothing caught it. Both halves matter: the slug has to exist in the service
  // catalogue, and the route has to be one we actually tell search engines about.
  it('only links to services that exist', () => {
    const slugs = SERVICES.map((s) => s.slug)
    const paths = sitemapEntries.map((e) => new URL(e.url).pathname)

    for (const service of DEFAULT_SERVICES) {
      const slug = service.href.replace('/services/', '')
      expect(slugs).toContain(slug)
      expect(paths).toContain(service.href)
    }
  })

  it('takes each card name from the service catalogue', () => {
    for (const service of DEFAULT_SERVICES) {
      const slug = service.href.replace('/services/', '')
      expect(service.name).toBe(SERVICES.find((s) => s.slug === slug)?.name)
    }
  })
})
