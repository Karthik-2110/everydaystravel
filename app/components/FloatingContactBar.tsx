'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Phone, Mail } from 'lucide-react'
import { PHONE, PHONE_HREF, EMAIL, EMAIL_HREF } from './contact/contact-details'

/**
 * Call + email pill that docks to the bottom of the viewport once the reader
 * has scrolled clear of the hero. Hidden while the hero is still on screen so
 * it never competes with the hero's own CTAs.
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
              href={PHONE_HREF}
              aria-label={`Call ${PHONE}`}
              className="h-11 px-5 inline-flex items-center gap-2.5 rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold hover:bg-[#DDA85E] active:bg-[#C8963E] transition-colors duration-150"
            >
              <Phone size={16} aria-hidden />
              <span className="hidden sm:inline">{PHONE}</span>
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
