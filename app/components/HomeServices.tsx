import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { FLEET_CATEGORIES, PH } from '../data/fleet'
import { SERVICES } from './ServiceList'
import { AIRPORT_TRANSFER_IMAGES } from './ServicesGrid'

// The six services the homepage leads with, in the order people search for
// them. Names and links are resolved against the real service catalogue below,
// so a card can never point at a page that was never built — only the card copy
// lives here, kept shorter and plainer than the service page's own description.

const vehiclePhoto = (category: string, vehicle: string): string =>
  FLEET_CATEGORIES
    .find((c) => c.slug === category)
    ?.vehicles.find((v) => v.slug === vehicle)
    ?.image ?? PH

const PICKS: { slug: string; description: string; image: string }[] = [
  {
    slug:        'airport-transfers',
    description: 'Heathrow, Gatwick and every major UK airport. We track your flight, so we are waiting when you land.',
    image:       AIRPORT_TRANSFER_IMAGES[0],
  },
  {
    slug:        'corporate',
    description: 'Get the whole team to the meeting, conference or client site on time, and looking the part.',
    image:       vehiclePhoto('chauffeur-cars', 'mercedes-s-class'),
  },
  {
    slug:        'group-travel',
    description: 'Day trips and longer tours across the UK and Europe — one coach, one driver, the group together.',
    image:       vehiclePhoto('executive-coaches', '55-seater-neoplan-tourliner'),
  },
  {
    slug:        'weddings-events',
    description: 'Bridal cars and guest shuttles timed to the minute, so nobody arrives late to your day.',
    image:       vehiclePhoto('chauffeur-cars', 'mercedes-v-class'),
  },
  {
    slug:        'school-trips',
    description: 'DBS-checked drivers, a seatbelt on every seat, and coaches that arrive when the register says.',
    image:       vehiclePhoto('executive-coaches', '53-seater-coach'),
  },
  {
    slug:        'sports-team-travel',
    description: 'Match-day travel for clubs, with space for the kit and a driver who knows the fixture routine.',
    image:       vehiclePhoto('executive-coaches', '49-seater-mercedes-turismo'),
  },
]

export interface HomeService {
  slug:        string
  name:        string
  href:        string
  description: string
  image:       string
}

export const HOME_SERVICES: HomeService[] = PICKS.flatMap(({ slug, description, image }) => {
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) return []

  return [{
    slug,
    name: service.name,
    href: `/services/${slug}`,
    description,
    image,
  }]
})

// ── Card ────────────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: HomeService }) {
  return (
    <Link
      href={service.href}
      data-service-card
      className="group relative block overflow-hidden rounded-2xl"
      style={{ aspectRatio: '3/4' }}
    >
      <Image
        src={service.image}
        alt={service.name}
        fill
        unoptimized
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/95 via-[#04060E]/35 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <h3
          className="text-white leading-tight mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            fontSize:   'clamp(1.5rem, 2.2vw, 2rem)',
          }}
        >
          {service.name}
        </h3>
        <p
          className="text-white/55 text-[12.5px] mb-5 leading-snug"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {service.description}
        </p>
        {/* A span, not a nested link — the whole card is already the link. */}
        <span
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#0C0F1C] text-[12.5px] font-semibold rounded-full group-hover:bg-[#EBBA6F] transition-colors duration-200 select-none"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Explore
          <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden />
        </span>
      </div>
    </Link>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

export default function HomeServices() {
  return (
    <section className="bg-[#0C0F1C] pt-20 lg:pt-28 pb-10 lg:pb-14">
      <div className="site-container">

        {/* ── Header ── */}
        <div className="mb-10 lg:mb-12 text-center">
          <h2
            className="text-white leading-[0.93] tracking-[-0.02em] mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize:   'clamp(2.4rem, 5vw, 4.5rem)',
            }}
          >
            Coach hire for every kind of journey
          </h2>
          <p
            className="text-white/50 mx-auto max-w-[620px]"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(0.9rem, 1.3vw, 1.05rem)',
            }}
          >
            Tell us where you are going and we will match the right vehicle and
            driver. Coach and minibus hire across London, the South East and the
            rest of the UK.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {HOME_SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        {/* ── Closing call to action ── */}
        <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <p
            className="text-white/50 text-[15px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Not sure which you need?
          </p>
          <Link
            href="/book"
            className="h-12 px-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[15px] font-semibold hover:bg-[#DDA85E] active:bg-[#C8963E] transition-colors duration-150"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Get a free quote
            <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>

      </div>
    </section>
  )
}
