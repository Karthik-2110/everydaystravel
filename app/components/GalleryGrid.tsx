'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react'

export type GalleryItem = {
  kind: 'image' | 'video'
  src: string
  poster?: string
  label: string
  href: string
}

const thumb = (url: string) => url.replace(/w_\d+/, 'w_800')
const controlClass = 'grid size-11 shrink-0 place-items-center rounded-full border border-white/25 bg-[#0C0F1C]/90 text-white hover:border-[#EBBA6F] hover:text-[#EBBA6F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBBA6F]'

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const active = selected === null ? null : items[selected]
  const open = selected !== null
  const close = () => { dialog.current?.close(); setSelected(null) }
  const move = (direction: number) => setSelected(index => index === null ? null : (index + direction + items.length) % items.length)

  useEffect(() => {
    if (!open) return
    const element = dialog.current!
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open])

  return (
    <>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <button key={`${item.kind}-${item.src}`} type="button" onClick={() => setSelected(index)} aria-label={`View ${item.label} ${item.kind} ${index + 1}`} className="group relative aspect-square overflow-hidden rounded-lg bg-[#0D1221] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBBA6F] sm:rounded-xl">
            <Image src={thumb(item.poster ?? item.src)} alt={item.label} fill unoptimized sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/85 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            {item.kind === 'video' && <span className="absolute inset-0 grid place-items-center"><span className={controlClass}><Play size={22} aria-hidden /></span></span>}
            <span className="absolute inset-x-3 bottom-3 translate-y-1 text-left text-sm font-medium text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">{item.label}</span>
          </button>
        ))}
      </div>
      <dialog ref={dialog} aria-label="Gallery viewer" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) close() }} onKeyDown={event => {
        // Let native video controls retain their arrow-key behaviour.
        if ((event.target as HTMLElement).tagName === 'VIDEO') return
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
      }} className="fixed inset-0 m-auto h-[80dvh] max-h-[80dvh] w-[94vw] max-w-none overflow-hidden rounded-2xl border border-white/20 bg-[#0C0F1C] p-0 text-white shadow-2xl backdrop:bg-black/85 sm:w-[80vw]">
        {active && <div className="flex h-full flex-col">
          <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4">
            <p id="gallery-current" className="truncate text-sm font-medium" aria-live="polite">{active.label} <span className="text-white/50">{selected! + 1} / {items.length}</span></p>
            <button type="button" aria-label="Close gallery" onClick={close} className={controlClass}><X size={21} aria-hidden /></button>
          </div>
          <div className="relative min-h-0 flex-1">
            {active.kind === 'video' ? <video key={active.src} src={active.src} poster={active.poster} autoPlay muted controls playsInline preload="metadata" aria-label={active.label} className="h-full w-full object-contain" /> : <Image key={active.src} src={active.src} alt={active.label} fill unoptimized sizes="80vw" className="object-contain" />}
            {items.length > 1 && <>
              <button type="button" aria-label="Previous gallery item" onClick={() => move(-1)} className={`absolute left-2 top-1/2 -translate-y-1/2 sm:left-4 ${controlClass}`}><ChevronLeft size={24} aria-hidden /></button>
              <button type="button" aria-label="Next gallery item" onClick={() => move(1)} className={`absolute right-2 top-1/2 -translate-y-1/2 sm:right-4 ${controlClass}`}><ChevronRight size={24} aria-hidden /></button>
            </>}
          </div>
          <div className="flex min-h-18 shrink-0 justify-end border-t border-white/10 p-3 sm:px-4"><Link href={active.href} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#EBBA6F] px-5 py-2 text-sm font-semibold text-[#0C0F1C] hover:bg-[#DDA85E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBBA6F]">Know more<ArrowUpRight size={18} aria-hidden /></Link></div>
        </div>}
      </dialog>
    </>
  )
}
