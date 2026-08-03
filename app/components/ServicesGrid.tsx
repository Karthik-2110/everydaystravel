import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ServiceItem {
  name:        string
  description: string
  image:       string
  href:        string
}

interface ServicesGridProps {
  services?:    ServiceItem[]
  heading?:     string
  subtext?:     string
  showKicker?:  boolean
}

// ── Default data ──────────────────────────────────────────────────────────────

const PLACEHOLDER = 'https://res.cloudinary.com/dckyndryf/image/upload/f_auto,q_auto,w_800,c_limit/IMG_0938_fhylhh'

// Real service photos — first is used on the card; extras for future service pages
export const AIRPORT_TRANSFER_IMAGES = [
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1200,c_limit/v1783787064/IMG_6170_fxbudt.jpg',
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1200,c_limit/v1783784630/20260211_134438550_iOS_okfp39.jpg',
]

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    name:        'Private Hire',
    description: 'Flexible transport for any occasion, from day trips to bespoke journeys across the UK.',
    image:       PLACEHOLDER,
    href:        '/services/private-hire',
  },
  {
    name:        'Corporate Travel',
    description: 'Executive transport for business — punctual, professional, and properly presented.',
    image:       PLACEHOLDER,
    href:        '/services/corporate',
  },
  {
    name:        'Weddings',
    description: 'Seamless guest and bridal transport so your day runs exactly as planned.',
    image:       PLACEHOLDER,
    href:        '/services/weddings-events',
  },
  {
    name:        'Airport Transfers',
    description: 'Reliable group airport travel to and from all major UK airports.',
    image:       AIRPORT_TRANSFER_IMAGES[0],
    href:        '/services/airport-transfers',
  },
  {
    name:        'Race Days & Events',
    description: 'Ascot, Cheltenham and all major events — we handle the logistics, you enjoy the day.',
    image:       PLACEHOLDER,
    href:        '/services/race-days',
  },
  {
    name:        'Tours (UK & Europe)',
    description: 'Day trips and extended tours across the UK and into Europe, fully catered to your group.',
    image:       PLACEHOLDER,
    href:        '/services/group-travel',
  },
]

// ── Card ──────────────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <Link
      href={service.href}
      className="group relative block w-full overflow-hidden rounded-2xl border border-white/[0.07] hover:border-[#EBBA6F]/35 transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(235,186,111,0.12),0_16px_48px_rgba(0,0,0,0.5)]"
      style={{ aspectRatio: '1 / 1' }}
    >
      {/* Image — fills entire card */}
      <Image
        src={service.image}
        alt={service.name}
        fill
        unoptimized
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* Gradient overlay — heavy at bottom, light at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/95 via-[#04060E]/40 to-[#04060E]/10" />

{/* Content — pinned to bottom */}
      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-2">
        <h3
          className="text-white leading-[0.95] tracking-[-0.01em]"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            fontSize:   '24px',
          }}
        >
          {service.name}
        </h3>

        <p
          className="text-white/55 text-[16px] leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {service.description}
        </p>

        <div className="flex items-center gap-1.5 pt-0.5">
          <span
            className="text-[#EBBA6F] text-[12px] font-medium"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Learn more
          </span>
          <ArrowUpRight
            size={13}
            className="text-[#EBBA6F] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ServicesGrid({
  services    = DEFAULT_SERVICES,
  heading     = 'What we offer',
  subtext     = 'We provide luxury coach, minibus, and executive travel services across London, the South East, and the UK for private, corporate, and official travel.',
  showKicker  = true,
}: ServicesGridProps) {
  return (
    <section className="bg-[#0C0F1C]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">

        {/* Header */}
        <div className="mb-12 lg:mb-16 flex flex-col items-center text-center">
          {showKicker && (
            <div className="inline-flex items-center gap-1.5 mb-4">
              <Sparkles size={14} strokeWidth={1} className="text-[#EBBA6F]" aria-hidden />
              <p
                className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.2em] uppercase"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Our services
              </p>
            </div>
          )}
          <h2
            className="text-white leading-[0.93] tracking-[-0.02em] mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize:   'clamp(2.4rem, 4.5vw, 4rem)',
            }}
          >
            {heading}
          </h2>
          <p
            className="text-white/50 text-[15px] leading-relaxed max-w-[560px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {subtext}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <ServiceCard key={service.href} service={service} />
          ))}
        </div>

      </div>
    </section>
  )
}
