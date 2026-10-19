'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import FloatingContactBar from './FloatingContactBar'
import CookieConsent from './CookieConsent'
import Analytics from './Analytics'
import { disableAnalytics } from '@/app/lib/analytics'

export default function MarketingChrome() {
  const pathname = usePathname()
  const crm = pathname === '/crm' || pathname.startsWith('/crm/')
  useEffect(() => { if (crm) disableAnalytics() }, [crm])
  if (crm) return null
  return <><FloatingContactBar /><CookieConsent /><Analytics /></>
}
