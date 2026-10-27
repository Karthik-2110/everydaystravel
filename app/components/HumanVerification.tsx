'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

interface TurnstileAPI {
  render(container: HTMLElement, options: Record<string, unknown>): string
  remove(id: string): void
}
declare global { interface Window { turnstile?: TurnstileAPI } }

export function useHumanVerification() {
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const reset = () => { setToken(''); setResetKey(key => key + 1) }
  return { token, setToken, resetKey, reset }
}

export default function HumanVerification({ action, onVerify, resetKey }: {
  action: 'quote' | 'contact'
  onVerify: (token: string) => void
  resetKey: number
}) {
  const container = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!sitekey || !ready || !container.current || !window.turnstile) return
    const api = window.turnstile
    const id = api.render(container.current, {
      sitekey, action, theme: 'dark', size: 'flexible',
      callback: (token: string) => { setFailed(false); onVerify(token) },
      'expired-callback': () => onVerify(''),
      'error-callback': () => { onVerify(''); setFailed(true) },
      'timeout-callback': () => { onVerify(''); setFailed(true) },
    })
    return () => { api.remove(id); onVerify('') }
  }, [action, onVerify, ready, resetKey, sitekey])

  if (!sitekey) return <p role="status" className="text-sm leading-relaxed text-white/75">If urgent, <a className="text-[#EBBA6F] underline" href="tel:02089418354">call 020 8941 8354</a>.</p>

  return (
    <div className="min-w-0 my-4">
      <Script id="cloudflare-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setFailed(true)} />
      <div ref={container} aria-label="Human verification" className="min-h-[65px] w-full" />
      {failed && <p role="alert" className="mt-2 text-sm text-white/75">Verification could not load. <button type="button" className="text-[#EBBA6F] underline" onClick={() => window.location.reload()}>Reload this page</button> or call 020 8941 8354.</p>}
      <noscript>Please enable JavaScript for verification, or call 020 8941 8354.</noscript>
    </div>
  )
}
