# Google Places Autocomplete — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static UK location dropdown in both quote forms with a Google Places Autocomplete field that returns live UK-biased predictions.

**Architecture:** A single shared `PlacesAutocompleteField` component lazy-loads the Google Maps JS SDK (via a singleton loader) on first interaction, then streams predictions from `AutocompleteService` as the user types — keeping the existing dark-theme combobox UI untouched. Both `QuoteForm` and `VehicleBookingForm` swap their local `LocationSelect` for this shared component.

**Tech Stack:** `@googlemaps/js-api-loader` (SDK singleton), `@types/google.maps` (TS types), Google Maps Places API (classic AutocompleteService), Vitest + Testing Library (tests).

## Global Constraints

- Next.js 16.2.6, React 19, TypeScript strict mode — no `any`, no `@ts-ignore`
- Tailwind v4 only — no new CSS files
- Dark theme tokens: background `#0C0F1C`, surface `#0D1221`, accent `#EBBA6F`, text-dim `white/35`, text-muted `white/30`
- UK bias: `componentRestrictions: { country: 'gb' }`, `types: ['geocode', 'establishment']`
- Debounce predictions at **300 ms**
- No new runtime dependencies beyond `@googlemaps/js-api-loader`
- Dev dependency: `@types/google.maps`
- API key env var: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
- The component must be `'use client'` — SDK only loads in the browser
- Do not remove `app/lib/uk-locations.ts` — it may still be used elsewhere

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `app/lib/google-maps-loader.ts` | Singleton that loads the Maps JS SDK once; returns a `Promise<void>` that resolves when `window.google.maps.places` is ready |
| Create | `app/components/PlacesAutocompleteField.tsx` | Shared combobox UI — drop-in replacement for the local `LocationSelect` in both forms |
| Modify | `app/components/QuoteForm.tsx` | Remove local `LocationSelect`, import `PlacesAutocompleteField` |
| Modify | `app/components/VehicleBookingForm.tsx` | Same removal + import |
| Create | `__tests__/PlacesAutocompleteField.test.tsx` | Component tests with a mocked `loadGoogleMaps` |

---

## Task 1 — Setup: packages, env var, type declarations

**Files:**
- Modify: `package.json` (dev dep)
- Create: `.env.local` entry (document only — never commit the real key)

**Interfaces:**
- Produces: `window.google` types available across the project via `@types/google.maps`

- [ ] **Step 1.1 — Install packages**

```bash
npm install @googlemaps/js-api-loader
npm install --save-dev @types/google.maps
```

Expected output ends with: `added N packages` (no errors).

- [ ] **Step 1.2 — Add the env var to `.env.local`**

Open `.env.local` and append (replace the placeholder with the real key from Google Cloud Console):

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza_YOUR_KEY_HERE
```

The key needs **Places API** enabled in Google Cloud Console → APIs & Services → Library.

- [ ] **Step 1.3 — Verify types resolve**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: zero errors related to `google.maps` (there may be pre-existing errors — those are out of scope).

- [ ] **Step 1.4 — Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @googlemaps/js-api-loader and @types/google.maps"
```

---

## Task 2 — Loader singleton

**Files:**
- Create: `app/lib/google-maps-loader.ts`

**Interfaces:**
- Produces: `loadGoogleMaps(): Promise<void>` — resolves when `window.google.maps.places.AutocompleteService` is available; safe to call multiple times (singleton).

- [ ] **Step 2.1 — Write the failing test**

Create `__tests__/google-maps-loader.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the loader package before importing our module
vi.mock('@googlemaps/js-api-loader', () => ({
  Loader: vi.fn().mockImplementation(() => ({
    importLibrary: vi.fn().mockResolvedValue(undefined),
  })),
}))

describe('loadGoogleMaps', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('resolves without throwing', async () => {
    const { loadGoogleMaps } = await import('@/app/lib/google-maps-loader')
    await expect(loadGoogleMaps()).resolves.toBeUndefined()
  })

  it('returns the same promise on repeated calls (singleton)', async () => {
    const { loadGoogleMaps } = await import('@/app/lib/google-maps-loader')
    const p1 = loadGoogleMaps()
    const p2 = loadGoogleMaps()
    expect(p1).toBe(p2)
  })
})
```

- [ ] **Step 2.2 — Run test to verify it fails**

```bash
npx vitest run __tests__/google-maps-loader.test.ts
```

Expected: FAIL — `Cannot find module '@/app/lib/google-maps-loader'`

- [ ] **Step 2.3 — Implement the loader**

Create `app/lib/google-maps-loader.ts`:

```typescript
import { Loader } from '@googlemaps/js-api-loader'

let loaderPromise: Promise<void> | null = null

export function loadGoogleMaps(): Promise<void> {
  if (loaderPromise) return loaderPromise

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    version: 'weekly',
  })

  loaderPromise = loader.importLibrary('places').then(() => undefined)
  return loaderPromise
}
```

