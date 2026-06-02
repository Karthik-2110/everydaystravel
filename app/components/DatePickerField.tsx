'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

// Override shadcn's CSS vars so the Calendar uses our brand palette
const CALENDAR_VARS = {
  '--background':           'oklch(0.13 0.02 250)',
  '--foreground':           'oklch(0.95 0.01 250)',
  '--primary':              'oklch(0.78 0.12 75)',    // gold #EBBA6F
  '--primary-foreground':   'oklch(0.12 0.02 250)',  // dark navy
  '--muted':                'oklch(0.20 0.02 250)',   // subtle dark tint
  '--muted-foreground':     'oklch(0.50 0.02 250)',
  '--accent':               'oklch(0.20 0.02 250)',
  '--accent-foreground':    'oklch(0.95 0.01 250)',
  '--border':               'oklch(0.28 0.02 250)',
  '--ring':                 'oklch(0.78 0.12 75)',
  '--radius':               '0.5rem',
} as React.CSSProperties

interface Props {
  id:        string
  value:     string          // yyyy-MM-dd
  onChange:  (v: string) => void
  minDate?:  string          // yyyy-MM-dd
  className?: string
}

export default function DatePickerField({ id, value, onChange, minDate, className }: Props) {
  const [open, setOpen] = useState(false)

  const selected = value ? parseISO(value) : undefined
  const minDay   = minDate ? parseISO(minDate) : new Date()

  const triggerBase =
    'w-full h-10 rounded-md border border-white/10 bg-[#0C0F1C] text-[13px] ' +
    'transition-colors duration-150 flex items-center gap-2 pl-3 pr-3 text-left ' +
    'hover:border-[#EBBA6F]/50 focus:outline-none data-[state=open]:border-[#EBBA6F]'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(triggerBase, selected ? 'text-white' : 'text-white/30', className)}
        >
          <CalendarDays size={13} className="text-white/35 shrink-0" aria-hidden />
          <span className="flex-1 truncate" style={{ fontFamily: 'var(--font-body)' }}>
            {selected ? format(selected, 'd MMM yyyy') : 'Select date'}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 border-0 shadow-2xl rounded-xl overflow-hidden"
        style={CALENDAR_VARS}
        align="start"
        sideOffset={4}
      >
        <div className="bg-[#0D1221] border border-white/10 rounded-xl overflow-hidden text-white">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(day) => {
              if (day) { onChange(format(day, 'yyyy-MM-dd')); setOpen(false) }
            }}
            fromDate={minDay}
            initialFocus
            classNames={{
              caption_label: 'text-white font-semibold text-[14px]',
              weekday:        'flex-1 text-white/40 text-[11px] font-normal text-center select-none',
              day:            'text-white/80 hover:text-white',
              today:          '!text-[#EBBA6F] font-semibold',
              outside:        'text-white/20',
              disabled:       '!text-white/50 cursor-not-allowed pointer-events-none',
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left'
                  ? <ChevronLeft size={15} className="text-white/70" />
                  : <ChevronRight size={15} className="text-white/70" />,
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
