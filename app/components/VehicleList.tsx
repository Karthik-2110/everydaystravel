import Image from 'next/image'
import Link from 'next/link'
import { Check, ArrowRight, Users, Briefcase } from 'lucide-react'
import { WhatsAppIcon, WHATSAPP_HREF } from './icons/social'
import type { Vehicle } from '../data/fleet'

// The fleet data lives in `app/data/fleet.ts`. These re-exports keep the many
// existing `from './VehicleList'` import sites working — new code should import
// from the data module directly.
export type { Vehicle, FleetCategory } from '../data/fleet'
export {
  CHAUFFEUR_CARS,
  LUXURY_MINIBUSES,
  EXECUTIVE_COACHES,
  FLEET_CATEGORIES,
  ALL_VEHICLE_OPTIONS,
} from '../data/fleet'

interface VehicleListProps {
  vehicles:  Vehicle[]
  heading?:  string
  subtext?:  string
  category?: string  // e.g. 'chauffeur-cars' — used to build detail page URLs
}

// ── Card ──────────────────────────────────────────────────────────────────────

function VehicleCard({ vehicle, category }: { vehicle: Vehicle; category?: string }) {
  const detailHref = category ? `/fleet/${category}/${vehicle.slug}` : undefined

  return (
    <article className="group flex flex-col lg:flex-row bg-[#0D1221] rounded-2xl border border-white/[0.07] overflow-hidden transition-all duration-300 hover:border-[#EBBA6F]/40 hover:shadow-[0_0_0_1px_rgba(235,186,111,0.12),0_8px_40px_rgba(235,186,111,0.07)]">

      {/* Image */}
      <div className="relative w-full lg:w-[400px] lg:shrink-0 aspect-video lg:aspect-auto overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 bg-[#EBBA6F] text-[#0C0F1C] text-[11.5px] font-semibold rounded-full"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {vehicle.badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 lg:p-8 gap-5">

        {/* Name + specs */}
        <div>
          <h3
            className="text-white leading-[1] tracking-[-0.01em] mb-3"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.7rem, 2.4vw, 2.2rem)' }}
          >
            {vehicle.name}
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/70 text-[13.5px]" style={{ fontFamily: 'var(--font-ui)' }}>
              <Users size={14} strokeWidth={1.5} className="text-[#EBBA6F]" aria-hidden />
              {vehicle.seats}
            </div>
            <div className="w-px h-3.5 bg-white/20 shrink-0" />
            <div className="flex items-center gap-1.5 text-white/70 text-[13.5px]" style={{ fontFamily: 'var(--font-ui)' }}>
              <Briefcase size={14} strokeWidth={1.5} className="text-[#EBBA6F]" aria-hidden />
              {vehicle.luggage}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.08]" />

        {/* Description */}
        <p
          className="text-white/80 text-[15px] leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {vehicle.description}
        </p>

        {/* Features */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {vehicle.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check size={14} strokeWidth={2.5} className="text-[#EBBA6F] shrink-0 mt-[3px]" aria-hidden />
              <span className="text-white/75 text-[14px] leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* Ideal For + CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 mt-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/50 text-[12.5px] font-medium" style={{ fontFamily: 'var(--font-ui)' }}>
              Ideal for:
            </span>
            {vehicle.idealFor.map((tag) => (
              <span
                key={tag}
                className="text-[12.5px] text-white/75 border border-white/20 px-3 py-1 rounded-full"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {detailHref && (
              <Link
                href={detailHref}
                className="flex items-center gap-2 px-6 py-3 bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold rounded-full hover:bg-[#E2B36A] active:bg-[#D4A85E] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                View details
                <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
              </Link>
            )}
            {!detailHref && (
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-3 bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold rounded-full hover:bg-[#E2B36A] active:bg-[#D4A85E] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Get a Quote
                <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
              </Link>
            )}
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1FBB59] text-white text-[14px] font-medium rounded-full transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <WhatsAppIcon size={13} />
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </article>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VehicleList({ vehicles, heading = 'Our vehicles', subtext, category }: VehicleListProps) {
  return (
    <section className="bg-[#0C0F1C]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">

        {(heading || subtext) && (
          <div className="mb-12 lg:mb-16 flex flex-col items-center text-center">
            <h2
              className="text-white leading-[0.93] tracking-[-0.02em] mb-4"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              {heading}
            </h2>
            {subtext && (
              <p
                className="text-white/45 text-[15px] leading-relaxed max-w-[520px]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {subtext}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-5">
          {vehicles.map((v) => (
            <VehicleCard key={v.name} vehicle={v} category={category} />
          ))}
        </div>

      </div>
    </section>
  )
}
