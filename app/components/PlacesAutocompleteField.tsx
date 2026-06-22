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

  // Initialize the service on mount so it is ready before first open
  useEffect(() => {
    initService()
  }, [initService])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    } else {
      setQuery('')
      setPredictions([])
    }
  }, [open])

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
