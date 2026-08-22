import type { Metadata } from 'next'
import { HeartHandshake, MessageSquareHeart, Phone, Mail, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactHero from '../components/contact/ContactHero'
import EnquiryForm from '../components/contact/EnquiryForm'
import LocationMap from '../components/contact/LocationMap'
import { CONTACT_LINES } from '../components/contact/contact-details'

export const metadata: Metadata = {
  title: 'Contact Us | Everyday Travels',
  description:
    'Share your travel requirements and receive a tailored quote — coach and minibus hire across the UK and Europe. Call 020 8941 8354 or send us an enquiry.',
}

const ICONS = { phone: Phone, mail: Mail, clock: Clock }

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      <ContactHero />

      {/* ── Note for our passengers ───────────────────────────────────────── */}
      <div className="bg-[#B8934F]">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-8 py-8 lg:py-10 text-center">
          <p className="flex items-center justify-center gap-2.5 mb-3">
            <HeartHandshake size={18} strokeWidth={1.25} className="text-white/90" aria-hidden />
            <span className="text-white/90 text-[14.5px]" style={{ fontFamily: 'var(--font-ui)' }}>
              Note for our passengers
            </span>
          </p>
          <p
            className="text-white text-[clamp(1.05rem,2.1vw,1.5rem)] leading-snug italic"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            All executive vehicles are professionally maintained, fully insured, and operated by experienced
            uniformed drivers.
          </p>
        </div>
      </div>

      {/* ── Get in touch ──────────────────────────────────────────────────── */}
      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20">

        <div className="flex flex-col items-center text-center mb-10">
          <p className="flex items-center gap-2 mb-4">
            <MessageSquareHeart size={16} strokeWidth={1.25} className="text-[#EBBA6F]" aria-hidden />
            <span
              className="text-[#EBBA6F] text-[12px] font-medium tracking-[0.16em]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Send your enquiry
            </span>
          </p>

          <h1
            className="text-white leading-[1] tracking-[-0.02em] mb-5"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)' }}
          >
            Get in touch with us
          </h1>

          <p
            className="text-white/55 text-[15px] leading-relaxed max-w-[620px] mb-7"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Share your travel requirements and receive a tailored quote with competitive pricing, premium coaches,
            and reliable service you can trust.
          </p>

          <ul className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {CONTACT_LINES.map(({ icon, label, href }) => {
              const Icon = ICONS[icon]
              const body = (
                <>
                  <Icon size={16} strokeWidth={1.5} className="text-white/60 shrink-0" aria-hidden />
                  <span className="text-white text-[14px]" style={{ fontFamily: 'var(--font-ui)' }}>
                    {label}
                  </span>
                </>
              )
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="flex items-center gap-2.5 hover:text-[#EBBA6F] transition-colors duration-150">
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

        <EnquiryForm />
      </main>

      <LocationMap />

      <Footer />
    </div>
  )
}
