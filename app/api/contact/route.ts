import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO_EMAILS = ['thaya@everydaystravel.co.uk', 'info@everydaystravel.co.uk', 'web@everydaystravel.co.uk']

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request: Request) {
  const body = await request.json()
  const { firstName, lastName, email, phone, message } = body

  const name = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Website visitor'

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
      <div style="background: #0C0F1C; padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #EBBA6F; font-size: 22px; margin: 0 0 4px;">New Enquiry</h1>
        <p style="color: rgba(255,255,255,0.45); font-size: 13px; margin: 0;">Everyday Travels — contact page</p>
      </div>

      <div style="background: #f9f9f9; padding: 28px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px; width: 40%;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;"><a href="mailto:${escapeHtml(email)}" style="color: #0C0F1C;">${escapeHtml(email)}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600;"><a href="tel:${escapeHtml(phone)}" style="color: #0C0F1C;">${escapeHtml(phone)}</a></td>
          </tr>` : ''}
        </table>

        <p style="color: #666; font-size: 13px; margin: 22px 0 6px;">Enquiry</p>
        <p style="font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${escapeHtml(message ?? '')}</p>
      </div>
    </div>
  `

  const { error } = await resend.emails.send({
    from: 'Everyday Travels <noreply@email.everydaystravel.co.uk>',
    to: TO_EMAILS,
    replyTo: email,
    subject: `New Enquiry — ${name}`,
    html,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
