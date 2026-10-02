'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// The form stores and submits 24-hour "HH:mm" — the same string the native
// input used to produce — so nothing downstream has to know this field changed.
// Twelve-hour display lives entirely in here.

const HOURS   = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
const PERIODS = ['AM', 'PM'] as const

type Period = (typeof PERIODS)[number]

interface Parts { hour12: number; minute: number; period: Period }

const DEFAULT: Parts = { hour12: 9, minute: 0, period: 'AM' }

const pad = (n: number) => String(n).padStart(2, '0')

/** "19:45" → { hour12: 7, minute: 45, period: 'PM' }. Invalid input is dropped. */
function parse(value: string): Parts | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null

  const hour24 = Number(match[1])
  const minute = Number(match[2])
  if (hour24 > 23 || minute > 59) return null

  return {
    hour12: hour24 % 12 === 0 ? 12 : hour24 % 12,
    minute,
    period: hour24 < 12 ? 'AM' : 'PM',
  }
}

/** The inverse: 7 / 45 / 'PM' → "19:45". Noon and midnight are the awkward pair. */
function format({ hour12, minute, period }: Parts): string {
  const base   = hour12 % 12               // 12 → 0, so midnight and noon land right
  const hour24 = period === 'PM' ? base + 12 : base
  return `${pad(hour24)}:${pad(minute)}`
}

const label = (p: Parts) => `${p.hour12}:${pad(p.minute)} ${p.period}`

// ── Dial ────────────────────────────────────────────────────────────────────
// Twelve marks on a circle, 12 o'clock at the top and 30° between each. The
// ring and the hand are drawn underneath in SVG; the numbers sit on top as real
// buttons so the dial stays reachable by keyboard.

const SIZE   = 224
const CENTRE = SIZE / 2
const RADIUS = 86

const pointAt = (index: number) => {
  const angle = (index * 30 - 90) * (Math.PI / 180)
  return { x: CENTRE + RADIUS * Math.cos(angle), y: CENTRE + RADIUS * Math.sin(angle) }
}

function Dial({
  values,
  selected,
  unit,
  onPick,
}: {
  values:   number[]
  selected: number
  unit:     'hours' | 'minutes'
  onPick:   (v: number) => void
}) {
  const index = values.indexOf(selected)
  const hand  = pointAt(index === -1 ? 0 : index)

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="absolute inset-0" aria-hidden>
        <circle cx={CENTRE} cy={CENTRE} r={RADIUS + 20} fill="rgba(255,255,255,0.03)" />
        <circle
          cx={CENTRE} cy={CENTRE} r={RADIUS + 20}
          fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1"
        />
        {index !== -1 && (
          <>
            <line x1={CENTRE} y1={CENTRE} x2={hand.x} y2={hand.y} stroke="#EBBA6F" strokeWidth="1.5" />
            <circle cx={CENTRE} cy={CENTRE} r="3"  fill="#EBBA6F" />
            <circle cx={hand.x} cy={hand.y} r="18" fill="#EBBA6F" />
          </>
        )}
      </svg>

      {values.map((v, i) => {
        const { x, y }   = pointAt(i)
        const isSelected = v === selected
        return (
          <button
            key={v}
            type="button"
            aria-label={`${v} ${unit}`}
            aria-pressed={isSelected}
            onClick={() => onPick(v)}
            className={cn(
              'absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full text-[13px]',
              'flex items-center justify-center transition-colors duration-150',
              isSelected
                ? 'text-[#0C0F1C] font-semibold'
                : 'text-white/75 hover:text-white hover:bg-white/[0.07]',
            )}
            style={{ left: x, top: y, fontFamily: 'var(--font-body)' }}
          >
            {pad(v)}
          </button>
        )
      })}
    </div>
  )
}

// ── Readout ─────────────────────────────────────────────────────────────────

function Readout({
  value,
  active,
  ariaLabel,
  onClick,
}: {
  value:     string
  active:    boolean
  ariaLabel: string
  onClick:   () => void
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'w-[58px] h-11 rounded-lg text-[22px] transition-colors duration-150',
        active
          ? 'bg-[#EBBA6F]/15 border border-[#EBBA6F]/50 text-[#EBBA6F]'
          : 'border border-white/10 text-white/75 hover:border-white/25',
      )}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {value}
    </button>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

