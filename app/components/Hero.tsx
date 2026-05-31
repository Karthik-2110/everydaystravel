'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { cdnUrl } from '@/app/lib/cloudinary'
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
}

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
          src={cdnUrl('IMG_0938_fhylhh', 2400)}
          alt="Everyday Travels coach on a scenic road with mountains in the background"
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
            className="text-white/70 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed mb-7 max-w-[400px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {subtext}
          </motion.p>

          {/* Trust row */}
          <motion.div {...fadeUp(0.75)} className="flex items-center gap-3">
            <div
              className="flex items-center gap-0.5"
              aria-label="4 out of 5 stars"
              role="img"
            >
              {[0, 1, 2, 3].map((i) => (
                <svg
                  key={i}
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  fill="#EBBA6F"
                  aria-hidden
                >
                  <path d="M10 1l2.4 4.9 5.3.8-3.9 3.8.9 5.3-4.7-2.5-4.8 2.5.9-5.3-3.8-3.8 5.3-.8L10 1z" />
                </svg>
              ))}
              <svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                fill="#EBBA6F"
                opacity="0.35"
                aria-hidden
              >
                <path d="M10 1l2.4 4.9 5.3.8-3.9 3.8.9 5.3-4.7-2.5-4.8 2.5.9-5.3-3.8-3.8 5.3-.8L10 1z" />
              </svg>
            </div>
            <p
              className="text-white/65 text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Trusted by{' '}
              <strong className="text-white font-semibold">500+</strong>{' '}
              customers
            </p>
          </motion.div>

        </div>
      </div>

      {/* Quote form */}
      <div className="relative z-10 w-full max-w-[1440px] pb-10">
        <QuoteForm />
      </div>

      {/* Trust bar */}
      <TrustBar />
    </section>
  )
}
