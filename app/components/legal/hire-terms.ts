/**
 * The commercial terms of a hire.
 *
 * ⚠️  EVERY NUMBER BELOW IS A PROPOSED DEFAULT, NOT A CONFIRMED FIGURE.
 *
 * These are conventional for UK coach operators, but they are not *your*
 * terms until someone at Everydays Travel says they are. They bind customers
 * once published, so they need reading line by line before this page counts
 * as live — particularly the cancellation scale, the deposit, and the
 * liability caps.
 *
 * While `DRAFT` is true the page shows a notice saying the terms are being
 * finalised, and stays out of the sitemap. Set it to false once the figures
 * below are confirmed, and both the notice and the exclusion disappear.
 */
export const DRAFT = true

// ── Booking and payment ─────────────────────────────────────────────────────

/** Percentage of the hire charge taken to hold a booking. */
export const DEPOSIT_PERCENT = 25

/** Days before departure by which the balance must clear. */
export const BALANCE_DUE_DAYS = 14

/** Annual interest on overdue invoices, above the Bank of England base rate. */
export const LATE_INTEREST_ABOVE_BASE = 4

/** Parking and tolls absorbed per day before they are recharged. */
export const INCLUDED_PARKING_PER_DAY = 15

// ── Cancellation ────────────────────────────────────────────────────────────

/**
 * What the customer pays if they cancel, by how much notice they give. Read
 * top down; the first band whose notice period is met applies.
 */
export const CANCELLATION_SCALE: { notice: string; charge: string }[] = [
  { notice: '29 days or more before departure', charge: 'Deposit only' },
  { notice: '15 to 28 days before departure',   charge: '30% of the hire charge' },
  { notice: '8 to 14 days before departure',    charge: '50% of the hire charge' },
  { notice: '3 to 7 days before departure',     charge: '75% of the hire charge' },
  { notice: 'Less than 72 hours before departure, or no show', charge: '100% of the hire charge' },
]

// ── Luggage and liability ───────────────────────────────────────────────────

/** Cases per passenger on a coach with a hold. */
export const LUGGAGE_ALLOWANCE = 'one suitcase of up to 20kg and one small item of hand luggage'

/** Our cap on liability for a passenger's property. */
export const LUGGAGE_LIABILITY_CAP = 100

/** Cap per on-board facility that turns out not to work. */
export const FACILITY_FAILURE_CAP = 20

/** Charge for returning a vehicle needing more than normal cleaning. */
export const SOILING_CHARGE = 150
