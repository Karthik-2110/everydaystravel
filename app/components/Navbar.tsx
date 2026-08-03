'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface DropdownChild {
  label:       string
  href:        string
  description: string
}

interface NavItem {
  label:         string
  href:          string
  children?:     DropdownChild[]
  viewAllLabel?: string
}

interface NavbarProps {
  ctaText?: string
  ctaHref?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',  href: '/' },
  {
    label:         'Services',
    href:          '/services',
    viewAllLabel:  'View all services',
    children: [
      { label: 'Airport Transfers',  href: '/services/airport-transfers',   description: 'All major UK airports, on time' },
      { label: 'Corporate Travel',   href: '/services/corporate',           description: 'Executive transport for business' },
      { label: 'Private Hire',       href: '/services/private-hire',        description: 'Premium vehicles, your schedule' },
      { label: 'Wedding & Events',   href: '/services/weddings-events',     description: 'Seamless bridal & guest logistics' },
      { label: 'School Transport',   href: '/services/school-trips',        description: 'Safe, reliable educational travel' },
      { label: 'Group Travel and Tours', href: '/services/group-travel',    description: 'UK & Europe tours for your group' },
      { label: 'Sports Team Travel', href: '/services/sports-team-travel',  description: 'Match-day travel for clubs & teams' },
      { label: 'Cruise Port Transfers', href: '/services/cruise-port-transfers', description: 'Door to dock, luggage and all' },
      { label: 'Executive Travel',   href: '/services/executive-travel',    description: 'First-class travel for VIPs' },
    ],
  },
  {
    label:        'Our Fleet',
    href:         '/fleet',
    viewAllLabel: 'View all fleet',
    children: [
      { label: 'Chauffeur Cars',    href: '/fleet/chauffeur-cars',    description: 'Executive & prestige vehicles' },
      { label: 'Lamborghini Huracán',  href: '/fleet/chauffeur-cars/lamborghini-huracan', description: 'Supercar for special occasions' },
      { label: 'BMW X7',               href: '/fleet/chauffeur-cars/bmw-x7',              description: 'Flagship luxury SUV' },
      { label: 'Mercedes E-Class',     href: '/fleet/chauffeur-cars/mercedes-e-class',    description: 'Refined executive saloon' },
      { label: 'Mercedes S-Class',     href: '/fleet/chauffeur-cars/mercedes-s-class',    description: 'The ultimate luxury saloon' },
      { label: 'Mercedes V-Class',     href: '/fleet/chauffeur-cars/mercedes-v-class',    description: 'Executive MPV for up to 6' },
      { label: 'Luxury Minibuses',  href: '/fleet/luxury-minibuses',  description: '8 to 16 seat luxury transfers' },
      { label: '16 Seater Sprinter',     href: '/fleet/luxury-minibuses/16-seater-minibus',      description: 'Flagship minibus for larger groups' },
      { label: '16 Seater VIP Sprinter', href: '/fleet/luxury-minibuses/16-seater-vip-sprinter', description: 'First-class group travel' },
      { label: 'Executive Coaches', href: '/fleet/executive-coaches', description: '33 to 55 seat premium coaches' },
      { label: '35 Seater Turas Midi',        href: '/fleet/executive-coaches/35-seater-turas-midi',        description: 'Mid-size executive coach' },
      { label: '49 Seater Mercedes Turismo',  href: '/fleet/executive-coaches/49-seater-mercedes-turismo',  description: 'Touring comfort for large groups' },
      { label: '53 Seater Mercedes Turismo',  href: '/fleet/executive-coaches/53-seater-coach',             description: 'Our most popular coach' },
      { label: '55 Seater Neoplan Tourliner', href: '/fleet/executive-coaches/55-seater-neoplan-tourliner', description: 'Our largest flagship coach' },
    ],
  },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About us', href: '/about' },
  {
    label:    'More',
    href:     '#',
    children: [
      { label: 'Gallery',   href: '/gallery',   description: 'Our vehicles and journeys' },
      { label: 'Our Team',  href: '/team',      description: 'Meet the people behind Everyday Travels' },
      { label: 'Vacancies', href: '/vacancies', description: 'Join our growing team' },
      { label: 'Travel Inspirations', href: '/blog', description: 'News, tips and travel guides' },
      { label: 'FAQs',      href: '/faqs',      description: 'Answers to common questions' },
    ],
  },
  { label: 'Contact us', href: '/contact' },
]

