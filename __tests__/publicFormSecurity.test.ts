import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
const send = vi.hoisted(() => vi.fn(async () => ({ error: null })))
vi.mock('resend', () => ({ Resend: class { emails = { send } } }))
import { POST as quote } from '@/app/api/quote/route'
import { POST as contact } from '@/app/api/contact/route'

const payload = { fullName: 'Ada Lovelace', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', phone: '07538 724000', pickup: 'Heathrow', destination: 'London', message: 'A group journey', journeyType: 'oneway' }
const request = (body: object) => new Request('https://everydaystravel.co.uk/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

beforeEach(() => { send.mockClear(); vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret'); vi.stubEnv('TURNSTILE_HOSTNAMES', 'everydaystravel.co.uk,www.everydaystravel.co.uk') })
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe.each([['quote', quote, 'quote'], ['contact', contact, 'contact']] as const)('%s form protection', (_name, post, action) => {
  it('rejects missing tokens before sending email', async () => {
    expect((await post(request(payload))).status).toBe(403)
    expect(send).not.toHaveBeenCalled()
  })
  it('rejects a failed or replayed challenge before sending email', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] })))
    expect((await post(request({ ...payload, turnstileToken: 'used-token' }))).status).toBe(403)
    expect(send).not.toHaveBeenCalled()
  })
  it('rejects a valid token issued for a different hostname', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, action, hostname: 'attacker.example' })))
    expect((await post(request({ ...payload, turnstileToken: 'token' }))).status).toBe(403)
    expect(send).not.toHaveBeenCalled()
  })
  it('rejects a token issued for another form action', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, action: 'other', hostname: 'everydaystravel.co.uk' })))
    expect((await post(request({ ...payload, turnstileToken: 'token' }))).status).toBe(403)
    expect(send).not.toHaveBeenCalled()
  })
  it('sends only after the expected action and hostname are verified', async () => {
    const verify = vi.fn(async () => Response.json({ success: true, action, hostname: 'everydaystravel.co.uk' }))
    vi.stubGlobal('fetch', verify)
    expect((await post(request({ ...payload, turnstileToken: 'token' }))).status).toBe(200)
    expect(send).toHaveBeenCalledTimes(1)
    expect(verify).toHaveBeenCalledWith('https://challenges.cloudflare.com/turnstile/v0/siteverify', expect.objectContaining({ method: 'POST' }))
  })
  it('fails closed when Cloudflare is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
    expect((await post(request({ ...payload, turnstileToken: 'token' }))).status).toBe(503)
    expect(send).not.toHaveBeenCalled()
  })
  it('fails closed when the secret is not configured', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    expect((await post(request({ ...payload, turnstileToken: 'token' }))).status).toBe(503)
    expect(send).not.toHaveBeenCalled()
  })
})
