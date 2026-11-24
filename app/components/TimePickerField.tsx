'use client'

import { useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

function displayTime(value: string) {
  const [hour, minute] = value.split(':')
  return `${Number(hour) % 12 || 12}:${minute} ${Number(hour) < 12 ? 'AM' : 'PM'}`
}

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1))
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

interface Props {
  id: string
  value: string
  onChange: (value: string) => void
  title?: string
  placeholder?: string
  invalid?: boolean
  className?: string
}

export default function TimePickerField({
  id, value, onChange, title = 'Select time', placeholder = 'Select time', invalid, className,
}: Props) {
  const selected = /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : ''
  const [open, setOpen] = useState(false)
  const [hour, setHour] = useState('9')
  const [minute, setMinute] = useState('00')
  const [period, setPeriod] = useState('AM')

  function toggle(next: boolean) {
    if (next) {
      const [h, m] = (selected || '09:00').split(':')
      setHour(String(Number(h) % 12 || 12))
      setMinute(m)
      setPeriod(Number(h) >= 12 ? 'PM' : 'AM')
    }
    setOpen(next)
  }

  const panel = useRef<HTMLDivElement>(null)

  function applyTime() {
    const hour24 = Number(hour) % 12 + (period === 'PM' ? 12 : 0)
    onChange(`${String(hour24).padStart(2, '0')}:${minute}`)
    setOpen(false)
  }

  const fields = [
    { label: 'Hour', value: hour, options: hours, change: setHour },
    { label: 'Minute', value: minute, options: minutes.includes(minute) ? minutes : [...minutes, minute].sort(), change: setMinute },
    { label: 'AM/PM', value: period, options: ['AM', 'PM'], change: setPeriod },
  ]

  return (
    <Popover open={open} onOpenChange={toggle}>
      <PopoverTrigger asChild>
        <button type="button" id={id} aria-label={selected ? `${title}, ${displayTime(selected)}` : title} aria-invalid={invalid}
          className={cn('flex w-full h-10 items-center gap-2 rounded-md border border-white/10 bg-[#0C0F1C] px-3 text-[13px] hover:border-[#EBBA6F]/50 focus-visible:border-[#EBBA6F] data-[state=open]:border-[#EBBA6F]',
            selected ? 'text-white' : 'text-white/50', invalid && 'border-red-400/60', className)}>
          <Clock size={13} aria-hidden className="text-white/35" />
          {selected ? displayTime(selected) : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={4} aria-label={title}
        ref={panel}
        onFocusOutside={event => event.preventDefault()}
        onPointerDownOutside={() => applyTime()}
        className="w-64 rounded-xl border border-white/10 bg-[#0D1221] p-4 text-white shadow-2xl">
        <div className="grid grid-cols-3 gap-2">
          {fields.map(field => (
            <div key={field.label} className="grid gap-1 text-xs text-white/70">
              <label htmlFor={`${id}-${field.label}`}>{field.label}</label>
              <Select value={field.value} onValueChange={field.change}>
                <SelectTrigger id={`${id}-${field.label}`} aria-label={field.label}
                  className="w-full border-white/15 bg-[#0C0F1C] px-2 text-white focus-visible:border-[#EBBA6F] data-[size=default]:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="start"
                  onPointerDownOutside={event => {
                    // The open list captures pointer events even over the underlying panel.
                    const bounds = panel.current?.getBoundingClientRect()
                    const { clientX, clientY } = event.detail.originalEvent
                    if (bounds && (clientX < bounds.left || clientX > bounds.right ||
                        clientY < bounds.top || clientY > bounds.bottom)) applyTime()
                  }}
                  className="max-h-[min(10rem,var(--radix-select-content-available-height))] min-w-0 border border-white/15 [--popover:#0D1221] bg-popover text-white">
                  {field.options.map(option => (
                    <SelectItem key={option} value={option} className="text-white focus:bg-[#EBBA6F]/15 focus:text-white not-data-[variant=destructive]:focus:**:text-white">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <button type="button" className="mt-4 ml-auto block rounded-full bg-[#EBBA6F] px-4 py-2 text-sm font-semibold text-[#0C0F1C]"
          onClick={applyTime}>
          Apply
        </button>
      </PopoverContent>
    </Popover>
  )
}
