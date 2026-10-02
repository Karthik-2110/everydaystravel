import Image from 'next/image'
import { Phone, Mail, Clock, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react'
import { WhatsAppIcon, InstagramIcon, FacebookIcon, LinkedInIcon, WHATSAPP_HREF, INSTAGRAM_HREF, FACEBOOK_HREF, LINKEDIN_HREF, SOCIAL_BRAND } from './icons/social'
import SiteLink from './SiteLink'
import CookieSettingsButton from './CookieSettingsButton'
import { ADDRESS } from './contact/contact-details'

// ── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'Services',   href: '/services' },
  { label: 'Our Fleet',  href: '/fleet' },
  { label: 'Reviews',    href: '/reviews' },
  { label: 'Contact Us', href: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy',      href: '/privacy' },
  { label: 'Terms of Use',        href: '/terms' },
  { label: 'Conditions of Hire',  href: '/conditions-of-hire' },
  { label: 'Cookie Policy',       href: '/cookies' },
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
  { icon: Phone,  primary: '020 8941 8354',              href: 'tel:02089418354' },
  { icon: Mail,   primary: 'info@everydaystravel.co.uk', href: 'mailto:info@everydaystravel.co.uk' },
  { icon: MapPin, primary: ADDRESS,                      secondary: 'UK & European travel' },
  { icon: Clock,  primary: 'Mon – Fri: 7:00 AM – 7:00 PM', secondary: 'Sat & Sun: 8:00 AM – 4:00 PM' },
]

// Brand-filled circles, matching the floating contact bar. Glyphs are 20px.
const SOCIAL_LINKS = [
  { label: 'Instagram', href: INSTAGRAM_HREF, brand: SOCIAL_BRAND.instagram, svg: <InstagramIcon size={20} /> },
  { label: 'Facebook',  href: FACEBOOK_HREF,  brand: SOCIAL_BRAND.facebook,  svg: <FacebookIcon  size={20} /> },
  { label: 'WhatsApp',  href: WHATSAPP_HREF,  brand: SOCIAL_BRAND.whatsapp,  svg: <WhatsAppIcon  size={20} /> },
  { label: 'LinkedIn',  href: LINKEDIN_HREF,  brand: SOCIAL_BRAND.linkedin,  svg: <LinkedInIcon  size={20} /> },
]

// With a lighter scrim the footage shows through behind the CTA copy, so the
// type carries its own shadow rather than leaning on the overlay for contrast.
const COPY_SHADOW = '0 2px 20px rgba(4,6,14,0.8), 0 1px 4px rgba(4,6,14,0.55)'

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[#EBBA6F]/80 text-[11.5px] font-semibold tracking-[0.18em] uppercase pb-3.5 mb-5 border-b border-[#EBBA6F]/15"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {children}
    </h3>
  )
}

const CTA_BACKGROUND =
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783787285/IMG_0513_o5cs0k.heic'

