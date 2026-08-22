'use client'

import { UserCheck, BusFront, Clock, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ── Why travel with us ────────────────────────────────────────────────────────

const REASONS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: UserCheck,
    title: 'Professional & Experienced Drivers',
    text:  'Courteous, licensed and highly experienced chauffeurs.',
  },
  {
    icon: BusFront,
    title: 'Modern Luxury Fleet',
    text:  'Immaculate vehicles with premium comfort and safety.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    text:  "We're here around the clock for complete peace of mind.",
  },
  {
    icon: Sparkles,
    title: 'Tailored For You',
    text:  'Every journey is planned around your needs and schedule.',
  },
]

export function WhyTravelCard() {
  return (
    <section
      aria-label="Why travel with Everyday Travels"
      className="bg-[#0D1221] rounded-2xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(235,186,111,0.06),0_18px_50px_rgba(0,0,0,0.45)] p-5 sm:p-6"
    >
      <h2
        className="text-white text-[19px] sm:text-[21px] leading-none tracking-[-0.01em] mb-5"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
      >
        Why Travel With Everyday Travels?
      </h2>

      <ul className="flex flex-col gap-4">
        {REASONS.map((r) => (
          <li key={r.title} className="flex items-start gap-3.5">
            <span className="w-9 h-9 shrink-0 rounded-full border border-[#EBBA6F]/25 bg-[#EBBA6F]/[0.06] flex items-center justify-center">
              <r.icon size={16} strokeWidth={1.25} className="text-[#EBBA6F]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p
                className="text-[#EBBA6F] text-[13px] font-semibold leading-snug"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {r.title}
              </p>
              <p
                className="text-white/50 text-[12.5px] leading-snug mt-0.5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {r.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
