import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import QuoteForm from '@/app/components/QuoteForm'
import React from 'react'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/app/components/PlacesAutocompleteField', () => {
  const mockValues: Record<string, string> = {
    'pickup-select': 'Manchester',
    'destination-select': 'Birmingham',
  }

  return {
    default: function MockPlacesAutocompleteField({ id, value, onChange, placeholder, ariaLabel }: any) {
      const mockValue = mockValues[id] || 'Unknown'

      // Auto-set the value on first render for testing
      React.useEffect(() => {
        if (!value) {
          onChange(mockValue)
        }
      }, [value, onChange, mockValue])

      return (
        <div>
          <button
            type="button"
            id={id}
            role="combobox"
            aria-label={ariaLabel}
          >
            {value || placeholder}
          </button>
          {value && (
            <div
              role="option"
              data-testid={`option-${id}`}
            >
              {value}
            </div>
          )}
        </div>
      )
    },
  }
})

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

  it('does not show name, email and phone fields initially', () => {
    render(<QuoteForm />)
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/phone/i)).not.toBeInTheDocument()
  })

  it('does not show Get a Free Quote button initially', () => {
    render(<QuoteForm />)
    expect(screen.queryByRole('button', { name: /get a free quote/i })).not.toBeInTheDocument()
  })

  it('shows email, phone and CTA after all fields are filled', async () => {
    render(<QuoteForm />)

    // PlacesAutocompleteField mock auto-sets pickup and destination via useEffect.
    // Wait for location values to propagate.
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Pickup location' })).toHaveTextContent('Manchester')
    })

    // Fill remaining required fields
    fireEvent.change(screen.getByLabelText('Passengers'), { target: { value: '4' } })

    // DatePickerField uses a button trigger with id="travel-date"; click it and
    // pick the last selectable day the calendar offers. Chosen dynamically so
    // the test does not rot as the real date moves past a hard-coded day.
    const travelDateBtn = document.getElementById('travel-date') as HTMLButtonElement
    fireEvent.click(travelDateBtn)
    await waitFor(() => {
      const days = screen
        .getAllByRole('button')
        .filter((b) => /day, \w+ \d+(st|nd|rd|th), \d{4}$/.test(b.getAttribute('aria-label') ?? ''))
        .filter((b) => !b.hasAttribute('disabled') && b.getAttribute('aria-disabled') !== 'true')
      expect(days.length).toBeGreaterThan(0)
      fireEvent.click(days[days.length - 1])
    })

    // Set pickup time — a clock dial, so it is tapped rather than typed into
    fireEvent.click(document.getElementById('pickup-time') as HTMLElement)
    const timePanel = screen.getByRole('dialog')
    fireEvent.click(within(timePanel).getByRole('button', { name: '9 hours' }))
    fireEvent.click(within(timePanel).getByRole('button', { name: '0 minutes' }))
    fireEvent.click(within(timePanel).getByRole('button', { name: 'AM' }))
    fireEvent.click(within(timePanel).getByRole('button', { name: /apply/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /get a free quote/i })).toBeInTheDocument()
    })

    // Full name leads the contact row, ahead of email.
    const contactFields = screen.getAllByRole('textbox').map((el) => el.id)
    expect(contactFields).toContain('full-name')
    expect(contactFields).toContain('email')
    expect(contactFields.indexOf('full-name')).toBeLessThan(contactFields.indexOf('email'))
  })

  // A spinner on a passenger count invites stray scroll-wheel edits, and the
  // native number input also accepts 'e', '+' and '-'. It is a plain text box
  // that keeps digits and nothing else.
  it('keeps the passenger count to digits, with no spinner', () => {
    render(<QuoteForm />)
    const pax = screen.getByLabelText('Passengers')

    expect(pax).toHaveAttribute('type', 'text')
    expect(pax).toHaveAttribute('inputmode', 'numeric')

    fireEvent.change(pax, { target: { value: '4e2abc' } })
    expect(pax).toHaveValue('42')

    // Nobody travels with zero passengers, so a leading zero never takes.
    fireEvent.change(pax, { target: { value: '0' } })
    expect(pax).toHaveValue('')
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
