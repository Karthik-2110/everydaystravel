'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import QuoteForm from './QuoteForm'
import TrustBar from './TrustBar'

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
  badge    = 'Premium Coach & Minibus Hire',
  lines    = DEFAULT_LINES,
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#060810]/90 via-[#0C0F1C]/60 to-[#0C0F1C]/0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0F1C]/40 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F1C] via-[#0C0F1C]/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-36 pb-10">
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

          {/* Headline — staggered line-by-line entrance */}
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

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.6)}
            className="text-white/70 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed mb-5 max-w-[400px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {subtext}
          </motion.p>

          {/* Trustpilot card */}
          <motion.a
            {...fadeUp(0.75)}
            href="https://www.trustpilot.com/evaluate/everydaystravel.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 sm:gap-4 bg-white rounded-xl px-3.5 sm:px-5 py-3 sm:py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_32px_rgba(0,0,0,0.28)] transition-shadow duration-200 group"
          >
            {/* Wordmark */}
            <div className="flex items-center gap-1.5 shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#00B67A" aria-hidden>
                <path d="M12 2l2.582 7.953H22l-6.29 4.573 2.4 7.388L12 17.35l-6.11 4.564 2.4-7.388L2 9.953h7.418L12 2z" />
              </svg>
              <span className="text-[12px] sm:text-[13px] font-bold text-[#191919] tracking-[-0.01em]" style={{ fontFamily: 'var(--font-ui)' }}>
                Trustpilot
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-6 sm:h-8 bg-black/10 shrink-0" />

            {/* Score + stars */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-[18px] sm:text-[24px] font-semibold text-[#191919] leading-none" style={{ fontFamily: 'var(--font-ui)' }}>
                4.4
              </span>
              <img
                src="https://res.cloudinary.com/dckyndryf/image/upload/v1780237231/stars-5_w1ckxp.svg"
                alt="5 stars"
                className="h-[15px] sm:h-[20px] w-auto"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-6 sm:h-8 bg-black/10 shrink-0" />

            {/* CTA */}
            <span
              className="text-[12px] sm:text-[13px] font-semibold text-white bg-[#00B67A] px-2.5 py-1.5 sm:px-3.5 rounded-lg shrink-0 group-hover:bg-[#00a368] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Write a review
            </span>
          </motion.a>

        </div>
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
