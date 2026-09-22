import { describe, expect, it } from 'vitest'
import {
  businessSchema,
  contentUpdated,
  createPageMetadata,
  serviceSchema,
  siteUrl,
  sitemapEntries,
  webSiteSchema,
} from '@/app/lib/seo'

describe('SEO configuration', () => {
  it('describes Everydays Travel as a London-area passenger transport business', () => {
    expect(businessSchema).toMatchObject({
      '@type': 'TransportationService',
      name: 'Everydays Travel',
      alternateName: 'Everydays Luxury Travel',
      areaServed: expect.arrayContaining([
        expect.objectContaining({ name: 'London' }),
        expect.objectContaining({ name: 'Surrey' }),
        expect.objectContaining({ name: 'Sunbury-on-Thames' }),
        expect.objectContaining({ name: 'Richmond' }),
        expect.objectContaining({ name: 'Hampton' }),
      ]),
    })
  })

  it('advertises the fleet and journey types the website supports', () => {
    expect(businessSchema.hasOfferCatalog.itemListElement).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ itemOffered: expect.objectContaining({ name: 'Luxury minibus hire with driver' }) }),
        expect.objectContaining({ itemOffered: expect.objectContaining({ name: 'Large coach hire London' }) }),
        expect.objectContaining({ itemOffered: expect.objectContaining({ name: 'Wedding coach hire London' }) }),
        expect.objectContaining({ itemOffered: expect.objectContaining({ name: 'Airport transfers London' }) }),
        expect.objectContaining({ itemOffered: expect.objectContaining({ name: 'Guided London tours' }) }),
      ]),
    )
  })

  it('exposes canonical URLs for the homepage and primary fleet and service pages', () => {
    expect(siteUrl).toBe('https://everydaystravel.co.uk')
    expect(sitemapEntries.map(({ url }) => url)).toEqual(
      expect.arrayContaining([
        `${siteUrl}/`,
        `${siteUrl}/fleet/luxury-minibuses`,
        `${siteUrl}/fleet/executive-coaches`,
        `${siteUrl}/services/airport-transfers`,
        `${siteUrl}/services/weddings-events`,
        `${siteUrl}/services/group-travel`,
      ]),
    )
  })

  it('creates route-specific canonical metadata for a local service page', () => {
    const metadata = createPageMetadata({
      title: 'Coach Hire in Sunbury-on-Thames',
      description: 'Luxury coach hire for group travel from Sunbury-on-Thames.',
      path: '/services/coach-hire-sunbury-on-thames',
    })

    expect(metadata.alternates?.canonical).toBe('/services/coach-hire-sunbury-on-thames')
    expect(metadata.openGraph?.url).toBe('/services/coach-hire-sunbury-on-thames')
  })

  it('creates service data with a canonical URL and a matching breadcrumb', () => {
    const schema = serviceSchema({
      name: 'Airport Transfers London',
      description: 'Airport transfers for groups travelling from London.',
      path: '/services/airport-transfers',
      category: 'Services',
    })

    expect(schema).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@type': 'Service',
          name: 'Airport Transfers London',
          url: `${siteUrl}/services/airport-transfers`,
        }),
        expect.objectContaining({
          '@type': 'BreadcrumbList',
          itemListElement: expect.arrayContaining([
            expect.objectContaining({ name: 'Services' }),
            expect.objectContaining({ name: 'Airport Transfers London' }),
          ]),
        }),
      ]),
    )
  })
})

describe('UK local search signals', () => {
  it('pins the business to its Feltham address with coordinates and a region', () => {
    expect(businessSchema).toMatchObject({
      '@id': `${siteUrl}/#organisation`,
      priceRange: '££',
      currenciesAccepted: 'GBP',
      address: expect.objectContaining({
        addressRegion: 'Greater London',
        addressCountry: 'GB',
        postalCode: 'TW13 7NB',
      }),
      geo: expect.objectContaining({
        '@type': 'GeoCoordinates',
        latitude: 51.4468,
        longitude: -0.4137,
      }),
    })
  })

  it('describes the radius it will travel from base', () => {
    expect(businessSchema.serviceArea).toMatchObject({
      '@type': 'GeoCircle',
      geoRadius: '96000',
      geoMidpoint: expect.objectContaining({ latitude: 51.4468, longitude: -0.4137 }),
    })
  })

  it('publishes the opening hours shown in the footer', () => {
    expect(businessSchema.openingHoursSpecification).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '07:00',
          closes: '19:00',
        }),
        expect.objectContaining({
          dayOfWeek: ['Saturday', 'Sunday'],
          opens: '08:00',
          closes: '16:00',
        }),
      ]),
    )
  })

  it('serves the named UK airports that drive transfer searches', () => {
    const airports = businessSchema.areaServed
      .filter((area) => area['@type'] === 'Airport')
      .map((area) => area.name)

    expect(airports).toEqual(
      expect.arrayContaining([
        'Heathrow Airport',
        'Gatwick Airport',
        'Stansted Airport',
        'Luton Airport',
        'London City Airport',
      ]),
    )
  })

  it('serves the home counties alongside Greater London', () => {
    const areas = businessSchema.areaServed.map((area) => area.name)
    expect(areas).toEqual(
      expect.arrayContaining(['Greater London', 'Surrey', 'Middlesex', 'Berkshire', 'Buckinghamshire']),
    )
  })

  it('declares British English on the business and the website', () => {
    expect(businessSchema.knowsLanguage).toBe('en-GB')
    expect(webSiteSchema.inLanguage).toBe('en-GB')
    expect(webSiteSchema.publisher).toEqual({ '@id': `${siteUrl}/#organisation` })
  })

  it('tells Google the pages target British English readers', () => {
    const metadata = createPageMetadata({
      title: 'Coach Hire London',
      description: 'Coach hire across London.',
      path: '/services/group-travel',
    })

    expect(metadata.alternates?.languages).toEqual({
      'en-GB': '/services/group-travel',
      'x-default': '/services/group-travel',
    })
  })
})

describe('sitemap freshness', () => {
  it('stamps every entry with the date the content last changed', () => {
    expect(contentUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isNaN(Date.parse(contentUpdated))) .toBe(false)
  })
})
