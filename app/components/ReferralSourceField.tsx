import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { inputCls } from './form-fields'

const sources = ['Google search', 'Google Maps', 'Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'Friend or colleague', 'Used Everydays Travel before', 'Other', 'Not sure']

export default function ReferralSourceField({
  required = false,
  value,
  onChange,
  className,
  labelClassName,
  selectClassName,
}: {
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  className?: string
  labelClassName?: string
  selectClassName?: string
}) {
  return (
    <label className={cn('grid min-w-0 gap-1.5 text-white', className)}>
      <span className={cn('text-[11px] tracking-[0.02em]', labelClassName)}>
        How did you hear about us? {required && <span aria-hidden="true">*</span>}
      </span>
      <span className="relative">
        <select
          name="referralSource"
          required={required}
          value={value}
          defaultValue={value === undefined ? '' : undefined}
          onChange={onChange ? event => onChange(event.target.value) : undefined}
          className={cn(inputCls, 'appearance-none pl-3 pr-9 [color-scheme:dark] forced-colors:appearance-auto', selectClassName)}
        >
          <option value="">Select a source</option>
          {sources.map(source => <option key={source} value={source}>{source}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 forced-colors:hidden" aria-hidden />
      </span>
    </label>
  )
}
