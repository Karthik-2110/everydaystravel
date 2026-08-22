'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WhatsAppIcon, WHATSAPP_HREF } from '../icons/social'

// Real photographs only — the same four the gallery leads with.
const SLIDES = [
  {
    caption: 'Wedding transport',
    href:    '/services/weddings-events',
    src:     'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783785511/IMG_6138_n9khty.jpg',
  },
  {
    caption: 'Airport transfers',
    href:    '/services/airport-transfers',
    src:     'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783784630/20260211_134438550_iOS_okfp39.jpg',
  },
  {
    caption: 'Corporate travel',
    href:    '/services/corporate',
    src:     'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783784686/DSC09063_xjmaio.jpg',
  },
  {
    caption: 'Group travel',
    href:    '/services/group-travel',
    src:     'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783783988/DSC09031_yjmhzx.jpg',
  },
]

const ARROW =
  'absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center ' +
  'text-white/80 hover:text-white bg-[#04060E]/30 hover:bg-[#04060E]/55 backdrop-blur-sm ' +
  'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBBA6F]/60'

export default function ContactHero() {
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]

  const go = useCallback((step: number) => {
    setIndex((i) => (i + step + SLIDES.length) % SLIDES.length)
  }, [])

  return (
    <section aria-label="Contact us" className="bg-[#0C0F1C] pt-24 lg:pt-28 pb-6">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div
          className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-[#0D1221]"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft')  go(-1)
            if (e.key === 'ArrowRight') go(1)
          }}
          tabIndex={-1}
        >
          {/* Photo */}
          <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[21/9]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.src}
                  alt={slide.caption}
                  fill
                  priority={index === 0}
                  unoptimized
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-[#04060E]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/70 via-transparent to-[#04060E]/40" />
          </div>

          {/* Caption + actions */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
            <p
              className="text-white/85 text-[13px] sm:text-[15px] mb-1"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Travel agency you can rely on
            </p>

            <AnimatePresence mode="wait">
              <motion.h1
                key={slide.caption}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-white leading-[1] tracking-[-0.02em] mb-6"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}
              >
                {slide.caption}
              </motion.h1>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/book"
                className="h-11 px-7 flex items-center justify-center rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold hover:bg-[#DDA85E] active:bg-[#C8963E] transition-colors duration-150 select-none relative overflow-hidden shadow-[0_0_18px_rgba(235,186,111,0.35),0_0_36px_rgba(235,186,111,0.15)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {/* Shimmer sweep — same cadence as the navbar CTA */}
                <motion.span
                  className="pointer-events-none absolute inset-0 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-120%', '220%'] }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' }}
                  aria-hidden
                />
                <span className="relative z-10">Get a Quote</span>
              </Link>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-7 flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1FBB59] text-white text-[14px] font-medium transition-colors duration-150"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <WhatsAppIcon size={17} />
                WhatsApp us
              </a>
            </div>
          </div>

          {/* Arrows */}
          <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className={`${ARROW} left-3 sm:left-5`}>
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next slide" className={`${ARROW} right-3 sm:right-5`}>
            <ChevronRight size={20} aria-hidden />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.caption}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${s.caption}`}
                aria-current={i === index}
                className={[
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-[#EBBA6F]' : 'w-1.5 bg-white/40 hover:bg-white/70',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
