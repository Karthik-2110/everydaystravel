import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import PlacesAutocompleteField from '@/app/components/PlacesAutocompleteField'

vi.mock('@/app/lib/google-maps-loader', () => ({
  loadGoogleMaps: vi.fn().mockResolvedValue(undefined),
}))

const mockFetchSuggestions = vi.fn()

/** Shapes a Places API (New) PlacePrediction the way the SDK returns it. */
function suggestion(placeId: string, mainText: string, secondaryText: string) {
  return {
    placePrediction: {
      placeId,
      text: { text: secondaryText ? `${mainText}, ${secondaryText}` : mainText },
      mainText: { text: mainText },
      secondaryText: secondaryText ? { text: secondaryText } : null,
    },
  }
}

function setupGoogle() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).google = {
    maps: {
      places: {
        AutocompleteSuggestion: { fetchAutocompleteSuggestions: mockFetchSuggestions },
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
    mockFetchSuggestions.mockResolvedValue({
      suggestions: [suggestion('abc', 'Gatwick Airport', 'Horley, UK')],
    })

    renderField('Gatwick')
    await act(async () => { await vi.runAllTimersAsync() })

    expect(screen.getByText('Gatwick Airport')).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('calls onChange with the full description when a prediction is selected', async () => {
    vi.useFakeTimers()
    const onChange = vi.fn()
    mockFetchSuggestions.mockResolvedValue({
      suggestions: [suggestion('xyz', 'Gatwick Airport', 'Horley, UK')],
    })

    renderField('Gatwick', onChange)
    await act(async () => { await vi.runAllTimersAsync() })

    fireEvent.mouseDown(screen.getByText('Gatwick Airport'))
    expect(onChange).toHaveBeenCalledWith('Gatwick Airport, Horley, UK')
  })

  it('closes the dropdown on Escape key', async () => {
    vi.useFakeTimers()
    mockFetchSuggestions.mockResolvedValue({
      suggestions: [suggestion('abc', 'Gatwick Airport', '')],
    })

    renderField('Gatwick')
    await act(async () => { await vi.runAllTimersAsync() })
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows no dropdown when the query returns no results', async () => {
    vi.useFakeTimers()
    mockFetchSuggestions.mockResolvedValue({ suggestions: [] })

    renderField('xyzzy')
    await act(async () => { await vi.runAllTimersAsync() })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
