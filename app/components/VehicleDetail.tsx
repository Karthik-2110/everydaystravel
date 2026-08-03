import Image from 'next/image'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft, ArrowUpRight,
  Armchair, EyeOff, Wind, Flame, Zap, Droplets,
  Wifi, Volume2, Lightbulb, DoorOpen, Maximize2,
  Briefcase, GlassWater, MonitorPlay, Speaker,
  Accessibility, ShieldCheck, UserCheck, Star,
  Plane, Heart, Car, CalendarDays, Users, GraduationCap,
  Trophy, Globe, Compass, Building2, Clock, Ship,
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import VehicleBookingForm from './VehicleBookingForm'
import VehicleImageGallery from './VehicleImageGallery'
import type { Vehicle } from './VehicleList'

const STARS_IMG = 'https://res.cloudinary.com/dckyndryf/image/upload/v1780237231/stars-5_w1ckxp.svg'

// ── Feature icon mapping ──────────────────────────────────────────────────────

function featureIcon(text: string): LucideIcon {
  const f = text.toLowerCase()
  // Service-specific keywords — checked first so they win over generic matches
  if (f.includes('flight') || f.includes('airport') || f.includes('cruise') || f.includes('port')) return Plane
  if (f.includes('meet & greet') || f.includes('greet') || f.includes('coordinator'))  return UserCheck
  if (f.includes('seatbelt') || f.includes('dbs') || f.includes('risk') || f.includes('safe')) return ShieldCheck
  if (f.includes('24/7') || f.includes('punctual') || f.includes('on time') || f.includes('schedul') || f.includes('waiting')) return Clock
  if (f.includes('ribbon') || f.includes('decorat') || f.includes('red carpet') || f.includes('bridal')) return Heart
  if (f.includes('itinerar') || f.includes('route') || f.includes('door-to-door') || f.includes('europe')) return Compass
  if (f.includes('kit') || f.includes('equipment'))                                    return Briefcase
  if (f.includes('leather') || f.includes('seat') || f.includes('reclining')) return Armchair
  if (f.includes('privacy glass') || f.includes('tinted'))                     return EyeOff
  if (f.includes('climate') || f.includes('air con') || f.includes('temperature')) return Wind
  if (f.includes('heat'))                                                       return Flame
  if (f.includes('usb') || f.includes('charg') || f.includes('12v') || f.includes('240v')) return Zap
  if (f.includes('water') || f.includes('bottle'))                             return Droplets
  if (f.includes('champagne') || f.includes('drink') || f.includes('refreshment')) return GlassWater
  if (f.includes('wifi') || f.includes('wi-fi') || f.includes('internet'))    return Wifi
  if (f.includes('bluetooth') || f.includes('audio') || f.includes('music'))  return Volume2
  if (f.includes('entertainment') || f.includes('monitor') || f.includes('screen')) return MonitorPlay
  if (f.includes('ambient') || f.includes('light') || f.includes('lamp'))     return Lightbulb
  if (f.includes('door'))                                                       return DoorOpen
  if (f.includes('legroom') || f.includes('extended') || f.includes('spacious')) return Maximize2
  if (f.includes('luggage') || f.includes('hold'))                             return Briefcase
  if (f.includes('pa ') || f.includes('speaker'))                              return Speaker
  if (f.includes('wheelchair') || f.includes('accessible'))                   return Accessibility
  if (f.includes('concierge') || f.includes('bespoke'))                       return Star
  if (f.includes('driver') || f.includes('uniformed'))                        return UserCheck
  if (f.includes('privacy') || f.includes('shield') || f.includes('insured')) return ShieldCheck
  return Wind
}

function idealForIcon(tag: string): LucideIcon {
  const t = tag.toLowerCase()
  if (t.includes('airport'))                              return Plane
  if (t.includes('wedding'))                             return Heart
  if (t.includes('corporate') || t.includes('business')) return Building2
  if (t.includes('vip') || t.includes('private hire'))   return Star
  if (t.includes('private'))                             return Car
  if (t.includes('event') || t.includes('concert'))     return CalendarDays
  if (t.includes('family'))                              return Users
  if (t.includes('school') || t.includes('education'))  return GraduationCap
  if (t.includes('sport') || t.includes('team') || t.includes('fixture') || t.includes('tournament')) return Trophy
  if (t.includes('cruise'))                              return Ship
  if (t.includes('occasion') || t.includes('prom'))     return Star
  if (t.includes('tour') || t.includes('europe'))       return Globe
  if (t.includes('away') || t.includes('day'))          return Compass
  if (t.includes('group'))                              return Users
  return Briefcase
}

// ── Explore card (ServicesGrid style — square, full-bleed) ────────────────────

