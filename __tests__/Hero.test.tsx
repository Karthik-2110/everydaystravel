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
    a: ({ children, initial, animate, transition, whileHover, ...props }: any) => (
      <a {...props}>{children}</a>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Hero', () => {
  it('renders the badge pill with correct text', () => {
    render(<Hero />)
    expect(screen.getByText(/LUXURY COACH & MINIBUS HIRE/i)).toBeInTheDocument()
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

  it('renders the Trustpilot card with its score', () => {
    render(<Hero />)
    expect(screen.getByText('4.4')).toBeInTheDocument()
    expect(screen.getByText(/write a review/i)).toBeInTheDocument()
  })

  it('gives the Trustpilot card an accessible label', () => {
    render(<Hero />)
    expect(
      screen.getByLabelText(/trustpilot rating 4\.4 out of 5/i),
    ).toBeInTheDocument()
  })

  it('renders a section with full viewport height', () => {
    render(<Hero />)
    const section = screen.getByRole('region', { name: /hero/i })
    expect(section).toBeInTheDocument()
  })

  it('shows the call and WhatsApp CTAs when showContact is set, and no Instagram', () => {
    render(<Hero showContact />)
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /call 020 8941 8354/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /instagram/i })).not.toBeInTheDocument()
  })
})
