'use client'

import { Car, Bus, BusFront, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  CHAUFFEUR_CARS,
  LUXURY_MINIBUSES,
  EXECUTIVE_COACHES,
  type Vehicle,
} from '../VehicleList'
import VehicleImageGallery from '../VehicleImageGallery'
import { SectionCard, FieldLabel, SimpleSelect } from '../form-fields'

// ── Categories ────────────────────────────────────────────────────────────────
// Mirrors the fleet data so the picker never drifts from /fleet.

export interface VehicleCategory {
  key:      string
  label:    string
  icon:     LucideIcon
  vehicles: Vehicle[]
}

export const CATEGORIES: VehicleCategory[] = [
  { key: 'chauffeur-cars',    label: 'Chauffeur Cars',    icon: Car,      vehicles: CHAUFFEUR_CARS    },
  { key: 'luxury-minibuses',  label: 'Luxury Minibuses',  icon: BusFront, vehicles: LUXURY_MINIBUSES  },
  { key: 'executive-coaches', label: 'Executive Coaches', icon: Bus,      vehicles: EXECUTIVE_COACHES },
]

export const DEFAULT_VEHICLE_SLUG = LUXURY_MINIBUSES[0].slug

export function categoryOfSlug(slug: string): VehicleCategory {
  return CATEGORIES.find((c) => c.vehicles.some((v) => v.slug === slug)) ?? CATEGORIES[1]
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  value:    string                    // vehicle slug
  onChange: (slug: string) => void
}

export default function VehiclePicker({ value, onChange }: Props) {
  const category = categoryOfSlug(value)
  const vehicle  = category.vehicles.find((v) => v.slug === value) ?? category.vehicles[0]
  const images   = vehicle.images ?? [vehicle.image]

  return (
    <SectionCard step={4} title="Choose Your Vehicle">

      {/* Category tabs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {CATEGORIES.map((c) => {
          const active = c.key === category.key
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(c.vehicles[0].slug)}
              className={[
                'flex flex-col items-center justify-center gap-1.5 h-[68px] rounded-xl border text-[11.5px] font-medium',
                'transition-all duration-200 px-1 text-center leading-tight',
                active
                  ? 'border-[#EBBA6F] bg-[#EBBA6F]/[0.07] text-[#EBBA6F]'
                  : 'border-white/10 bg-[#0C0F1C] text-white/55 hover:text-white/85 hover:border-white/20',
              ].join(' ')}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <c.icon size={18} strokeWidth={1.25} aria-hidden />
              {c.label}
            </button>
          )
        })}
      </div>

      {/* Vehicle within the category */}
      <div className="mb-4">
        <FieldLabel htmlFor="bk-vehicle">Vehicle</FieldLabel>
        <SimpleSelect
          id="bk-vehicle"
          ariaLabel="Vehicle"
          value={vehicle.slug}
          onChange={onChange}
          icon={Car}
          placeholder="Select a vehicle"
        >
          {category.vehicles.map((v) => (
            <option key={v.slug} value={v.slug}>{v.name}</option>
          ))}
        </SimpleSelect>
      </div>

      {/* Selected summary */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-white text-[13.5px] min-w-0 truncate" style={{ fontFamily: 'var(--font-body)' }}>
          <span className="text-white/45">Selected Vehicle: </span>
          {vehicle.name}
        </p>
        <span
          className="flex items-center gap-1.5 shrink-0 text-white/55 text-[12.5px]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <Users size={13} className="text-[#EBBA6F]" aria-hidden />
          {vehicle.seats}
        </span>
      </div>

      <VehicleImageGallery key={vehicle.slug} images={images} vehicleName={vehicle.name} />

    </SectionCard>
  )
}
