import type { Review } from '@/app/data/reviews'

// The white review card used on the testimonials section and in the booking
// sidebar. One component so a review looks identical wherever it appears.

const STARS_IMG = 'https://res.cloudinary.com/dckyndryf/image/upload/v1780237231/stars-5_w1ckxp.svg'

export function AvatarCircle({
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

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(12,15,28,0.06),0_6px_20px_rgba(12,15,28,0.05)] flex flex-col gap-3">

      {/* ── Row 1: avatar + name + date ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <AvatarCircle initials={review.initials} bg={review.avatarBg} />
          <div className="min-w-0">
            <p
              className="text-[#0C0F1C] text-[14px] font-semibold leading-snug"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {review.name}
            </p>
            <p
              className="text-[#0C0F1C]/45 text-[12px] leading-snug mt-0.5"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {review.location} · {review.reviews} {review.reviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
        <span
          className="text-[#0C0F1C]/35 text-[12px] shrink-0 mt-0.5"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {review.date}
        </span>
      </div>

      {/* ── Row 2: stars image ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={STARS_IMG}
        alt="5 stars"
        className="h-[22px] w-auto self-start"
      />

      {/* ── Row 3: title ── */}
      <p
        className="text-[#0C0F1C] text-[14px] font-semibold leading-snug"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {review.title}
      </p>

      {/* ── Row 4: body ── */}
      <p
        className="text-[#0C0F1C]/65 text-[13.5px] leading-relaxed flex-1"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {review.text}
      </p>

    </article>
  )
}
