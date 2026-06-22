import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import PlacesAutocompleteField from '@/app/components/PlacesAutocompleteField'

// Mock the loader so no real network calls happen
vi.mock('@/app/lib/google-maps-loader', () => ({
  loadGoogleMaps: vi.fn().mockResolvedValue(undefined),
}))

// Stub window.google.maps.places before each test
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
  // Ensure real timers are restored even if a test failed mid-flight
  vi.useRealTimers()
})

function renderField(value = '', onChange = vi.fn()) {
  return render(
    <PlacesAutocompleteField
      id="test-field"
      ariaLabel="Pickup location"
      value={value}
      onChange={onChange}
      placeholder="Search locations…"
    />
  )
}

describe('PlacesAutocompleteField', () => {
  it('renders the placeholder when no value is selected', () => {
    renderField()
    expect(screen.getByRole('combobox', { name: /pickup location/i })).toBeInTheDocument()
    expect(screen.getByText('Search locations…')).toBeInTheDocument()
  })

  it('renders the selected value when one is provided', () => {
    renderField('London Heathrow Airport, London, UK')
    expect(screen.getByText('London Heathrow Airport, London, UK')).toBeInTheDocument()
  })

  it('opens the dropdown on trigger click', () => {
    renderField()
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search locations…')).toBeVisible()
  })

  it('shows predictions after typing', async () => {
    vi.useFakeTimers()
    mockGetPredictions.mockImplementation(
      (
        _req: unknown,
        cb: (predictions: unknown[], status: string) => void,
      ) => {
        cb(
          [
            {
              place_id: 'abc123',
              description: 'Gatwick Airport, Horley, UK',
              structured_formatting: { main_text: 'Gatwick Airport' },
            },
          ],
          'OK',
        )
      },
    )

    renderField()
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.change(screen.getByPlaceholderText('Search locations…'), {
      target: { value: 'Gatwick' },
    })

    // Flush the 300ms debounce + any queued microtasks/state updates
    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(screen.getByText('Gatwick Airport')).toBeInTheDocument()
  })

  it('calls onChange with the full description when a prediction is selected', async () => {
    vi.useFakeTimers()
    const onChange = vi.fn()
    mockGetPredictions.mockImplementation(
      (
        _req: unknown,
        cb: (predictions: unknown[], status: string) => void,
      ) => {
        cb(
          [
            {
              place_id: 'xyz',
              description: 'Gatwick Airport, Horley, UK',
              structured_formatting: { main_text: 'Gatwick Airport' },
            },
          ],
          'OK',
        )
      },
    )

    renderField('', onChange)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.change(screen.getByPlaceholderText('Search locations…'), {
      target: { value: 'Gatwick' },
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    fireEvent.click(screen.getByText('Gatwick Airport'))
    expect(onChange).toHaveBeenCalledWith('Gatwick Airport, Horley, UK')
  })

  it('closes on Escape key', () => {
    renderField()
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search locations…')).toBeVisible()
    fireEvent.keyDown(screen.getByPlaceholderText('Search locations…'), { key: 'Escape' })
    expect(screen.queryByPlaceholderText('Search locations…')).not.toBeInTheDocument()
  })

  it('shows empty state when query returns no results', async () => {
    vi.useFakeTimers()
    mockGetPredictions.mockImplementation(
      (
        _req: unknown,
        cb: (predictions: unknown[], status: string) => void,
      ) => {
        cb([], 'ZERO_RESULTS')
      },
    )

    renderField()
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.change(screen.getByPlaceholderText('Search locations…'), {
      target: { value: 'xyzzy' },
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(screen.getByText('No locations found')).toBeInTheDocument()
  })
})
