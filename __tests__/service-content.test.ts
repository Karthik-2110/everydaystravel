import { describe, it, expect } from 'vitest'
import { SERVICE_CONTENT, serviceContent } from '@/app/data/service-content'
import { SERVICES } from '@/app/components/ServiceList'

/**
 * The content layer's integrity, not its prose.
 *
 * The failure that matters here is invisible from a page: content keyed to a
 * service that does not exist renders nowhere and is never noticed.
 */

describe('service content', () => {
  it('keys every entry to a service that exists', () => {
    const slugs = SERVICES.map((s) => s.slug)
    for (const slug of Object.keys(SERVICE_CONTENT)) {
      expect(slugs, `no service named "${slug}"`).toContain(slug)
    }
  })

  it('returns undefined for a service with nothing written', () => {
    expect(serviceContent('not-a-service')).toBeUndefined()
  })

  it('never repeats a standard amenity as an optional extra', () => {
    // "Every transfer includes" and "you can also ask for" only mean anything
    // as a pair. An item on both sides erases the line between them.
    for (const [slug, content] of Object.entries(SERVICE_CONTENT)) {
      const fleet = content.fleet
      if (!fleet) continue

      const normalise = (s: string) => s.trim().toLowerCase()
      const standard = fleet.included.map(({ text }) => normalise(text))
      for (const { text } of fleet.extras) {
        expect(standard, `${slug}: "${text}" is already standard`).not.toContain(normalise(text))
      }
    }
  })

  it('fills the two-column spec grid without leaving an orphan row', () => {
    // "Features & Amenities" and "Preferred for" render in a two-column grid.
    // An odd count leaves a single item stranded on the last row, which is what
    // the three-item list looked like before.
    const airport = SERVICES.find((s) => s.slug === 'airport-transfers')!
    expect(airport.features.length % 2, 'features list is odd').toBe(0)
    expect(airport.idealFor.length % 2, 'preferred-for list is odd').toBe(0)
  })

  it('draws the audiences from copy that appears on the page', () => {
    // Each audience should be something the section copy actually claims, so
    // the spec and the prose below it cannot say different things.
    const airport  = SERVICES.find((s) => s.slug === 'airport-transfers')!
    const rows     = SERVICE_CONTENT['airport-transfers'].solutions!.accordion
    const pageCopy = rows.map((r) => `${r.title} ${r.text}`).join(' ').toLowerCase()

    for (const tag of ['Wedding Parties', 'Sports Teams', 'Tour Groups']) {
      expect(airport.idealFor).toContain(tag)
      // "Wedding Parties" -> "wedding", "Sports Teams" -> "team"
      const stem = tag.split(' ')[0].toLowerCase().replace(/s$/, '')
      expect(pageCopy, `nothing on the page mentions "${stem}"`).toContain(stem)
    }
  })

  it('keeps the heading split into parts so emphasis can fall either way', () => {
    const airport = SERVICE_CONTENT['airport-transfers']
    expect(airport.whyChoose!.heading.some((p) => p.accent)).toBe(true)
    expect(airport.solutions!.heading.some((p) => p.accent)).toBe(true)
  })
})
