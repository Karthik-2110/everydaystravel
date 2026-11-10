'use client'

import { useEffect } from 'react'

const LEAVE_MESSAGE = 'Leave this page? Your filled-in booking details will be lost.'

export function useBookingLeaveWarning(hasUnsavedDetails: boolean) {
  useEffect(() => {
    if (!hasUnsavedDetails) return

    const bookingUrl = new URL(window.location.href)
    const bookingState = window.history.state
    // Older browsers expose the History API but have no way to locate a
    // particular entry after a same-document traversal.
    const navigation = (window as Window & {
      navigation?: { currentEntry: { key: string } | null; traverseTo: (key: string) => { committed: Promise<unknown> } }
    }).navigation
    const bookingEntry = navigation?.currentEntry?.key
    const isBookingPage = (url: URL) => url.pathname === bookingUrl.pathname && url.search === bookingUrl.search

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = true
    }

    const useBrowserNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download') || (link.target && link.target !== '_self')) return

      const destination = new URL(link.href)
      if (destination.origin === bookingUrl.origin && !isBookingPage(destination)) {
        // Let the anchor perform a normal navigation so the browser can warn
        // before leaving. Next's delegated Link handler would stay in this document.
        event.stopPropagation()
      }
    }

    const warnOnHistoryNavigation = (event: PopStateEvent) => {
      // Back/Forward across documents is already covered by beforeunload.
      if (isBookingPage(new URL(window.location.href))) return
      if (window.confirm(LEAVE_MESSAGE)) return

      // Stop the app router from rendering the traversed page while restoring
      // the booking entry. Keep the existing React form and its local state.
      event.stopImmediatePropagation()
      const restore = () => window.history.pushState(bookingState, '', bookingUrl.href)
      if (navigation && bookingEntry) {
        navigation.traverseTo(bookingEntry).committed.catch(restore)
      } else {
        restore()
      }
    }

    window.addEventListener('beforeunload', warnBeforeUnload)
    window.addEventListener('popstate', warnOnHistoryNavigation, true)
    document.addEventListener('click', useBrowserNavigation, true)
    return () => {
      window.removeEventListener('beforeunload', warnBeforeUnload)
      window.removeEventListener('popstate', warnOnHistoryNavigation, true)
      document.removeEventListener('click', useBrowserNavigation, true)
    }
  }, [hasUnsavedDetails])
}
