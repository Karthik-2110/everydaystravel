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
  // The vehicle picker's gallery asks whether to animate before it crossfades.
  useReducedMotion: () => false,
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
// Pickup time is a clock dial now: open it, tap round the face, apply. Picking
// an hour swaps the dial over to minutes on its own.
function pickTime(id: string, hour: number, minute: number, period: string) {
  fireEvent.click(document.getElementById(id) as HTMLElement)
  const panel = screen.getByRole('dialog')
  fireEvent.click(within(panel).getByRole('button', { name: `${hour} hours` }))
  fireEvent.click(within(panel).getByRole('button', { name: `${minute} minutes` }))
  fireEvent.click(within(panel).getByRole('button', { name: period }))
  fireEvent.click(within(panel).getByRole('button', { name: /apply/i }))
}

function fillJourney(passengerCount = '67') {
  fireEvent.change(screen.getByLabelText('Pickup Location'), { target: { value: 'Heathrow Airport' } })
  fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'Central London' } })
  fireEvent.change(document.getElementById('bk-date')!, { target: { value: '2026-09-01' } })
  pickTime('bk-time', 9, 0, 'AM')
  fireEvent.change(screen.getByLabelText(/passenger count/i), { target: { value: passengerCount } })
  fireEvent.change(screen.getByLabelText('Journey Type'), { target: { value: 'Airport Transfers' } })
}

const next = () => fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

function fillContact() {
  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Ada Lovelace' } })
  fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'ada@example.com' } })
  fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '07538 724000' } })
}

const submit = () => fireEvent.click(screen.getByRole('button', { name: /request my quote/i }))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })))
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('BookingForm', () => {
  it('shows the four step names and only the current step fields', () => {
    render(<BookingForm />)
    expect(within(screen.getByRole('list', { name: 'Booking progress' })).getByText('Journey Details')).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Booking progress' })).getByText('Your Details')).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Booking progress' })).getByText('Additional Information')).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Booking progress' })).getByText('Choose Your Vehicle')).toBeInTheDocument()
  })

  it('retains journey details when returning to the previous step', () => {
    render(<BookingForm />)
    fillJourney()
    next()
    expect(screen.queryByLabelText('Pickup Location')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Go back to Journey Details' }))
    expect(screen.getByLabelText('Pickup Location')).toHaveValue('Heathrow Airport')
    expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument()
  })

  it('warns on tab close only while booking details are unsaved', () => {
    render(<BookingForm />)
    const attemptLeave = () => window.dispatchEvent(new Event('beforeunload', { cancelable: true }))
    expect(attemptLeave()).toBe(true)
    fireEvent.change(screen.getByLabelText('Pickup Location'), { target: { value: 'Heathrow Airport' } })
    expect(attemptLeave()).toBe(false)
    fireEvent.change(screen.getByLabelText('Pickup Location'), { target: { value: '' } })
    expect(attemptLeave()).toBe(true)
  })

  it('keeps the booking and its answers when the user cancels browser Back', () => {
    const originalUrl = window.location.href
    const originalState = window.history.state
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    window.history.replaceState({}, '', '/book')
    const view = render(<BookingForm />)
    try {
      fireEvent.change(screen.getByLabelText('Pickup Location'), { target: { value: 'Heathrow Airport' } })
      window.history.replaceState({}, '', '/services')
      window.dispatchEvent(new PopStateEvent('popstate'))
      expect(confirm).toHaveBeenCalledWith(expect.stringContaining('booking details will be lost'))
      expect(window.location.pathname).toBe('/book')
      expect(screen.getByLabelText('Pickup Location')).toHaveValue('Heathrow Airport')
    } finally {
      view.unmount()
      confirm.mockRestore()
      window.history.replaceState(originalState, '', originalUrl)
    }
  })

  it('blocks submit and shows errors when required fields are empty', async () => {
    render(<BookingForm />)
    next()

    await waitFor(() => {
      expect(screen.getByText('Pickup location is required')).toBeInTheDocument()
    })
    expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument()
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('rejects a malformed email address', async () => {
    render(<BookingForm />)
    fillJourney()
    next()
    fillContact()
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'not-an-email' } })
    next()

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
    fillJourney()
    next()
    fillContact()
    next()
    const vehicleSelect = screen.getByLabelText('Vehicle') as HTMLSelectElement

    fireEvent.click(screen.getByRole('button', { name: /executive coaches/i }))

    const options = within(vehicleSelect).getAllByRole('option').map((o) => o.textContent)
    expect(options.some((o) => /coach|turismo|tourliner|turas/i.test(o ?? ''))).toBe(true)
    expect(options.some((o) => /lamborghini/i.test(o ?? ''))).toBe(false)
  })

  it('selects a vehicle that fits and allows an override with all additional fields blank', async () => {
    render(<BookingForm />)
    fillJourney('12')
    next()
    fillContact()
    next()
    expect(screen.getByText(/for 12 passengers, we recommend/i)).toBeVisible()
    expect(screen.getByLabelText('Vehicle')).toHaveValue('16-seater-minibus')
    fireEvent.click(screen.getByRole('button', { name: /executive coaches/i }))
    next()
    expect(screen.getByRole('heading', { name: 'Additional Information (Optional step. You can request a quote now.)' })).toBeVisible()
    submit()
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1))
    const request = vi.mocked(fetch).mock.calls[0][1]
    expect(JSON.parse(String(request?.body))).toMatchObject({ vehicle: '35-seater-turas-midi', notes: '' })
  })

  it('adds and removes extra stops', () => {
    render(<BookingForm />)
    fillJourney()
    next()
    fillContact()
    next()
    next()
    expect(screen.queryByLabelText('Special Requests')).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Extra Stops'), { target: { value: 'Watford Junction' } })
    fireEvent.click(screen.getByRole('button', { name: /add stop/i }))

    expect(screen.getByText('Watford Junction')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /remove watford junction/i }))
    expect(screen.queryByText('Watford Junction')).not.toBeInTheDocument()
  })

  it('posts the full payload and shows the confirmation panel on success', async () => {
    render(<BookingForm />)
    fillJourney()
    next()
    fillContact()
    fireEvent.change(screen.getByLabelText('Company / Organisation'), { target: { value: 'Analytical Engines Ltd' } })
    next()
    next()
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
      passengers: '67',
      journeyType: 'oneway',
      serviceType: 'Airport Transfers',
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '07538 724000',
      company: 'Analytical Engines Ltd',
      flightDetails: 'BA123, T5',
      extraStops: ['Watford Junction'],
    })
    expect(body.vehicle).toBe('')

    await waitFor(() => {
      expect(screen.getByText(/quote request sent/i)).toBeInTheDocument()
    })
  })
})

// These tests cover the form's own fields. Cloudflare lifecycle and server
// enforcement are exercised separately in the verification tests.
vi.mock('@/app/components/HumanVerification', () => ({
  default: () => null,
  useHumanVerification: () => ({ token: 'verified-test-token', setToken: () => {}, resetKey: 0, reset: () => {} }),
}))
