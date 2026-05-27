'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  MapPin, Users, CalendarDays, Clock,
  ArrowRight, ArrowRightLeft, ChevronDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { UK_LOCATION_GROUPS } from '@/app/lib/uk-locations'

// ── Style constants ─────────────────────────────────────────────────────────

const base =
  'w-full h-10 rounded-md border border-white/10 bg-[#0C0F1C] text-[13px] ' +
  'transition-colors duration-150'

const inputCls =
  base +
  ' text-white placeholder:text-white/30 ' +
  'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F]'

const nativeSelect = (hasValue: boolean) =>
  base +
  ' pl-8 pr-8 appearance-none cursor-pointer [color-scheme:dark] ' +
  'focus:outline-none focus:border-[#EBBA6F] focus:ring-0 ' +
  (hasValue ? 'text-white' : 'text-white/30')

const REVEAL = {
  initial:    { opacity: 0, height: 0, marginTop: 0 },
  animate:    { opacity: 1, height: 'auto', marginTop: 24 },
  exit:       { opacity: 0, height: 0, marginTop: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
} as const

const TIME_OPTIONS = Array.from({ length: 38 }, (_, i) => {
  const total = 5 * 60 + i * 30
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
})

const today = new Date().toISOString().split('T')[0]

// ── Sub-components ──────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-white/45 text-[11px] mb-1.5 tracking-[0.02em]"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {children}
    </span>
  )
}

function SelectField({
  id,
  ariaLabel,
  value,
  onChange,
  icon: Icon,
  placeholder,
  children,
}: {
  id: string
  ariaLabel: string
  value: string
  onChange: (v: string) => void
  icon: React.ElementType
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <Icon
        size={13}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10"
        aria-hidden
      />
      <select
        id={id}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={nativeSelect(!!value)}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
        aria-hidden
      />
    </div>
  )
}

