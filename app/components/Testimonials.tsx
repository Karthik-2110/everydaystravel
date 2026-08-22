'use client'

import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { ALL_REVIEWS, type Review } from '@/app/data/reviews'
import ReviewCard from './ReviewCard'

// ── Data ─────────────────────────────────────────────────────────────────────
// Real reviews only — see app/data/reviews.ts for provenance.

const INITIAL_COUNT = 6

// ── Component ─────────────────────────────────────────────────────────────────

export default function Testimonials({ reviews = ALL_REVIEWS }: { reviews?: Review[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const visibleReviews = reviews.slice(0, visibleCount)
  const hasMore = visibleCount < reviews.length

  return (
    <section aria-label="Customer reviews" className="bg-[#F4EFE8]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-16">

        {/* ── Centered header ── */}
        <div className="flex flex-col items-center text-center mb-10">

          {/* Kicker */}
          <div className="inline-flex items-center gap-1.5 mb-4">
            <Sparkles size={14} strokeWidth={1} className="text-[#0C0F1C]/70" aria-hidden />
            <span
              className="text-[#0C0F1C]/70 text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Testimonials
            </span>
          </div>

          {/* Heading */}
          <h2
            className="text-[#0C0F1C] text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.08] tracking-[-0.015em] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
          >
            What our clients say about us
          </h2>

        </div>

        {/* ── Card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>

        {/* ── Load more + Get a Quote ── */}
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => Math.min(c + 3, reviews.length))}
              className="h-10 px-7 flex items-center gap-2 bg-white border border-[#0C0F1C]/12 text-[#0C0F1C]/70 text-[13px] font-medium rounded-full hover:bg-[#0C0F1C]/[0.04] hover:text-[#0C0F1C] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ChevronDown size={15} aria-hidden />
              Load more reviews
            </button>
          )}
       
        </div>

      </div>
    </section>
  )
}
