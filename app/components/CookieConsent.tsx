'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import Link from 'next/link'
import {
  ALL_OFF, ALL_ON, DEFAULT_CHOICE, OPEN_PREFERENCES_EVENT,
  readConsent, saveConsent, useConsent, useHydrated,
  type ConsentChoice,
} from '../lib/consent'

// ── Categories ──────────────────────────────────────────────────────────────

interface Category {
  key:      keyof ConsentChoice | 'necessary'
  label:    string
  detail:   string
  /** Strictly necessary storage is exempt from consent and cannot be switched off. */
  locked?:  boolean
}

const CATEGORIES: Category[] = [
  {
    key:    'necessary',
    label:  'Strictly necessary',
    detail:
      'Remembers the choice you make here, and runs the enquiry forms — including ' +
      'the address suggestions you asked for by typing into them. Exempt from ' +
      'consent because the site cannot do what you came for without them.',
    locked: true,
  },
  {
    key:   'functional',
    label: 'Functional',
    detail:
      'Loads the interactive Google map on our Contact page, which sets Google\'s ' +
      'own cookies. Leave it off and we show our address as text instead.',
  },
  {
    key:   'analytics',
    label: 'Analytics',
    detail:
      'Google Analytics, which counts visits and shows us which pages people actually ' +
      'use, so we know what to improve. It sets two cookies on this site, and starts ' +
      'switched on — turn it off here if you would rather we did not count your visit. ' +
      'Google\'s advertising features are off, so none of it feeds ad targeting.',
  },
]

// ── Styling ─────────────────────────────────────────────────────────────────

/**
 * Accept and Reject share one class on purpose. The ICO expects refusing to be
 * as easy as agreeing, and a greyed-out or text-only reject is the single most
 * common way sites fail that test — so neither button may out-style the other.
 */
const choiceBtn =
  'h-11 px-6 inline-flex items-center justify-center rounded-full text-[14px] font-semibold ' +
  'transition-colors duration-150 w-full sm:w-auto sm:min-w-[150px]'

const acceptBtn = `${choiceBtn} bg-[#EBBA6F] text-[#0C0F1C] hover:bg-[#DDA85E]`
const rejectBtn = `${choiceBtn} bg-[#F2F3F5] text-[#0C0F1C] hover:bg-[#E2E4E8]`
const quietBtn =
  'h-11 px-5 inline-flex items-center justify-center rounded-full text-[14px] font-medium ' +
  'text-white border border-white/30 hover:border-white/60 transition-colors duration-150 ' +
  'w-full sm:w-auto'

// ── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({
  checked, disabled, onChange, label,
}: {
  checked:   boolean
  disabled?: boolean
  onChange:  (next: boolean) => void
  label:     string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative w-[42px] h-[24px] rounded-full shrink-0 transition-colors duration-150',
        checked ? 'bg-[#EBBA6F]' : 'bg-white/20',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-150',
          checked ? 'left-[21px]' : 'left-[3px]',
        ].join(' ')}
        aria-hidden
      />
    </button>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

export default function CookieConsent() {
  // The decision lives in a cookie, so it is subscribed to rather than copied
  // into state — and nothing renders until hydration, so the server markup and
  // the first client render agree.
  const stored = useConsent()
  const ready  = useHydrated()

  const [reopened, setReopened] = useState(false)
  const [showPrefs, setPrefs]   = useState(false)
  const [draft, setDraft]       = useState<ConsentChoice>(DEFAULT_CHOICE)
  const panelRef                = useRef<HTMLDivElement>(null)

  // No decision means no optional storage, so the banner stays up rather than
  // timing out into an assumed yes.
  const visible = stored === null || reopened

  // The footer link re-opens this from any page, which is what makes consent
  // as easy to withdraw as it was to give.
  useEffect(() => {
    const open = () => {
      const current = readConsent()
      setDraft(current ? { functional: current.functional, analytics: current.analytics } : DEFAULT_CHOICE)
      setReopened(true)
      setPrefs(true)
    }
    window.addEventListener(OPEN_PREFERENCES_EVENT, open)
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open)
  }, [])

  /** Closing without choosing leaves the stored decision exactly as it was. */
  const dismissPanel = useCallback(() => {
    setPrefs(false)
    setReopened(false)
  }, [])

  const decide = useCallback((choice: ConsentChoice) => {
    saveConsent(choice)
    setPrefs(false)
    setReopened(false)
  }, [])

  // Escape closes the panel without deciding anything — dismissing is not consent.
  useEffect(() => {
    if (!showPrefs) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismissPanel() }
    window.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [showPrefs, dismissPanel])

  if (!ready || !visible) return null

  return (
    <AnimatePresence>
      {showPrefs ? (
        /* ── Preferences ── */
        <motion.div
          key="prefs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full sm:max-w-[560px] max-h-[90vh] overflow-y-auto bg-[#0D1221] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 sm:p-7 outline-none"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <h2
                id="cookie-prefs-title"
                className="text-white text-[19px] font-semibold"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Cookie preferences
              </h2>
              <button
                type="button"
                onClick={dismissPanel}
                aria-label="Close cookie preferences without saving"
                className="text-white/45 hover:text-white transition-colors duration-150 shrink-0"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="flex flex-col gap-5 mb-7">
              {CATEGORIES.map((category) => (
                <div key={category.key} className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-white text-[14px] font-medium mb-1"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {category.label}
                      {category.locked && (
                        <span className="text-white/40 text-[12px] font-normal ml-2">Always on</span>
                      )}
                    </p>
                    <p
                      className="text-white/55 text-[13px] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {category.detail}
                    </p>
                  </div>
                  <Toggle
                    label={category.label}
                    checked={category.locked ? true : draft[category.key as keyof ConsentChoice]}
                    disabled={category.locked}
                    onChange={(next) =>
                      setDraft((d) => ({ ...d, [category.key]: next }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" className={acceptBtn} onClick={() => decide(ALL_ON)}>
                Accept all
              </button>
              <button type="button" className={rejectBtn} onClick={() => decide(ALL_OFF)}>
                Reject all
              </button>
              <button type="button" className={quietBtn} onClick={() => decide(draft)}>
                Save my choices
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        /* ── Banner ── */
        <motion.div
          key="banner"
          role="region"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-0 inset-x-0 z-[100] bg-[#0D1221] border-t border-[#EBBA6F]/25 shadow-[0_-8px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="site-container py-5 lg:py-6 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            <div className="min-w-0 flex-1">
              <p
                className="text-white text-[15px] font-semibold mb-1.5"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                We ask before we store anything
              </p>
              <p
                className="text-white/60 text-[13.5px] leading-relaxed max-w-[68ch]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                We use cookies and similar storage that are strictly necessary to run this
                site and its booking forms. We would also like to count visits with Google
                Analytics, and to load the interactive Google map on our Contact page. Both
                set cookies of their own, and neither happens unless you agree — you can
                change your mind at any time.{' '}
                <Link href="/cookies" className="text-[#EBBA6F] underline underline-offset-2 hover:text-[#DDA85E]">
                  Read our cookie policy
                </Link>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
              <button type="button" className={acceptBtn} onClick={() => decide(ALL_ON)}>
                Accept all
              </button>
              <button type="button" className={rejectBtn} onClick={() => decide(ALL_OFF)}>
                Reject all
              </button>
              <button type="button" className={quietBtn} onClick={() => setPrefs(true)}>
                Manage
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
