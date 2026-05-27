import { ShieldCheck, UserCheck, Clock, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ITEMS: { icon: LucideIcon; label: string; subtitle: string }[] = [
  { icon: ShieldCheck, label: 'Fully Licensed & Insured', subtitle: 'Your safety, our priority' },
  { icon: UserCheck,   label: 'Professional Drivers',    subtitle: 'Experienced & courteous' },
  { icon: Clock,       label: '24/7 Availability',       subtitle: 'Here when you need us' },
  { icon: Globe,       label: 'UK & Europe Coverage',    subtitle: 'Travel across the UK & Europe' },
]

export default function TrustBar() {
  return (
    <div className="relative w-full">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:divide-x sm:divide-white/[0.12]">
          {ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 py-3 sm:py-0 sm:flex-1 sm:px-8 lg:px-10 first:sm:pl-0 last:sm:pr-0"
            >
              <item.icon
                size={28}
                className="text-[#EBBA6F] shrink-0"
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
