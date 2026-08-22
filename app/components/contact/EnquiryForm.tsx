'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquareHeart, FileText, Mail, Phone, ArrowRight, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FieldLabel, FieldError, inputCls, textareaCls, errorRing } from '../form-fields'

type Errors = Partial<Record<'firstName' | 'lastName' | 'email' | 'phone' | 'message', string>>

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export default function EnquiryForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [message, setMessage]     = useState('')

  const [errors, setErrors]         = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  const clearError = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  const validate = (): Errors => {
    const e: Errors = {}
    if (!firstName.trim()) e.firstName = 'First name is required'
    if (!lastName.trim())  e.lastName  = 'Last name is required'
    if (!email.trim())     e.email     = 'Email address is required'
    else if (!isEmail(email)) e.email  = 'Please enter a valid email address'
    if (!phone.trim())     e.phone     = 'Phone number is required'
    if (!message.trim())   e.message   = 'Please tell us about your enquiry'
    return e
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, message }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again, or call us on 020 8941 8354.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto">

      {/* Enquiry / quote switch */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-10">
        <span
          aria-current="page"
          className="h-12 px-6 flex items-center justify-center gap-2.5 rounded-full border border-[#EBBA6F] bg-[#EBBA6F]/[0.06] text-white text-[14px] font-medium"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <MessageSquareHeart size={16} strokeWidth={1.5} className="text-[#EBBA6F]" aria-hidden />
          Send us an Enquiry message
        </span>

        <Link
          href="/book"
          className="h-12 px-6 flex items-center justify-center gap-2.5 rounded-full border border-white/20 text-white/80 text-[14px] font-medium hover:border-[#EBBA6F]/60 hover:text-[#EBBA6F] transition-colors duration-150"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <FileText size={16} strokeWidth={1.5} aria-hidden />
          Get Quote
        </Link>
      </div>

      {submitted ? (
        <div className="bg-[#0D1221] rounded-2xl border border-white/[0.08] px-6 py-16 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#EBBA6F]/15 flex items-center justify-center">
            <Check size={22} strokeWidth={2} className="text-[#EBBA6F]" aria-hidden />
          </div>
          <p className="text-white text-[20px]" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
            Enquiry sent
          </p>
          <p className="text-white/45 text-[13.5px] max-w-[420px]" style={{ fontFamily: 'var(--font-body)' }}>
            Thank you, {firstName}. Our team will get back to you shortly — we aim to respond within 30 minutes
            during business hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <FieldLabel htmlFor="ct-first">First name</FieldLabel>
              <Input
                id="ct-first" aria-label="First name" value={firstName}
                onChange={(e) => { setFirstName(e.target.value); clearError('firstName') }}
                placeholder="Jane"
                aria-invalid={!!errors.firstName}
                className={`${inputCls} h-12 ${errors.firstName ? errorRing : ''}`}
              />
              <FieldError message={errors.firstName} />
            </div>

            <div>
              <FieldLabel htmlFor="ct-last">Last name</FieldLabel>
              <Input
                id="ct-last" aria-label="Last name" value={lastName}
                onChange={(e) => { setLastName(e.target.value); clearError('lastName') }}
                placeholder="Smith"
                aria-invalid={!!errors.lastName}
                className={`${inputCls} h-12 ${errors.lastName ? errorRing : ''}`}
              />
              <FieldError message={errors.lastName} />
            </div>

            <div>
              <FieldLabel htmlFor="ct-email">Email address</FieldLabel>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="ct-email" type="email" aria-label="Email address" value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email') }}
                  placeholder="janesmith@gmail.com"
                  aria-invalid={!!errors.email}
                  className={`pl-9 ${inputCls} h-12 ${errors.email ? errorRing : ''}`}
                />
              </div>
              <FieldError message={errors.email} />
            </div>

            <div>
              <FieldLabel htmlFor="ct-phone">Phone</FieldLabel>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="ct-phone" type="tel" aria-label="Phone" value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError('phone') }}
                  placeholder="Please include your country code if international"
                  aria-invalid={!!errors.phone}
                  className={`pl-9 ${inputCls} h-12 ${errors.phone ? errorRing : ''}`}
                />
              </div>
              <FieldError message={errors.phone} />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="ct-message">Type your enquiries here</FieldLabel>
            <textarea
              id="ct-message" aria-label="Type your enquiries here" value={message}
              onChange={(e) => { setMessage(e.target.value); clearError('message') }}
              rows={5}
              placeholder="Feel free to drop your requirements or questions here. Our team will get in touch with you soon"
              aria-invalid={!!errors.message}
              className={`${textareaCls} ${errors.message ? errorRing : ''}`}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.message} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-13 py-3.5 flex items-center justify-center gap-2 bg-[#EBBA6F] text-[#0C0F1C] text-[15px] font-semibold rounded-lg hover:bg-[#E2B36A] active:bg-[#D4A85E] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {submitting ? 'Sending…' : 'Send Enquiry'}
            {!submitting && <ArrowRight size={16} aria-hidden />}
          </button>

        </form>
      )}
    </div>
  )
}
