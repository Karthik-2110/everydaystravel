'use client'

import { useEffect } from 'react'
import { useHasConsent, useHydrated } from '@/app/lib/consent'
import { loadAnalytics, disableAnalytics } from '@/app/lib/analytics'

/**
 * The analytics consent gate. Google's tag is kept out of the page until the
 * visitor turns the category on, and silenced again the moment they turn it
 * off — no reload needed, because the decision is subscribed to rather than
 * read once on mount.
 *
 * No decision is treated the same as a refusal, which is why the effect
 * disables on every path but the agreed one.
 */
export default function Analytics() {
  const allowed = useHasConsent('analytics')
  const ready   = useHydrated()

  useEffect(() => {
    if (!ready) return
    if (allowed) loadAnalytics()
    else disableAnalytics()
  }, [ready, allowed])

  return null
}
