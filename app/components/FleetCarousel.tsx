'use client'

import { useRef, useState, useCallback } from 'react'
import { Sparkles, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

const FLEET = [
  {
    name: '53 Seater Executive Coach',
    slug: 'executive-coach',
    features: ['Reclining seats', 'USB charging', 'Onboard WiFi'],
    image: '/images/hero.JPG',
    tag: 'Most popular',
  },
  {
    name: '33 Seater Luxury Coach',
    slug: 'luxury-coach',
    features: ['Air conditioning', 'USB charging', 'Panoramic windows'],
    image: '/images/hero.JPG',
    tag: null,
  },
  {
    name: '16 Seater Minibus',
    slug: 'executive-minibus',
    features: ['Climate control', 'USB charging', 'Extra legroom'],
    image: '/images/hero.JPG',
    tag: null,
  },
  {
    name: '8 Seater Executive Van',
    slug: 'luxury-van',
    features: ['Leather interior', 'USB charging', 'Onboard WiFi'],
    image: '/images/hero.JPG',
    tag: null,
  },
]

export default function FleetCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const handleScroll = useCallback(() => {
    const el = carouselRef.current
    if (!el) return
    setAtStart(el.scrollLeft < 8)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8)
  }, [])

  const scroll = (dir: 'prev' | 'next') => {
    const el = carouselRef.current
    if (!el) return
    const card = el.querySelector('[data-fleet-card]') as HTMLElement | null
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' })
  }

  return (
    <section className="bg-[#0C0F1C] py-20 lg:py-28 overflow-hidden">

      {/* ── Header ── */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 mb-10 lg:mb-12 text-center">

        {/* Kicker */}
        <div className="inline-flex items-center gap-2 mb-5">
          <Sparkles size={12} className="text-[#EBBA6F]" aria-hidden />
          <span
            className="text-[#EBBA6F] text-[11px] font-medium tracking-[0.18em] uppercase"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Must see
          </span>
        </div>

        <h2
          className="text-white leading-[0.93] tracking-[-0.02em] mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
          }}
        >
          Our luxury coach fleet
        </h2>

        <p
          className="text-white/50 mb-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
          }}
        >
          Explore our popular fleet options
        </p>

      </div>

      {/* ── Carousel track + overlay arrows ── */}
      <div className="relative">

        {/* Left arrow */}
        <button
          onClick={() => scroll('prev')}
          disabled={atStart}
          aria-label="Previous vehicle"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-[#0C0F1C]/70 border border-white/20 text-white backdrop-blur-sm hover:border-[#EBBA6F]/60 hover:text-[#EBBA6F] disabled:opacity-0 disabled:pointer-events-none transition-all duration-200"
        >
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll('next')}
          disabled={atEnd}
          aria-label="Next vehicle"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-[#0C0F1C]/70 border border-white/20 text-white backdrop-blur-sm hover:border-[#EBBA6F]/60 hover:text-[#EBBA6F] disabled:opacity-0 disabled:pointer-events-none transition-all duration-200"
        >
          <ChevronRight size={20} strokeWidth={1.5} aria-hidden />
        </button>

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pl-5 sm:pl-8 lg:pl-12 pr-5 sm:pr-8 lg:pr-12 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
        {FLEET.map((item) => (
          <div
            key={item.slug}
            data-fleet-card
            className="relative flex-shrink-0 rounded-2xl overflow-hidden group cursor-pointer w-[82vw] sm:w-[45vw] lg:w-[29vw] max-w-[400px]"
            style={{ aspectRatio: '3/4' }}
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/95 via-[#04060E]/35 to-transparent" />

            {/* Tag */}
            {item.tag && (
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1 bg-[#EBBA6F] text-[#0C0F1C] text-[11px] font-semibold rounded-full"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {item.tag}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <h3
                className="text-white leading-tight mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 300,
                  fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                }}
              >
                {item.name}
              </h3>
              <p
                className="text-white/55 text-[12.5px] mb-5 leading-snug"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {item.features.join(' • ')}
              </p>
              <a
                href={`/fleet/${item.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#0C0F1C] text-[12.5px] font-semibold rounded-full hover:bg-[#EBBA6F] transition-colors duration-200 select-none"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Explore
                <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden />
              </a>
            </div>
          </div>
        ))}
        </div>
      </div>

    </section>
  )
}
