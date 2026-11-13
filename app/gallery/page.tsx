import GalleryGrid, { type GalleryItem } from '../components/GalleryGrid'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CHAUFFEUR_CARS, LUXURY_MINIBUSES, EXECUTIVE_COACHES, type Vehicle } from '../components/VehicleList'
import { SERVICES } from '../components/ServiceList'
import { createPageMetadata } from '../lib/seo'

export const metadata = createPageMetadata({
  title: 'Fleet Gallery',
  description:
    'Photographs of the Everydays Travel fleet: luxury minibuses, executive coaches and chauffeur cars serving London, Surrey and the UK.',
  path: '/gallery',
})

// ── Gallery data ──────────────────────────────────────────────────────────────
// Tiles are collected from the fleet & service data, so new photos added there
// appear here automatically. Placeholder images are excluded.

const HERO_SHOTS: GalleryItem[] = [
  { kind: 'image', src: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783784686/DSC09063_xjmaio.jpg', label: 'Our Fleet', href: '/fleet' },
  { kind: 'image', src: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783783988/DSC09031_yjmhzx.jpg', label: 'Our Fleet', href: '/fleet' },
  { kind: 'image', src: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783785511/IMG_6138_n9khty.jpg', label: 'Our Fleet', href: '/fleet' },
  { kind: 'image', src: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783784630/20260211_134438550_iOS_okfp39.jpg', label: 'Airport Transfers', href: '/services/airport-transfers' },
]

function collectGallery(): GalleryItem[] {
  const items: GalleryItem[] = []
  const seen = new Set<string>()

  const push = (src: string, label: string, href: string) => {
    if (src.includes('dckyndryf')) return            // placeholder image
    const key = src.split('/').pop() ?? src          // dedupe by filename across transforms
    if (seen.has(key)) return
    seen.add(key)
    items.push({ kind: 'image', src, label, href })
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
      for (const video of v.videos ?? []) {
        if (seen.has(video.src)) continue
        seen.add(video.src)
        items.push({ kind: 'video', ...video, label: v.name, href: `/fleet/${category}/${v.slug}` })
      }
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

      <main className="site-container site-header-clearance pb-20 lg:pb-24">

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
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
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

        <GalleryGrid items={items} />

      </main>

      <Footer />
    </div>
  )
}
