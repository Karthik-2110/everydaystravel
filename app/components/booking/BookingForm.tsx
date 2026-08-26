'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Users, Clock, User, Mail, Phone, Building2, Plane, Luggage, Accessibility,
  MapPin, Plus, X, ArrowRight, Check, Route,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { WhatsAppIcon, WHATSAPP_HREF } from '../icons/social'
import PlacesAutocompleteField from '../PlacesAutocompleteField'
import DatePickerField from '../DatePickerField'
import { SERVICES } from '../ServiceList'
import VehiclePicker, { DEFAULT_VEHICLE_SLUG } from './VehiclePicker'
import { WhyTravelCard } from './Sidebar'
import {
  SectionCard, FieldLabel, FieldError, SimpleSelect,
  inputCls, textareaCls, errorRing, TIME_OPTIONS, todayISO,
} from '../form-fields'

// ── Options ───────────────────────────────────────────────────────────────────

const PASSENGER_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '14', '16', '20', '25', '30', '35', '40', '45', '50', '55', '60+']

const LUGGAGE_OPTIONS = [
  'No luggage',
  'Hand luggage only',
  '1 bag per passenger',
  '2 bags per passenger',
  'Oversized items (skis, instruments, sports kit)',
]

const ACCESSIBILITY_OPTIONS = [
  'None required',
  'Wheelchair accessible vehicle',
  'Step-free / low entry',
  'Assistance boarding',
  'Child seat required',
]

