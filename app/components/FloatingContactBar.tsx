'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Phone, Mail } from 'lucide-react'
import { MOBILE, MOBILE_HREF, EMAIL, EMAIL_HREF } from './contact/contact-details'
import { WhatsAppIcon, InstagramIcon, FacebookIcon, WHATSAPP_HREF, INSTAGRAM_HREF, FACEBOOK_HREF, SOCIAL_BRAND } from './icons/social'

const SOCIALS = [
  { label: 'Everydays Travel on Facebook',  href: FACEBOOK_HREF,  brand: SOCIAL_BRAND.facebook,  icon: <FacebookIcon  size={18} /> },
  { label: 'Message us on WhatsApp',        href: WHATSAPP_HREF,  brand: SOCIAL_BRAND.whatsapp,  icon: <WhatsAppIcon  size={18} /> },
  { label: 'Everydays Travel on Instagram', href: INSTAGRAM_HREF, brand: SOCIAL_BRAND.instagram, icon: <InstagramIcon size={18} /> },
]

/**
 * Call, email, Facebook, WhatsApp and Instagram pill that docks to the bottom
 * of the viewport once the reader has scrolled clear of the hero. Hidden while
 * the hero is still on screen so it never competes with the hero's own CTAs.
 */
export default function FloatingContactBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Roughly one hero's worth of scrolling — the hero fills the viewport.
      setVisible(window.scrollY > window.innerHeight * 0.75)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pointer-events-none"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div
            className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-[#0C0F1C]/85 border border-white/12 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            <a
              href={MOBILE_HREF}
              aria-label={`Call ${MOBILE}`}
              className="h-11 px-5 inline-flex items-center gap-2.5 rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold hover:bg-[#DDA85E] active:bg-[#C8963E] transition-colors duration-150"
            >
              <Phone size={16} aria-hidden />
              <span className="hidden sm:inline">{MOBILE}</span>
              <span className="sm:hidden">Call us</span>
            </a>
            <a
              href={EMAIL_HREF}
              aria-label={`Email ${EMAIL}`}
              className="h-11 px-5 inline-flex items-center gap-2.5 rounded-full text-white/85 text-[14px] font-medium border border-white/15 hover:border-[#EBBA6F]/60 hover:text-[#EBBA6F] transition-colors duration-150"
            >
              <Mail size={16} aria-hidden />
              Email us
            </a>
            {/* Icon-only socials — same brand fills as the hero and footer */}
            {SOCIALS.map(({ label, href, brand, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full text-white transition-opacity duration-150 hover:opacity-90"
                style={brand}
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
