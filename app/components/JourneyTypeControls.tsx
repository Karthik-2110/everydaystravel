import { ArrowRight, ArrowRightLeft } from 'lucide-react'

type JourneyType = 'oneway' | 'return'

export function JourneyTypeChips({ isReturn, onChange }: {
  isReturn: boolean
  onChange: (type: JourneyType) => void
}) {
  return (
    <div role="group" aria-label="Journey type" className="grid w-full grid-cols-2 gap-1.5">
      {([
        ['oneway', 'One way trip', ArrowRight],
        ['return', 'Add Return trip', ArrowRightLeft],
      ] as const).map(([type, label, Icon]) => {
        const active = isReturn === (type === 'return')
        return (
          <button key={type} type="button" aria-pressed={active} onClick={() => onChange(type)}
            className={`flex items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 text-[13px] font-medium transition-colors sm:px-3 ${active ? 'border-white/20 bg-[#1e2338] text-white' : 'border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}
            style={{ fontFamily: 'var(--font-ui)' }}>
            <Icon size={13} aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}

export function ReturnTripPrompt({ onAdd }: { onAdd: () => void }) {
  return (
    <p className="col-span-full text-[13px] text-white/75">
      Are you planning to book a return trip as well?{' '}
      <button type="button" onClick={onAdd} className="font-medium text-[#EBBA6F] underline underline-offset-4 hover:text-[#F4CD93]">
        Add return trip information
      </button>
    </p>
  )
}
