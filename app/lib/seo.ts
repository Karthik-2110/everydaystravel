import type { Metadata } from 'next'

export const siteUrl = 'https://everydaystravel.co.uk'

/**
 * A stable identifier for the business entity. Every page links its schema back
 * to this one node, so Google merges the graph into a single organisation
 * rather than reading each page as a separate business.
 */
export const organisationId = `${siteUrl}/#organisation`

/** Depot coordinates (TW13 7NB). Keep in step with the Google Business Profile pin. */
const latitude = 51.4468
const longitude = -0.4137

/**
 * The date the page content last changed, not the date of the last deploy.
 * A lastmod that moves on every build is a freshness signal crawlers discount.
 */
export const contentUpdated = '2026-09-22'

type PageMetadataInput = {
  title: string
  description: string
  path: string
}

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const fullTitle = `${title} | Everydays Travel`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: path,
      // The site is British English only, so en-GB doubles as the default.
      languages: { 'en-GB': path, 'x-default': path },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Everydays Travel',
    },
  }
}

type ServiceSchemaInput = Omit<PageMetadataInput, 'title'> & {
  name: string
  category: string
}

export function serviceSchema({ name, description, path, category }: ServiceSchemaInput) {
  const absoluteUrl = `${siteUrl}${path}`

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name,
      description,
      url: absoluteUrl,
      // Reference rather than repeat, so this resolves to the one business node.
      provider: { '@id': organisationId },
      areaServed: ['London', 'Greater London', 'Surrey', 'United Kingdom'],
      inLanguage: 'en-GB',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category,
          item: `${siteUrl}${path.split('/').slice(0, -1).join('/')}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name,
          item: absoluteUrl,
        },
      ],
    },
  ]
}

const serviceNames = [
  'Luxury minibus hire with driver',
  'Mercedes-Benz 16-seater minibus',
  'Large coach hire London',
  'Luxury mini coach hire',
  'Chauffeur-driven Mercedes-Benz',
  'Wedding coach hire London',
  'Corporate events transport',
  'Business meeting chauffeur',
  'Airport transfers London',
  'Port transfers UK',
  'Guided London tours',
  'Private UK sightseeing tours',
  'Windsor Castle coach tour',
  'Stonehenge minibus tour',
  'European coach tours (Paris, Prague)',
  'Vineyard wine tasting tours',
  'Blue Badge Tour Guides London',
  'Cheap luxury minibus hire',
  'Affordable sightseeing tour packages',
  'Group travel specialist London',
]

export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'TransportationService',
  '@id': organisationId,
  name: 'Everydays Travel',
  alternateName: 'Everydays Luxury Travel',
  url: siteUrl,
  email: 'info@everydaystravel.co.uk',
  telephone: '+442089418354',
  logo: `${siteUrl}/images/everyday_logo.avif`,
  image: `${siteUrl}/images/hero.JPG`,
  description:
    'Everydays Travel provides luxury coach, minibus and chauffeur-driven travel for group journeys, airport transfers, corporate events, weddings and private tours across London, Surrey, the UK and Europe.',
  knowsLanguage: 'en-GB',
  priceRange: '££',
  currenciesAccepted: 'GBP',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'The Reeves, Snakey Lane',
    addressLocality: 'Feltham',
    addressRegion: 'Greater London',
    postalCode: 'TW13 7NB',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude,
    longitude,
  },
  // Roughly 60 miles — the radius the fleet covers for a same-day return journey.
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    },
    geoRadius: '96000',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '08:00',
      closes: '16:00',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'London' },
    { '@type': 'AdministrativeArea', name: 'Greater London' },
    { '@type': 'AdministrativeArea', name: 'Surrey' },
    { '@type': 'AdministrativeArea', name: 'Middlesex' },
    { '@type': 'AdministrativeArea', name: 'Berkshire' },
    { '@type': 'AdministrativeArea', name: 'Buckinghamshire' },
    { '@type': 'City', name: 'Sunbury-on-Thames' },
    { '@type': 'City', name: 'Richmond' },
    { '@type': 'City', name: 'Hampton' },
    { '@type': 'City', name: 'Twickenham' },
    { '@type': 'City', name: 'Feltham' },
    // Named separately from the towns: airport transfers are searched by airport.
    { '@type': 'Airport', name: 'Heathrow Airport', iataCode: 'LHR' },
    { '@type': 'Airport', name: 'Gatwick Airport', iataCode: 'LGW' },
    { '@type': 'Airport', name: 'Stansted Airport', iataCode: 'STN' },
    { '@type': 'Airport', name: 'Luton Airport', iataCode: 'LTN' },
    { '@type': 'Airport', name: 'London City Airport', iataCode: 'LCY' },
    { '@type': 'Country', name: 'United Kingdom' },
  ],
  sameAs: [
    'https://www.instagram.com/everydaystravel/',
    'https://www.facebook.com/p/Everydays-Luxury-Travel-100063491714841/',
    'https://www.linkedin.com/company/everydays-travel-limited/',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Everydays Travel services',
    itemListElement: serviceNames.map((name) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name,
      },
    })),
  },
}

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Everydays Travel',
  alternateName: 'Everydays Luxury Travel',
  url: siteUrl,
  inLanguage: 'en-GB',
  publisher: { '@id': organisationId },
}

export const sitemapEntries = [
  { path: '/', priority: 1 },
  { path: '/fleet', priority: 0.9 },
  { path: '/fleet/luxury-minibuses', priority: 0.9 },
  { path: '/fleet/executive-coaches', priority: 0.9 },
  { path: '/fleet/chauffeur-cars', priority: 0.8 },
  { path: '/services', priority: 0.9 },
  { path: '/services/airport-transfers', priority: 0.9 },
  { path: '/services/corporate', priority: 0.9 },
  { path: '/services/weddings-events', priority: 0.9 },
  { path: '/services/group-travel', priority: 0.9 },
  { path: '/services/cruise-port-transfers', priority: 0.8 },
  { path: '/services/executive-travel', priority: 0.8 },
  { path: '/services/private-hire', priority: 0.8 },
  { path: '/services/school-trips', priority: 0.8 },
  { path: '/services/sports-team-travel', priority: 0.8 },
  { path: '/about', priority: 0.7 },
  { path: '/contact', priority: 0.7 },
  { path: '/gallery', priority: 0.6 },
  { path: '/reviews', priority: 0.6 },
  { path: '/book', priority: 0.7 },
  { path: '/fleet/luxury-minibuses/7-seater-mpv-v-class', priority: 0.7 },
  { path: '/fleet/luxury-minibuses/16-seater-minibus', priority: 0.8 },
  { path: '/fleet/luxury-minibuses/16-seater-vip-sprinter', priority: 0.8 },
  { path: '/fleet/luxury-minibuses/19-seater-minibus', priority: 0.7 },
  { path: '/fleet/executive-coaches/35-seater-turas-midi', priority: 0.7 },
  { path: '/fleet/executive-coaches/49-seater-mercedes-turismo', priority: 0.7 },
  { path: '/fleet/executive-coaches/53-seater-coach', priority: 0.8 },
  { path: '/fleet/executive-coaches/55-seater-neoplan-tourliner', priority: 0.8 },
  { path: '/fleet/chauffeur-cars/lamborghini-huracan', priority: 0.6 },
  { path: '/fleet/chauffeur-cars/bmw-x7', priority: 0.7 },
  { path: '/fleet/chauffeur-cars/mercedes-e-class', priority: 0.7 },
  { path: '/fleet/chauffeur-cars/mercedes-s-class', priority: 0.8 },
  { path: '/fleet/chauffeur-cars/mercedes-v-class', priority: 0.8 },
].map(({ path, priority }) => ({ url: `${siteUrl}${path}`, priority }))