interface Props {
  id:           string
  value:        string          // HH:mm, 24-hour
  onChange:     (v: string) => void
  /** Heads the panel, and names the field for screen readers — the visible
   *  value alone does not. */
  title?:       string
  placeholder?: string
  invalid?:     boolean
  className?:   string
}

export default function TimePickerField({
  id,
  value,
  onChange,
  title = 'Select time',
  placeholder = 'Select time',
  invalid = false,
  className,
}: Props) {
  const [open, setOpen]   = useState(false)
  const [unit, setUnit]   = useState<'hours' | 'minutes'>('hours')
  const [draft, setDraft] = useState<Parts>(parse(value) ?? DEFAULT)

  const committed = parse(value)

  const triggerBase =
    'w-full h-10 rounded-md border border-white/10 bg-[#0C0F1C] text-[13px] ' +
    'transition-colors duration-150 flex items-center gap-2 pl-3 pr-3 text-left ' +
    'hover:border-[#EBBA6F]/50 focus:outline-none data-[state=open]:border-[#EBBA6F]'

  // Each opening starts from the time the field holds, not from wherever the
  // last visit left off — Cancel has to be able to put everything back.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(parse(value) ?? DEFAULT)
      setUnit('hours')
    }
    setOpen(next)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          aria-label={title}
          className={cn(
            triggerBase,
            committed ? 'text-white' : 'text-white/30',
            invalid && 'border-red-400/60',
            className,
          )}
        >
          <Clock size={13} className="text-white/35 shrink-0" aria-hidden />
          <span className="flex-1 truncate" style={{ fontFamily: 'var(--font-body)' }}>
            {committed ? label(committed) : placeholder}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 border-0 shadow-2xl rounded-xl overflow-hidden"
        align="start"
        sideOffset={4}
      >
        {/* Same shell as the calendar, so the date and time fields read as one
            control — the layout follows a clock app, the colours do not. */}
        <div className="bg-[#0D1221] border border-white/10 rounded-xl overflow-hidden text-white w-[288px]">

          <p
            className="px-5 py-3.5 text-[14px] font-semibold border-b border-white/10"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {title}
          </p>

          <div className="px-5 pt-5 pb-4">

            {/* Readouts — tapping one swaps which dial is showing */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <Readout
                value={pad(draft.hour12)}
                active={unit === 'hours'}
                ariaLabel="Hour"
                onClick={() => setUnit('hours')}
              />
              <span className="text-white/40 text-[20px]" aria-hidden>:</span>
              <Readout
                value={pad(draft.minute)}
                active={unit === 'minutes'}
                ariaLabel="Minutes"
                onClick={() => setUnit('minutes')}
              />
              <div className="flex flex-col ml-2">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={draft.period === p}
                    onClick={() => setDraft((d) => ({ ...d, period: p }))}
                    className={cn(
                      'px-2 py-0.5 text-[13px] font-semibold transition-colors duration-150',
                      draft.period === p ? 'text-[#EBBA6F]' : 'text-white/35 hover:text-white/60',
                    )}
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {unit === 'hours' ? (
              <Dial
                values={HOURS}
                selected={draft.hour12}
                unit="hours"
                onPick={(h) => {
                  setDraft((d) => ({ ...d, hour12: h }))
                  setUnit('minutes')   // straight on to minutes, as a clock app would
                }}
              />
            ) : (
              <Dial
                values={MINUTES}
                selected={draft.minute}
                unit="minutes"
                onPick={(m) => setDraft((d) => ({ ...d, minute: m }))}
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-white/10">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 h-9 rounded-full text-white/60 text-[13px] font-medium hover:text-white transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { onChange(format(draft)); setOpen(false) }}
              className="px-5 h-9 rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[13px] font-semibold hover:bg-[#DDA85E] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Apply
            </button>
          </div>

        </div>
      </PopoverContent>
    </Popover>
  )
}
