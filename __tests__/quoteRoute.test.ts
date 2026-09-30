import { describe, it, expect, vi, beforeEach } from 'vitest'

// One shared spy so each test can read back what was handed to Resend.
const send = vi.hoisted(() =>
  vi.fn(async (_payload: { subject: string; html: string }) => ({ error: null })),
)

vi.mock('resend', () => ({
  Resend: class {
    emails = { send }
  },
}))

import { POST } from '@/app/api/quote/route'

const VALID = {
  journeyType: 'oneway',
  pickup:      'Heathrow Airport',
  destination: 'Central London',
  passengers:  '12',
  travelDate:  '2026-10-01',
  pickupTime:  '09:00',
  fullName:    'Ada Lovelace',
  email:       'ada@example.com',
  phone:       '07538 724000',
}

const post = (body: Record<string, unknown>) =>
  POST(new Request('http://localhost/api/quote', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  }))

beforeEach(() => send.mockClear())

describe('POST /api/quote', () => {
  it('puts the full name in the email, ahead of the journey detail', async () => {
    const res = await post(VALID)
    expect(res.status).toBe(200)

    const { html } = send.mock.calls[0][0]
    expect(html).toContain('Ada Lovelace')
    expect(html).toMatch(/>Name</)
    // The name identifies the enquiry, so it leads the table.
    expect(html.indexOf('Ada Lovelace')).toBeLessThan(html.indexOf('Heathrow Airport'))
  })

  it('rejects a name that is a keyboard run', async () => {
    const res = await post({ ...VALID, fullName: 'asdfasdf' })
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({ fields: { fullName: 'Please enter your full name' } })
    expect(send).not.toHaveBeenCalled()
  })

  it('rejects a filler phone number', async () => {
    const res = await post({ ...VALID, phone: '07000 000000' })
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({ fields: { phone: 'Please enter a real phone number' } })
    expect(send).not.toHaveBeenCalled()
  })

  it('rejects a disposable email address', async () => {
    const res = await post({ ...VALID, email: 'someone@mailinator.com' })
    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it('accepts a request with no name at all, as the vehicle form sends', async () => {
    const { fullName, ...withoutName } = VALID
    void fullName
    const res = await post(withoutName)
    expect(res.status).toBe(200)
  })

  it('accepts an international phone number', async () => {
    const res = await post({ ...VALID, phone: '+91 96774 34707' })
    expect(res.status).toBe(200)
  })

  it('escapes markup so a typed angle bracket cannot reach the inbox as HTML', async () => {
    await post({ ...VALID, fullName: 'Ada <b>Lovelace</b>' })
    const { html } = send.mock.calls[0][0]
    expect(html).toContain('Ada &lt;b&gt;Lovelace&lt;/b&gt;')
    expect(html).not.toContain('<b>Lovelace</b>')
  })
})
