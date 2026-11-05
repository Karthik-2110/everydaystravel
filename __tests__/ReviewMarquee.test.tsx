import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ReviewMarquee from '@/app/components/ReviewMarquee'
import { ALL_REVIEWS } from '@/app/data/reviews'

describe('Review marquee', () => {
  it('keeps all real reviews accessible without exposing the loop duplicate', () => {
    render(<ReviewMarquee reviews={ALL_REVIEWS} />)
    const region = screen.getByRole('region', { name: 'Scrolling customer reviews' })
    expect(within(region).getAllByRole('article')).toHaveLength(ALL_REVIEWS.length)
    expect(within(region).getAllByRole('article')[0]).toHaveTextContent(ALL_REVIEWS[0].text)
  })

  it('has no playback buttons and supports dragging in either direction', () => {
    vi.stubGlobal('PointerEvent', MouseEvent)
    render(<ReviewMarquee reviews={ALL_REVIEWS} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    const region = screen.getByRole('region', { name: 'Scrolling customer reviews' })
    const track = region.firstElementChild as HTMLElement
    vi.spyOn(track.firstElementChild!, 'getBoundingClientRect').mockReturnValue({ width: 1000 } as DOMRect)
    region.setPointerCapture = vi.fn()
    region.releasePointerCapture = vi.fn()
    region.hasPointerCapture = vi.fn().mockReturnValue(true)
    fireEvent.pointerDown(region, { clientX: 200, button: 0 })
    fireEvent.pointerMove(region, { clientX: 100 })
    expect(track.style.transform).toBe('translate3d(-100px, 0, 0)')
    fireEvent.pointerMove(region, { clientX: 250 })
    expect(track.style.transform).toBe('translate3d(-950px, 0, 0)')
    fireEvent.pointerUp(region)
    expect(region).toHaveAttribute('data-dragging', 'false')
    vi.unstubAllGlobals()
  })
  it('keeps moving on hover, holds while grabbed, and releases with fading momentum', () => {
    vi.stubGlobal('PointerEvent', MouseEvent)
    let frame: FrameRequestCallback = () => {}
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frame = callback; return 1 })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    const view = render(<ReviewMarquee reviews={ALL_REVIEWS} />)
    const region = screen.getByRole('region', { name: 'Scrolling customer reviews' })
    const track = region.firstElementChild as HTMLElement
    vi.spyOn(track.firstElementChild!, 'getBoundingClientRect').mockReturnValue({ width: 10000 } as DOMRect)
    region.setPointerCapture = vi.fn()
    region.hasPointerCapture = vi.fn().mockReturnValue(false)
    const pointer = (type: string, x: number, time: number) => {
      const event = new MouseEvent(type, { clientX: x, button: 0, bubbles: true })
      Object.defineProperty(event, 'timeStamp', { value: time })
      fireEvent(region, event)
    }
    pointer('pointerdown', 200, 0)
    pointer('pointermove', 100, 50)
    const grabbed = track.style.transform
    act(() => frame(100))
    act(() => frame(116))
    expect(track.style.transform).toBe(grabbed)
    pointer('pointerup', 100, 60)
    fireEvent.pointerEnter(region)
    act(() => frame(132))
    const first = track.style.transform
    expect(first).not.toBe(grabbed)
    for (let time = 148; time <= 3148; time += 16) act(() => frame(time))
    const before = +(track.style.transform.match(/translate3d\((-?[\d.]+)/)![1])
    act(() => frame(3164))
    const after = +(track.style.transform.match(/translate3d\((-?[\d.]+)/)![1])
    expect(before - after).toBeGreaterThan(0)
    expect(before - after).toBeLessThan(1)
    view.unmount()
    vi.unstubAllGlobals()
  })

})
