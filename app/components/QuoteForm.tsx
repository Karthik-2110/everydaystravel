'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Users, Clock,
  ArrowRight, ArrowRightLeft, ChevronDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import DatePickerField from './DatePickerField'
import PlacesAutocompleteField from './PlacesAutocompleteField'

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
      className="block text-white text-[11px] mb-1.5 tracking-[0.02em]"
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
  const [email, setEmail]               = useState('')
  const [phone, setPhone]               = useState('')
  const [emailError, setEmailError]     = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [submitted, setSubmitted]       = useState(false)

  useEffect(() => {
    if (!submitted) return
    const t = setTimeout(() => {
      setSubmitted(false)
      setJourneyType('oneway')
      setPickup('')
      setDestination('')
      setPassengers('')
      setTravelDate('')
      setPickupTime('')
      setReturnDate('')
      setReturnTime('')
      setEmail('')
      setPhone('')
      setEmailTouched(false)
      setEmailError('')
    }, 3000)
    return () => clearTimeout(t)
  }, [submitted])

  const isReturn       = journeyType === 'return'
  const showContactRow = Boolean(pickup && destination && passengers && travelDate && pickupTime)

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

  const handleEmailBlur = () => {
    setEmailTouched(true)
    if (!email) {
      setEmailError('Email address is required')
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)
    if (!email) { setEmailError('Email address is required'); return }
    if (!validateEmail(email)) { setEmailError('Please enter a valid email address'); return }
    setEmailError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyType, pickup, destination, passengers, travelDate, pickupTime, returnDate, returnTime, email, phone }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }


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

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[#EBBA6F]/15 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EBBA6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="text-white text-[15px] font-medium" style={{ fontFamily: 'var(--font-body)' }}>Quote request sent!</p>
            <p className="text-white/45 text-[13px]" style={{ fontFamily: 'var(--font-body)' }}>The Everyday Travels team will get in touch with you shortly.</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} noValidate>

          {/* ── Row 1: stacks on mobile, 2-col sm, 5-col lg ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

            {/* Pickup location */}
            <div>
              <label htmlFor="pickup-select">
                <FieldLabel>Pickup location</FieldLabel>
              </label>
              <PlacesAutocompleteField
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
              <PlacesAutocompleteField
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

            {/* Travel date — full row on mobile */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="travel-date">
                <FieldLabel>Travel date</FieldLabel>
              </label>
              <DatePickerField
                id="travel-date"
                value={travelDate}
                onChange={setTravelDate}
                minDate={today}
              />
            </div>

            {/* Pickup time — full row on mobile */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="pickup-time">
                <FieldLabel>Pickup time</FieldLabel>
              </label>
              <div className="relative">
                <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="pickup-time"
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className={`pl-8 [color-scheme:dark] ${base} focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F] ${pickupTime ? 'text-white' : 'text-white/30'}`}
                />
              </div>
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
                    <DatePickerField
                      id="return-date"
                      value={returnDate}
                      onChange={setReturnDate}
                      minDate={travelDate || today}
                    />
                  </div>

                  <div>
                    <label htmlFor="return-time">
                      <FieldLabel>Return time</FieldLabel>
                    </label>
                    <div className="relative">
                      <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                      <Input
                        id="return-time"
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className={`pl-8 [color-scheme:dark] ${base} focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F] ${returnTime ? 'text-white' : 'text-white/30'}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Contact row ── */}
          <AnimatePresence>
            {showContactRow && (
              <motion.div {...REVEAL} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">

                  <div>
                    <label htmlFor="email">
                      <FieldLabel>Email address</FieldLabel>
                    </label>
                    <Input
                      id="email"
                      aria-label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailTouched) {
                          const v = e.target.value
                          if (!v) setEmailError('Email address is required')
                          else if (!validateEmail(v)) setEmailError('Please enter a valid email address')
                          else setEmailError('')
                        }
                      }}
                      onBlur={handleEmailBlur}
                      placeholder="your@email.com"
                      aria-invalid={emailTouched && !!emailError}
                      aria-describedby={emailTouched && emailError ? 'email-error' : undefined}
                      className={`${inputCls} ${emailTouched && emailError ? '!border-red-500/70 focus-visible:!border-red-500' : ''}`}
                    />
                    {emailTouched && emailError && (
                      <p
                        id="email-error"
                        role="alert"
                        className="mt-1.5 text-[11px] text-red-400"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {emailError}
                      </p>
                    )}
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

                  <div>
                    <span className="block text-[11px] mb-1.5" aria-hidden>&#8203;</span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-10 flex items-center justify-center gap-2 px-6 bg-[#EBBA6F] text-[#0C0F1C] text-[13.5px] font-semibold rounded-lg hover:bg-[#E2B36A] active:bg-[#AC864C] transition-colors duration-150 w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {submitting ? 'Sending…' : 'Get Instant Quote'}
                    {!submitting && <ArrowRight size={15} aria-hidden />}
                  </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
        )}
      </div>
    </section>
  )
}
