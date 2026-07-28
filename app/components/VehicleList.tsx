import Image from 'next/image'
import Link from 'next/link'
import { Check, MessageCircle, ArrowRight, Users, Briefcase } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Vehicle {
  slug:        string
  name:        string
  badge:       string
  image:       string
  seats:       string
  luggage:     string
  description: string
  features:    string[]
  idealFor:    string[]
}

interface VehicleListProps {
  vehicles:  Vehicle[]
  heading?:  string
  subtext?:  string
  category?: string  // e.g. 'chauffeur-cars' — used to build detail page URLs
}

// ── Placeholder ───────────────────────────────────────────────────────────────

const PH = 'https://res.cloudinary.com/dckyndryf/image/upload/f_auto,q_auto,w_900,c_limit/IMG_0938_fhylhh'

// ── Data ──────────────────────────────────────────────────────────────────────

export const CHAUFFEUR_CARS: Vehicle[] = [
  {
    slug:        'lamborghini-huracan',
    name:        'Lamborghini Huracán',
    badge:       'Supercar',
    image:       PH,
    seats:       '1–2 Passengers',
    luggage:     'Soft bags only',
    description: 'An unforgettable arrival. The Huracán pairs breathtaking performance with head-turning Italian design — for the moments that deserve a grand entrance.',
    features:    ['V10 performance', 'Alcantara sport seats', 'Carbon-fibre interior detailing', 'Dual-zone climate control', 'Premium audio system', 'Professional chauffeur included'],
    idealFor:    ['Weddings', 'Proms', 'Special Occasions'],
  },
  {
    slug:        'bmw-x7',
    name:        'BMW X7',
    badge:       'Luxury SUV',
    image:       PH,
    seats:       '1–6 Passengers',
    luggage:     '4 large + 2 medium cases',
    description: 'BMW’s flagship SUV blends commanding presence with first-class comfort — generous space for passengers and luggage without compromising refinement.',
    features:    ['Heated leather comfort seats', 'Panoramic glass roof', 'Four-zone climate control', 'Ambient interior lighting', 'USB & wireless charging', 'Bottled water provided'],
    idealFor:    ['Airport Transfers', 'Corporate Travel', 'Family Travel'],
  },
  {
    slug:        'mercedes-e-class',
    name:        'Mercedes-Benz E-Class Executive',
    badge:       'Executive',
    image:       PH,
    seats:       '1–3 Passengers',
    luggage:     '2 large + 2 medium cases',
    description: 'The E-Class Executive makes sophistication effortless. Premium climate control, a whisper-quiet ride, and a refined interior designed for discerning passengers.',
    features:    ['Premium black leather reclining seats', 'Privacy glass', 'Dual-zone climate control', 'Heated seats', 'USB ports & 12v charging points', 'Bottled water provided'],
    idealFor:    ['Corporate Travel', 'Airport Transfers'],
  },
  {
    slug:        'mercedes-s-class',
    name:        'Mercedes-Benz S-Class Executive',
    badge:       'Executive',
    image:       PH,
    seats:       '1–2 Passengers',
    luggage:     '2 large + 2 medium cases',
    description: 'The ultimate luxury vehicle, offering prestige, comfort and refinement for airport transfers, corporate events and private travel.',
    features:    ['Plush black leather reclining seats', 'Tinted privacy glass', 'Luxury ambient interior lighting', 'Soft-close doors', 'Champagne cooler', 'Bespoke concierge service'],
    idealFor:    ['VIP Clients', 'Weddings', 'Private Hire'],
  },
  {
    slug:        'mercedes-v-class',
    name:        'Mercedes-Benz V-Class Executive',
    badge:       'Executive MPV',
    image:       PH,
    seats:       '1–6 Passengers',
    luggage:     '6 large + 4 small cases',
    description: 'A spacious MPV ideal for small groups or families, with luxurious flexible seating and ample room for luggage and refined travel.',
    features:    ['Luxury black leather reclining seats', 'Privacy audio & rear entertainment', 'Bluetooth audio & rear climate control', 'Dark privacy glass', 'Extended legroom', 'USB charging for all seats'],
    idealFor:    ['Airport Transfers', 'Events', 'Family Travel'],
  },
]

