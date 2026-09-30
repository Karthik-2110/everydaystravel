'use client'

import { MapPin } from 'lucide-react'
import { useHasConsent, useHydrated, openCookiePreferences } from '@/app/lib/consent'

/**
 * The Google Maps embed sets Google's cookies the instant the iframe loads, so
 * it stays out of the DOM entirely until functional consent exists. What shows
 * instead is the address itself plus a way to turn the map on — never a blank
 * hole, and never a nudge that makes refusing feel like a mistake.
 */
export default function MapEmbed({
  src, address,
}: {
  src:     string | null
  address: string
}) {
  const allowed = useHasConsent('functional')
  const ready   = useHydrated()

  if (ready && allowed && src) {
    return (
      <iframe
        src={src}
        title={`Map showing ${address}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3 px-6">
      <MapPin size={22} className="text-[#EBBA6F]" strokeWidth={1.5} aria-hidden />
      <p className="text-white/70 text-[14px]" style={{ fontFamily: 'var(--font-body)' }}>
        {address}
      </p>
      {src && (
        <>
          <p className="text-white/40 text-[12.5px] max-w-[42ch]" style={{ fontFamily: 'var(--font-body)' }}>
            The interactive map is provided by Google, which sets its own cookies.
          </p>
          <button
            type="button"
            onClick={openCookiePreferences}
            className="mt-1 h-9 px-5 rounded-full border border-white/30 text-white text-[13px] font-medium hover:border-[#EBBA6F]/60 hover:text-[#EBBA6F] transition-colors duration-150"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Load the map
          </button>
        </>
      )}
    </div>
  )
}
