import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import QuoteForm from '@/app/components/QuoteForm'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('QuoteForm', () => {
  it('renders the Plan your journey label', () => {
    render(<QuoteForm />)
    expect(screen.getByText('Plan your journey')).toBeInTheDocument()
  })

  it('renders One way and Return toggles', () => {
    render(<QuoteForm />)
    expect(screen.getByRole('button', { name: /one way/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /return/i })).toBeInTheDocument()
  })

  it('One way is active by default', () => {
    render(<QuoteForm />)
    const oneWay = screen.getByRole('button', { name: /one way/i })
    expect(oneWay).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches to Return when clicked', () => {
    render(<QuoteForm />)
    const returnBtn = screen.getByRole('button', { name: /return/i })
    fireEvent.click(returnBtn)
    expect(returnBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /one way/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders all 5 main field labels', () => {
    render(<QuoteForm />)
    expect(screen.getByText('Pickup location')).toBeInTheDocument()
    expect(screen.getByText('Destination')).toBeInTheDocument()
    expect(screen.getByText('Passengers')).toBeInTheDocument()
    expect(screen.getByText('Travel date')).toBeInTheDocument()
    expect(screen.getByText('Pickup time')).toBeInTheDocument()
  })

  it('does not show email and phone fields initially', () => {
    render(<QuoteForm />)
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/phone/i)).not.toBeInTheDocument()
  })

  it('does not show Get Instant Quote button initially', () => {
    render(<QuoteForm />)
    expect(screen.queryByRole('button', { name: /get instant quote/i })).not.toBeInTheDocument()
  })

  it('shows email, phone and CTA after all fields are filled', async () => {
    render(<QuoteForm />)

    // Pickup: open combobox, click option
    fireEvent.click(screen.getByRole('combobox', { name: 'Pickup location' }))
    fireEvent.click(screen.getByRole('option', { name: 'Manchester' }))

    // Destination: open combobox, click option
    fireEvent.click(screen.getByRole('combobox', { name: 'Destination' }))
    fireEvent.click(screen.getByRole('option', { name: 'Birmingham' }))

    // Passengers: simple number input
    fireEvent.change(screen.getByLabelText('Passengers'), { target: { value: '4' } })

    fireEvent.change(screen.getByLabelText('Travel date'), { target: { value: '2026-06-01' } })
    fireEvent.change(screen.getByLabelText('Pickup time'), { target: { value: '09:00' } })

    await waitFor(() => {
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /get instant quote/i })).toBeInTheDocument()
    })
  })

  it('shows return date and time fields when Return is selected', async () => {
    render(<QuoteForm />)
    fireEvent.click(screen.getByRole('button', { name: /return/i }))
    await waitFor(() => {
      expect(screen.getByText('Return date')).toBeInTheDocument()
      expect(screen.getByText('Return time')).toBeInTheDocument()
    })
  })
})
