import { describe, it, expect } from 'vitest'
import { VEHICLE_CONTENT, vehicleContent } from '@/app/data/vehicle-content'
import { CHAUFFEUR_CARS, LUXURY_MINIBUSES, EXECUTIVE_COACHES } from '@/app/data/fleet'
import type { Vehicle } from '@/app/data/fleet'

/**
 * The fleet content layer's integrity, not its prose.
 *
 * The same checks the service content runs, for the same reason: content keyed
 * to a vehicle that does not exist renders nowhere and is never noticed, and a
 * vehicle written to a different shape than the last one is a page that stops
 * halfway down.
 *
 * One check here has no counterpart on the service side. The V-Class appears in
 * the fleet twice — as a chauffeur car and as the smallest minibus — so the two
 * entries have to stay different from each other, or the site publishes one
 * page of copy at two URLs.
 */

/** Vehicles with their copy written. Add a slug here when its entry lands. */
const WRITTEN = ['mercedes-v-class', '7-seater-mpv-v-class']

const ALL: Vehicle[] = [...CHAUFFEUR_CARS, ...LUXURY_MINIBUSES, ...EXECUTIVE_COACHES]

const vehicle = (slug: string) => ALL.find((v) => v.slug === slug)!

/** Every word a reader can see in a vehicle's sections, lowercased. */
const pageCopy = (slug: string) => {
  const content = VEHICLE_CONTENT[slug]
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

describe('vehicle content', () => {
  it('keys every entry to a vehicle that exists', () => {
    const slugs = ALL.map((v) => v.slug)
    for (const slug of Object.keys(VEHICLE_CONTENT)) {
      expect(slugs, `no vehicle named "${slug}"`).toContain(slug)
    }
  })

  it('returns undefined for a vehicle with nothing written', () => {
    expect(vehicleContent('not-a-vehicle')).toBeUndefined()
    expect(vehicleContent('bmw-x7')).toBeUndefined()
  })

  it('gives every written vehicle all three bands', () => {
    for (const slug of WRITTEN) {
      const content = vehicleContent(slug)
      expect(content, `nothing written for "${slug}"`).toBeDefined()
      expect(content!.whyChoose, `${slug}: no whyChoose`).toBeDefined()
      expect(content!.solutions, `${slug}: no solutions`).toBeDefined()
      expect(content!.fleet,     `${slug}: no fleet`).toBeDefined()
    }
  })

  it('never repeats a standard amenity as an optional extra', () => {
    for (const [slug, content] of Object.entries(VEHICLE_CONTENT)) {
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
    for (const slug of WRITTEN) {
      const v = vehicle(slug)
      expect(v.features.length % 2, `${slug}: features list is odd`).toBe(0)
      expect(v.idealFor.length % 2, `${slug}: preferred-for list is odd`).toBe(0)
      expect(VEHICLE_CONTENT[slug].whyChoose!.points.length % 2,
        `${slug}: why-choose list is odd`).toBe(0)
    }
  })

  it('draws the audiences from copy that appears on the page', () => {
    for (const slug of WRITTEN) {
      const copy = pageCopy(slug)
      for (const tag of vehicle(slug).idealFor) {
        // "Corporate Groups" -> "corporate", "Weddings" -> "wedding"
        const stem = tag.split(' ')[0].toLowerCase().replace(/s$/, '')
        expect(copy, `${slug}: nothing on the page mentions "${stem}"`).toContain(stem)
      }
    }
  })

  it('keeps the heading split into parts so emphasis can fall either way', () => {
    for (const slug of WRITTEN) {
      const content = VEHICLE_CONTENT[slug]
      expect(content.whyChoose!.heading.some((p) => p.accent), `${slug}: whyChoose`).toBe(true)
      expect(content.solutions!.heading.some((p) => p.accent), `${slug}: solutions`).toBe(true)
      expect(content.fleet!.heading.some((p) => p.accent),     `${slug}: fleet`).toBe(true)
    }
  })

  it('gives the carousel something to advance to', () => {
    for (const slug of WRITTEN) {
      expect(VEHICLE_CONTENT[slug].solutions!.carousel.length,
        `${slug}: carousel needs more than one slide`).toBeGreaterThan(1)
    }
  })

  it('names each band for a screen reader rather than calling it a transfer', () => {
    // The bands render through the service components, whose defaults say
    // "Kinds of transfer" and "The vehicles we use" — both wrong on a page
    // about one vehicle.
    for (const slug of WRITTEN) {
      const content = VEHICLE_CONTENT[slug]
      expect(content.solutions!.ariaLabel, `${slug}: solutions band unnamed`).toBeTruthy()
      expect(content.fleet!.ariaLabel,     `${slug}: fleet band unnamed`).toBeTruthy()
    }
  })

  describe('the V-Class, which has two pages', () => {
    const chauffeur = VEHICLE_CONTENT['mercedes-v-class']
    const minibus   = VEHICLE_CONTENT['7-seater-mpv-v-class']

    it('writes the two pages differently rather than publishing one twice', () => {
      // Near-duplicate copy at two URLs is worth less than either page alone.
      // Comparing the accordion rows catches the longest prose on the page.
      const rows = (c: typeof chauffeur) =>
        new Set(c.solutions!.accordion.map((r) => r.text.toLowerCase()))

      const shared = [...rows(chauffeur)].filter((t) => rows(minibus).has(t))
      expect(shared, 'the same paragraph appears on both V-Class pages').toEqual([])

      expect(chauffeur.solutions!.intro).not.toBe(minibus.solutions!.intro)
      expect(chauffeur.whyChoose!.heading).not.toEqual(minibus.whyChoose!.heading)
    })

    it('sends each page at the search its own category answers', () => {
      const chauffeurCopy = pageCopy('mercedes-v-class')
      const minibusCopy   = pageCopy('7-seater-mpv-v-class')

      expect(chauffeurCopy).toContain('chauffeur')
      expect(minibusCopy).toContain('minibus')
    })

    it('draws its band photos from the gallery on the page', () => {
      // A band photo that is not in the strip above it is a photo nobody has
      // looked at since it was pasted in.
      const gallery = new Set(vehicle('mercedes-v-class').images)
      for (const slug of WRITTEN) {
        const content = VEHICLE_CONTENT[slug]
        for (const { src } of content.solutions!.carousel) {
          expect(gallery, `${slug}: carousel photo is not in the gallery`).toContain(src)
        }
        expect(gallery, `${slug}: band photo is not in the gallery`).toContain(content.fleet!.image)
      }
    })

    it('keeps the band photo off the carousel, so the page is not one picture twice', () => {
      for (const slug of WRITTEN) {
        const content = VEHICLE_CONTENT[slug]
        const carousel = content.solutions!.carousel.map(({ src }) => src)
        expect(carousel, `${slug}: the band repeats a carousel slide`)
          .not.toContain(content.fleet!.image)
      }
    })
  })
})
