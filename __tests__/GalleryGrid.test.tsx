import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import GalleryGrid, { type GalleryItem } from '@/app/components/GalleryGrid'

const items: GalleryItem[] = [
  { kind: 'image', src: 'https://res.cloudinary.com/test/image/upload/car.jpg', label: 'S-Class', href: '/fleet/chauffeur-cars/mercedes-s-class' },
  { kind: 'video', src: 'https://res.cloudinary.com/test/video/upload/coach.mp4', poster: 'https://res.cloudinary.com/test/image/upload/coach.jpg', label: 'Coach', href: '/fleet/executive-coaches/53-seater-coach' },
]

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute('open') } })
})
afterEach(() => { cleanup(); vi.restoreAllMocks() })

it('opens the photo viewer, navigates videos and wraps with the related detail link', () => {
  const { container } = render(<GalleryGrid items={items} />)
  fireEvent.click(screen.getByRole('button', { name: 'View S-Class image 1' }))
  expect(screen.getByRole('dialog', { name: 'Gallery viewer' })).toBeVisible()
  expect(document.body.style.overflow).toBe('hidden')
  expect(screen.getByRole('link', { name: 'Know more' })).toHaveAttribute('href', items[0].href)
  fireEvent.click(screen.getByRole('button', { name: 'Next gallery item' }))
  expect(container.querySelector('video')).toHaveAttribute('src', items[1].src)
  expect(container.querySelector('video')).toHaveAttribute('controls')
  expect(screen.getByRole('link', { name: 'Know more' })).toHaveAttribute('href', items[1].href)
  fireEvent.click(screen.getByRole('button', { name: 'Next gallery item' }))
  expect(container.querySelector('video')).toBeNull()
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowLeft' })
  expect(container.querySelector('video')).toHaveAttribute('src', items[1].src)
  fireEvent.click(screen.getByRole('button', { name: 'Close gallery' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(document.body.style.overflow).toBe('')
})

it('supports Escape and restores the opener focus', () => {
  render(<GalleryGrid items={items} />)
  const opener = screen.getByRole('button', { name: 'View S-Class image 1' })
  opener.focus()
  fireEvent.click(opener)
  fireEvent(screen.getByRole('dialog'), new Event('cancel'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(opener).toHaveFocus()
})