- [ ] **Step 2.4 — Run test to verify it passes**

```bash
npx vitest run __tests__/google-maps-loader.test.ts
```

Expected: PASS — 2 tests passing.

- [ ] **Step 2.5 — Commit**

```bash
git add app/lib/google-maps-loader.ts __tests__/google-maps-loader.test.ts
git commit -m "feat: add Google Maps loader singleton"
```

---

## Task 3 — PlacesAutocompleteField component

**Files:**
- Create: `app/components/PlacesAutocompleteField.tsx`
- Create: `__tests__/PlacesAutocompleteField.test.tsx`

**Interfaces:**
- Consumes: `loadGoogleMaps(): Promise<void>` from `@/app/lib/google-maps-loader`
- Produces default export `PlacesAutocompleteField` with props:
  ```typescript
  interface PlacesAutocompleteFieldProps {
    id: string
    ariaLabel: string
    value: string
    onChange: (value: string) => void
    placeholder: string
  }
  ```

- [ ] **Step 3.1 — Write the failing tests**

Create `__tests__/PlacesAutocompleteField.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlacesAutocompleteField from '@/app/components/PlacesAutocompleteField'

// Mock the loader so no real network calls happen
vi.mock('@/app/lib/google-maps-loader', () => ({
  loadGoogleMaps: vi.fn().mockResolvedValue(undefined),
}))

// Stub window.google.maps.places before each test
const mockGetPredictions = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).google = {
    maps: {
      places: {
        AutocompleteService: vi.fn().mockImplementation(() => ({
          getPlacePredictions: mockGetPredictions,
        })),
        PlacesServiceStatus: { OK: 'OK', ZERO_RESULTS: 'ZERO_RESULTS' },
      },
    },
  }
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

  it('opens the dropdown on trigger click', async () => {
    renderField()
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search locations…')).toBeVisible()
  })

  it('shows predictions after typing', async () => {
    mockGetPredictions.mockImplementation((_req: unknown, cb: Function) => {
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
    })

    renderField()
    await userEvent.click(screen.getByRole('combobox'))
    const input = screen.getByPlaceholderText('Search locations…')
    await userEvent.type(input, 'Gatwick')

    await waitFor(() => {
      expect(screen.getByText('Gatwick Airport')).toBeInTheDocument()
    })
  })

  it('calls onChange with the full description when a prediction is selected', async () => {
    const onChange = vi.fn()
    mockGetPredictions.mockImplementation((_req: unknown, cb: Function) => {
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
    })

    renderField('', onChange)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.type(screen.getByPlaceholderText('Search locations…'), 'Gatwick')

    await waitFor(() => screen.getByText('Gatwick Airport'))
    await userEvent.click(screen.getByText('Gatwick Airport'))

    expect(onChange).toHaveBeenCalledWith('Gatwick Airport, Horley, UK')
  })

  it('closes on Escape key', async () => {
    renderField()
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search locations…')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByPlaceholderText('Search locations…')).not.toBeInTheDocument()
  })

  it('shows empty state when query returns no results', async () => {
    mockGetPredictions.mockImplementation((_req: unknown, cb: Function) => {
      cb([], 'ZERO_RESULTS')
    })

    renderField()
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.type(screen.getByPlaceholderText('Search locations…'), 'xyzzy')

    await waitFor(() => {
      expect(screen.getByText('No locations found')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 3.2 — Run tests to verify they fail**

```bash
npx vitest run __tests__/PlacesAutocompleteField.test.tsx
```

Expected: FAIL — `Cannot find module '@/app/components/PlacesAutocompleteField'`

- [ ] **Step 3.3 — Implement the component**

Create `app/components/PlacesAutocompleteField.tsx`:

```typescript
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, ChevronDown, Loader2 } from 'lucide-react'
import { loadGoogleMaps } from '@/app/lib/google-maps-loader'

const base =
  'w-full h-10 rounded-md border border-white/10 bg-[#0C0F1C] text-[13px] transition-colors duration-150'

interface Prediction {
  placeId: string
  description: string
  mainText: string
}

export interface PlacesAutocompleteFieldProps {
  id: string
  ariaLabel: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export default function PlacesAutocompleteField({
  id,
  ariaLabel,
  value,
  onChange,
  placeholder,
}: PlacesAutocompleteFieldProps) {
  const [open, setOpen]               = useState(false)
  const [query, setQuery]             = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading]         = useState(false)
  const containerRef                  = useRef<HTMLDivElement>(null)
  const inputRef                      = useRef<HTMLInputElement>(null)
  const serviceRef                    = useRef<google.maps.places.AutocompleteService | null>(null)
  const debounceRef                   = useRef<ReturnType<typeof setTimeout> | null>(null)

