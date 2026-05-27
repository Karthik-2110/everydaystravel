'use client'

import { useState } from 'react'
import { Users, PenLine, ChevronDown } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

export type ReviewSource = 'google' | 'trustpilot'

export interface Review {
  name: string
  context: string
  stars: number
  text: string
  initials: string
  avatarBg: string
  source: ReviewSource
}

// ── Static data (edit freely) ────────────────────────────────────────────────

const DEFAULT_REVIEWS: Review[] = [
  {
    name: 'James Mitchell',
    context: 'Corporate Events, London',
    stars: 5,
    text: 'The driver arrived fifteen minutes early, the coach was immaculate, and every detail was handled without us lifting a finger. This is what premium service looks like.',
    initials: 'JM',
    avatarBg: '#B8975A',
    source: 'google',
  },
  {
    name: 'Sarah Keane',
    context: 'Wedding, Surrey',
    stars: 5,
    text: 'Booked a 16-seat minibus for our wedding party. On time, spotless, and the driver was calm and courteous throughout. Could not have asked for more.',
    initials: 'SK',
    avatarBg: '#7A93B4',
    source: 'trustpilot',
  },
  {
    name: 'Tom Davies',
    context: 'Sports Club, Manchester',
    stars: 5,
    text: 'We use Everyday Travels for every away fixture. Always reliable, always professional. The whole team looks forward to it.',
    initials: 'TD',
    avatarBg: '#6A9B7E',
    source: 'google',
  },
  {
    name: 'Priya Sharma',
    context: 'School Trip, Birmingham',
    stars: 5,
    text: 'Organised a school trip for 45 students. The coach was on time, the driver was patient and kind, and the whole day ran perfectly. Highly recommend.',
    initials: 'PS',
    avatarBg: '#A07A94',
    source: 'trustpilot',
  },
  {
    name: 'David Chen',
    context: 'Airport Transfer, Heathrow',
    stars: 5,
    text: 'Used them for an early morning airport run. Professional, punctual, and the vehicle was spotless. Will definitely book again.',
    initials: 'DC',
    avatarBg: '#4A6B8A',
    source: 'google',
  },
  {
    name: 'Emma Thompson',
    context: 'Hen Party, Edinburgh',
    stars: 5,
    text: 'Fantastic experience from booking to drop-off. The driver went above and beyond to make sure our group had a brilliant time. Exactly what we needed.',
    initials: 'ET',
    avatarBg: '#B47A6E',
    source: 'trustpilot',
  },
  {
    name: 'Michael Osei',
    context: 'Conference Transfer, Birmingham',
    stars: 5,
    text: 'Arranged transfers for 60 delegates across two days. Every vehicle arrived on time and the drivers were incredibly professional. Will use again without hesitation.',
    initials: 'MO',
    avatarBg: '#5A7A6A',
    source: 'google',
  },
  {
    name: 'Rachel Byrne',
    context: 'Airport Run, Gatwick',
    stars: 5,
    text: 'Booked last minute for an early morning Gatwick run. The driver was punctual, friendly, and got us there with time to spare. Stress-free from start to finish.',
    initials: 'RB',
    avatarBg: '#8A7AB4',
    source: 'trustpilot',
  },
  {
    name: 'Liam Foster',
    context: 'Stadium Transfer, Wembley',
    stars: 5,
    text: 'Organised a coach for 40 supporters to Wembley. The experience was seamless and the price was excellent. Highly recommended for large group travel.',
    initials: 'LF',
    avatarBg: '#9A7A5A',
    source: 'google',
  },
]

const INITIAL_COUNT = 6

// ── Sub-components ────────────────────────────────────────────────────────────

function Stars({ filled = 5, total = 5 }: { filled?: number; total?: number }) {
  return (
    <div
      className="flex items-center gap-[3px]"
      role="img"
      aria-label={`${filled} out of ${total} stars`}
    >
      {Array.from({ length: total }, (_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 20 20"
          fill="#EBBA6F"
          opacity={i < filled ? 1 : 0.2}
          aria-hidden
        >
          <path d="M10 1l2.4 4.9 5.3.8-3.9 3.8.9 5.3-4.7-2.5-4.8 2.5.9-5.3-3.8-3.8 5.3-.8L10 1z" />
        </svg>
      ))}
    </div>
  )
}

