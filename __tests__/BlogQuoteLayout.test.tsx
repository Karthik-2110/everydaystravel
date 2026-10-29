import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BlogQuoteLayout from '@/app/components/BlogQuoteLayout'
vi.mock('@/app/components/QuoteForm', () => ({ default: () => <form aria-label="Journey quote"><button>Request quote</button></form> }))
describe('Blog quote layout', () => {
  it('keeps one working quote form alongside the editorial content', () => {
    render(<BlogQuoteLayout><h1>Travel advice</h1></BlogQuoteLayout>)
    expect(screen.getByRole('heading', { name: 'Travel advice' })).toBeVisible()
    expect(screen.getAllByRole('form', { name: 'Journey quote' })).toHaveLength(1)
    expect(screen.getByRole('complementary', { name: 'Get a journey quote' })).toHaveClass('lg:sticky')
    expect(screen.getByRole('link', { name: 'Get a quote' })).toHaveAttribute('href', '#blog-quote')
  })
})
