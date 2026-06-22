import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import PlacesAutocompleteField from '@/app/components/PlacesAutocompleteField'

vi.mock('@/app/lib/google-maps-loader', () => ({
  loadGoogleMaps: vi.fn().mockResolvedValue(undefined),
}))

const mockGetPredictions = vi.fn()

function setupGoogle() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).google = {
    maps: {
      places: {
        AutocompleteService: vi.fn().mockImplementation(function () {
          return { getPlacePredictions: mockGetPredictions }
        }),
        PlacesServiceStatus: { OK: 'OK', ZERO_RESULTS: 'ZERO_RESULTS' },
      },
    },
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  setupGoogle()
})

afterEach(() => {
  vi.useRealTimers()
})

function renderField(value = '', onChange = vi.fn()) {
  return render(
    <PlacesAutocompleteField
      id="test-field"
      ariaLabel="Pickup location"
      value={value}
      onChange={onChange}
      placeholder="Enter pickup location"
    />
  )
}

describe('PlacesAutocompleteField', () => {
  it('renders an input with the placeholder when no value', () => {
    renderField()
    const input = screen.getByRole('combobox', { name: /pickup location/i })
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Enter pickup location')
  })

  it('renders the current value in the input', () => {
    renderField('London Heathrow Airport, London, UK')
    const input = screen.getByRole('combobox') as HTMLInputElement
    expect(input.value).toBe('London Heathrow Airport, London, UK')
  })

  it('calls onChange with typed text on every keystroke (free text)', () => {
    const onChange = vi.fn()
    renderField('', onChange)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Manchester' } })
    expect(onChange).toHaveBeenCalledWith('Manchester')
  })

  it('shows predictions after typing (debounced 300 ms)', async () => {
    vi.useFakeTimers()
    mockGetPredictions.mockImplementation(
      (_req: unknown, cb: (predictions: unknown[], status: string) => void) => {
        cb(
          [{ place_id: 'abc', description: 'Gatwick Airport, Horley, UK', structured_formatting: { main_text: 'Gatwick Airport' } }],
          'OK',
        )
      },
    )

    renderField('Gatwick')
    await act(async () => { await vi.runAllTimersAsync() })

    expect(screen.getByText('Gatwick Airport')).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('calls onChange with the full description when a prediction is selected', async () => {
    vi.useFakeTimers()
    const onChange = vi.fn()
    mockGetPredictions.mockImplementation(
      (_req: unknown, cb: (predictions: unknown[], status: string) => void) => {
        cb(
          [{ place_id: 'xyz', description: 'Gatwick Airport, Horley, UK', structured_formatting: { main_text: 'Gatwick Airport' } }],
          'OK',
        )
      },
    )

    renderField('Gatwick', onChange)
    await act(async () => { await vi.runAllTimersAsync() })

    fireEvent.mouseDown(screen.getByText('Gatwick Airport'))
    expect(onChange).toHaveBeenCalledWith('Gatwick Airport, Horley, UK')
  })

  it('closes the dropdown on Escape key', async () => {
    vi.useFakeTimers()
    mockGetPredictions.mockImplementation(
      (_req: unknown, cb: (predictions: unknown[], status: string) => void) => {
        cb(
          [{ place_id: 'abc', description: 'Gatwick Airport', structured_formatting: { main_text: 'Gatwick Airport' } }],
          'OK',
        )
      },
    )

    renderField('Gatwick')
    await act(async () => { await vi.runAllTimersAsync() })
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows no dropdown when the query returns no results', async () => {
    vi.useFakeTimers()
    mockGetPredictions.mockImplementation(
      (_req: unknown, cb: (predictions: unknown[], status: string) => void) => {
        cb([], 'ZERO_RESULTS')
      },
    )

    renderField('xyzzy')
    await act(async () => { await vi.runAllTimersAsync() })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
