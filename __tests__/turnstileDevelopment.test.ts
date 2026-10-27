import { afterEach, expect, it, vi } from 'vitest'
import { verifyHuman } from '@/app/lib/turnstile'
const secret = '1x0000000000000000000000000000000AA'
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })
it('accepts the official Cloudflare dummy response only in development', async () => {
  vi.stubEnv('NODE_ENV', 'development'); vi.stubEnv('TURNSTILE_SECRET_KEY', secret)
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, hostname: 'example.com', metadata: { result_with_testing_key: true } })))
  expect(await verifyHuman('XXXX.DUMMY.TOKEN.XXXX', 'quote')).toBeNull()
})
it('rejects dummy secrets in production without contacting Cloudflare', async () => {
  vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('TURNSTILE_SECRET_KEY', secret)
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher)
  expect(await verifyHuman('XXXX.DUMMY.TOKEN.XXXX', 'quote')).toMatchObject({ status: 503 })
  expect(fetcher).not.toHaveBeenCalled()
})
it('retains hostname and action checks for real secrets in development', async () => {
  vi.stubEnv('NODE_ENV', 'development'); vi.stubEnv('TURNSTILE_SECRET_KEY', 'real-secret')
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, hostname: 'example.com', metadata: { result_with_testing_key: true } })))
  expect(await verifyHuman('XXXX.DUMMY.TOKEN.XXXX', 'quote')).toMatchObject({ status: 403 })
})
