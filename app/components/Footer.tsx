import { Phone, Mail, Clock, MapPin, MessageCircle, ArrowRight, ArrowUpRight } from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'Services',   href: '/services' },
  { label: 'Our Fleet',  href: '/fleet' },
  { label: 'Reviews',    href: '/reviews' },
  { label: 'Contact Us', href: '/contact' },
]

const SERVICES = [
  { label: 'Airport Transfers', href: '/services/airport-transfers' },
  { label: 'Weddings & Events', href: '/services/weddings-events' },
  { label: 'Corporate Travel',  href: '/services/corporate' },
  { label: 'Group Travel',      href: '/services/group-travel' },
  { label: 'School Trips',      href: '/services/school-trips' },
]

interface ContactItem {
  icon: React.ElementType
  primary: string
  secondary?: string
  tertiary?: string
  href?: string
}

const CONTACT_ITEMS: ContactItem[] = [
  { icon: Phone,  primary: '020 8941 8334',              href: 'tel:02089418334' },
  { icon: Mail,   primary: 'info@everydaystravel.co.uk', href: 'mailto:info@everydaystravel.co.uk' },
  { icon: MapPin, primary: 'London-based',               secondary: 'UK & European travel' },
  { icon: Clock,  primary: 'Mon – Fri: 7:00 AM – 7:00 PM', secondary: 'Sat & Sun: 8:00 AM – 4:00 PM' },
]

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: '#',
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: '#',
    svg: <MessageCircle size={13} aria-hidden />,
  },
  {
    label: 'LinkedIn',
    href: '#',
    svg: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[#EBBA6F]/80 text-[10.5px] font-semibold tracking-[0.18em] uppercase pb-3.5 mb-5 border-b border-[#EBBA6F]/15"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {children}
    </h3>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer>

      {/* ── Pre-footer CTA ── */}
      <div className="relative overflow-hidden">
        {/* Background image */}
        <img
          src="/images/hero.JPG"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay — dark on both sides, lighter in centre */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060E]/95 via-[#04060E]/75 to-[#04060E]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060E]/30 via-transparent to-[#04060E]/40" />

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

            {/* Left — heading + buttons */}
            <div className="flex-shrink-0 flex flex-col gap-8">
              <div>
                <p
                  className="text-[#EBBA6F] text-[11px] font-medium tracking-[0.18em] uppercase mb-4"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Book with us
                </p>
                <h2
                  className="text-white leading-[0.92] tracking-[-0.025em]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 300,
                    fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                  }}
                >
                  Ready to travel<br />in style?
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/4402089418334"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold rounded-full hover:bg-[#E2B36A] active:bg-[#D4A85E] transition-colors duration-150 shadow-[0_0_28px_rgba(235,186,111,0.25)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <MessageCircle size={15} strokeWidth={2} aria-hidden />
                  Chat on WhatsApp
                </a>
                <a
                  href="/contact"
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 border border-white/25 text-white text-[14px] font-medium rounded-full hover:border-[#EBBA6F]/50 hover:text-[#EBBA6F] transition-all duration-150"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Get instant quote
                  <ArrowRight size={14} strokeWidth={2} aria-hidden />
                </a>
              </div>
            </div>

            {/* Right — contact details */}
            <div className="flex flex-col gap-5 lg:max-w-[420px] w-full">

              <p
                className="text-white/70 text-[10.5px] tracking-[0.18em] uppercase"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Get in touch
              </p>

              {/* Phone */}
              <a
                href="tel:02089418334"
                className="flex items-center gap-3 group"
                aria-label="Call 020 8941 8334"
              >
                <Phone size={16} className="text-[#EBBA6F] shrink-0" strokeWidth={1.5} aria-hidden />
                <span
                  className="text-white group-hover:text-[#EBBA6F] transition-colors duration-150 tracking-[-0.01em]"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', lineHeight: 1 }}
                >
                  020 8941 8334
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:info@everydaystravel.co.uk"
                className="flex items-center gap-3 group"
                aria-label="Email info@everydaystravel.co.uk"
              >
                <Mail size={16} className="text-[#EBBA6F] shrink-0" strokeWidth={1.5} aria-hidden />
                <span
                  className="text-white group-hover:text-[#EBBA6F] transition-colors duration-150 tracking-[-0.01em]"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', lineHeight: 1 }}
                >
                  info@everydaystravel.co.uk
                </span>
              </a>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#EBBA6F] shrink-0 mt-1" strokeWidth={1.5} aria-hidden />
                <div className="flex flex-col gap-2">
                  <span
                    className="text-white tracking-[-0.01em]"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', lineHeight: 1 }}
                  >
                    Mon – Fri: 7:00 AM – 7:00 PM
                  </span>
                  <span
                    className="text-white/50 tracking-[-0.01em]"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', lineHeight: 1 }}
                  >
                    Sat &amp; Sun: 8:00 AM – 4:00 PM
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="bg-[#0C0F1C]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 pb-12 lg:pt-16 lg:pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 lg:gap-12">

            {/* Brand column */}
            <div>
              <img
                src="/images/everyday_logo.avif"
                alt="Everyday Travels"
                className="h-[80px] w-auto object-contain mb-5"
              />
              <p
                className="text-white text-[13.5px] leading-relaxed mb-6 max-w-[210px]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Premium coach &amp; minibus hire across the UK and Europe.
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ svg, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-white/60 hover:border-[#EBBA6F]/70 hover:text-[#EBBA6F] hover:scale-105 transition-all duration-150"
                  >
                    {svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <SectionLabel>Quick links</SectionLabel>
              <ul className="flex flex-col gap-3">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group inline-flex items-center gap-1.5 text-white/50 text-[14px] hover:text-[#EBBA6F] transition-colors duration-150"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {label}
                      <ArrowUpRight
                        size={12}
                        strokeWidth={2}
                        className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-150 text-[#EBBA6F] shrink-0"
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <SectionLabel>Our services</SectionLabel>
              <ul className="flex flex-col gap-3">
                {SERVICES.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group inline-flex items-center gap-1.5 text-white/50 text-[14px] hover:text-[#EBBA6F] transition-colors duration-150"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {label}
                      <ArrowUpRight
                        size={12}
                        strokeWidth={2}
                        className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-150 text-[#EBBA6F] shrink-0"
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <SectionLabel>Contact us</SectionLabel>
              <ul className="flex flex-col gap-4">
                {CONTACT_ITEMS.map(({ icon: Icon, primary, secondary, href }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon
                      size={13}
                      className="text-[#EBBA6F]/50 shrink-0 mt-[3px]"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      {href ? (
                        <a
                          href={href}
                          className="text-white/70 text-[13px] hover:text-white transition-colors duration-150 leading-snug block"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {primary}
                        </a>
                      ) : (
                        <span
                          className="text-white/70 text-[13px] leading-snug block"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {primary}
                        </span>
                      )}
                      {secondary && (
                        <span
                          className="text-white/35 text-[12px] leading-snug block mt-0.5"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {secondary}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative bg-[#06080F]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EBBA6F]/20 to-transparent" />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p
              className="text-white/25 text-[12px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              © 2026 Everydays Travel. All rights reserved
            </p>
            <div className="flex items-center gap-5">
              <a
                href="/privacy"
                className="text-white/28 text-[12px] hover:text-[#EBBA6F]/70 transition-colors duration-150"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Privacy Policy
              </a>
              <span className="text-white/12 select-none">·</span>
              <a
                href="/terms"
                className="text-white/28 text-[12px] hover:text-[#EBBA6F]/70 transition-colors duration-150"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