export const LUXURY_MINIBUSES: Vehicle[] = [
  {
    slug:        '8-seater-minibus',
    name:        '8-Seater Executive Minibus',
    badge:       'Minibus',
    image:       PH,
    seats:       'Up to 8 Passengers',
    luggage:     '8 standard cases',
    description: 'Our 8-seater executive minibus offers a premium group transfer experience, combining generous legroom with a smooth and professional ride.',
    features:    ['Leather seating throughout', 'Air conditioning', 'USB charging points', 'Tinted privacy windows', 'Onboard WiFi', 'Professional uniformed driver'],
    idealFor:    ['Corporate Groups', 'Airport Transfers', 'Private Hire'],
  },
  {
    slug:        '12-seater-minibus',
    name:        '12-Seater Luxury Minibus',
    badge:       'Minibus',
    image:       PH,
    seats:       'Up to 12 Passengers',
    luggage:     '12 standard cases',
    description: 'Perfect for medium-sized groups, our 12-seater offers the comfort and style expected of Everyday Travels, with ample storage for longer journeys.',
    features:    ['Reclining leather seats', 'Panoramic windows', 'Climate control', 'USB & 12v charging', 'Luggage hold', 'PA system available'],
    idealFor:    ['Events', 'School Trips', 'Group Travel'],
  },
  {
    slug:        '16-seater-minibus',
    name:        '16-Seater Sprinter',
    badge:       'Minibus',
    image:       PH,
    seats:       'Up to 16 Passengers',
    luggage:     '16 standard cases',
    description: 'Our flagship minibus seats up to 16 in comfort. Ideal for larger groups requiring a premium experience without the scale of a full coach.',
    features:    ['Individual reclining seats', 'Onboard WiFi', 'Entertainment system', 'Air conditioning throughout', 'Central luggage hold', 'Wheelchair-accessible option'],
    idealFor:    ['Weddings', 'Sports Teams', 'Corporate Events'],
  },
  {
    slug:        '16-seater-vip-sprinter',
    name:        '16-Seater VIP Sprinter',
    badge:       'VIP',
    image:       PH,
    seats:       'Up to 16 Passengers',
    luggage:     '16 standard cases',
    description: 'The VIP Sprinter elevates group travel to first class — luxury captain seats, mood lighting and onboard entertainment for journeys that feel like an event in themselves.',
    features:    ['Luxury captain seats', 'Ambient mood lighting', 'Onboard WiFi', 'Entertainment system with screens', 'Climate control throughout', 'Privacy glass'],
    idealFor:    ['VIP Clients', 'Corporate Events', 'Special Occasions'],
  },
]

export const EXECUTIVE_COACHES: Vehicle[] = [
  {
    slug:        '33-seater-coach',
    name:        '33-Seater Executive Coach',
    badge:       'Coach',
    image:       PH,
    seats:       'Up to 33 Passengers',
    luggage:     'Large underfloor hold',
    description: 'A mid-size executive coach delivering the same premium standard as our larger fleet. Ideal for corporate away-days, tours, and medium group travel.',
    features:    ['Reclining seats with headrests', 'Onboard WiFi', 'USB charging at every seat', 'Climate control', 'Onboard WC', 'PA & entertainment system'],
    idealFor:    ['Corporate Away-Days', 'Tours', 'Airport Transfers'],
  },
  {
    slug:        '35-seater-turas-midi',
    name:        '35-Seater Turas Midi',
    badge:       'Midi Coach',
    image:       PH,
    seats:       'Up to 35 Passengers',
    luggage:     'Large underfloor hold',
    description: 'The Turas Midi punches above its size — a nimble mid-size coach with full executive specification, perfect when a full-size coach is more than you need.',
    features:    ['Reclining seats with headrests', 'Onboard WiFi', 'USB charging at every seat', 'Climate control', 'PA & entertainment system', 'Large luggage hold'],
    idealFor:    ['Corporate Away-Days', 'Tours', 'School Transport'],
  },
  {
    slug:        '49-seater-mercedes-turismo',
    name:        '49-Seater Mercedes Turismo',
    badge:       'Coach',
    image:       PH,
    seats:       'Up to 49 Passengers',
    luggage:     'Large underfloor hold',
    description: 'The Mercedes Turismo sets the benchmark for touring comfort — smooth, quiet and superbly appointed for long-distance group travel across the UK and Europe.',
    features:    ['Individual reclining seats', 'Onboard WiFi', 'USB & 240v charging', 'Air conditioning', 'Onboard WC', 'Entertainment system'],
    idealFor:    ['Group Tours', 'Sports Teams', 'Corporate Events'],
  },
  {
    slug:        '53-seater-coach',
    name:        '53-Seater Mercedes Turismo',
    badge:       'Coach',
    image:       PH,
    seats:       'Up to 53 Passengers',
    luggage:     'Large underfloor hold',
    description: 'Our most popular coach, trusted by sports clubs, schools, and event organisers across the UK. Premium comfort for large groups on any route.',
    features:    ['Individual reclining seats', 'Onboard WiFi', 'USB & 240v charging', 'Air conditioning', 'Onboard WC & refreshment area', 'Luggage hold with easy access'],
    idealFor:    ['Sports Teams', 'School Trips', 'Events & Concerts'],
  },
  {
    slug:        '55-seater-neoplan-tourliner',
    name:        '55-Seater Neoplan Tourliner',
    badge:       'Coach',
    image:       PH,
    seats:       'Up to 55 Passengers',
    luggage:     'Large underfloor hold',
    description: 'Our largest coach — the flagship Neoplan Tourliner carries up to 55 passengers in premium comfort, ideal for major events, tours and cruise transfers.',
    features:    ['Individual reclining seats', 'Onboard WiFi', 'USB & 240v charging', 'Climate control throughout', 'Onboard WC & refreshment area', 'Easy-access luggage hold'],
    idealFor:    ['Events & Concerts', 'Cruise Port Transfers', 'Group Tours'],
  },
]

// ── All vehicles flat list (for booking form dropdown) ────────────────────────

export const ALL_VEHICLE_OPTIONS = [
  { group: 'Chauffeur Cars',     vehicles: CHAUFFEUR_CARS },
  { group: 'Luxury Minibuses',   vehicles: LUXURY_MINIBUSES },
  { group: 'Executive Coaches',  vehicles: EXECUTIVE_COACHES },
]

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
              href="https://wa.me/4402089418354"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white/80 text-[14px] font-medium rounded-full hover:border-[#EBBA6F]/50 hover:text-[#EBBA6F] transition-all duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <MessageCircle size={13} strokeWidth={1.5} aria-hidden />
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
