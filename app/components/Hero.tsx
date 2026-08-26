'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import QuoteForm from './QuoteForm'
import TrustBar from './TrustBar'
import { WhatsAppIcon, WHATSAPP_HREF } from './icons/social'
import { PHONE, PHONE_HREF } from './contact/contact-details'

// ── Animation helpers ───────────────────────────────────────────────────────

const lineVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
}

const fadeUp = (delay: number): {
  initial: { opacity: number; y: number }
  animate: { opacity: number; y: number }
  transition: { delay: number; duration: number; ease: [number, number, number, number] }
} => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

// ── Types ───────────────────────────────────────────────────────────────────

export interface HeroLine { text: string; accent: boolean }

export interface HeroProps {
  badge?:    string
  lines?:    HeroLine[]
  /** When set, replaces the large headline with a short story block. */
  story?:    string[]
  storyCta?: string
  /** Show the call + WhatsApp buttons under the copy. */
  showContact?: boolean
  subtext?:  string
  videoSrc?: string
  imageSrc?: string
}

const DEFAULT_HERO_IMAGE =
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783784686/DSC09063_xjmaio.jpg'

const DEFAULT_LINES: HeroLine[] = [
  { text: 'Luxury Coach &', accent: false },
  { text: 'Minibus Hire',   accent: false },
  { text: 'Across the UK',  accent: true  },
]

// ── Component ───────────────────────────────────────────────────────────────

export default function Hero({
  badge    = 'Luxury Coach & Minibus Hire',
  lines    = DEFAULT_LINES,
  story,
  storyCta,
  showContact = false,
  subtext  = 'Reliable, professional transport for airport transfers, events and group travel.',
  videoSrc,
  imageSrc = DEFAULT_HERO_IMAGE,
}: HeroProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [])
  return (
    <section
      aria-label="hero"
      className="relative flex flex-col min-h-screen bg-[#0C0F1C]"
    >
      {/* Background — video or image */}
      {videoSrc ? (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          autoPlay
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          {/* WebM/VP9 for Chrome & Firefox */}
          <source src={videoSrc.replace('/upload/', '/upload/vc_vp9,q_auto/')} type="video/webm" />
          {/* H.264 MP4 for Safari — universally supported */}
          <source src={videoSrc.replace('/upload/', '/upload/vc_h264,q_auto/') + '.mp4'} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={imageSrc}
          alt="Everyday Travels fleet of luxury coaches"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      )}

      {/* Gradient layers */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[80%] bg-gradient-to-r from-[#060810]/95 via-[#060810]/72 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0F1C]/40 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F1C] via-[#0C0F1C]/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 lg:pt-36 pb-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-10">
        <div className="max-w-[560px] lg:max-w-[660px]">

          {/* Badge pill */}
          <motion.div
            {...fadeUp(0.05)}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[#0C0F1C]/55 border border-white/15 backdrop-blur-sm"
          >
            <span
              className="text-[#EBBA6F] text-[11px] font-medium tracking-[0.16em] uppercase"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {badge}
            </span>
          </motion.div>

          {story ? (
            /* Story block — replaces the large headline */
            <div className="mb-7 sm:mb-8 max-w-[640px]">
              <h1 className="sr-only">{lines.map((l) => l.text).join(' ')}</h1>
              {story.map((para, i) => (
                <motion.p
                  key={para}
                  className={
                    i === 0
                      ? 'text-white text-[clamp(1.5rem,4.5vw,2.5rem)] leading-[1.3] sm:leading-[1.25] tracking-[-0.01em] mb-5 sm:mb-6'
                      : 'text-white/90 text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.7] sm:leading-[1.8] mb-4 sm:mb-5 last:mb-0 max-w-[56ch]'
                  }
                  style={{
                    fontFamily: i === 0 ? 'var(--font-display)' : 'var(--font-body)',
                    fontWeight: i === 0 ? 300 : undefined,
                    textShadow: '0 2px 18px rgba(6,8,16,0.85), 0 1px 3px rgba(6,8,16,0.6)',
                  }}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  {para}
                </motion.p>
              ))}
              {storyCta && (
                <motion.p
                  className="mt-6 sm:mt-7 text-[#EBBA6F] text-[clamp(0.9rem,1.2vw,1.1rem)] font-medium tracking-[0.12em] sm:tracking-[0.14em] uppercase"
                  style={{ fontFamily: 'var(--font-ui)', textShadow: '0 2px 18px rgba(6,8,16,0.85)' }}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  custom={story.length}
                >
                  {storyCta}
                </motion.p>
              )}
            </div>
          ) : (
            /* Headline — staggered line-by-line entrance */
            <h1
              className="mb-7 leading-[0.91] tracking-[-0.015em]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
            >
              {lines.map((line, i) => (
                <motion.span
                  key={line.text}
                  className={[
                    'block text-[clamp(3rem,6.5vw,5.8rem)]',
                    line.accent ? 'text-[#EBBA6F]' : 'text-white',
                  ].join(' ')}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>
          )}

          {/* Subtext */}
          {subtext && (
            <motion.p
              {...fadeUp(0.6)}
              className="text-white/70 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed mb-5 max-w-[400px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {subtext}
            </motion.p>
          )}

          {/* Call + WhatsApp */}
          {showContact && (
            <motion.div
              {...fadeUp(0.8)}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <a
                href={PHONE_HREF}
                aria-label={`Call ${PHONE}`}
                className="h-12 w-full sm:w-auto px-6 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[15px] font-semibold hover:bg-[#DDA85E] active:bg-[#C8963E] transition-colors duration-150 shadow-[0_0_18px_rgba(235,186,111,0.35),0_0_36px_rgba(235,186,111,0.15)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <Phone size={17} aria-hidden />
                {PHONE}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-full sm:w-auto px-6 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1FBB59] text-white text-[15px] font-medium transition-colors duration-150"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <WhatsAppIcon size={18} />
                WhatsApp us
              </a>
            </motion.div>
          )}

        </div>

        {/* Trustpilot card — sits opposite the copy, top-right of the hero */}
        <motion.a
          {...fadeUp(0.9)}
          href="https://www.trustpilot.com/evaluate/everydaystravel.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Trustpilot rating 4.4 out of 5 — write a review"
          className="self-start lg:self-auto shrink-0 inline-flex items-center gap-2.5 sm:gap-3 bg-white rounded-lg px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_32px_rgba(0,0,0,0.28)] transition-shadow duration-200 group"
        >
          {/* Score + stars */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[15px] sm:text-[17px] font-semibold text-[#191919] leading-none" style={{ fontFamily: 'var(--font-ui)' }}>
              4.4
            </span>
            <img
              src="https://res.cloudinary.com/dckyndryf/image/upload/v1780237231/stars-5_w1ckxp.svg"
              alt="5 stars"
              className="h-[13px] sm:h-[15px] w-auto"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-5 sm:h-6 bg-black/10 shrink-0" />

          {/* CTA */}
          <span
            className="text-[11px] sm:text-[12px] font-semibold text-white bg-[#00B67A] px-2.5 py-1.5 rounded-md shrink-0 group-hover:bg-[#00a368] transition-colors duration-150"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Write a review
          </span>
        </motion.a>
      </div>

      {/* Quote form */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto pb-10">
        <QuoteForm />
      </div>

      {/* Trust bar */}
      <TrustBar />
    </section>
  )
}
