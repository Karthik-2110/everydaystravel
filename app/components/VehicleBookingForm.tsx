'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Users, Clock, Car,
  ArrowRight, ArrowRightLeft, ChevronDown, Check,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ALL_VEHICLE_OPTIONS } from './VehicleList'
import PlacesAutocompleteField from './PlacesAutocompleteField'

// ── Shared style tokens ───────────────────────────────────────────────────────

const base =
  'w-full h-10 rounded-md border border-white/10 bg-[#0C0F1C] text-[13px] transition-colors duration-150'

const inputCls =
  base + ' text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F]'

const selectCls = (hasValue: boolean) =>
  base +
  ' pl-8 pr-8 appearance-none cursor-pointer [color-scheme:dark] focus:outline-none focus:border-[#EBBA6F] focus:ring-0 ' +
  (hasValue ? 'text-white' : 'text-white/30')

const REVEAL = {
  initial:    { opacity: 0, height: 0, marginTop: 0 },
  animate:    { opacity: 1, height: 'auto', marginTop: 16 },
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

// ── FieldLabel ────────────────────────────────────────────────────────────────

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

// ── SimpleSelect (native) ─────────────────────────────────────────────────────

function SimpleSelect({
  id, ariaLabel, value, onChange, icon: Icon, placeholder, children,
}: {
  id: string; ariaLabel: string; value: string; onChange: (v: string) => void
  icon: React.ElementType; placeholder: string; children: React.ReactNode
}) {
  return (
    <div className="relative">
      <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
      <select
        id={id} aria-label={ariaLabel} value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectCls(!!value)}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" aria-hidden />
    </div>
  )
}


// ── Component ─────────────────────────────────────────────────────────────────

