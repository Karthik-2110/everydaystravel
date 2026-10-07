import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CHAUFFEUR_CARS, LUXURY_MINIBUSES, EXECUTIVE_COACHES } from '@/app/components/VehicleList'
import { validateEmail, validatePhone, validateFullName } from '@/app/lib/validation'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO_EMAILS = ['info@everydaystravel.co.uk', 'web@everydaystravel.co.uk']

const ALL_VEHICLES = [...CHAUFFEUR_CARS, ...LUXURY_MINIBUSES, ...EXECUTIVE_COACHES]

function vehicleNameFromSlug(slug: string): string {
  return ALL_VEHICLES.find((v) => v.slug === slug)?.name ?? slug
}

// Extra rows the /book page sends. Omitted entirely when empty, so the shorter
// hero/vehicle forms keep producing the same email they always have.
const EXTRA_FIELDS: [key: string, label: string][] = [
  ['serviceType',     'Journey type'],
  ['company',         'Company'],
  ['flightDetails',   'Flight / train'],
  ['luggage',         'Luggage'],
  ['accessibility',   'Accessibility'],
  ['specialRequests', 'Special requests'],
  ['notes',           'Additional notes'],
]

/**
 * Everything below is interpolated into an HTML email, so anything a stranger
 * typed gets escaped first — otherwise a `<` in a name or a note reaches our
 * inbox as markup.
 */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value: string): string {
  return `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px; width: 40%;">${label}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${esc(value)}</td>
          </tr>`
}

export async function POST(request: Request) {
  const body = await request.json()
  const { vehicle, journeyType, pickup, destination, passengers, travelDate, pickupTime, returnDate, returnTime, email, phone, fullName, extraStops } = body
  const vehicleName = vehicle ? vehicleNameFromSlug(vehicle) : null

  // The forms check these in the browser, which does nothing for a request
  // posted straight at the endpoint. Checking again here is what actually
  // keeps junk out of the inbox.
  const fields: Record<string, string> = {}
  // Only the /book and hero forms collect a name; the vehicle form omits the
  // key entirely, so an absent name is fine and an empty one is not.
  if (fullName !== undefined) {
    const problem = validateFullName(String(fullName))
    if (problem) fields.fullName = problem
  }
  const emailProblem = validateEmail(String(email ?? ''))
  if (emailProblem) fields.email = emailProblem
  const phoneProblem = validatePhone(String(phone ?? ''))
  if (phoneProblem) fields.phone = phoneProblem

  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: 'Invalid contact details', fields }, { status: 400 })
  }

  const stops: string[] = Array.isArray(extraStops) ? extraStops.filter(Boolean) : []

  // The name identifies the enquiry, so it heads the table instead of sitting
  // below the journey detail with the optional rows.
  const nameRow = fullName ? row('Name', String(fullName)) : ''

  const extraRows = [
    ...(stops.length ? [row('Extra stops', stops.join(' · '))] : []),
    ...EXTRA_FIELDS.filter(([key]) => body[key]).map(([key, label]) => row(label, body[key])),
  ].join('')

  const subject = `New Quote Request: ${pickup} → ${destination}`.replace(/[\r\n]+/g, ' ')

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: #0C0F1C; padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #EBBA6F; font-size: 22px; margin: 0 0 4px;">New Quote Request</h1>
        <p style="color: rgba(255,255,255,0.45); font-size: 13px; margin: 0;">Everydays Travel</p>
      </div>

      <div style="background: #f9f9f9; padding: 28px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5; border-top: none;">

        <table style="width: 100%; border-collapse: collapse;">
          ${nameRow}
          ${vehicleName ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px; width: 40%;">Vehicle</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${esc(vehicleName)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px; width: 40%;">Trip type</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600; text-transform: capitalize;">${journeyType === 'oneway' ? 'One way' : 'Return'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Pickup</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${esc(pickup)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Destination</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${esc(destination)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Passengers</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${esc(passengers)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Travel date</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${esc(travelDate)} at ${esc(pickupTime)}</td>
          </tr>
          ${journeyType === 'return' && returnDate ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Return</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${esc(returnDate)}${returnTime ? ` at ${esc(returnTime)}` : ''}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;"><a href="mailto:${esc(email)}" style="color: #0C0F1C;">${esc(email)}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;"><a href="tel:${esc(phone)}" style="color: #0C0F1C;">${esc(phone)}</a></td>
          </tr>` : ''}
          ${extraRows}
        </table>

      </div>
    </div>
  `

  const { error } = await resend.emails.send({
    from: 'Everydays Travel <noreply@email.everydaystravel.co.uk>',
    to: TO_EMAILS,
    replyTo: email,
    subject,
    html,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
