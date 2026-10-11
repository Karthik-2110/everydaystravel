'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { VehicleVideo } from '../data/fleet'

interface Props {
  images:      string[]
  videos?:     VehicleVideo[]
  vehicleName: string
}

/**
 * The ground the crossfade passes through: #EBBA6F held at its own hue and
 * saturation and taken down to a tenth of its lightness. `mode="wait"` fades
 * the outgoing slide out before the incoming one arrives, so for a beat this
 * colour is the whole frame — black made that a blink, and the page's navy
 * made it look like something had failed to load.
 */
const FADE_GROUND = '#2D1D06'

// Photos and clips share one strip of thumbnails, so they share one list, with
// the clips leading it — a vehicle in motion sells harder than a still. A clip
// carries its poster frame, which stands in for it everywhere a photo would
// appear: the thumbnail, and the main pane before the first frame decodes.
type Slide =
  | { kind: 'image'; src: string; n: number }
  | { kind: 'video'; src: string; poster: string; n: number }

export default function VehicleImageGallery({ images, videos, vehicleName }: Props) {
  const [selected, setSelected] = useState(0)

  /**
   * The clips play through as one walkaround until somebody picks a tile, at
   * which point the gallery is theirs and stops moving on its own. Clicking a
   * clip counts as taking over too: it loops that one rather than running on
   * to the next.
   */
  const [sequencing, setSequencing] = useState(true)
  const reduceMotion = useReducedMotion()

  // `n` numbers each kind from one, so the labels read "video 2" and "image 2"
  // rather than taking their position in the combined strip.
  const clips = videos ?? []
  const slides: Slide[] = [
    ...clips.map((v, i): Slide => ({ kind: 'video', ...v, n: i + 1 })),
    ...images.map((src, i): Slide => ({ kind: 'image', src, n: i + 1 })),
  ]

  const current = slides[selected] ?? slides[0]

  // Auto-advance only while the sequence is running, and only around the
  // clips, which sit at the head of the list. Reduced motion opts out of the
  // hand-off entirely: the first clip just loops.
  const autoAdvance = sequencing && !reduceMotion && clips.length > 1

  const take = (i: number) => {
    setSequencing(false)
    setSelected(i)
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Main hero — no text, clean.

          3:2 rather than 16:9 throughout: the cabin stills are 4:3 off the
          camera, and a 16:9 frame cut a quarter of their height away. The
          thumbnails take the same ratio, so the strip is the hero in
          miniature rather than a differently-cropped set of the same shots. */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ aspectRatio: '3/2', backgroundColor: FADE_GROUND }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {current.kind === 'video' ? (
              /* No controls: the clip is a moving photograph, not something to
                 scrub. Muted is also what lets it autoplay at all — browsers
                 block unprompted playback with sound.

                 `loop` and `onEnded` are opposites: a clip that loops never
                 ends, so the one handing on to the next must not loop. */
              <video
                src={current.src}
                poster={current.poster}
                autoPlay
                muted
                loop={!autoAdvance}
                playsInline
                preload="metadata"
                aria-label={`${vehicleName} video ${current.n}`}
                onEnded={autoAdvance
                  ? () => setSelected((i) => (i + 1) % clips.length)
                  : undefined}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={current.src}
                alt={vehicleName}
                fill
                unoptimized
                priority
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => take(i)}
            aria-label={slide.kind === 'video' ? `Play video ${slide.n}` : `View image ${slide.n}`}
            aria-current={i === selected}
            className={[
              'relative rounded-xl overflow-hidden border-2 transition-all duration-200',
              i === selected
                ? 'border-[#EBBA6F] shadow-[0_0_0_1px_rgba(235,186,111,0.3)]'
                : 'border-transparent hover:border-white/25 opacity-60 hover:opacity-100',
            ].join(' ')}
            style={{ aspectRatio: '3/2' }}
          >
            <Image
              src={slide.kind === 'video' ? slide.poster : slide.src}
              alt={slide.kind === 'video' ? `${vehicleName} video ${slide.n}` : `${vehicleName} view ${slide.n}`}
              fill
              unoptimized
              className="object-cover"
            />
            {slide.kind === 'video' && (
              /* The badge is a share of the tile rather than a fixed 28px: at
                 320px the strip is four 35px-tall tiles, and a fixed badge
                 covered the photograph it was supposed to label. Clamped at
                 both ends so the triangle stays legible on the narrowest
                 phone and does not balloon on a wide screen. */
              <span className="absolute inset-0 grid place-items-center bg-black/25">
                <span
                  className="grid place-items-center rounded-full bg-black/55 ring-1 ring-white/30 backdrop-blur-sm"
                  style={{ height: 'clamp(14px, 36%, 28px)', aspectRatio: '1' }}
                >
                  <Play className="h-1/2 w-1/2 translate-x-[4%] fill-white text-white" />
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

    </div>
  )
}
