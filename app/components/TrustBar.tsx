import { ShieldCheck, UserCheck, Clock, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ITEMS: { icon: LucideIcon; label: string; subtitle: string }[] = [
  { icon: ShieldCheck, label: 'Fully Licensed & Insured', subtitle: 'Your safety, our priority' },
  { icon: UserCheck,   label: 'Professional Drivers',    subtitle: 'Experienced & courteous' },
  { icon: Clock,       label: '24/7 Availability',       subtitle: 'Here when you need us' },
  { icon: Globe,       label: 'UK & Europe Coverage',    subtitle: 'Travel across the UK & Europe' },
]

// ── Shimmer timing ──────────────────────────────────────────────────────────
// A band of white travels along each gold stroke, one icon at a time. Icon i
// starts STAGGER seconds after icon i-1, so the run takes ITEMS.length × STAGGER
// and then begins again from the first icon — the gradient animation simply
// repeats on that cycle, which keeps every icon on the same clock without any
// JavaScript.

const STAGGER = 1      // seconds between one icon lighting up and the next
const SWEEP   = 0.9    // seconds a single sweep takes to cross an icon
const CYCLE   = ITEMS.length * STAGGER

const GRADIENT_ID = (i: number) => `trustbar-shimmer-${i}`

/**
 * The gradient is anchored in the icon's own 24×24 user space rather than to
 * each path's bounding box, so a multi-part icon (the shield and its tick)
 * lights up as one shape instead of each stroke sweeping separately.
 */
function ShimmerGradients() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      className="absolute pointer-events-none"
    >
      <defs>
        {ITEMS.map((_, i) => (
          <linearGradient
            key={i}
            id={GRADIENT_ID(i)}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
            gradientTransform="translate(-34 0)"
          >
            <stop offset="0%"   stopColor="#EBBA6F" />
            <stop offset="35%"  stopColor="#EBBA6F" />
            <stop offset="50%"  stopColor="#FFFFFF" />
            <stop offset="65%"  stopColor="#EBBA6F" />
            <stop offset="100%" stopColor="#EBBA6F" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              /* Sweeps across, then parks off the right edge until its next turn. */
              values="-34 0; 34 0; 34 0"
              keyTimes={`0; ${(SWEEP / CYCLE).toFixed(4)}; 1`}
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0 0 1 1"
              dur={`${CYCLE}s`}
              begin={`${i * STAGGER}s`}
              repeatCount="indefinite"
            />
          </linearGradient>
        ))}
      </defs>
    </svg>
  )
}

export default function TrustBar() {
  return (
    <div className="relative w-full">
      <ShimmerGradients />
      <div className="site-container py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:divide-x sm:divide-white/[0.12]">
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-4 py-3 sm:py-0 sm:flex-1 sm:px-8 lg:px-10 first:sm:pl-0 last:sm:pr-0"
            >
              <item.icon
                size={28}
                className="trust-icon shrink-0"
                stroke={`url(#${GRADIENT_ID(i)})`}
                strokeWidth={1}
                aria-hidden
              />
              <div className="min-w-0">
                <p
                  className="text-white text-[15px] font-semibold leading-snug tracking-[-0.01em]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-white/45 text-[13px] leading-snug mt-0.5"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
