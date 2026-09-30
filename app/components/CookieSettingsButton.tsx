'use client'

import { openCookiePreferences } from '../lib/consent'

/**
 * Re-opens the consent choice. Present in the footer of every page, because
 * consent has to be as easy to withdraw as it was to give.
 */
export default function CookieSettingsButton({
  className,
  children = 'Cookie settings',
}: {
  className?: string
  children?:  React.ReactNode
}) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      {children}
    </button>
  )
}
