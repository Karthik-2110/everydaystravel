'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import type { Review } from '@/app/data/reviews'
import ReviewCard from './ReviewCard'
import styles from './ReviewMarquee.module.css'

export default function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offset = useRef(0)
  const width = useRef(0)
  const velocity = useRef(.032)
  const reducedMotion = useRef(false)
  const drag = useRef<{ id: number; x: number; offset: number; lastX: number; lastTime: number; velocity: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const geometry = useRef<{ viewportWidth: number; cards: { element: HTMLElement; center: number }[] }>({ viewportWidth: 0, cards: [] })
  const paint = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    track.style.transform = `translate3d(${-offset.current}px, 0, 0)`
    const half = geometry.current.viewportWidth / 2
    if (!half) return
    // A broad circular path: only 24px lower at desktop edges, 8px on phones.
    const rise = geometry.current.viewportWidth < 640 ? 8 : 24
    const radius = (half * half + rise * rise) / (2 * rise)
    for (const { element, center } of geometry.current.cards) {
      if (reducedMotion.current) {
        element.style.transform = 'none'
        continue
      }
      const x = Math.max(-half * 1.5, Math.min(half * 1.5, center - offset.current - half))
      const y = radius - Math.sqrt(Math.max(0, radius * radius - x * x))
      const tilt = Math.asin(Math.max(-1, Math.min(1, x / radius))) * 180 / Math.PI
      element.style.transform = `translate3d(0, ${y.toFixed(3)}px, 0) rotate(${tilt.toFixed(3)}deg)`
    }
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      reducedMotion.current = preference?.matches ?? false
      offset.current = 0
      paint()
    }
    updatePreference()
    preference?.addEventListener('change', updatePreference)
    const measure = () => {
      width.current = track.firstElementChild?.getBoundingClientRect().width ?? 0
      geometry.current = {
        viewportWidth: viewport.clientWidth,
        cards: Array.from(track.querySelectorAll<HTMLElement>(`.${styles.card}`)).map(element => ({ element, center: element.offsetLeft + element.offsetWidth / 2 })),
      }
      paint()
    }
    measure()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    observer?.observe(track)
    observer?.observe(viewport)
    let frame = 0
    let previous = 0
    const tick = (time: number) => {
      const elapsed = previous ? Math.min(time - previous, 64) : 0
      previous = time
      if (!reducedMotion.current && !drag.current && width.current) {
        // Exponential drag dissipates the release momentum and approaches the
        // gentle automatic velocity without snapping or reversing abruptly.
        const decay = Math.exp(-elapsed / 500)
        const distance = .032 * elapsed + (velocity.current - .032) * 500 * (1 - decay)
        velocity.current = .032 + (velocity.current - .032) * decay
        offset.current = ((offset.current + distance) % width.current + width.current) % width.current
        paint()
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      preference?.removeEventListener('change', updatePreference)
    }
  }, [reviews.length, paint])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || drag.current) return
    width.current = trackRef.current?.firstElementChild?.getBoundingClientRect().width ?? 0
    drag.current = { id: event.pointerId, x: event.clientX, offset: reducedMotion.current ? event.currentTarget.scrollLeft : offset.current, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0 }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    if (event.pointerType === 'mouse') event.preventDefault()
  }
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const active = drag.current
    if (!active || active.id !== event.pointerId) return
    const elapsed = Math.max(event.timeStamp - active.lastTime, 8)
    const sampledVelocity = (active.lastX - event.clientX) / elapsed
    active.velocity = Math.max(-1.6, Math.min(1.6, active.velocity * .35 + sampledVelocity * .65))
    active.lastX = event.clientX
    active.lastTime = event.timeStamp
    const next = active.offset + active.x - event.clientX
    if (reducedMotion.current) {
      event.currentTarget.scrollLeft = next
    } else if (width.current && trackRef.current) {
      offset.current = ((next % width.current) + width.current) % width.current
      paint()
    }
  }
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.id !== event.pointerId) return
    velocity.current = event.type === 'pointercancel' || event.timeStamp - drag.current.lastTime > 100 ? 0 : drag.current.velocity
    drag.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  if (!reviews.length) return null

  return (
    <section aria-label="Customer reviews" className="bg-[#F4EFE8] py-16 overflow-hidden">
      <div className="site-container mb-10 text-center">
        <h2 className="text-[#0C0F1C] text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.08] tracking-[-0.015em]" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          What our clients say about us
        </h2>
      </div>
      <div className={styles.marquee}>
        <div
          ref={viewportRef}
          role="region"
          aria-label="Scrolling customer reviews"
          tabIndex={0}
          className={styles.viewport}
          data-dragging={dragging}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onDragStart={event => event.preventDefault()}
          onKeyDown={event => {
            if (reducedMotion.current || !width.current || !trackRef.current) return
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
            event.preventDefault()
            const next = offset.current + (event.key === 'ArrowRight' ? 300 : -300)
            offset.current = ((next % width.current) + width.current) % width.current
            paint()
          }}
        >
          <div ref={trackRef} className={styles.track}>
            <div className={styles.group}>
              {reviews.map((review, index) => <div className={styles.card} key={`${review.name}-${index}`}><ReviewCard review={review} /></div>)}
            </div>
            <div className={`${styles.group} ${styles.duplicate}`} aria-hidden="true" inert>
              {reviews.map((review, index) => <div className={styles.card} key={`${review.name}-${index}`}><ReviewCard review={review} /></div>)}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
