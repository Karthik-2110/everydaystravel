import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import VehicleImageGallery from '@/app/components/VehicleImageGallery'
import { V_CLASS_IMAGES, V_CLASS_VIDEOS } from '@/app/data/fleet'

// `AnimatePresence mode="wait"` holds the incoming slide until the outgoing one
// finishes exiting. In jsdom that exit never completes, so the crossfade is
// stubbed out — these tests are about which slide is shown, not how it arrives.
type MotionDivProps = React.ComponentProps<'div'> & {
  initial?:    unknown
  animate?:    unknown
  exit?:       unknown
  transition?: unknown
}

const reduceMotion = vi.fn(() => false)

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: MotionDivProps) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => reduceMotion(),
}))

/**
 * The gallery at the top of a vehicle page.
 *
 * The behaviour worth pinning is the hand-off: the clips play through as one
 * walkaround on load, and the moment somebody picks a tile the gallery stops
 * moving on its own. A sequence that kept advancing under a visitor who had
 * chosen a photo would be the page arguing with them.
 */

const NAME   = 'Mercedes-Benz V-Class Executive'
const CLIPS  = V_CLASS_VIDEOS
const PHOTOS = V_CLASS_IMAGES

const gallery = () =>
  render(<VehicleImageGallery images={PHOTOS} videos={CLIPS} vehicleName={NAME} />)

/** The clip in the main pane, or null when a photo is showing. */
const playing = (container: HTMLElement) => container.querySelector('video')

describe('VehicleImageGallery', () => {
  it('leads with the clips and numbers each kind from one', () => {
    gallery()
    expect(screen.getAllByRole('button', { name: /^play video/i })).toHaveLength(CLIPS.length)
    expect(screen.getAllByRole('button', { name: /^view image/i })).toHaveLength(PHOTOS.length)

    // "View image 3", not "View image 6" — position in the combined strip is
    // not what a visitor is counting.
    expect(screen.getByRole('button', { name: 'Play video 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View image 1' })).toBeInTheDocument()
  })

  it('opens on the first clip, playing muted with no controls', () => {
    const { container } = gallery()
    const clip = playing(container)!

    expect(clip).toHaveAttribute('src', CLIPS[0].src)
    expect(clip).toHaveAttribute('poster', CLIPS[0].poster)
    expect(clip).toHaveAttribute('autoplay')
    // Muted is what lets a browser autoplay it unprompted.
    expect(clip).toHaveProperty('muted', true)
    expect(clip).not.toHaveAttribute('controls')
  })

  it('hands on to the next clip when one ends, and wraps at the last', () => {
    const { container } = gallery()

    for (const next of [1, 2, 0]) {
      fireEvent.ended(playing(container)!)
      expect(playing(container)).toHaveAttribute('src', CLIPS[next].src)
    }
  })

  it('does not loop while sequencing, or the clip would never end', () => {
    // `loop` and `onEnded` are opposites: a looping clip fires no `ended`
    // event, so the hand-off would silently never happen.
    const { container } = gallery()
    expect(playing(container)).not.toHaveAttribute('loop')
  })

  it('stops advancing once a visitor picks a photo', async () => {
    const user = userEvent.setup()
    const { container } = gallery()

    await user.click(screen.getByRole('button', { name: 'View image 2' }))
    expect(playing(container)).toBeNull()
    expect(screen.getByRole('button', { name: 'View image 2' })).toHaveAttribute('aria-current', 'true')
  })

  it('loops a clip the visitor chose rather than running on to the next', async () => {
    const user = userEvent.setup()
    const { container } = gallery()

    await user.click(screen.getByRole('button', { name: 'Play video 2' }))
    const clip = playing(container)!
    expect(clip).toHaveAttribute('src', CLIPS[1].src)
    expect(clip).toHaveAttribute('loop')

    // And the sequence stays handed over: ending it changes nothing.
    fireEvent.ended(clip)
    expect(playing(container)).toHaveAttribute('src', CLIPS[1].src)
  })

  it('leaves the sequence alone for anyone who asked for less motion', () => {
    reduceMotion.mockReturnValueOnce(true)
    const { container } = gallery()

    const clip = playing(container)!
    expect(clip).toHaveAttribute('loop')
    fireEvent.ended(clip)
    expect(playing(container)).toHaveAttribute('src', CLIPS[0].src)
  })

  it('still works for a vehicle with photos and no clips', () => {
    const { container } = render(
      <VehicleImageGallery images={PHOTOS} vehicleName={NAME} />,
    )
    expect(playing(container)).toBeNull()
    expect(screen.getAllByRole('button', { name: /^view image/i })).toHaveLength(PHOTOS.length)
    expect(screen.queryByRole('button', { name: /^play video/i })).not.toBeInTheDocument()
  })
})