export default function Navbar({
  ctaText = 'Book your journey',
  ctaHref = '#quote',
}: NavbarProps) {
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [scrolled, setScrolled]             = useState(false)
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
            <Image
              src="/images/everyday_logo.avif"
              alt="Everyday Travels"
              width={160}
              height={62}
              className="h-[62px] w-auto object-contain"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              if (item.children) {
                const isDropdownOnly = item.href === '#'
                const triggerCls = [
                  'flex items-center gap-[5px] px-4 py-2 text-[13.5px] font-medium rounded-full transition-all duration-200 select-none',
                  isActive ? 'text-[#EBBA6F]' : 'text-white/55 hover:text-white hover:bg-white/[0.05]',
                ].join(' ')
                const chevron = (
                  <ChevronDown
                    size={14} strokeWidth={2}
                    className={['transition-transform duration-200 group-hover:rotate-180', isActive ? 'text-[#EBBA6F]/70' : 'text-white/60'].join(' ')}
                    aria-hidden
                  />
                )

                return (
                  <div key={item.label} className="relative group">
                    {isDropdownOnly ? (
                      <button type="button" className={triggerCls} style={{ fontFamily: 'var(--font-ui)' }}>
                        {item.label}{chevron}
                      </button>
                    ) : (
                      <Link href={item.href} aria-current={isActive ? 'page' : undefined} className={triggerCls} style={{ fontFamily: 'var(--font-ui)' }}>
                        {item.label}{chevron}
                      </Link>
                    )}

                    {/* Dropdown panel */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                      <div className="bg-[#0D1221] border border-white/[0.09] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden min-w-[220px]">
                        {item.children.slice(0, 5).map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex flex-col px-4 py-3 hover:bg-white/[0.04] transition-colors duration-150 group/item"
                          >
                            <span className="text-white text-[13.5px] font-medium group-hover/item:text-[#EBBA6F] transition-colors duration-150" style={{ fontFamily: 'var(--font-ui)' }}>
                              {child.label}
                            </span>
                            <span className="text-white/35 text-[11.5px] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                              {child.description}
                            </span>
                          </Link>
                        ))}
                        {!isDropdownOnly && item.children.length > 5 && (
                          <Link
                            href={item.href}
                            className="flex items-center justify-between px-4 py-3 border-t border-white/[0.07] text-[#EBBA6F] text-[12px] font-semibold tracking-[0.08em] uppercase hover:bg-white/[0.04] transition-colors duration-150"
                            style={{ fontFamily: 'var(--font-ui)' }}
                          >
                            {item.viewAllLabel ?? `View all ${item.label.toLowerCase()}`}
                            <ArrowRight size={13} aria-hidden />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }

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
            className="lg:hidden bg-[#0C0F1C]/98 backdrop-blur-xl border-t border-white/[0.07] max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain"
          >
            <nav
              className="max-w-[1440px] mx-auto px-5 sm:px-8 py-4 flex flex-col"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                if (item.children) {
                  const isDropdownOnly = item.href === '#'
                  const isExpanded = mobileExpanded === item.label
                  const toggleExpanded = () => setMobileExpanded(v => v === item.label ? null : item.label)

                  return (
                    <div key={item.label}>
                      <div className="flex items-center">
                        {isDropdownOnly ? (
                          <button
                            type="button"
                            onClick={toggleExpanded}
                            className={['flex-1 text-left px-4 py-3.5 rounded-xl text-[15px] transition-colors duration-150', isExpanded ? 'text-[#EBBA6F] font-medium' : 'text-white/60 hover:text-white'].join(' ')}
                            style={{ fontFamily: 'var(--font-ui)' }}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={['flex-1 px-4 py-3.5 rounded-xl text-[15px] transition-colors duration-150', isActive ? 'text-[#EBBA6F] font-medium' : 'text-white/60 hover:text-white'].join(' ')}
                            style={{ fontFamily: 'var(--font-ui)' }}
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                        )}
                        <button
                          onClick={toggleExpanded}
                          className="px-4 py-3.5 text-white/40 hover:text-white transition-colors duration-150"
                          aria-label={`Toggle ${item.label} submenu`}
                        >
                          <ChevronDown
                            size={15} strokeWidth={2}
                            className={['transition-transform duration-200', isExpanded ? 'rotate-180' : ''].join(' ')}
                            aria-hidden
                          />
                        </button>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 pl-4 border-l border-white/[0.07] flex flex-col pb-2">
                              {item.children.slice(0, 5).map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="flex flex-col py-2.5 text-white/55 hover:text-white transition-colors duration-150"
                                  style={{ fontFamily: 'var(--font-ui)' }}
                                  onClick={() => setMobileOpen(false)}
                                >
                                  <span className="text-[14px]">{child.label}</span>
                                  <span className="text-[12px] text-white/30 mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                                    {child.description}
                                  </span>
                                </Link>
                              ))}
                              {!isDropdownOnly && item.children.length > 5 && (
                                <Link
                                  href={item.href}
                                  className="flex items-center gap-2 py-2.5 text-[#EBBA6F] text-[13px] font-semibold tracking-[0.06em] uppercase hover:text-[#DDA85E] transition-colors duration-150"
                                  style={{ fontFamily: 'var(--font-ui)' }}
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {item.viewAllLabel ?? `View all ${item.label.toLowerCase()}`}
                                  <ArrowRight size={13} aria-hidden />
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

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
