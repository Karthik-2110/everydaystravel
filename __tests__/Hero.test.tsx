import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import Hero from '@/app/components/Hero'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, initial, animate, transition, variants, custom, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
    p: ({ children, initial, animate, transition, ...props }: any) => (
      <p {...props}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Hero', () => {
  it('renders the badge pill with correct text', () => {
    render(<Hero />)
    expect(screen.getByText(/PREMIUM COACH & MINIBUS HIRE/i)).toBeInTheDocument()
  })

  it('renders the two white headline lines', () => {
    render(<Hero />)
    expect(screen.getByText('Luxury Coach &')).toBeInTheDocument()
    expect(screen.getByText('Minibus Hire')).toBeInTheDocument()
  })

  it('renders the gold accent line', () => {
    render(<Hero />)
    expect(screen.getByText('Across the UK')).toBeInTheDocument()
  })

  it('renders the subtext paragraph', () => {
    render(<Hero />)
    expect(
      screen.getByText(/Reliable, professional transport for airport transfers/i)
    ).toBeInTheDocument()
  })

  it('renders the trust signal with 500+', () => {
    render(<Hero />)
    expect(screen.getByText(/500\+/)).toBeInTheDocument()
    expect(screen.getByText(/Trusted by/i)).toBeInTheDocument()
  })

  it('renders star rating with accessible label', () => {
    render(<Hero />)
    expect(screen.getByLabelText(/4 out of 5 stars/i)).toBeInTheDocument()
  })

  it('renders a section with full viewport height', () => {
    render(<Hero />)
    const section = screen.getByRole('region', { name: /hero/i })
    expect(section).toBeInTheDocument()
  })
})
