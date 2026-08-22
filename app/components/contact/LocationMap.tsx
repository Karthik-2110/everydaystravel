import { Phone, Mail, Clock, ExternalLink } from 'lucide-react'
import { ADDRESS, CONTACT_LINES } from './contact-details'

// The map uses the Google Maps **Embed API** — a different API from Places,
// keyed off the same NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. If the iframe renders an
// error, enable "Maps Embed API" for that key in Google Cloud Console.

const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`

const ICONS = { phone: Phone, mail: Mail, clock: Clock }

export default function LocationMap() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const embedSrc = key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(ADDRESS)}&zoom=14`
    : null

  return (
    <section aria-label="Find us">
      <div className="relative h-[320px] sm:h-[420px] bg-[#0D1221]">
        {embedSrc ? (
          <iframe
            src={embedSrc}
            title={`Map showing ${ADDRESS}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/40 text-[13px]" style={{ fontFamily: 'var(--font-body)' }}>
              {ADDRESS}
            </p>
          </div>
        )}

        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 left-4 z-10 h-9 px-3.5 inline-flex items-center gap-2 rounded-md bg-white text-[#1a73e8] text-[13px] font-medium shadow-[0_1px_4px_rgba(0,0,0,0.3)] hover:bg-white/95 transition-colors duration-150"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Open in Maps
          <ExternalLink size={13} aria-hidden />
        </a>
      </div>

      {/* Contact strip */}
      <div className="bg-[#EDE9E0]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-6">
          <ul className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {CONTACT_LINES.map(({ icon, label, href }) => {
              const Icon = ICONS[icon]
              const body = (
                <>
                  <Icon size={17} strokeWidth={1.5} className="text-[#0C0F1C]/70 shrink-0" aria-hidden />
                  <span
                    className="text-[#0C0F1C] text-[14.5px]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {label}
                  </span>
                </>
              )
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="flex items-center gap-2.5 hover:opacity-70 transition-opacity duration-150">
                      {body}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2.5">{body}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