  const initService = useCallback(async () => {
    if (serviceRef.current) return
    await loadGoogleMaps()
    serviceRef.current = new google.maps.places.AutocompleteService()
  }, [])

  useEffect(() => {
    if (open) {
      initService()
      inputRef.current?.focus()
    } else {
      setQuery('')
      setPredictions([])
    }
  }, [open, initService])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setPredictions([])
      return
    }

    debounceRef.current = setTimeout(() => {
      if (!serviceRef.current) return
      setLoading(true)
      serviceRef.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'gb' },
          types: ['geocode', 'establishment'],
        },
        (results, status) => {
          setLoading(false)
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setPredictions(
              results.map((p) => ({
                placeId: p.place_id,
                description: p.description,
                mainText: p.structured_formatting.main_text,
              }))
            )
          } else {
            setPredictions([])
          }
        }
      )
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = (description: string) => {
    onChange(description)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10"
          aria-hidden
        />
        <button
          type="button"
          id={id}
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((o) => !o)}
          className={`${base} pl-8 pr-8 flex items-center text-left focus:outline-none focus:border-[#EBBA6F] ${value ? 'text-white' : 'text-white/30'}`}
        >
          <span className="truncate" style={{ fontFamily: 'var(--font-body)' }}>
            {value || placeholder}
          </span>
        </button>
        <ChevronDown
          size={13}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-md border border-white/10 bg-[#0D1221] shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/[0.08]">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false)
              }}
              placeholder="Search locations…"
              className="w-full h-8 px-3 rounded bg-[#0C0F1C] border border-white/10 text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#EBBA6F] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            />
          </div>

          <div role="listbox" aria-label={ariaLabel} className="max-h-[260px] overflow-y-auto">
            {loading && (
              <div
                className="flex items-center justify-center py-6 gap-2 text-white/30 text-[13px]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Loader2 size={14} className="animate-spin" aria-hidden />
                Searching…
              </div>
            )}

            {!loading && !query.trim() && (
              <div
                className="px-3 py-8 text-center text-white/30 text-[13px]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Start typing to search…
              </div>
            )}

            {!loading && query.trim() && predictions.length === 0 && (
              <div
                className="px-3 py-8 text-center text-white/30 text-[13px]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                No locations found
              </div>
            )}

            {!loading &&
              predictions.map((p) => (
                <div
                  key={p.placeId}
                  role="option"
                  aria-selected={p.description === value}
                  onClick={() => handleSelect(p.description)}
                  className={`px-3 py-2.5 cursor-pointer transition-colors duration-100 ${
                    p.description === value
                      ? 'text-[#EBBA6F] bg-[#EBBA6F]/[0.08]'
                      : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span
                    className="block text-[13px]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {p.mainText}
                  </span>
                  <span
                    className="block text-[11px] text-white/35 mt-0.5"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {p.description}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3.4 — Run tests to verify they pass**

```bash
npx vitest run __tests__/PlacesAutocompleteField.test.tsx
```

Expected: PASS — 6 tests passing.

- [ ] **Step 3.5 — Commit**

```bash
git add app/components/PlacesAutocompleteField.tsx __tests__/PlacesAutocompleteField.test.tsx
git commit -m "feat: add PlacesAutocompleteField with Google Places predictions"
```

---

## Task 4 — Update QuoteForm

**Files:**
- Modify: `app/components/QuoteForm.tsx`

**Interfaces:**
- Consumes: `PlacesAutocompleteField` props interface from Task 3
- The local `LocationSelect` function (lines 102–240) is deleted; `UK_LOCATION_GROUPS` import is removed; `useMemo` import is removed if unused.

- [ ] **Step 4.1 — Remove the local LocationSelect and static import**

In `app/components/QuoteForm.tsx`:

1. Remove the line:
   ```typescript
   import { UK_LOCATION_GROUPS } from '@/app/lib/uk-locations'
   ```

2. Remove `useMemo` from the React imports (it was only used by `LocationSelect`):
   ```typescript
   // Before
   import { useState, useRef, useEffect, useMemo } from 'react'
   // After
   import { useState, useRef, useEffect } from 'react'
   ```

3. Delete the entire `LocationSelect` function (lines 102–240 in the original file — the block that starts `function LocationSelect(` and ends with its closing `}`).

4. Add the import for the new component at the top (after the existing imports):
   ```typescript
   import PlacesAutocompleteField from './PlacesAutocompleteField'
   ```

- [ ] **Step 4.2 — Swap the two LocationSelect usages**

Find the two `<LocationSelect` JSX elements in the form and replace each:

```typescript
// Before (pickup)
<LocationSelect
  id="pickup-select"
  ariaLabel="Pickup location"
  value={pickup}
  onChange={setPickup}
  placeholder="Enter pickup location"
/>

// After
<PlacesAutocompleteField
  id="pickup-select"
  ariaLabel="Pickup location"
  value={pickup}
  onChange={setPickup}
  placeholder="Enter pickup location"
/>
```

```typescript
// Before (destination)
<LocationSelect
  id="destination-select"
  ariaLabel="Destination"
  value={destination}
  onChange={setDestination}
  placeholder="Enter destination"
/>

// After
<PlacesAutocompleteField
  id="destination-select"
  ariaLabel="Destination"
  value={destination}
  onChange={setDestination}
  placeholder="Enter destination"
/>
```

- [ ] **Step 4.3 — Type-check**

```bash
npx tsc --noEmit 2>&1 | grep QuoteForm
```

Expected: no lines output (no errors in QuoteForm).

- [ ] **Step 4.4 — Run the existing QuoteForm tests**

```bash
npx vitest run __tests__/QuoteForm.test.tsx
```

Expected: all existing tests pass. The tests don't interact with the location fields so this is a smoke-check that nothing is broken by the import changes.

- [ ] **Step 4.5 — Commit**

```bash
git add app/components/QuoteForm.tsx
git commit -m "feat: replace static LocationSelect with PlacesAutocompleteField in QuoteForm"
```

---

## Task 5 — Update VehicleBookingForm

**Files:**
- Modify: `app/components/VehicleBookingForm.tsx`

**Interfaces:**
- Consumes: `PlacesAutocompleteField` props interface from Task 3
- The local `LocationSelect` function (lines 81–192) is deleted; `UK_LOCATION_GROUPS` import is removed; `useMemo` import is removed.

- [ ] **Step 5.1 — Remove local LocationSelect and static import**

In `app/components/VehicleBookingForm.tsx`:

1. Remove the line:
   ```typescript
   import { UK_LOCATION_GROUPS } from '@/app/lib/uk-locations'
   ```

2. Remove `useMemo` from the React imports:
   ```typescript
   // Before
   import { useState, useRef, useEffect, useMemo } from 'react'
   // After
   import { useState, useRef, useEffect } from 'react'
   ```

3. Delete the entire `LocationSelect` function (the block starting at `function LocationSelect(` through its closing `}`).

4. Add the import:
   ```typescript
   import PlacesAutocompleteField from './PlacesAutocompleteField'
   ```

- [ ] **Step 5.2 — Swap the two LocationSelect usages**

```typescript
// Before (pickup)
<LocationSelect
  id="vbf-pickup"
  ariaLabel="Pickup location"
  value={pickup}
  onChange={setPickup}
  placeholder="Select pickup location"
/>

// After
<PlacesAutocompleteField
  id="vbf-pickup"
  ariaLabel="Pickup location"
  value={pickup}
  onChange={setPickup}
  placeholder="Select pickup location"
/>
```

```typescript
// Before (destination)
<LocationSelect
  id="vbf-dest"
  ariaLabel="Destination"
  value={destination}
  onChange={setDestination}
  placeholder="Select destination"
/>

// After
<PlacesAutocompleteField
  id="vbf-dest"
  ariaLabel="Destination"
  value={destination}
  onChange={setDestination}
  placeholder="Select destination"
/>
```

- [ ] **Step 5.3 — Type-check**

```bash
npx tsc --noEmit 2>&1 | grep VehicleBookingForm
```

Expected: no output.

- [ ] **Step 5.4 — Run the full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 5.5 — Commit**

```bash
git add app/components/VehicleBookingForm.tsx
git commit -m "feat: replace static LocationSelect with PlacesAutocompleteField in VehicleBookingForm"
```

---

## Task 6 — Manual smoke test

> No automated test covers the live API call — do this manually before shipping.

- [ ] **Step 6.1 — Start dev server**

```bash
npm run dev
```

- [ ] **Step 6.2 — Test QuoteForm (homepage)**

1. Open `http://localhost:3000`
2. Click the **Pickup location** field
3. Type `Heathrow` — verify a dropdown appears with Google predictions (e.g. "Heathrow Airport")
4. Click a result — verify the field closes and shows the selected name
5. Repeat for **Destination**
6. Verify the form submits successfully (check email arrives)

- [ ] **Step 6.3 — Test VehicleBookingForm (vehicle detail page)**

1. Navigate to e.g. `http://localhost:3000/fleet/executive-coaches/[any-slug]`
2. Repeat the same pickup/destination test as above

- [ ] **Step 6.4 — Test missing API key handling**

1. Temporarily remove `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` from `.env.local`
2. Restart dev server, open the form, click a location field
3. Verify the dropdown opens but shows "Start typing to search…" (does not crash the page)
4. Restore the env var

- [ ] **Step 6.5 — Final commit (if any tweaks needed)**

```bash
git add -p   # stage only intentional changes
git commit -m "fix: smoke test corrections for PlacesAutocompleteField"
```