function AvatarCircle({
  initials,
  bg,
  ring = false,
}: {
  initials: string
  bg: string
  ring?: boolean
}) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0 ${ring ? 'ring-2 ring-[#F4EFE8]' : ''}`}
      style={{ backgroundColor: bg, fontFamily: 'var(--font-ui)' }}
      aria-hidden
    >
      {initials}
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function TrustpilotLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#00B67A" aria-hidden>
      <path d="M12 2l2.582 7.953H22l-6.29 4.573 2.4 7.388L12 17.35l-6.11 4.564 2.4-7.388L2 9.953h7.418L12 2z" />
    </svg>
  )
}

function SourceTag({ source }: { source: ReviewSource }) {
  return (
    <div className="flex items-center gap-1.5">
      {source === 'google' ? <GoogleLogo /> : <TrustpilotLogo />}
      <span
        className="text-[11.5px] text-[#0C0F1C]/40"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {source === 'google' ? 'Google' : 'Trustpilot'}
      </span>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(12,15,28,0.06),0_6px_20px_rgba(12,15,28,0.05)] flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <AvatarCircle initials={review.initials} bg={review.avatarBg} />
          <div className="min-w-0">
            <p
              className="text-[#0C0F1C] text-[13.5px] font-semibold leading-snug truncate"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {review.name}
            </p>
            <p
              className="text-[#0C0F1C]/45 text-[11.5px] leading-snug truncate"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {review.context}
            </p>
          </div>
        </div>
        <Stars filled={review.stars} />
      </div>

      <p
        className="text-[#0C0F1C]/65 text-[13.5px] leading-relaxed flex-1 mb-4"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {review.text}
      </p>

      <div className="pt-3 border-t border-[#0C0F1C]/[0.07]">
        <SourceTag source={review.source} />
      </div>
    </article>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Testimonials({ reviews = DEFAULT_REVIEWS }: { reviews?: Review[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const visibleReviews = reviews.slice(0, visibleCount)
  const hasMore = visibleCount < reviews.length

  return (
    <section aria-label="Customer reviews" className="bg-[#F4EFE8]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">

        {/* ── Centered header ── */}
        <div className="flex flex-col items-center text-center mb-14">

    

          {/* Heading */}
          <h2
            className="text-[#0C0F1C] text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.08] tracking-[-0.015em] mb-7 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
          >
            What our clients say about us
          </h2>

          {/* Avatar stack + social proof */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2.5">
              {reviews.slice(0, 4).map((r, i) => (
                <div key={r.name} style={{ zIndex: 4 - i }} className="relative">
                  <AvatarCircle initials={r.initials} bg={r.avatarBg} ring />
                </div>
              ))}
            </div>
            <p
              className="text-[#0C0F1C]/60 text-[14px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Trusted by{' '}
              <strong className="text-[#0C0F1C] font-semibold">5,000+</strong>{' '}
              people.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="h-10 px-6 bg-[#0C0F1C] text-white text-[13px] font-medium rounded-full hover:bg-[#1a2030] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Get a Quote
            </button>
            <button
              type="button"
              className="h-10 px-6 bg-white border border-[#0C0F1C]/12 text-[#0C0F1C] text-[13px] font-medium rounded-full hover:bg-[#0C0F1C]/[0.04] transition-colors duration-150 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <PenLine size={13} aria-hidden />
              Share your feedback
            </button>
          </div>
        </div>

        {/* ── Card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>

        {/* ── Load more ── */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => Math.min(c + 3, reviews.length))}
              className="h-10 px-7 flex items-center gap-2 bg-white border border-[#0C0F1C]/12 text-[#0C0F1C]/70 text-[13px] font-medium rounded-full hover:bg-[#0C0F1C]/[0.04] hover:text-[#0C0F1C] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ChevronDown size={15} aria-hidden />
              Load more reviews
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
