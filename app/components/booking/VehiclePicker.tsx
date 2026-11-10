'use client'

import Image from 'next/image'
import { Car, Bus, BusFront, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  CHAUFFEUR_CARS,
  LUXURY_MINIBUSES,
  EXECUTIVE_COACHES,
  type Vehicle,
} from '../VehicleList'
import VehicleImageGallery from '../VehicleImageGallery'
import { FieldLabel, SimpleSelect } from '../form-fields'

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

function passengerCapacity(vehicle: Vehicle): number {
  // Seat labels are either a range (1–6) or a maximum (Up to 16).
  return Number(vehicle.seats.match(/\d+/g)?.at(-1) ?? 0)
}

const recommendationOrder = CATEGORIES.flatMap(category => category.vehicles)
  .filter(vehicle => vehicle.badge !== 'Supercar')
  .sort((a, b) => passengerCapacity(a) - passengerCapacity(b))

export function recommendVehicle(passengerCount: number) {
  return recommendationOrder.find(vehicle => passengerCapacity(vehicle) >= passengerCount)
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  sideBySide?: boolean
  passengerCount?: number
  recommendation?: Vehicle
  onConfirmRecommendation?: (slug: string) => void
  value:    string                    // vehicle slug
  onChange: (slug: string) => void
}

export default function VehiclePicker({ value, onChange, sideBySide = false, passengerCount, recommendation, onConfirmRecommendation }: Props) {
  const category = categoryOfSlug(value)
  const vehicle = category.vehicles.find(v => v.slug === value)

  return (
    <>
      {passengerCount !== undefined && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-[#EBBA6F]/25 bg-[#EBBA6F]/[0.05] p-3 sm:p-4">
          {recommendation && (
            <div className="relative aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-lg sm:w-32">
              <Image src={recommendation.images?.[0] ?? recommendation.image} alt="" fill sizes="(min-width: 640px) 128px, 96px" className="object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1 basis-32">
            {recommendation ? (
              <>
                <p className="text-sm leading-relaxed text-white/75">
                  For {passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'}, we recommend the{' '}
                  <strong className="font-semibold text-[#EBBA6F]">{recommendation.name}</strong>.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/65">
                  {recommendation.seats}. Feel free to choose another vehicle below.
                </p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-white/75">
                For {passengerCount} passengers, our team can quote for multiple vehicles. You can leave the vehicle blank or select a preference below.
              </p>
            )}
          </div>
          {recommendation && onConfirmRecommendation && (
            <button
              type="button"
              onClick={() => onConfirmRecommendation(recommendation.slug)}
              className="ml-auto inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#EBBA6F] px-5 text-sm font-semibold text-[#0C0F1C] transition-colors hover:bg-[#E2B36A]"
            >
              Confirm vehicle
            </button>
          )}
        </div>
      )}
      <div className={sideBySide ? "grid gap-6 md:grid-cols-2 md:items-start" : undefined}>
        <div className="min-w-0">
          {/* Category tabs */}
          <div className={sideBySide ? 'mb-4 flex flex-wrap gap-2' : 'grid grid-cols-3 gap-2 mb-4'}>
            {CATEGORIES.map((c) => {
              const active = c.key === category.key
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange(c.vehicles[0].slug)}
                  className={[
                    'flex items-center justify-center border text-[11.5px] font-medium transition-colors duration-200 text-center leading-tight',
                    sideBySide ? 'min-h-9 rounded-full px-3 py-1.5' : 'h-[68px] flex-col gap-1.5 rounded-xl px-1',
                    active
                      ? 'border-[#EBBA6F] bg-[#EBBA6F]/[0.07] text-[#EBBA6F]'
                      : 'border-white/10 bg-[#0C0F1C] text-white/55 hover:text-white/85 hover:border-white/20',
                  ].join(' ')}
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {!sideBySide && <c.icon size={18} strokeWidth={1.25} aria-hidden />}
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
              value={value}
              onChange={onChange}
              icon={Car}
              placeholder="Select a vehicle"
            >
              {category.vehicles.map((v) => (
                <option key={v.slug} value={v.slug}>{v.name}</option>
              ))}
            </SimpleSelect>
          </div>

          {vehicle && (
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
          )}
          {vehicle && passengerCount !== undefined && passengerCount > passengerCapacity(vehicle) && (
            <p className="text-xs leading-relaxed text-[#EBBA6F]">
              This vehicle seats fewer than {passengerCount} passengers. Our team can quote for additional vehicles.
            </p>
          )}
        </div>
        {vehicle && <VehicleImageGallery key={vehicle.slug} images={vehicle.images ?? [vehicle.image]} vehicleName={vehicle.name} />}
      </div>
    </>
  )
}
