import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CHAUFFEUR_CARS, LUXURY_MINIBUSES, EXECUTIVE_COACHES, type Vehicle } from '../components/VehicleList'
import { SERVICES } from '../components/ServiceList'

// ── Gallery data ──────────────────────────────────────────────────────────────
// Tiles are collected from the fleet & service data, so new photos added there
// appear here automatically. Placeholder images are excluded.

interface GalleryItem {
  src:   string
  label: string
  href:  string
}

const HERO_SHOTS: GalleryItem[] = [
  { src: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783784686/DSC09063_xjmaio.jpg', label: 'Our Fleet', href: '/fleet' },
  { src: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783783988/DSC09031_yjmhzx.jpg', label: 'Our Fleet', href: '/fleet' },
  { src: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783785511/IMG_6138_n9khty.jpg', label: 'Our Fleet', href: '/fleet' },
  { src: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783784630/20260211_134438550_iOS_okfp39.jpg', label: 'Airport Transfers', href: '/services/airport-transfers' },
]

// Serve grid-sized thumbnails regardless of the stored transform width
const thumb = (url: string) => url.replace(/w_\d+/, 'w_800')

function collectGallery(): GalleryItem[] {
  const items: GalleryItem[] = []
  const seen = new Set<string>()

  const push = (src: string, label: string, href: string) => {
    if (src.includes('dckyndryf')) return            // placeholder image
    const key = src.split('/').pop() ?? src          // dedupe by filename across transforms
    if (seen.has(key)) return
    seen.add(key)
    items.push({ src, label, href })
  }

  HERO_SHOTS.forEach(({ src, label, href }) => push(src, label, href))

  const categories: [Vehicle[], string][] = [
    [CHAUFFEUR_CARS,    'chauffeur-cars'],
    [LUXURY_MINIBUSES,  'luxury-minibuses'],
    [EXECUTIVE_COACHES, 'executive-coaches'],
  ]
  for (const [vehicles, category] of categories) {
    for (const v of vehicles) {
      for (const src of v.images ?? [v.image]) push(src, v.name, `/fleet/${category}/${v.slug}`)
    }
  }
  for (const s of SERVICES) {
    for (const src of s.images ?? [s.image]) push(src, s.name, `/services/${s.slug}`)
  }

  return items
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const items = collectGallery()

  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-20 lg:pb-24">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-14">
          <p
            className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Gallery
          </p>
          <h1
            className="text-white leading-[0.93] tracking-[-0.02em] mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
          >
            Our vehicles &amp; journeys
          </h1>
          <p
            className="text-white/45 text-[15px] leading-relaxed max-w-[480px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            A look at the fleet, the destinations, and the journeys in between.
          </p>
        </div>

        {/* Instagram-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {items.map(({ src, label, href }) => (
            <Link
              key={src}
              href={href}
              aria-label={label}
              className="group relative aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-[#0D1221]"
            >
              <Image
                src={thumb(src)}
                alt={label}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span
                className="absolute bottom-3 left-3 right-3 text-white text-[12.5px] font-medium opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  )
}
