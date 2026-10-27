/** Server-only verification. Never import this module into a client component. */
export async function verifyHuman(token: unknown, action: 'quote' | 'contact'): Promise<{ status: number; error: string } | null> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || (process.env.NODE_ENV === 'production' && /^[123]x0+/.test(secret))) {
    return { status: 503, error: 'Verification is unavailable. Please call us on 020 8941 8354.' }
  }
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    return { status: 403, error: 'Please complete the human verification and try again.' }
  }
  const hostnames = (process.env.TURNSTILE_HOSTNAMES || 'everydaystravel.co.uk,www.everydaystravel.co.uk')
    .split(',').map(host => host.trim().toLowerCase()).filter(Boolean)
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!response.ok) throw new Error('Verification service unavailable')
    const result = await response.json()
    // Cloudflare's official test service returns synthetic hostname/action
    // data. Only its exact passing key + dummy token can use this path, and
    // only in development. Production rejects dummy secrets above.
    const officialDevelopmentTest = process.env.NODE_ENV === 'development'
      && secret === '1x0000000000000000000000000000000AA'
      && token === 'XXXX.DUMMY.TOKEN.XXXX'
      && result.success === true
      && result.metadata?.result_with_testing_key === true
    if (officialDevelopmentTest) return null
    if (result.success !== true || result.action !== action || typeof result.hostname !== 'string' || !hostnames.includes(result.hostname.toLowerCase())) {
      return { status: 403, error: 'Verification was unsuccessful or expired. Please verify again.' }
    }
    return null
  } catch {
    return { status: 503, error: 'Verification is temporarily unavailable. Please try again or call 020 8941 8354.' }
  }
}
