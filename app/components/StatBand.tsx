import type { LucideIcon } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BandStat {
  icon:  LucideIcon
  label: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StatBand({ stats }: { stats: BandStat[] }) {
  return (
    <div
      className="w-full border-t border-b border-[#EBBA6F]/20"
      style={{ background: 'linear-gradient(90deg, #2B1E06 0%, #3A2A0A 50%, #2B1E06 100%)' }}
    >
      <div className="site-container py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#EBBA6F]/25">
          {stats.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-8 py-3 sm:py-0 first:pt-0 last:pb-0 sm:first:pl-0 sm:last:pr-0"
            >
              <Icon
                size={16}
                strokeWidth={1.5}
                className="text-[#EBBA6F] shrink-0"
                aria-hidden
              />
              <span
                className="text-[#EBBA6F] text-[13.5px] font-medium whitespace-nowrap"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
