import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import BookingForm from '@/app/components/booking/BookingForm'
import React from 'react'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    p: ({ children, initial, animate, exit, transition, ...props }: any) => (
      <p {...props}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Places autocomplete talks to Google — swap for a plain text input
vi.mock('@/app/components/PlacesAutocompleteField', () => ({
  default: function MockPlaces({ id, value, onChange, placeholder, ariaLabel }: any) {
    return (
      <input
        id={id}
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  },
}))

// DatePickerField opens a Radix popover — swap for a native date input
vi.mock('@/app/components/DatePickerField', () => ({
  default: function MockDatePicker({ id, value, onChange }: any) {
    return <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} />
  },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Fill every required field so submit is expected to succeed. */
function fillRequired() {
  fireEvent.change(screen.getByLabelText('Pickup Location'), { target: { value: 'Heathrow Airport' } })
  fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'Central London' } })
  fireEvent.change(document.getElementById('bk-date')!, { target: { value: '2026-09-01' } })
  fireEvent.change(screen.getByLabelText('Pickup Time'), { target: { value: '09:00' } })
  fireEvent.change(screen.getByLabelText('Passenger Count'), { target: { value: '12' } })
  fireEvent.change(screen.getByLabelText('Journey Type'), { target: { value: 'Airport Transfers' } })
  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Ada Lovelace' } })
  fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'ada@example.com' } })
  fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '07000 000000' } })
}

const submit = () => fireEvent.click(screen.getByRole('button', { name: /request my quote/i }))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })))
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('BookingForm', () => {
  it('renders the four numbered sections', () => {
    render(<BookingForm />)
    expect(screen.getByText('Journey Details')).toBeInTheDocument()
    expect(screen.getByText('Your Details')).toBeInTheDocument()
    expect(screen.getByText('Additional Information')).toBeInTheDocument()
    expect(screen.getByText('Choose Your Vehicle')).toBeInTheDocument()
  })

  it('blocks submit and shows errors when required fields are empty', async () => {
    render(<BookingForm />)
    submit()

    await waitFor(() => {
      expect(screen.getByText('Pickup location is required')).toBeInTheDocument()
    })
    expect(screen.getByText('Full name is required')).toBeInTheDocument()
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('rejects a malformed email address', async () => {
    render(<BookingForm />)
    fillRequired()
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'not-an-email' } })
    submit()

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('reveals return date and time when the return journey toggle is switched on', () => {
    render(<BookingForm />)
    expect(screen.queryByLabelText('Return Date')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch', { name: /return journey/i }))

    expect(screen.getByLabelText('Return Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Return Time')).toBeInTheDocument()
  })

  it('swaps the vehicle list when a different category tab is chosen', () => {
    render(<BookingForm />)
    const vehicleSelect = screen.getByLabelText('Vehicle') as HTMLSelectElement

    fireEvent.click(screen.getByRole('button', { name: /executive coaches/i }))

    const options = within(vehicleSelect).getAllByRole('option').map((o) => o.textContent)
    expect(options.some((o) => /coach|turismo|tourliner|turas/i.test(o ?? ''))).toBe(true)
    expect(options.some((o) => /lamborghini/i.test(o ?? ''))).toBe(false)
  })

  it('adds and removes extra stops', () => {
    render(<BookingForm />)
    fireEvent.change(screen.getByLabelText('Extra Stops'), { target: { value: 'Watford Junction' } })
    fireEvent.click(screen.getByRole('button', { name: /add stop/i }))

    expect(screen.getByText('Watford Junction')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /remove watford junction/i }))
    expect(screen.queryByText('Watford Junction')).not.toBeInTheDocument()
  })

  it('posts the full payload and shows the confirmation panel on success', async () => {
    render(<BookingForm />)
    fillRequired()
    fireEvent.change(screen.getByLabelText('Company / Organisation'), { target: { value: 'Analytical Engines Ltd' } })
    fireEvent.change(screen.getByLabelText(/flight \/ train details/i), { target: { value: 'BA123, T5' } })
    fireEvent.change(screen.getByLabelText('Extra Stops'), { target: { value: 'Watford Junction' } })
    fireEvent.click(screen.getByRole('button', { name: /add stop/i }))
    submit()

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1))

    const [url, init] = (globalThis.fetch as any).mock.calls[0]
    expect(url).toBe('/api/quote')
    const body = JSON.parse(init.body)
    expect(body).toMatchObject({
      pickup: 'Heathrow Airport',
      destination: 'Central London',
      travelDate: '2026-09-01',
      pickupTime: '09:00',
      passengers: '12',
      journeyType: 'oneway',
      serviceType: 'Airport Transfers',
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '07000 000000',
      company: 'Analytical Engines Ltd',
      flightDetails: 'BA123, T5',
      extraStops: ['Watford Junction'],
    })
    expect(body.vehicle).toBeTruthy()

    await waitFor(() => {
      expect(screen.getByText(/quote request sent/i)).toBeInTheDocument()
    })
  })
})