const REVEAL = {
  initial:    { opacity: 0, height: 0, marginTop: 0 },
  animate:    { opacity: 1, height: 'auto', marginTop: 16 },
  exit:       { opacity: 0, height: 0, marginTop: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
} as const

type Errors = Partial<Record<
  'pickup' | 'destination' | 'travelDate' | 'pickupTime' | 'passengers' |
  'serviceType' | 'fullName' | 'email' | 'phone', string
>>

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

// ── Component ─────────────────────────────────────────────────────────────────

export default function BookingForm() {
  // 1 — Journey
  const [pickup, setPickup]           = useState('')
  const [destination, setDestination] = useState('')
  const [travelDate, setTravelDate]   = useState('')
  const [pickupTime, setPickupTime]   = useState('')
  const [isReturn, setIsReturn]       = useState(false)
  const [returnDate, setReturnDate]   = useState('')
  const [returnTime, setReturnTime]   = useState('')
  const [passengers, setPassengers]   = useState('')
  const [serviceType, setServiceType] = useState('')

  // 2 — Your details
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [company, setCompany]   = useState('')

  // 3 — Additional
  const [flightDetails, setFlightDetails]   = useState('')
  const [luggage, setLuggage]               = useState('')
  const [accessibility, setAccessibility]   = useState('')
  const [stopDraft, setStopDraft]           = useState('')
  const [extraStops, setExtraStops]         = useState<string[]>([])
  const [specialRequests, setSpecialRequests] = useState('')
  const [notes, setNotes]                   = useState('')

  // 4 — Vehicle
  const [vehicle, setVehicle] = useState(DEFAULT_VEHICLE_SLUG)

  const [errors, setErrors]       = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  const clearError = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  const addStop = () => {
    const v = stopDraft.trim()
    if (!v) return
    setExtraStops((s) => [...s, v])
    setStopDraft('')
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!pickup.trim())      e.pickup      = 'Pickup location is required'
    if (!destination.trim()) e.destination = 'Destination is required'
    if (!travelDate)         e.travelDate  = 'Date of journey is required'
    if (!pickupTime)         e.pickupTime  = 'Pickup time is required'
    if (!passengers)         e.passengers  = 'Passenger count is required'
    if (!serviceType)        e.serviceType = 'Journey type is required'
    if (!fullName.trim())    e.fullName    = 'Full name is required'
    if (!email.trim())       e.email       = 'Email address is required'
    else if (!isEmail(email)) e.email      = 'Please enter a valid email address'
    if (!phone.trim())       e.phone       = 'Phone number is required'
    return e
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById('bk-journey-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle,
          journeyType: isReturn ? 'return' : 'oneway',
          serviceType,
          pickup, destination, passengers,
          travelDate, pickupTime,
          returnDate: isReturn ? returnDate : '',
          returnTime: isReturn ? returnTime : '',
          fullName, email, phone, company,
          flightDetails, luggage, accessibility,
          extraStops, specialRequests, notes,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again, or call us on 020 8941 8354.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Confirmation ────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="bg-[#0D1221] rounded-2xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(235,186,111,0.08),0_24px_60px_rgba(0,0,0,0.5)] px-6 py-16 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#EBBA6F]/15 flex items-center justify-center">
          <Check size={22} strokeWidth={2} className="text-[#EBBA6F]" aria-hidden />
        </div>
        <p className="text-white text-[20px]" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
          Quote request sent
        </p>
        <p className="text-white/45 text-[13.5px] max-w-[420px]" style={{ fontFamily: 'var(--font-body)' }}>
          Thank you, {fullName.split(' ')[0]}. Our team is preparing your personalised quotation and will be in
          touch shortly — we aim to respond within 30 minutes during business hours.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 h-10 px-5 inline-flex items-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#1FBB59] text-white text-[13px] font-medium transition-colors duration-150"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <WhatsAppIcon size={14} />
          Need it sooner? WhatsApp us
        </a>
      </div>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Two columns. The submit bar lives outside this grid so the sticky
          right column can never slide over it. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">

      {/* ── Left column ─────────────────────────────────────────────────────── */}
      <div className="lg:col-span-7 flex flex-col gap-5 lg:gap-6">

        {/* 1 — Journey Details */}
        <div id="bk-journey-details">
          <SectionCard step={1} title="Journey Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">

              <div>
                <FieldLabel htmlFor="bk-pickup" required>Pickup Location</FieldLabel>
                <PlacesAutocompleteField
                  id="bk-pickup" ariaLabel="Pickup Location" value={pickup}
                  onChange={(v) => { setPickup(v); clearError('pickup') }}
                  placeholder="Enter pickup location"
                />
                <FieldError message={errors.pickup} />
              </div>

              <div>
                <FieldLabel htmlFor="bk-destination" required>Destination</FieldLabel>
                <PlacesAutocompleteField
                  id="bk-destination" ariaLabel="Destination" value={destination}
                  onChange={(v) => { setDestination(v); clearError('destination') }}
                  placeholder="Enter destination"
                />
                <FieldError message={errors.destination} />
              </div>

              <div>
                <FieldLabel htmlFor="bk-date" required>Date of Journey</FieldLabel>
                <DatePickerField
                  id="bk-date" value={travelDate} minDate={todayISO()}
                  onChange={(v) => { setTravelDate(v); clearError('travelDate') }}
                  className={errors.travelDate ? errorRing : ''}
                />
                <FieldError message={errors.travelDate} />
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1 min-w-0">
                  <FieldLabel htmlFor="bk-time" required>Pickup Time</FieldLabel>
                  <SimpleSelect
                    id="bk-time" ariaLabel="Pickup Time" value={pickupTime}
                    onChange={(v) => { setPickupTime(v); clearError('pickupTime') }}
                    icon={Clock} placeholder="Select time" invalid={!!errors.pickupTime}
                  >
                    {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </SimpleSelect>
                  <FieldError message={errors.pickupTime} />
                </div>

                {/* Return toggle */}
                <div className="shrink-0 pb-0.5">
                  <span className="block text-white text-[11px] mb-1.5 tracking-[0.02em]" style={{ fontFamily: 'var(--font-ui)' }}>
                    Return Journey
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isReturn}
                    aria-label="Return Journey"
                    onClick={() => setIsReturn((r) => !r)}
                    className={[
                      'relative block w-[46px] h-[26px] p-0 rounded-full transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EBBA6F]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1221]',
                      isReturn ? 'bg-[#EBBA6F]' : 'bg-white/12',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                        isReturn ? 'translate-x-[20px]' : 'translate-x-0',
                      ].join(' ')}
                    />
                  </button>
                </div>
              </div>

            </div>

            {/* Return fields */}
            <AnimatePresence initial={false}>
              {isReturn && (
                <motion.div {...REVEAL} className="overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                      <FieldLabel htmlFor="bk-rdate">Return Date</FieldLabel>
                      <DatePickerField
                        id="bk-rdate" value={returnDate}
                        minDate={travelDate || todayISO()}
                        onChange={setReturnDate}
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="bk-rtime">Return Time</FieldLabel>
                      <SimpleSelect
                        id="bk-rtime" ariaLabel="Return Time" value={returnTime}
                        onChange={setReturnTime} icon={Clock} placeholder="Select time"
                      >
                        {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </SimpleSelect>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mt-4">
              <div>
                <FieldLabel htmlFor="bk-pax" required>Passenger Count</FieldLabel>
                <SimpleSelect
                  id="bk-pax" ariaLabel="Passenger Count" value={passengers}
                  onChange={(v) => { setPassengers(v); clearError('passengers') }}
                  icon={Users} placeholder="Select passengers" invalid={!!errors.passengers}
                >
                  {PASSENGER_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </SimpleSelect>
                <FieldError message={errors.passengers} />
              </div>

              <div>
                <FieldLabel htmlFor="bk-service" required>Journey Type</FieldLabel>
                <SimpleSelect
                  id="bk-service" ariaLabel="Journey Type" value={serviceType}
                  onChange={(v) => { setServiceType(v); clearError('serviceType') }}
                  icon={Route} placeholder="Select journey type" invalid={!!errors.serviceType}
                >
                  {SERVICES.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
                  <option value="Other">Other</option>
                </SimpleSelect>
                <FieldError message={errors.serviceType} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* 2 — Your Details */}
        <SectionCard step={2} title="Your Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">

            <div>
              <FieldLabel htmlFor="bk-name" required>Full Name</FieldLabel>
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="bk-name" aria-label="Full Name" value={fullName}
                  onChange={(e) => { setFullName(e.target.value); clearError('fullName') }}
                  placeholder="Enter full name"
                  aria-invalid={!!errors.fullName}
                  className={`pl-8 ${inputCls} ${errors.fullName ? errorRing : ''}`}
                />
              </div>
              <FieldError message={errors.fullName} />
            </div>

            <div>
              <FieldLabel htmlFor="bk-email" required>Email Address</FieldLabel>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="bk-email" type="email" aria-label="Email Address" value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email') }}
                  placeholder="Enter email address"
                  aria-invalid={!!errors.email}
                  className={`pl-8 ${inputCls} ${errors.email ? errorRing : ''}`}
                />
              </div>
              <FieldError message={errors.email} />
            </div>

            <div>
              <FieldLabel htmlFor="bk-phone" required>Phone Number</FieldLabel>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="bk-phone" type="tel" aria-label="Phone Number" value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError('phone') }}
                  placeholder="Enter phone number"
                  aria-invalid={!!errors.phone}
                  className={`pl-8 ${inputCls} ${errors.phone ? errorRing : ''}`}
                />
              </div>
              <FieldError message={errors.phone} />
            </div>

            <div>
              <FieldLabel htmlFor="bk-company">Company / Organisation</FieldLabel>
              <div className="relative">
                <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="bk-company" aria-label="Company / Organisation" value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter company name (optional)"
                  className={`pl-8 ${inputCls}`}
                />
              </div>
            </div>

          </div>
        </SectionCard>

        {/* 3 — Additional Information */}
        <SectionCard step={3} title="Additional Information">
          <div className="flex flex-col gap-4">

            <div>
              <FieldLabel htmlFor="bk-flight">Flight / Train Details (if applicable)</FieldLabel>
              <div className="relative">
                <Plane size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="bk-flight" aria-label="Flight / Train Details (if applicable)" value={flightDetails}
                  onChange={(e) => setFlightDetails(e.target.value)}
                  placeholder="Flight number, arrival time, terminal…"
                  className={`pl-8 ${inputCls}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <FieldLabel htmlFor="bk-luggage">Luggage Amount</FieldLabel>
                <SimpleSelect
                  id="bk-luggage" ariaLabel="Luggage Amount" value={luggage}
                  onChange={setLuggage} icon={Luggage} placeholder="Select luggage amount"
                >
                  {LUGGAGE_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </SimpleSelect>
              </div>
              <div>
                <FieldLabel htmlFor="bk-access">Accessibility Requirements</FieldLabel>
                <SimpleSelect
                  id="bk-access" ariaLabel="Accessibility Requirements" value={accessibility}
                  onChange={setAccessibility} icon={Accessibility} placeholder="Select accessibility needs"
                >
                  {ACCESSIBILITY_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </SimpleSelect>
              </div>
            </div>

            {/* Extra stops */}
            <div>
              <FieldLabel htmlFor="bk-stop">Extra Stops</FieldLabel>
              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="bk-stop" aria-label="Extra Stops" value={stopDraft}
                  onChange={(e) => setStopDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStop() } }}
                  placeholder="Add any additional stops"
                  className={`pl-8 pr-11 ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={addStop}
                  aria-label="Add stop"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-[#EBBA6F] hover:bg-[#EBBA6F]/10 transition-colors duration-150"
                >
                  <Plus size={15} aria-hidden />
                </button>
              </div>

              {extraStops.length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-2.5">
                  {extraStops.map((stop, i) => (
                    <li
                      key={`${stop}-${i}`}
                      className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full border border-white/12 bg-[#0C0F1C] text-white/75 text-[12px]"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {stop}
                      <button
                        type="button"
                        aria-label={`Remove ${stop}`}
                        onClick={() => setExtraStops((s) => s.filter((_, j) => j !== i))}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150"
                      >
                        <X size={11} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="bk-requests">Special Requests</FieldLabel>
              <Input
                id="bk-requests" aria-label="Special Requests" value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Child seats, refreshments, meet & greet, etc."
                className={inputCls}
              />
            </div>

            <div>
              <FieldLabel htmlFor="bk-notes">Additional Notes</FieldLabel>
              <textarea
                id="bk-notes" aria-label="Additional Notes" value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Any other information that helps us tailor your journey…"
                className={textareaCls}
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            <p className="text-white/35 text-[11.5px]" style={{ fontFamily: 'var(--font-ui)' }}>
              <span className="text-[#EBBA6F]">*</span> Required fields
            </p>

          </div>
        </SectionCard>
      </div>

      {/* ── Right column ────────────────────────────────────────────────────── */}
      <div className="lg:col-span-5 flex flex-col gap-5 lg:gap-6 lg:sticky lg:top-24">
        <VehiclePicker value={vehicle} onChange={setVehicle} />
        <WhyTravelCard />
      </div>

      </div>

      {/* ── Submit bar ──────────────────────────────────────────────────────── */}
      <div className="mt-6 lg:mt-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="h-12 px-8 flex items-center justify-center gap-2 bg-[#EBBA6F] text-[#0C0F1C] text-[14.5px] font-semibold rounded-lg hover:bg-[#E2B36A] active:bg-[#D4A85E] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {submitting ? 'Sending…' : 'Request My Quote'}
            {!submitting && <ArrowRight size={16} aria-hidden />}
          </button>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-6 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#1FBB59] text-white text-[14px] font-medium transition-colors duration-150"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            <WhatsAppIcon size={15} />
            Need Help? WhatsApp Us
          </a>
        </div>

        <p className="text-center text-white/35 text-[12.5px] mt-4" style={{ fontFamily: 'var(--font-body)' }}>
          We aim to respond within 30 minutes during business hours.
        </p>
      </div>

    </form>
  )
}