// ── Component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer>

      {/* ── Pre-footer CTA ── */}
      <div className="relative overflow-hidden">
        {/* Background still. The source is a HEIC, which only Safari can
            draw, so it is delivered through f_auto — Cloudinary hands every
            browser a format it understands. */}
        <Image
          src={CTA_BACKGROUND}
          alt=""
          aria-hidden
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay — kept light so the coaches read, leaning on the
            copy's own shadow rather than a scrim to hold contrast. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060E]/50 via-[#04060E]/10 to-[#04060E]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060E]/10 via-transparent to-[#04060E]/15" />

        <div className="relative site-container py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

            {/* Left — heading + buttons */}
            <div className="flex-shrink-0 flex flex-col gap-8">
              <div>
                <p
                  className="text-[#EBBA6F] text-[11px] font-medium tracking-[0.18em] uppercase mb-4"
                  style={{ fontFamily: 'var(--font-ui)', textShadow: COPY_SHADOW }}
                >
                  Book with us
                </p>
                <h2
                  className="text-white leading-[0.92] tracking-[-0.025em]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 300,
                    fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                    textShadow: COPY_SHADOW,
                  }}
                >
                  Ready to travel<br />in style?
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white text-[14px] font-semibold rounded-full hover:bg-[#1FBB59] active:bg-[#19A34D] transition-colors duration-150 shadow-[0_0_28px_rgba(37,211,102,0.25)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <WhatsAppIcon size={15} />
                  Chat on WhatsApp
                </a>
                <SiteLink
                  href="/contact"
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 border border-white/25 text-white text-[14px] font-medium rounded-full hover:border-[#EBBA6F]/50 hover:text-[#EBBA6F] transition-all duration-150"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Get a free quote
                  <ArrowRight size={14} strokeWidth={2} aria-hidden />
                </SiteLink>
              </div>
            </div>

            {/* Right — contact details */}
            <div className="flex flex-col gap-5 lg:max-w-[420px] w-full">

              <p
                className="text-white/80 text-[10.5px] tracking-[0.18em] uppercase"
                style={{ fontFamily: 'var(--font-ui)', textShadow: COPY_SHADOW }}
              >
                Get in touch
              </p>

              {/* Phone */}
              <a
                href="tel:02089418354"
                className="flex items-center gap-3 group"
                aria-label="Call 020 8941 8354"
              >
                <Phone size={16} className="text-[#EBBA6F] shrink-0" strokeWidth={1.5} aria-hidden />
                <span
                  className="text-white group-hover:text-[#EBBA6F] transition-colors duration-150 tracking-[-0.01em]"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', lineHeight: 1, textShadow: COPY_SHADOW }}
                >
                  020 8941 8354
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
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', lineHeight: 1, textShadow: COPY_SHADOW }}
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
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', lineHeight: 1, textShadow: COPY_SHADOW }}
                  >
                    Mon – Fri: 7:00 AM – 7:00 PM
                  </span>
                  <span
                    className="text-white/65 tracking-[-0.01em]"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', lineHeight: 1, textShadow: COPY_SHADOW }}
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
        <div className="site-container pt-14 pb-12 lg:pt-16 lg:pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 lg:gap-12">

            {/* Brand column */}
            <div>
              <Image
                src="/images/everyday_logo.avif"
                alt="Everydays Travel"
                width={512}
                height={267}
                className="h-[80px] w-auto object-contain mb-5"
              />
              <p
                className="text-white text-[14.5px] leading-relaxed mb-6 max-w-[250px]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Coach and minibus hire across London and the UK. Airport transfers,
                weddings, corporate and group travel — every day.
              </p>
              <div className="flex items-center gap-2" data-testid="footer-socials">
                {SOCIAL_LINKS.map(({ svg, href, label, brand }) => (
                  <SiteLink
                    key={label}
                    href={href}
                    aria-label={label}
                    style={brand}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:opacity-90 hover:scale-105 transition-all duration-150"
                  >
                    {svg}
                  </SiteLink>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <SectionLabel>Quick links</SectionLabel>
              <ul className="flex flex-col gap-3">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <SiteLink
                      href={href}
                      className="group inline-flex items-center gap-1.5 text-white/50 text-[15px] hover:text-[#EBBA6F] transition-colors duration-150"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {label}
                      <ArrowUpRight
                        size={12}
                        strokeWidth={2}
                        className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-150 text-[#EBBA6F] shrink-0"
                        aria-hidden
                      />
                    </SiteLink>
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
                    <SiteLink
                      href={href}
                      className="group inline-flex items-center gap-1.5 text-white/50 text-[15px] hover:text-[#EBBA6F] transition-colors duration-150"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {label}
                      <ArrowUpRight
                        size={12}
                        strokeWidth={2}
                        className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-150 text-[#EBBA6F] shrink-0"
                        aria-hidden
                      />
                    </SiteLink>
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
                          className="text-white/70 text-[14px] hover:text-white transition-colors duration-150 leading-snug block"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {primary}
                        </a>
                      ) : (
                        <span
                          className="text-white/70 text-[14px] leading-snug block"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {primary}
                        </span>
                      )}
                      {secondary && (
                        <span
                          className="text-white/35 text-[13px] leading-snug block mt-0.5"
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
        <div className="site-container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p
              className="text-white/25 text-[12px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              © 2026 Everydays Travel. All rights reserved
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {LEGAL_LINKS.map(({ label, href }, i) => (
                <div key={href} className="flex items-center gap-4">
                  {i > 0 && <span className="text-white/12 select-none">·</span>}
                  <SiteLink
                    href={href}
                    className="text-white/28 text-[12px] hover:text-[#EBBA6F]/70 transition-colors duration-150"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {label}
                  </SiteLink>
                </div>
              ))}
              <span className="text-white/12 select-none">·</span>
              {/* Withdrawing consent has to be as easy as giving it, so this
                  sits on every page beside the policy it belongs to. */}
              <CookieSettingsButton
                className="text-white/28 text-[12px] hover:text-[#EBBA6F]/70 transition-colors duration-150"
              />
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