export default function VehicleBookingForm({ defaultVehicleSlug }: { defaultVehicleSlug?: string }) {
  const [journeyType, setJourneyType] = useState<'oneway' | 'return'>('oneway')
  const [vehicle, setVehicle]         = useState(defaultVehicleSlug ?? '')
  const [pickup, setPickup]           = useState('')
  const [destination, setDestination] = useState('')
  const [passengers, setPassengers]   = useState('')
  const [travelDate, setTravelDate]   = useState('')
  const [pickupTime, setPickupTime]   = useState('')
  const [returnDate, setReturnDate]   = useState('')
  const [returnTime, setReturnTime]   = useState('')
  const [email, setEmail]             = useState('')
  const [emailError, setEmailError]   = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [phone, setPhone]             = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)

  const isReturn = journeyType === 'return'

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

  const handleEmailBlur = () => {
    setEmailTouched(true)
    if (!email) setEmailError('Email address is required')
    else if (!validateEmail(email)) setEmailError('Please enter a valid email address')
    else setEmailError('')
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
        body: JSON.stringify({ vehicle, journeyType, pickup, destination, passengers, travelDate, pickupTime, returnDate, returnTime, email, phone }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setPickup(''); setDestination(''); setPassengers('')
        setTravelDate(''); setPickupTime(''); setReturnDate(''); setReturnTime('')
        setEmail(''); setPhone(''); setEmailTouched(false); setEmailError('')
      }, 3000)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#0D1221] rounded-2xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(235,186,111,0.08),0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.07] bg-[#EBBA6F]/[0.05]">
        <p className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.18em] uppercase mb-0.5" style={{ fontFamily: 'var(--font-ui)' }}>
          Get a free quote
        </p>
        <p className="text-white/40 text-[12px]" style={{ fontFamily: 'var(--font-body)' }}>
          Fill in your journey details below
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-5">
          <div className="w-10 h-10 rounded-full bg-[#EBBA6F]/15 flex items-center justify-center">
            <Check size={18} strokeWidth={2} className="text-[#EBBA6F]" aria-hidden />
          </div>
          <p className="text-white text-[15px] font-medium" style={{ fontFamily: 'var(--font-body)' }}>Quote request sent!</p>
          <p className="text-white/45 text-[13px]" style={{ fontFamily: 'var(--font-body)' }}>
            The Everyday Travels team will get in touch with you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="p-5 flex flex-col gap-4">

          {/* Vehicle */}
          <div>
            <FieldLabel>Selected vehicle</FieldLabel>
            <SimpleSelect
              id="vbf-vehicle" ariaLabel="Vehicle" value={vehicle}
              onChange={setVehicle} icon={Car} placeholder="Select a vehicle"
            >
              {ALL_VEHICLE_OPTIONS.map(({ group, vehicles }) => (
                <optgroup key={group} label={group}>
                  {vehicles.map((v) => (
                    <option key={v.slug} value={v.slug}>{v.name}</option>
                  ))}
                </optgroup>
              ))}
            </SimpleSelect>
          </div>

          {/* Journey type */}
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-pressed={!isReturn}
              onClick={() => setJourneyType('oneway')}
              className={['flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200',
                !isReturn ? 'bg-[#1e2338] text-white border border-white/20' : 'text-white/45 hover:text-white/70'].join(' ')}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ArrowRight size={12} aria-hidden />One way
            </button>
            <button
              type="button"
              aria-pressed={isReturn}
              onClick={() => setJourneyType('return')}
              className={['flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200',
                isReturn ? 'bg-[#1e2338] text-white border border-white/20' : 'text-white/45 hover:text-white/70'].join(' ')}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ArrowRightLeft size={12} aria-hidden />Return
            </button>
          </div>

          {/* Pickup */}
          <div>
            <label htmlFor="vbf-pickup"><FieldLabel>Pickup location</FieldLabel></label>
            <PlacesAutocompleteField id="vbf-pickup" ariaLabel="Pickup location" value={pickup} onChange={setPickup} placeholder="Select pickup location" />
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="vbf-dest"><FieldLabel>Destination</FieldLabel></label>
            <PlacesAutocompleteField id="vbf-dest" ariaLabel="Destination" value={destination} onChange={setDestination} placeholder="Select destination" />
          </div>

          {/* Passengers */}
          <div>
            <label htmlFor="vbf-pax"><FieldLabel>Passengers</FieldLabel></label>
            <div className="relative">
              <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
              <Input id="vbf-pax" type="number" min="1" value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                placeholder="Number of passengers" className={`pl-8 ${inputCls}`} />
            </div>
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="vbf-date"><FieldLabel>Travel date</FieldLabel></label>
              <div className="relative min-w-0 overflow-hidden">
                <Input id="vbf-date" type="date" value={travelDate} min={today}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className={`w-full [color-scheme:dark] ${base} focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F] ${travelDate ? 'text-white' : 'text-white/30'}`} />
              </div>
            </div>
            <div>
              <label htmlFor="vbf-time"><FieldLabel>Pickup time</FieldLabel></label>
              <SimpleSelect id="vbf-time" ariaLabel="Pickup time" value={pickupTime} onChange={setPickupTime} icon={Clock} placeholder="Time">
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </SimpleSelect>
            </div>
          </div>

          {/* Return fields */}
          <AnimatePresence>
            {isReturn && (
              <motion.div {...REVEAL} className="overflow-hidden">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="vbf-rdate"><FieldLabel>Return date</FieldLabel></label>
                    <div className="relative min-w-0 overflow-hidden">
                      <Input id="vbf-rdate" type="date" value={returnDate} min={travelDate || today}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className={`w-full [color-scheme:dark] ${base} focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F] ${returnDate ? 'text-white' : 'text-white/30'}`} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="vbf-rtime"><FieldLabel>Return time</FieldLabel></label>
                    <SimpleSelect id="vbf-rtime" ariaLabel="Return time" value={returnTime} onChange={setReturnTime} icon={Clock} placeholder="Time">
                      {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </SimpleSelect>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="h-px bg-white/[0.06]" />

          {/* Email */}
          <div>
            <label htmlFor="vbf-email"><FieldLabel>Email address</FieldLabel></label>
            <Input id="vbf-email" type="email" value={email}
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
              className={`${inputCls} ${emailTouched && emailError ? '!border-red-500/70' : ''}`} />
            {emailTouched && emailError && (
              <p className="mt-1.5 text-[11px] text-red-400" role="alert" style={{ fontFamily: 'var(--font-ui)' }}>
                {emailError}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="vbf-phone"><FieldLabel>Phone number</FieldLabel></label>
            <Input id="vbf-phone" type="tel" value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7000 000000" className={inputCls} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-11 flex items-center justify-center gap-2 bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold rounded-lg hover:bg-[#E2B36A] active:bg-[#D4A85E] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed w-full"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {submitting ? 'Sending…' : 'Get a Free Quote'}
            {!submitting && <ArrowRight size={15} aria-hidden />}
          </button>

        </form>
      )}
    </div>
  )
}