function ExploreCard({ vehicle, href, cta }: { vehicle: Vehicle; href: string; cta: string }) {
  return (
    <Link
      href={href}
      className="group relative block w-full overflow-hidden rounded-2xl border border-white/[0.07] hover:border-[#EBBA6F]/35 transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(235,186,111,0.12),0_16px_48px_rgba(0,0,0,0.5)]"
      style={{ aspectRatio: '1 / 1' }}
    >
      <Image
        src={vehicle.image}
        alt={vehicle.name}
        fill
        unoptimized
        sizes="(max-width: 640px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/95 via-[#04060E]/40 to-[#04060E]/10" />

      {/* Badge */}
      <div className="absolute top-4 left-4">
        <span
          className="px-2.5 py-0.5 bg-[#EBBA6F] text-[#0C0F1C] text-[10.5px] font-semibold rounded-full"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {vehicle.badge}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-1.5">
        <h3
          className="text-white leading-[0.95] tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)' }}
        >
          {vehicle.name}
        </h3>
        <p className="text-white/50 text-[12px]" style={{ fontFamily: 'var(--font-ui)' }}>
          {vehicle.seats}
        </p>
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="text-[#EBBA6F] text-[12px] font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
            {cta}
          </span>
          <ArrowUpRight
            size={12}
            className="text-[#EBBA6F] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

interface VehicleDetailProps {
  vehicle:       Vehicle
  category:      string
  categoryLabel: string
  otherVehicles: Vehicle[]
  popular?:      boolean
  hrefBase?:         string   // base path for breadcrumb & explore links
  exploreHeading?:   string
  cardCta?:          string
  preselectVehicle?: boolean  // false for pages (e.g. services) not tied to one vehicle
}

export default function VehicleDetail({
  vehicle, category, categoryLabel, otherVehicles, popular = true,
  hrefBase, exploreHeading = 'Explore other vehicles', cardCta = 'View vehicle',
  preselectVehicle = true,
}: VehicleDetailProps) {
  const base = hrefBase ?? `/fleet/${category}`

  // Real gallery photos when available, otherwise 4 placeholder slots
  const galleryImages = vehicle.images?.length
    ? vehicle.images
    : [vehicle.image, vehicle.image, vehicle.image, vehicle.image]

  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-0">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href={base}
            className="flex items-center gap-1.5 text-white/40 text-[12.5px] hover:text-white/70 transition-colors duration-150"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            <ArrowLeft size={13} aria-hidden />
            {categoryLabel}
          </Link>
          <span className="text-white/20 text-[12px]">/</span>
          <span className="text-white/50 text-[12.5px] truncate" style={{ fontFamily: 'var(--font-ui)' }}>
            {vehicle.name}
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 lg:gap-10 items-start">

          {/* ── Left column ── */}
          <div className="flex flex-col">

            {/* 1. Interactive gallery */}
            <VehicleImageGallery images={galleryImages} vehicleName={vehicle.name} />

            {/* 2. Title + stars + badge */}
            <div className="mt-7 mb-3">
              <h1
                className="text-white leading-[0.92] tracking-[-0.02em] mb-4"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
              >
                {vehicle.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <img src={STARS_IMG} alt="5 stars" className="h-[18px] w-auto" />
                <span className="text-white/40 text-[12.5px]" style={{ fontFamily: 'var(--font-ui)' }}>
                  4.4 · Trustpilot
                </span>
                {popular && (
                  <span
                    className="px-2.5 py-0.5 bg-[#EBBA6F]/15 text-[#EBBA6F] text-[11px] font-semibold rounded-full border border-[#EBBA6F]/25"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Most Popular
                  </span>
                )}
                <span
                  className="px-2.5 py-0.5 bg-white/[0.06] text-white/50 text-[11px] rounded-full border border-white/10"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {vehicle.badge}
                </span>
              </div>
            </div>

            {/* 3. Description */}
            <p
              className="text-white/65 text-[15px] leading-relaxed mb-7 line-clamp-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {vehicle.description}
            </p>

            {/* 4. Amenities */}
            <div className="mb-7">
              <h2
                className="text-white mb-5 tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.5rem, 2vw, 2rem)' }}
              >
                Features &amp; Amenities
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {vehicle.features.map((f) => {
                  const Icon = featureIcon(f)
                  return (
                    <li key={f} className="flex items-center gap-3.5">
                      <Icon
                        size={20}
                        strokeWidth={1.3}
                        className="text-[#EBBA6F] shrink-0"
                        aria-hidden
                      />
                      <span
                        className="text-white text-[15px] leading-snug"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {f}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* 5. Preferred for */}
            <div className="mb-10">
              <h2
                className="text-white mb-5 tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.5rem, 2vw, 2rem)' }}
              >
                Preferred for
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {vehicle.idealFor.map((tag) => {
                  const Icon = idealForIcon(tag)
                  return (
                    <li key={tag} className="flex items-center gap-3.5">
                      <Icon
                        size={20}
                        strokeWidth={1.3}
                        className="text-[#EBBA6F] shrink-0"
                        aria-hidden
                      />
                      <span
                        className="text-white text-[15px] leading-snug"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {tag}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>


          </div>

          {/* ── Right: sticky booking form ── */}
          <div className="lg:sticky lg:top-24 lg:self-start pb-10">
            <VehicleBookingForm defaultVehicleSlug={preselectVehicle ? vehicle.slug : undefined} />
          </div>

        </div>
      </main>

      {/* ── Explore other vehicles ── */}
      {otherVehicles.length > 0 && (
        <section className="bg-[#0C0F1C] border-t border-white/[0.05]">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-24">

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-12">
              <h2
                className="text-white leading-[0.93] tracking-[-0.02em] mb-3"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
              >
                {exploreHeading}
              </h2>
              <Link
                href={base}
                className="text-[#EBBA6F]/60 text-[13px] hover:text-[#EBBA6F] transition-colors duration-150 mt-2"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                View all {categoryLabel.toLowerCase()} →
              </Link>
            </div>

            {/* Cards — same square style as ServicesGrid */}
            <div className={`grid gap-5 ${
              otherVehicles.length === 1
                ? 'grid-cols-1 max-w-[360px] mx-auto'
                : otherVehicles.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-[760px] mx-auto'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {otherVehicles.map((v) => (
                <ExploreCard key={v.slug} vehicle={v} href={`${base}/${v.slug}`} cta={cardCta} />
              ))}
            </div>

          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