function LocationSelect({
  id,
  ariaLabel,
  value,
  onChange,
  placeholder,
}: {
  id: string
  ariaLabel: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const containerRef        = useRef<HTMLDivElement>(null)
  const searchRef           = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return UK_LOCATION_GROUPS
    return UK_LOCATION_GROUPS
      .map(group => ({
        ...group,
        locations: group.locations.filter(loc => loc.toLowerCase().includes(q)),
      }))
      .filter(group => group.locations.length > 0)
  }, [search])

  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = (loc: string) => {
    onChange(loc)
    setOpen(false)
    setSearch('')
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
          onClick={() => setOpen(o => !o)}
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
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') { setOpen(false); setSearch('') }
              }}
              placeholder="Search locations…"
              className="w-full h-8 px-3 rounded bg-[#0C0F1C] border border-white/10 text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#EBBA6F] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            />
          </div>

          <div role="listbox" aria-label={ariaLabel} className="h-[300px] overflow-y-auto">
            {filtered.map(group => (
              <div key={group.label}>
                <div
                  className="px-3 py-1.5 text-[10px] font-semibold text-white/25 uppercase tracking-[0.08em] sticky top-0 bg-[#0D1221]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                  aria-hidden
                >
                  {group.label}
                </div>
                {group.locations.map(loc => (
                  <div
                    key={loc}
                    role="option"
                    aria-selected={loc === value}
                    onClick={() => handleSelect(loc)}
                    className={`px-3 py-2 text-[13px] cursor-pointer transition-colors duration-100 ${
                      loc === value
                        ? 'text-[#EBBA6F] bg-[#EBBA6F]/[0.08]'
                        : 'text-white/65 hover:text-white hover:bg-white/5'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <div
                className="px-3 py-8 text-center text-white/30 text-[13px]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

export default function QuoteForm() {
  const [journeyType, setJourneyType] = useState<'oneway' | 'return'>('oneway')
  const [pickup, setPickup]           = useState('')
  const [destination, setDestination] = useState('')
  const [passengers, setPassengers]   = useState('')
  const [travelDate, setTravelDate]   = useState('')
  const [pickupTime, setPickupTime]   = useState('')
  const [returnDate, setReturnDate]   = useState('')
  const [returnTime, setReturnTime]   = useState('')
  const [email, setEmail]             = useState('')
  const [phone, setPhone]             = useState('')

  const isReturn       = journeyType === 'return'
  const showContactRow = Boolean(pickup && destination && passengers && travelDate && pickupTime)


  return (
    <section className="relative z-20 px-5 sm:px-8 lg:px-12 mt-[42px]">
      <div className="bg-[#0D1221] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-7 lg:p-8 transition-[border-color,box-shadow] duration-300 hover:border-[#EBBA6F]/30 hover:shadow-[0_0_0_1px_rgba(235,186,111,0.15),0_0_40px_rgba(235,186,111,0.08)]">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className="text-[#EBBA6F] font-medium text-[15px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Plan your journey
          </span>

          <div className="flex gap-1.5">
            <button
              type="button"
              aria-pressed={!isReturn}
              onClick={() => setJourneyType('oneway')}
              className={[
                'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200',
                !isReturn
                  ? 'bg-[#1e2338] text-white border border-white/20'
                  : 'text-white/45 hover:text-white/70',
              ].join(' ')}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ArrowRight size={13} aria-hidden />
              One way
            </button>

            <button
              type="button"
              aria-pressed={isReturn}
              onClick={() => setJourneyType('return')}
              className={[
                'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200',
                isReturn
                  ? 'bg-[#1e2338] text-white border border-white/20'
                  : 'text-white/45 hover:text-white/70',
              ].join(' ')}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ArrowRightLeft size={13} aria-hidden />
              Return
            </button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} noValidate>

          {/* ── Row 1: 5 equal columns ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

            {/* Pickup location */}
            <div>
              <label htmlFor="pickup-select">
                <FieldLabel>Pickup location</FieldLabel>
              </label>
              <LocationSelect
                id="pickup-select"
                ariaLabel="Pickup location"
                value={pickup}
                onChange={setPickup}
                placeholder="Enter pickup location"
              />
            </div>

            {/* Destination */}
            <div>
              <label htmlFor="destination-select">
                <FieldLabel>Destination</FieldLabel>
              </label>
              <LocationSelect
                id="destination-select"
                ariaLabel="Destination"
                value={destination}
                onChange={setDestination}
                placeholder="Enter destination"
              />
            </div>

            {/* Passengers */}
            <div>
              <label htmlFor="passengers">
                <FieldLabel>Passengers</FieldLabel>
              </label>
              <div className="relative">
                <Users
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10"
                  aria-hidden
                />
                <Input
                  id="passengers"
                  aria-label="Passengers"
                  type="number"
                  min="1"
                  value={passengers}
                  onChange={e => setPassengers(e.target.value)}
                  placeholder="Number of passengers"
                  className={`pl-8 ${inputCls}`}
                />
              </div>
            </div>

            {/* Travel date */}
            <div>
              <label htmlFor="travel-date">
                <FieldLabel>Travel date</FieldLabel>
              </label>
              <div className="relative">
                <CalendarDays
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10"
                  aria-hidden
                />
                <Input
                  id="travel-date"
                  aria-label="Travel date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={today}
                  className={`pl-8 [color-scheme:dark] ${base} focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F] ${travelDate ? 'text-white' : 'text-white/30'}`}
                />
              </div>
            </div>

            {/* Pickup time */}
            <div>
              <label htmlFor="pickup-time">
                <FieldLabel>Pickup time</FieldLabel>
              </label>
              <SelectField
                id="pickup-time"
                ariaLabel="Pickup time"
                value={pickupTime}
                onChange={setPickupTime}
                icon={Clock}
                placeholder="Select time"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </SelectField>
            </div>
          </div>

          {/* ── Return fields ── */}
          <AnimatePresence>
            {isReturn && (
              <motion.div {...REVEAL} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div>
                    <label htmlFor="return-date">
                      <FieldLabel>Return date</FieldLabel>
                    </label>
                    <div className="relative">
                      <CalendarDays
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10"
                        aria-hidden
                      />
                      <Input
                        id="return-date"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={travelDate || today}
                        className={`pl-8 [color-scheme:dark] ${base} focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F] ${returnDate ? 'text-white' : 'text-white/30'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="return-time">
                      <FieldLabel>Return time</FieldLabel>
                    </label>
                    <SelectField
                      id="return-time"
                      ariaLabel="Return time"
                      value={returnTime}
                      onChange={setReturnTime}
                      icon={Clock}
                      placeholder="Select time"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </SelectField>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Contact row ── */}
          <AnimatePresence>
            {showContactRow && (
              <motion.div {...REVEAL} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">

                  <div>
                    <label htmlFor="email">
                      <FieldLabel>Email address</FieldLabel>
                    </label>
                    <Input
                      id="email"
                      aria-label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone">
                      <FieldLabel>Phone number</FieldLabel>
                    </label>
                    <Input
                      id="phone"
                      aria-label="Phone number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7000 000000"
                      className={inputCls}
                    />
                  </div>

                  <button
                    type="submit"
                    className="h-10 flex items-center justify-center gap-2 px-6 bg-[#EBBA6F] text-[#0C0F1C] text-[13.5px] font-semibold rounded-lg hover:bg-[#E2B36A] active:bg-[#AC864C] transition-colors duration-150 w-full"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Get Instant Quote
                    <ArrowRight size={15} aria-hidden />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </div>
    </section>
  )
}
