import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CHAUFFEUR_CARS, LUXURY_MINIBUSES, EXECUTIVE_COACHES } from '@/app/components/VehicleList'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO_EMAILS = ['thaya@everydaystravel.co.uk', 'info@everydaystravel.co.uk', 'web@everydaystravel.co.uk']

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

function row(label: string, value: string): string {
  return `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px; width: 40%;">${label}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${value}</td>
          </tr>`
}

export async function POST(request: Request) {
  const body = await request.json()
  const { vehicle, journeyType, pickup, destination, passengers, travelDate, pickupTime, returnDate, returnTime, email, phone, fullName, extraStops } = body
  const vehicleName = vehicle ? vehicleNameFromSlug(vehicle) : null

  const stops: string[] = Array.isArray(extraStops) ? extraStops.filter(Boolean) : []

  const extraRows = [
    ...(fullName ? [row('Name', fullName)] : []),
    ...(stops.length ? [row('Extra stops', stops.join(' · '))] : []),
    ...EXTRA_FIELDS.filter(([key]) => body[key]).map(([key, label]) => row(label, body[key])),
  ].join('')

  const subject = `New Quote Request — ${pickup} → ${destination}`

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: #0C0F1C; padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #EBBA6F; font-size: 22px; margin: 0 0 4px;">New Quote Request</h1>
        <p style="color: rgba(255,255,255,0.45); font-size: 13px; margin: 0;">Everyday Travels</p>
      </div>

      <div style="background: #f9f9f9; padding: 28px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5; border-top: none;">

        <table style="width: 100%; border-collapse: collapse;">
          ${vehicleName ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px; width: 40%;">Vehicle</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${vehicleName}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px; width: 40%;">Trip type</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600; text-transform: capitalize;">${journeyType === 'oneway' ? 'One way' : 'Return'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Pickup</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${pickup}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Destination</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${destination}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Passengers</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${passengers}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Travel date</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${travelDate} at ${pickupTime}</td>
          </tr>
          ${journeyType === 'return' && returnDate ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Return</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${returnDate}${returnTime ? ` at ${returnTime}` : ''}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;"><a href="mailto:${email}" style="color: #0C0F1C;">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;"><a href="tel:${phone}" style="color: #0C0F1C;">${phone}</a></td>
          </tr>` : ''}
          ${extraRows}
        </table>

      </div>
    </div>
  `

  const { error } = await resend.emails.send({
    from: 'Everyday Travels <noreply@email.everydaystravel.co.uk>',
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
