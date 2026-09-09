import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '@/app/components/Footer'

describe('Footer', () => {
  it('renders the footer landmark', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders contact bar with phone number', () => {
    render(<Footer />)
    expect(screen.getAllByText(/020 8941 8354/).length).toBeGreaterThan(0)
  })

  it('renders contact bar with email', () => {
    render(<Footer />)
    expect(screen.getAllByText(/info@everydaystravel\.co\.uk/).length).toBeGreaterThan(0)
  })

  it('renders opening hours in contact bar', () => {
    render(<Footer />)
    expect(screen.getAllByText(/Mon.*Fri.*7:00/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Sat.*Sun.*8:00/i).length).toBeGreaterThan(0)
  })

  it('renders Quick links section with all links', () => {
    render(<Footer />)
    expect(screen.getByRole('heading', { name: /quick links/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Our Fleet' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reviews' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact Us' })).toBeInTheDocument()
  })

  it('renders Our services section with all items', () => {
    render(<Footer />)
    expect(screen.getByRole('heading', { name: /our services/i })).toBeInTheDocument()
    expect(screen.getByText('Airport Transfers')).toBeInTheDocument()
    expect(screen.getByText('Weddings & Events')).toBeInTheDocument()
    expect(screen.getByText('Corporate Travel')).toBeInTheDocument()
    expect(screen.getByText('Group Travel')).toBeInTheDocument()
    expect(screen.getByText('School Trips')).toBeInTheDocument()
  })

  it('renders Contact us section with contact details', () => {
    render(<Footer />)
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument()
    expect(screen.getByText(/UK & European travel/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Feltham/i).length).toBeGreaterThan(0)
  })

  it('renders CTA buttons', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /chat on whatsapp/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get a free quote/i })).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('fills each social circle with its brand colour', () => {
    render(<Footer />)
    const socials = within(screen.getByTestId('footer-socials'))
    expect(socials.getByRole('link', { name: /whatsapp/i })).toHaveStyle({ background: '#25D366' })
    expect(socials.getByRole('link', { name: /facebook/i })).toHaveStyle({ background: '#1877F2' })
    expect(socials.getByRole('link', { name: /linkedin/i })).toHaveStyle({ background: '#0A66C2' })
    // Instagram is a gradient, so assert the declaration rather than a colour.
    expect(socials.getByRole('link', { name: /instagram/i }).getAttribute('style'))
      .toContain('linear-gradient')
  })

  it('draws the social glyphs at 20px', () => {
    render(<Footer />)
    const socials = within(screen.getByTestId('footer-socials'))
    for (const name of [/instagram/i, /facebook/i, /whatsapp/i, /linkedin/i]) {
      const svg = socials.getByRole('link', { name }).querySelector('svg')
      expect(svg).toHaveAttribute('width', '20')
      expect(svg).toHaveAttribute('height', '20')
    }
  })

  it('renders copyright notice', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Everydays Travel/)).toBeInTheDocument()
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument()
  })
})
