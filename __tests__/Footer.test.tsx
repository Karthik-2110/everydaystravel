import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '@/app/components/Footer'

describe('Footer', () => {
  it('renders the footer landmark', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders contact bar with phone number', () => {
    render(<Footer />)
    expect(screen.getAllByText(/020 8941 8334/).length).toBeGreaterThan(0)
  })

  it('renders contact bar with email', () => {
    render(<Footer />)
    expect(screen.getAllByText(/info@everydaystravel\.co\.uk/).length).toBeGreaterThan(0)
  })

  it('renders opening hours in contact bar', () => {
    render(<Footer />)
    expect(screen.getByText(/Mon.*Fri.*7:00/i)).toBeInTheDocument()
    expect(screen.getByText(/Sat.*Sun.*8:00/i)).toBeInTheDocument()
  })

  it('renders Quick links section with all links', () => {
    render(<Footer />)
    expect(screen.getByRole('heading', { name: /quick links/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Our Fleet' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reviews' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Gallery' })).toBeInTheDocument()
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

  it('renders Get in touch section with contact details', () => {
    render(<Footer />)
    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument()
    expect(screen.getByText('London-based')).toBeInTheDocument()
    expect(screen.getByText('Available 24/7')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /chat on whatsapp/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get instant quote/i })).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('renders copyright notice', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Everydays Travel/)).toBeInTheDocument()
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument()
  })
})
