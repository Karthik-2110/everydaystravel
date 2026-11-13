'use client'

import { useId, useState, type FormEvent } from 'react'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ReferralSourceField from '../components/ReferralSourceField'
import DatePickerField from '../components/DatePickerField'
import TimePickerField from '../components/TimePickerField'
import PlacesAutocompleteField from '../components/PlacesAutocompleteField'
import HumanVerification, { useHumanVerification } from '../components/HumanVerification'
import { digitsOnly, validateEmail, validateFullName, validatePhone } from '../lib/validation'
import { todayISO } from '../components/form-fields'

const fieldClass = 'h-11 w-full rounded-md border border-white/20 bg-[#671624] text-sm text-white placeholder:text-white/55 focus-visible:border-[#F37A80] focus-visible:ring-0 [color-scheme:dark]'
const selectClass = `${fieldClass} focus:outline-none focus:border-[#F37A80] forced-colors:focus:outline`
const pickerClass = 'h-11 border-white/20 bg-[#671624] text-sm hover:border-[#F37A80] focus-visible:border-[#F37A80] data-[state=open]:border-[#F37A80]'
const fields = [
  { name: 'pickup', label: 'Pickup location', placeholder: 'Town or postcode' },
  { name: 'destination', label: 'Party venue', placeholder: 'Venue or postcode' },
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
]

function RequiredMark() {
  return <span aria-hidden="true"> *</span>
}

export default function ChristmasQuoteForm() {
  const verification = useHumanVerification()
  const pickerId = useId()
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [travelDate, setTravelDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [passengers, setPassengers] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function requestQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    setError('')
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? '').trim()
    const fullName = value('fullName')
    const email = value('email')
    const phone = value('phone')
    const problem = validateFullName(fullName) || validateEmail(email) || validatePhone(phone)
    if (problem) return setError(problem)
    if (!value('pickup') || !value('destination')) return setError('Enter your pickup location and party venue.')
    if (!travelDate || !pickupTime) return setError('Select your travel date and pickup time.')
    if (travelDate < todayISO()) return setError('Select a travel date from today onwards.')
    if (!/[1-9]/.test(passengers)) return setError('Enter a passenger count greater than zero.')
    if (!verification.token) return setError('Please complete the verification before requesting a quote.')

    setSending(true)
    const query = new URLSearchParams(window.location.search)
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turnstileToken: verification.token,
          fullName, email, phone, passengers,
          pickup: value('pickup'),
          destination: value('destination'),
          travelDate,
          pickupTime,
          journeyType: value('journeyType'),
          referralSource: value('referralSource'),
          eventType: 'Christmas party or dinner',
          landingPage: '/christmas',
          utm_source: query.get('utm_source'),
          utm_medium: query.get('utm_medium'),
          utm_campaign: query.get('utm_campaign'),
          utm_content: query.get('utm_content'),
        }),
      })
      if (!response.ok) throw new Error('Your request could not be sent. Please try again.')
      setSent(true)
    } catch {
      setError('Your request could not be sent. Please try again.')
    } finally {
      setSending(false)
      verification.reset()
    }
  }

  return (
    <div id="christmas-quote" aria-labelledby="christmas-quote-title" className="scroll-mt-[var(--site-header-sticky-top)]">
      <h2 id="christmas-quote-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {sent ? 'Quote request received' : 'Request your Christmas quote'}
      </h2>
      {sent ? (
        <p role="status" className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-white/85">
          <Check size={19} className="shrink-0" aria-hidden />
          Thanks. We’ll be in touch to confirm availability and prepare your quote.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Share your journey details to get <strong className="font-semibold text-white">15% off your quoted price</strong> for Christmas coach or minibus hire.
          </p>
          <form className="mt-5" onSubmit={requestQuote}>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.slice(0, 2).map(({ name, label, placeholder }) => (
                <div key={name} className="grid min-w-0 gap-1.5 text-sm font-medium">
                  <label htmlFor={`${pickerId}-${name}`}>{label}<RequiredMark /></label>
                  <PlacesAutocompleteField
                    id={`${pickerId}-${name}`}
                    name={name}
                    ariaLabel={label}
                    value={name === 'pickup' ? pickup : destination}
                    onChange={name === 'pickup' ? setPickup : setDestination}
                    placeholder={placeholder ?? ''}
                    className={fieldClass}
                    required
                  />
                </div>
              ))}
              <div className="grid min-w-0 gap-1.5 text-sm font-medium">
                <label htmlFor={`${pickerId}-date`}>Travel date<RequiredMark /></label>
                <DatePickerField id={`${pickerId}-date`} value={travelDate} onChange={setTravelDate} minDate={todayISO()} className={pickerClass} />
              </div>
              <div className="grid min-w-0 gap-1.5 text-sm font-medium">
                <label htmlFor={`${pickerId}-time`}>Pickup time<RequiredMark /></label>
                <TimePickerField id={`${pickerId}-time`} title="Pickup time" value={pickupTime} onChange={setPickupTime} className={pickerClass} />
              </div>
              <label className="grid min-w-0 gap-1.5 text-sm font-medium">
                <span>Passenger count<RequiredMark /></span>
                <Input name="passengers" inputMode="numeric" placeholder="Number of passengers" value={passengers} onChange={event => setPassengers(digitsOnly(event.target.value))} className={fieldClass} required />
              </label>
              <label className="grid min-w-0 gap-1.5 text-sm font-medium">
                <span>Journey type<RequiredMark /></span>
                <span className="relative">
                  <select name="journeyType" required className={`${selectClass} appearance-none pl-3 pr-9 forced-colors:appearance-auto`}>
                    <option value="oneway">One way</option>
                    <option value="return">Return</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 forced-colors:hidden" aria-hidden />
                </span>
              </label>
              {fields.slice(2).map(({ name, label, ...props }) => (
                <label key={name} className="grid min-w-0 gap-1.5 text-sm font-medium">
                  <span>{label}<RequiredMark /></span>
                  <Input name={name} className={fieldClass} {...props} required />
                </label>
              ))}
              <ReferralSourceField required labelClassName="text-sm font-medium tracking-normal" selectClassName={selectClass} />
            </div>
            <HumanVerification action="quote" onVerify={verification.setToken} resetKey={verification.resetKey} />
            {error && <p role="alert" className="mb-3 text-sm text-[#FFC4C7]">{error}</p>}
            <button type="submit" disabled={sending} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FAEBD9] px-5 py-3 text-sm font-semibold text-[#6F1422] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-60">
              {sending ? 'Sending…' : 'Request my quote'}
              <ArrowRight size={16} aria-hidden />
            </button>
          </form>
        </>
      )}
    </div>
  )
}
