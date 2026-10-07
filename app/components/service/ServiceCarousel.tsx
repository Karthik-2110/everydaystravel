'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CarouselSlide } from '../../data/service-content'

/**
 * The photo panel beside a section's copy.
 *
 * A carousel rather than a single photo because the vehicle that runs a
 * transfer varies with the group, and one picture would quietly argue that we
 * only run the one in it.
 *
 * It advances only when somebody asks it to. An auto-playing panel next to a
 * column of text competes with the reading, and anybody who wants the next
 * picture can say so. Crossfade is skipped for anyone who has asked for less
 * motion; the picture still changes, it just does not animate.
 */
export default function ServiceCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  const count = slides.length
  const go = (next: number) => setIndex((next + count) % count)

  const slide = slides[index]

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-[#0D1221]"
        style={{ aspectRatio: '4/5' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Keeps the controls legible whatever the photo underneath is doing. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#06080F]/80 to-transparent"
        />

        {count > 1 && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4">
            {/* Dots double as the position readout, so no "3 of 4" label is needed. */}
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}: ${s.alt}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBBA6F] ${
                    i === index ? 'w-6 bg-[#EBBA6F]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {[
                { label: 'Previous photo', icon: ChevronLeft,  to: index - 1 },
                { label: 'Next photo',     icon: ChevronRight, to: index + 1 },
              ].map(({ label, icon: Icon, to }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(to)}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/25 bg-[#06080F]/60 text-white flex items-center justify-center hover:border-[#EBBA6F] hover:text-[#EBBA6F] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBBA6F]"
                >
                  <Icon size={17} strokeWidth={1.6} aria-hidden />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Announced on change for anyone who cannot see the photo swap. */}
      <p
        aria-live="polite"
        className="text-white/45 text-[13px] leading-snug"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {slide.alt}
      </p>
    </div>
  )
}
