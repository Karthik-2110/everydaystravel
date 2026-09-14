'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { loadGoogleMaps } from '@/app/lib/google-maps-loader'

const base =
  'w-full h-10 rounded-md border border-white/10 bg-[#0C0F1C] text-[13px] transition-colors duration-150'

interface Prediction {
  placeId: string
  /** Full formatted text — what we write back into the field on select. */
  description: string
  mainText: string
  secondaryText: string
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
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading]         = useState(false)
  const containerRef                  = useRef<HTMLDivElement>(null)
  const debounceRef                   = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Monotonic id so a slow response for an old query can't overwrite a newer one.
  const requestIdRef                  = useRef(0)

  // Fetch predictions whenever value changes (debounced 300 ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      setPredictions([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current
      setLoading(true)
      try {
        // Awaiting the singleton loader here (rather than priming a service on
        // mount) means keystrokes that land before the SDK is ready still
        // resolve once it loads, instead of silently returning nothing.
        await loadGoogleMaps()

        const { suggestions } =
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: value,
            includedRegionCodes: ['gb'],
          })

        if (requestId !== requestIdRef.current) return // a newer query superseded this one

        setPredictions(
          suggestions
            .map((s) => s.placePrediction)
            .filter((p): p is google.maps.places.PlacePrediction => p !== null)
            .map((p) => ({
              placeId: p.placeId,
              description: p.text.text,
              mainText: p.mainText?.text ?? p.text.text,
              secondaryText: p.secondaryText?.text ?? '',
            }))
        )
      } catch {
        if (requestId === requestIdRef.current) setPredictions([])
      } finally {
        if (requestId === requestIdRef.current) setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    if (!predictions.length) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPredictions([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [predictions.length])

  const handleSelect = (description: string) => {
    onChange(description)
    setPredictions([])
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10"
          aria-hidden
        />
        {loading && (
          <Loader2
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 animate-spin pointer-events-none"
            aria-hidden
          />
        )}
        <input
          id={id}
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={predictions.length > 0}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') setPredictions([]) }}
          placeholder={placeholder}
          autoComplete="off"
          className={`${base} pl-8 ${loading ? 'pr-8' : ''} text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBBA6F]`}
          style={{ fontFamily: 'var(--font-body)' }}
        />
      </div>

      {predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-md border border-white/10 bg-[#0D1221] shadow-2xl overflow-hidden">
          <div role="listbox" aria-label={ariaLabel} className="max-h-[260px] overflow-y-auto">
            {predictions.map((p) => (
              <div
                key={p.placeId}
                role="option"
                aria-selected={p.description === value}
                onMouseDown={(e) => {
                  e.preventDefault() // prevent input blur before the click registers
                  handleSelect(p.description)
                }}
                className={`px-3 py-2.5 cursor-pointer transition-colors duration-100 ${
                  p.description === value
                    ? 'text-[#EBBA6F] bg-[#EBBA6F]/[0.08]'
                    : 'text-white/65 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="block text-[13px]" style={{ fontFamily: 'var(--font-body)' }}>
                  {p.mainText}
                </span>
                {p.secondaryText && (
                  <span className="block text-[11px] text-white/35 mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                    {p.secondaryText}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
