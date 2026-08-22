'use client'

import { ChevronDown } from 'lucide-react'

// ── Style tokens ──────────────────────────────────────────────────────────────
// Shared by every field on the booking page so the whole form reads as one set.

export const base =
  'w-full h-10 rounded-md border border-white/10 bg-[#0C0F1C] text-[13px] transition-colors duration-150'

export const inputCls =
  base +
  ' text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F]'

export const textareaCls =
  'w-full rounded-md border border-white/10 bg-[#0C0F1C] text-[13px] text-white placeholder:text-white/30 ' +
  'px-3 py-2.5 leading-relaxed transition-colors duration-150 focus:outline-none focus:border-[#EBBA6F] resize-none'

export const selectCls = (hasValue: boolean) =>
  base +
  ' pl-8 pr-8 appearance-none cursor-pointer [color-scheme:dark] focus:outline-none focus:border-[#EBBA6F] focus:ring-0 ' +
  (hasValue ? 'text-white' : 'text-white/30')

export const errorRing = '!border-red-500/70'

/** Pickup / return times, 05:00 → 23:30 in half-hour steps. */
export const TIME_OPTIONS = Array.from({ length: 38 }, (_, i) => {
  const total = 5 * 60 + i * 30
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
})

export const todayISO = () => new Date().toISOString().split('T')[0]

// ── FieldLabel ────────────────────────────────────────────────────────────────

export function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-white text-[11px] mb-1.5 tracking-[0.02em]"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {children}
      {required && <span className="text-[#EBBA6F] ml-0.5">*</span>}
    </label>
  )
}

// ── FieldError ────────────────────────────────────────────────────────────────

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      className="mt-1.5 text-[11px] text-red-400"
      role="alert"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {message}
    </p>
  )
}

// ── SimpleSelect (native, styled) ─────────────────────────────────────────────

export function SimpleSelect({
  id,
  ariaLabel,
  value,
  onChange,
  icon: Icon,
  placeholder,
  invalid = false,
  children,
}: {
  id: string
  ariaLabel: string
  value: string
  onChange: (v: string) => void
  icon: React.ElementType
  placeholder: string
  invalid?: boolean
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
        aria-invalid={invalid || undefined}
        className={`${selectCls(!!value)} ${invalid ? errorRing : ''}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
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

// ── SectionCard ───────────────────────────────────────────────────────────────

export function SectionCard({
  step,
  title,
  children,
  className = '',
}: {
  step: number
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      aria-label={title}
      className={
        'bg-[#0D1221] rounded-2xl border border-white/[0.08] ' +
        'shadow-[0_0_0_1px_rgba(235,186,111,0.06),0_18px_50px_rgba(0,0,0,0.45)] ' +
        'p-5 sm:p-6 ' +
        className
      }
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-7 h-7 shrink-0 rounded-full border border-[#EBBA6F]/60 text-[#EBBA6F] text-[12px] font-semibold flex items-center justify-center"
          style={{ fontFamily: 'var(--font-ui)' }}
          aria-hidden
        >
          {step}
        </span>
        <h2
          className="text-white text-[19px] sm:text-[21px] leading-none tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}
