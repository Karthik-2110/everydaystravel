'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight } from 'lucide-react'
import QuoteForm from './QuoteForm'

type Mode = 'hero' | 'minimized' | 'modal'
const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export default function HeroQuoteForm({ compact = false }: { compact?: boolean }) {
  const anchor = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const busy = useRef(false)
  const animation = useRef<Animation | null>(null)
  const ghost = useRef<HTMLElement | null>(null)
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
  const [mode, setMode] = useState<Mode>('hero')
  const [moving, setMoving] = useState(false)
  const [height, setHeight] = useState(320)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 480 })

  useEffect(() => {
    return () => { animation.current?.cancel(); ghost.current?.remove() }
  }, [])

  useLayoutEffect(() => {
    if (!mounted) return
    const measure = () => {
      const rect = anchor.current?.getBoundingClientRect()
      if (rect && anchor.current) {
        const padding = getComputedStyle(anchor.current)
        const left = parseFloat(padding.paddingLeft) || 0
        const right = parseFloat(padding.paddingRight) || 0
        const next = { top: rect.top + window.scrollY, left: rect.left + window.scrollX + left, width: rect.width - left - right }
        setPosition((previous) => previous.top === next.top && previous.left === next.left && previous.width === next.width ? previous : next)
      }
      if (mode === 'hero' && card.current) setHeight(card.current.getBoundingClientRect().height)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (anchor.current) observer.observe(anchor.current)
    if (card.current) observer.observe(card.current)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [mounted, mode])

  // A tapered silhouette and staged horizontal/vertical compression evoke the
  // Dock's genie motion. Only a noninteractive snapshot travels; inputs stay mounted.
  const travel = useCallback(async (opening: boolean) => {
    const source = card.current
    const target = button.current
    if (!source || !target || !source.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = source.getBoundingClientRect()
    const dock = target.getBoundingClientRect()
    const copy = source.cloneNode(true) as HTMLElement
    copy.removeAttribute('data-quote-card')
    copy.removeAttribute('role')
    copy.removeAttribute('aria-modal')
    copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    copy.setAttribute('aria-hidden', 'true')
    copy.inert = true
    Object.assign(copy.style, {
      position: 'fixed', top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`,
      height: `${rect.height}px`, margin: '0', maxHeight: 'none', visibility: 'visible',
      pointerEvents: 'none', zIndex: '100', transformOrigin: '50% 100%', overflow: 'hidden',
    })
    document.body.appendChild(copy)
    ghost.current = copy
    setMoving(true)
    const dx = dock.left + dock.width / 2 - (rect.left + rect.width / 2)
    const dy = dock.top + dock.height / 2 - rect.bottom
    const frames = [
      { transform: 'translate(0, 0) scale(1, 1)', clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)', opacity: 1, borderRadius: '16px', offset: 0 },
      { transform: `translate(${dx * .15}px, ${dy * .12}px) scale(.96, .94)`, clipPath: 'polygon(0% 0%,100% 0%,68% 100%,32% 100%)', opacity: 1, offset: .28 },
      { transform: `translate(${dx * .78}px, ${dy * .7}px) scale(.4, .55)`, clipPath: 'polygon(12% 0%,88% 0%,54% 100%,46% 100%)', opacity: .85, offset: .7 },
      { transform: `translate(${dx}px, ${dy}px) scale(${dock.width / rect.width * .75}, .035)`, clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)', opacity: 0, borderRadius: '40px', offset: 1 },
    ]
    const flight = copy.animate(frames, { duration: 680, easing: 'cubic-bezier(.32, 0, .18, 1)', direction: opening ? 'reverse' : 'normal', fill: 'both' })
    animation.current = flight
    try { await flight.finished } catch { /* cancelled on unmount */ }
    copy.remove()
    ghost.current = null
    animation.current = null
    setMoving(false)
  }, [])

  const minimize = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    await travel(false)
    setMode('minimized')
    busy.current = false
    requestAnimationFrame(() => button.current?.focus({ preventScroll: true }))
  }, [travel])

  const restore = () => {
    if (busy.current) return
    const hero = anchor.current?.closest('section[aria-label="hero"]')?.getBoundingClientRect()
    // Restore inline while the hero still occupies the central reading area.
    const inHero = !hero || (hero.top <= window.innerHeight * .55 && hero.bottom >= window.innerHeight * .45)
    busy.current = true
    setMode(inHero ? 'hero' : 'modal')
    setMoving(true)
    requestAnimationFrame(async () => {
      await travel(true)
      setMoving(false)
      busy.current = false
      card.current?.querySelector<HTMLElement>('button, input')?.focus({ preventScroll: true })
    })
  }

  useEffect(() => {
    if (mode !== 'modal') return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const background = Array.from(document.body.children).filter((el): el is HTMLElement =>
      el instanceof HTMLElement && !el.hasAttribute('data-quote-layer') && !['SCRIPT', 'STYLE', 'LINK'].includes(el.tagName))
    const inertBefore = background.map((el) => el.inert)
    background.forEach((el) => { el.inert = true })
    const keydown = (event: KeyboardEvent) => {
      // Let open location suggestions and date/time pickers handle Escape first.
      if (event.key === 'Escape' && !document.querySelector('[data-slot="popover-content"]') && !card.current?.querySelector('[role="combobox"][aria-expanded="true"]')) {
        event.preventDefault()
        void minimize()
      }
      if (event.key === 'Tab') {
        const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-quote-card] button, [data-quote-card] input, [data-quote-card] select, [data-slot="popover-content"] button'))
          .filter((el) => !el.hasAttribute('disabled') && el.tabIndex >= 0 && el.getClientRects().length > 0)
        const first = elements[0], last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', keydown, true)
    return () => {
      document.body.style.overflow = previous
      background.forEach((el, i) => { el.inert = inertBefore[i] })
      document.removeEventListener('keydown', keydown, true)
    }
  }, [mode, minimize])

  return <>
    <div ref={anchor} style={{ height: mounted ? height : undefined }} className={compact ? 'w-full' : 'site-container mt-[42px]'}>
      {!mounted && <QuoteForm variant={compact ? 'compact' : 'panel'} docked />}
    </div>
    {mounted && createPortal(<div data-quote-layer="" style={{ display: 'contents' }}>
      {mode === 'modal' && <div className="quote-dock-backdrop" onClick={() => void minimize()} aria-hidden="true" />}
      <div ref={card} data-quote-card="" role={mode === 'modal' ? 'dialog' : undefined}
        aria-modal={mode === 'modal' ? true : undefined} aria-label={mode === 'modal' ? 'Get an instant quote' : undefined}
        className={mode === 'modal' ? 'quote-dock-modal' : 'absolute z-20'}
        inert={mode === 'minimized' || moving}
        style={{ ...(mode === 'modal' ? {} : position), visibility: mode === 'minimized' || moving ? 'hidden' : 'visible' }}>
        <QuoteForm variant={compact || mode === 'modal' ? 'compact' : 'panel'} docked onMinimize={() => void minimize()} />
      </div>
      <button ref={button} type="button" className="quote-dock-button" onClick={restore}
        aria-haspopup="dialog" aria-expanded={mode !== 'minimized'}
        style={{ visibility: mode === 'minimized' && !moving ? 'visible' : 'hidden' }}>
        <span>Get an Instant quote</span><ArrowUpRight size={18} aria-hidden />
      </button>
    </div>, document.body)}
  </>
}
