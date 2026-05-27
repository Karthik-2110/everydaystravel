'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface NavItem {
  label: string
  href: string
  hasDropdown?: boolean
}

interface NavbarProps {
  ctaText?: string
  ctaHref?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Our Fleet', href: '/fleet', hasDropdown: true },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar({
  ctaText = 'Book your journey',
  ctaHref = '#quote',
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      role="banner"
      className={[
        'fixed top-0 inset-x-0 z-50 border-b transition-[background-color,border-color] duration-300',
        scrolled
          ? 'bg-[#0C0F1C] border-white/[0.07]'
          : 'bg-transparent border-transparent',
      ].join(' ')}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px] lg:h-[80px]">

          {/* ── Logo ── */}
          <Link
            href="/"
            aria-label="Everyday Travels home"
            className="flex-shrink-0 select-none"
          >
            <img
              src="/images/everyday_logo.avif"
              alt="Everyday Travels"
              className="h-[62px] w-auto object-contain"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex items-center gap-[5px] px-4 py-2 text-[13.5px] font-medium rounded-full transition-all duration-200 select-none',
                    isActive
                      ? 'text-[#EBBA6F]'
                      : 'text-white/55 hover:text-white hover:bg-white/[0.05]',
                  ].join(' ')}
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      size={12}
                      className={isActive ? 'text-[#EBBA6F]/50' : 'text-white/30'}
                      aria-hidden
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── Desktop CTA ── */}
          <Link
            href={ctaHref}
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-[#EBBA6F] text-[#0C0F1C] text-[13px] font-semibold rounded-full hover:bg-[#DDA85E] active:bg-[#C8963E] transition-colors duration-150 select-none relative overflow-hidden shadow-[0_0_18px_rgba(235,186,111,0.35),0_0_36px_rgba(235,186,111,0.15)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {/* Shimmer sweep */}
            <motion.span
              className="pointer-events-none absolute inset-0 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' }}
              aria-hidden
            />
            <span className="relative z-10 flex items-center gap-2">
              {ctaText}
              <ArrowRight size={14} aria-hidden strokeWidth={2.5} />
            </span>
          </Link>

          {/* ── Mobile hamburger ── */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 text-white/70 hover:text-white rounded-lg hover:bg-white/[0.07] transition-colors duration-150"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen
              ? <X size={20} aria-hidden strokeWidth={2} />
              : <Menu size={20} aria-hidden strokeWidth={2} />
            }
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#0C0F1C]/98 backdrop-blur-xl border-t border-white/[0.07]"
          >
            <nav
              className="max-w-[1440px] mx-auto px-5 sm:px-8 py-4 flex flex-col"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] transition-colors duration-150',
                      isActive
                        ? 'text-[#EBBA6F] font-medium'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.05]',
                    ].join(' ')}
                    style={{ fontFamily: 'var(--font-ui)' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown
                        size={15}
                        className={isActive ? 'text-[#EBBA6F]/40' : 'text-white/20'}
                        aria-hidden
                      />
                    )}
                  </Link>
                )
              })}

              {/* Mobile CTA */}
              <div className="pt-4 pb-2">
                <Link
                  href={ctaHref}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold rounded-full hover:bg-[#DDA85E] transition-colors duration-150"
                  style={{ fontFamily: 'var(--font-ui)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {ctaText}
                  <ArrowRight size={15} aria-hidden strokeWidth={2.5} />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
