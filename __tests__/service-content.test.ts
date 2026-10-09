import { describe, it, expect } from 'vitest'
import { SERVICE_CONTENT, serviceContent } from '@/app/data/service-content'
import { SERVICES } from '@/app/components/ServiceList'

/**
 * The content layer's integrity, not its prose.
 *
 * The failure that matters here is invisible from a page: content keyed to a
 * service that does not exist renders nowhere and is never noticed.
 *
 * Services land one at a time, so the checks below run over the roster rather
 * than over one named service. A service nobody has written yet is not a
 * failure; a service written to a different shape than the last one is, because
 * the bands all render through the same components and a missing block is a
 * page that stops halfway down.
 */

/** Services with their copy written. Add a slug here when its entry lands. */
const WRITTEN = ['airport-transfers', 'corporate']

const service = (slug: string) => SERVICES.find((s) => s.slug === slug)!

/** Every word a reader can see in a service's sections, lowercased. */
const pageCopy = (slug: string) => {
  const content = SERVICE_CONTENT[slug]
  const parts = [
    ...(content.whyChoose?.points ?? []).map((p) => p.text),
    content.solutions?.intro ?? '',
    ...(content.solutions?.accordion ?? []).flatMap((r) => [r.title, r.text]),
    content.fleet?.intro ?? '',
    ...(content.fleet?.included ?? []).map((p) => p.text),
    ...(content.fleet?.extras ?? []).map((p) => p.text),
  ]
  return parts.join(' ').toLowerCase()
}

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

  it('gives every written service all three bands', () => {
    // A service with only some of its blocks renders a page that stops
    // halfway down, which reads as broken rather than as unfinished.
    for (const slug of WRITTEN) {
      const content = serviceContent(slug)
      expect(content, `nothing written for "${slug}"`).toBeDefined()
      expect(content!.whyChoose, `${slug}: no whyChoose`).toBeDefined()
      expect(content!.solutions, `${slug}: no solutions`).toBeDefined()
      expect(content!.fleet,     `${slug}: no fleet`).toBeDefined()
    }
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
    // "Features & Amenities", "Preferred for" and "Why choose" all render in a
    // two-column grid. An odd count leaves a single item stranded on the last
    // row, which is what the three-item list looked like before.
    for (const slug of WRITTEN) {
      const svc = service(slug)
      expect(svc.features.length % 2, `${slug}: features list is odd`).toBe(0)
      expect(svc.idealFor.length % 2, `${slug}: preferred-for list is odd`).toBe(0)
      expect(SERVICE_CONTENT[slug].whyChoose!.points.length % 2,
        `${slug}: why-choose list is odd`).toBe(0)
    }
  })

  it('draws the audiences from copy that appears on the page', () => {
    // Each audience should be something the section copy actually claims, so
    // the spec and the prose below it cannot say different things.
    for (const slug of WRITTEN) {
      const copy = pageCopy(slug)
      for (const tag of service(slug).idealFor) {
        // "Wedding Parties" -> "wedding", "Sports Teams" -> "sport"
        const stem = tag.split(' ')[0].toLowerCase().replace(/s$/, '')
        expect(copy, `${slug}: nothing on the page mentions "${stem}"`).toContain(stem)
      }
    }
  })

  it('keeps the heading split into parts so emphasis can fall either way', () => {
    for (const slug of WRITTEN) {
      const content = SERVICE_CONTENT[slug]
      expect(content.whyChoose!.heading.some((p) => p.accent), `${slug}: whyChoose`).toBe(true)
      expect(content.solutions!.heading.some((p) => p.accent), `${slug}: solutions`).toBe(true)
      expect(content.fleet!.heading.some((p) => p.accent),     `${slug}: fleet`).toBe(true)
    }
  })

  it('gives the carousel something to advance to', () => {
    for (const slug of WRITTEN) {
      expect(SERVICE_CONTENT[slug].solutions!.carousel.length,
        `${slug}: carousel needs more than one slide`).toBeGreaterThan(1)
    }
  })
})
