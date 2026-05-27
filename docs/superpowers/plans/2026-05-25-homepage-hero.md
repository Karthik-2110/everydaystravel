# Homepage Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full above-the-fold homepage — Header, Hero, QuoteForm (with one-way/return toggle + progressive email/phone reveal), TrustBar, and StatsStrip — pixel-matched to the client design.

**Architecture:** Five self-contained server/client components assembled in `app/page.tsx`. Only Header and QuoteForm are client components (state/scroll). CSS brand variables live in `globals.css`. Fonts loaded via `@font-face` (Formula Condensed Light) and CSS `@import` (Source Sans 3, Inter). shadcn `Input` and `Select` are the base form primitives, styled to match the dark brand.

**Tech Stack:** Next.js 16.2.6, React 19, Tailwind CSS v4, TypeScript, shadcn (radix-vega), Framer Motion, Lucide icons, Vitest + React Testing Library

---

## ⚠️ Before writing any code

Read the Next.js 16 app router docs:
```
node_modules/next/dist/docs/01-app/
```
Pay attention to: `'use client'` rules, `next/font`, `next/image` props, and metadata API — they may differ from your training data.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `vitest.config.ts` | Vitest config with jsdom + @ alias |
| Create | `vitest.setup.ts` | @testing-library/jest-dom matchers |
| Modify | `app/globals.css` | Brand CSS vars, @font-face, base styles |
| Modify | `app/layout.tsx` | Remove Geist fonts, update metadata |
| Create | `public/fonts/formula-condensed-light.woff2` | User-provided font file |
| Create | `app/components/Header.tsx` | Sticky nav — `'use client'` |
| Create | `app/components/Hero.tsx` | Full-viewport hero — server component |
| Create | `app/components/QuoteForm.tsx` | Quote form with toggle + reveal — `'use client'` |
| Create | `app/components/TrustBar.tsx` | 4-column trust icons — server component |
| Create | `app/components/StatsStrip.tsx` | Stats + Trustpilot — server component |
| Modify | `app/page.tsx` | Assemble all components |
| Create | `__tests__/Header.test.tsx` | Header smoke + mobile toggle tests |
| Create | `__tests__/Hero.test.tsx` | Hero content render tests |
| Create | `__tests__/QuoteForm.test.tsx` | Form state, toggle, progressive reveal |
| Create | `__tests__/TrustBar.test.tsx` | Trust items render test |
| Create | `__tests__/StatsStrip.test.tsx` | Stats render test |

---

## Task 1: Test environment setup

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install test dependencies**

```bash
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Expected: packages added to `devDependencies` in package.json.

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 3: Create vitest.setup.ts**

```ts
import '@testing-library/jest-dom'

// Radix UI uses pointer events — polyfill for jsdom
window.HTMLElement.prototype.hasPointerCapture = () => false
window.HTMLElement.prototype.releasePointerCapture = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 5: Verify setup works**

```bash
bun run test:run
```

Expected: `No test files found` — not an error, confirms runner is configured.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json
git commit -m "chore: add vitest + testing-library test environment"
```

---

## Task 2: Brand tokens, fonts, and base styles

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `public/fonts/` (directory for font file)

- [ ] **Step 1: Add Formula Condensed Light font file**

Place the `formula-condensed-light.woff2` file at:
```
public/fonts/formula-condensed-light.woff2
```

If you don't have it yet, the rest of the plan still works — headings will fall back to sans-serif until the file is added.

- [ ] **Step 2: Replace app/globals.css**

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,opsz,wght@0,9..46,300;0,9..46,400;0,9..46,500;0,9..46,600;1,9..46,400&family=Inter:wght@400;500;600;700&display=swap');

@font-face {
  font-family: 'Formula Condensed Light';
  src: url('/fonts/formula-condensed-light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

:root {
  /* Backgrounds */
  --color-bg-primary: #0C0F1C;
  --color-bg-secondary: #0D1221;
  --color-bg-dark: #050505;

  /* Brand Gold */
  --color-accent: #EBBA6F;
  --color-accent-warm: #E2B36A;
  --color-accent-dark: #AC864C;
  --color-accent-mid: #C7A879;

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-muted: rgba(255, 255, 255, 0.75);
  --color-text-grey-light: #ADB1B8;
  --color-text-grey-mid: #888888;
  --color-text-dark: #0C0F1C;

  /* Fonts */
  --font-display: 'Formula Condensed Light', sans-serif;
  --font-body: 'Source Sans 3', sans-serif;
  --font-ui: 'Inter', sans-serif;

  /* Shadcn overrides */
  --background: #0C0F1C;
  --foreground: #FFFFFF;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

body {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-body);
}
```

- [ ] **Step 3: Update app/layout.tsx — remove Geist, update metadata**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Everydays Travel | Luxury Coach & Minibus Hire Across the UK',
  description: 'Premium coach, minibus and private car hire across the UK. Airport transfers, corporate travel and group transport. Get an instant quote.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-[#0C0F1C]">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Start dev server and verify fonts load**

```bash
bun dev
```

Open http://localhost:3000. Check DevTools → Network tab. Confirm `fonts.googleapis.com` request fires. Formula Condensed Light will show as fallback until the woff2 file is added.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add brand tokens, fonts, and base styles to globals.css"
```

---

## Task 3: Install required shadcn components

**Files:**
- Create: `components/ui/input.tsx` (via shadcn CLI)
- Create: `components/ui/select.tsx` (via shadcn CLI)

- [ ] **Step 1: Install Input and Select**

```bash
bunx shadcn@canary add input select
```

Expected: `components/ui/input.tsx` and `components/ui/select.tsx` created.

- [ ] **Step 2: Verify imports resolve**

Open `components/ui/input.tsx`. Confirm it imports from `@/lib/utils`. Open `lib/utils.ts` — confirm it exists (shadcn should have created it on `init`).

- [ ] **Step 3: Commit**

```bash
git add components/ui/input.tsx components/ui/select.tsx lib/utils.ts
git commit -m "chore: add shadcn Input and Select components"
```

---

## Task 4: Header component

**Files:**
- Create: `app/components/Header.tsx`
- Create: `__tests__/Header.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/app/components/Header'

describe('Header', () => {
  it('renders the brand name', () => {
    render(<Header />)
    expect(screen.getByText('EVERYDAYS')).toBeInTheDocument()
  })

  it('renders the Get Instant Quote CTA', () => {
    render(<Header />)
    expect(screen.getAllByText('Get Instant Quote').length).toBeGreaterThan(0)
  })

  it('renders all desktop nav links', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /reviews/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about us/i })).toBeInTheDocument()
  })

  it('toggles mobile menu on hamburger click', () => {
    render(<Header />)
    const hamburger = screen.getByRole('button', { name: /toggle menu/i })
    expect(screen.queryByRole('link', { name: /contact us/i })).toBeNull()
    fireEvent.click(hamburger)
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
bun run test:run __tests__/Header.test.tsx
```

Expected: FAIL — `Cannot find module '@/app/components/Header'`

- [ ] **Step 3: Create app/components/Header.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '/', hasDropdown: false },
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Our fleet', href: '/fleet', hasDropdown: true },
  { label: 'Reviews', href: '/reviews', hasDropdown: false },
  { label: 'About us', href: '/about', hasDropdown: false },
  { label: 'Contact us', href: '/contact', hasDropdown: false },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0C0F1C]/95 backdrop-blur-sm border-b border-white/10'
          : 'bg-[#0C0F1C]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center gap-0.5 shrink-0">
            <svg width="22" height="14" viewBox="0 0 24 16" fill="none" aria-hidden>
              <path
                d="M12 0L15 6H24L17.5 10L20 16H12H4L6.5 10L0 6H9L12 0Z"
                fill="#EBBA6F"
              />
            </svg>
            <div className="text-center leading-none">
              <div
                className="text-[#EBBA6F] tracking-[0.25em] text-[11px] font-bold"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                EVERYDAYS
              </div>
              <div
                className="text-[#EBBA6F]/50 tracking-[0.3em] text-[7px] mt-0.5"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                — TRAVEL —
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 text-white/75 hover:text-white text-sm transition-colors duration-200"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown size={13} className="text-white/40" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <button
            className="hidden lg:block px-5 py-2 text-sm font-medium border border-[#EBBA6F] text-[#EBBA6F] rounded hover:bg-[#EBBA6F] hover:text-[#0C0F1C] transition-colors duration-200"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Get Instant Quote
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2 -mr-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0C0F1C] border-t border-white/10 px-6 py-5">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center justify-between text-white/80 hover:text-white py-2.5 text-base border-b border-white/5 last:border-0"
                style={{ fontFamily: 'var(--font-ui)' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={15} className="text-white/40" />}
              </Link>
            ))}
            <button
              className="mt-4 w-full py-3 text-sm font-medium border border-[#EBBA6F] text-[#EBBA6F] rounded hover:bg-[#EBBA6F] hover:text-[#0C0F1C] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Get Instant Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
bun run test:run __tests__/Header.test.tsx
```

Expected: 4 tests pass.

- [ ] **Step 5: Verify visually in browser**

With `bun dev` running, open http://localhost:3000. Add `<Header />` temporarily to `app/page.tsx` to preview. Check: logo visible, nav links render, mobile hamburger appears below 1024px, drawer opens/closes.

- [ ] **Step 6: Commit**

```bash
git add app/components/Header.tsx __tests__/Header.test.tsx
git commit -m "feat: add Header component with sticky scroll effect and mobile drawer"
```

---

## Task 5: Hero component

**Files:**
- Create: `app/components/Hero.tsx`
- Create: `__tests__/Hero.test.tsx`
- Add: `public/images/hero-coach.jpg` (client-provided image)

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/app/components/Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    expect(screen.getByText(/Luxury Coach/i)).toBeInTheDocument()
    expect(screen.getByText(/Minibus Hire/i)).toBeInTheDocument()
  })

  it('renders gold accent text', () => {
    render(<Hero />)
    expect(screen.getByText('Across the UK')).toBeInTheDocument()
  })

  it('renders the trust signal', () => {
    render(<Hero />)
    expect(screen.getByText(/500\+/)).toBeInTheDocument()
    expect(screen.getByText(/Trusted by/i)).toBeInTheDocument()
  })

  it('renders the premium badge', () => {
    render(<Hero />)
    expect(screen.getByText(/PREMIUM COACH/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
bun run test:run __tests__/Hero.test.tsx
```

Expected: FAIL — `Cannot find module '@/app/components/Hero'`

- [ ] **Step 3: Add placeholder hero image**

Place the client's coach photo at `public/images/hero-coach.jpg`.

Until the real image is available, create a placeholder: copy any dark image to that path, or the component will fall back to the gradient overlay only.

- [ ] **Step 4: Create app/components/Hero.tsx**

```tsx
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-coach.jpg"
        alt="Luxury Everydays Travel coach at night in London"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Left-to-right dark gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0F1C]/95 via-[#0C0F1C]/70 to-[#0C0F1C]/10" />
      {/* Bottom fade into the quote form */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F1C] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-28 pb-44 lg:pb-56">
        <div className="max-w-xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C0F1C]/50 border border-white/10 mb-7">
            <svg width="13" height="9" viewBox="0 0 24 16" fill="#EBBA6F" aria-hidden>
              <path d="M12 0L15 6H24L17.5 10L20 16H12H4L6.5 10L0 6H9L12 0Z" />
            </svg>
            <span
              className="text-[#EBBA6F] text-[11px] tracking-[0.18em] uppercase font-medium"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Premium Coach &amp; Minibus Hire
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(3rem,8vw,5.5rem)] font-light leading-[0.92] mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
          >
            <span className="text-white block">Luxury Coach &</span>
            <span className="text-white block">Minibus Hire</span>
            <span className="text-[#EBBA6F] block">Across the UK</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-white/70 text-lg leading-relaxed max-w-sm mb-7"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Reliable, professional transport for airport transfers, events and group travel.
          </p>

          {/* Trust row */}
          <div className="flex items-center gap-2.5">
            <div className="flex gap-0.5" aria-label="4 out of 5 stars">
              {[0, 1, 2, 3].map((i) => (
                <svg key={i} width="15" height="15" viewBox="0 0 20 20" fill="#EBBA6F" aria-hidden>
                  <path d="M10 1l2.4 4.9 5.3.8-3.9 3.8.9 5.3-4.7-2.5-4.8 2.5.9-5.3-3.8-3.8 5.3-.8L10 1z" />
                </svg>
              ))}
              <svg width="15" height="15" viewBox="0 0 20 20" fill="#EBBA6F" opacity="0.35" aria-hidden>
                <path d="M10 1l2.4 4.9 5.3.8-3.9 3.8.9 5.3-4.7-2.5-4.8 2.5.9-5.3-3.8-3.8 5.3-.8L10 1z" />
              </svg>
            </div>
            <p className="text-white/65 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              Trusted by{' '}
              <strong className="text-white font-semibold">500+</strong>{' '}
              customers
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test — expect PASS**

```bash
bun run test:run __tests__/Hero.test.tsx
```

Expected: 4 tests pass.

- [ ] **Step 6: Check visually**

In browser: headline renders in three lines (white / white / gold). Background image fills the section. Both gradients visible — text is legible, bottom fades into dark.

- [ ] **Step 7: Commit**

```bash
git add app/components/Hero.tsx __tests__/Hero.test.tsx public/images/
git commit -m "feat: add Hero component with gradient overlay and trust signal"
```

---

## Task 6: QuoteForm component

**Files:**
- Create: `app/components/QuoteForm.tsx`
- Create: `__tests__/QuoteForm.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// __tests__/QuoteForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuoteForm from '@/app/components/QuoteForm'

describe('QuoteForm', () => {
  it('renders the Plan your journey label', () => {
    render(<QuoteForm />)
    expect(screen.getByText('Plan your journey')).toBeInTheDocument()
  })

  it('shows One way as default selected', () => {
    render(<QuoteForm />)
    const oneWayBtn = screen.getByRole('button', { name: /one way/i })
    expect(oneWayBtn).toHaveClass('bg-[#EBBA6F]')
  })

  it('hides email and phone fields initially', () => {
    render(<QuoteForm />)
    expect(screen.queryByPlaceholderText(/your@email/i)).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/\+44/i)).not.toBeInTheDocument()
  })

  it('does not show return date/time fields on one-way', () => {
    render(<QuoteForm />)
    expect(screen.queryByLabelText(/return date/i)).not.toBeInTheDocument()
  })

  it('shows return date and time fields when Return is selected', async () => {
    render(<QuoteForm />)
    const returnBtn = screen.getByRole('button', { name: /return/i })
    await userEvent.click(returnBtn)
    await waitFor(() => {
      expect(screen.getByLabelText('Return date')).toBeInTheDocument()
      expect(screen.getByLabelText('Return time')).toBeInTheDocument()
    })
  })

  it('reveals email and phone fields after pickup time is selected', async () => {
    const user = userEvent.setup()
    render(<QuoteForm />)
    // Open the Pickup time select
    const pickupTimeTrigger = screen.getByRole('combobox', { name: /pickup time/i })
    await user.click(pickupTimeTrigger)
    // Click the first available time option
    const option = await screen.findByRole('option', { name: /05:00/i })
    await user.click(option)
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/your@email/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/\+44/i)).toBeInTheDocument()
    })
  })

  it('renders Get Instant Quote and WhatsApp CTAs', () => {
    render(<QuoteForm />)
    expect(screen.getByRole('button', { name: /get instant quote/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /chat on whatsapp/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
bun run test:run __tests__/QuoteForm.test.tsx
```

Expected: FAIL — `Cannot find module '@/app/components/QuoteForm'`

- [ ] **Step 3: Create app/components/QuoteForm.tsx**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users, CalendarDays, Clock, ArrowRight, MessageCircle, ArrowLeftRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type JourneyType = 'oneway' | 'return'

const PASSENGER_OPTIONS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11-15', '16-20', '21-30', '31-50', '51+',
]

const TIME_OPTIONS = Array.from({ length: 36 }, (_, i) => {
  const h = Math.floor(i / 2) + 5
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h % 24).padStart(2, '0')}:${m}`
})

const REVEAL = {
  initial: { opacity: 0, height: 0, marginTop: 0 },
  animate: { opacity: 1, height: 'auto', marginTop: 12 },
  exit: { opacity: 0, height: 0, marginTop: 0 },
  transition: { duration: 0.18, ease: 'easeOut' },
}

const fieldClass =
  'bg-[#0C0F1C] border-white/10 text-white placeholder:text-white/30 ' +
  'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EBBA6F] ' +
  'transition-colors duration-150'

const selectTriggerClass =
  'bg-[#0C0F1C] border-white/10 text-white ' +
  'focus:ring-0 focus:ring-offset-0 focus:border-[#EBBA6F] ' +
  'data-[state=open]:border-[#EBBA6F] transition-colors duration-150 [&>span]:text-white/30'

export default function QuoteForm() {
  const [journeyType, setJourneyType] = useState<JourneyType>('oneway')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [passengers, setPassengers] = useState('')
  const [travelDate, setTravelDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const showContactFields = pickupTime !== ''
  const isReturn = journeyType === 'return'

  const today = new Date().toISOString().split('T')[0]

  return (
    <section className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-28">
      <div className="bg-[#0D1221] rounded-2xl border border-white/10 p-5 sm:p-7 lg:p-8 shadow-2xl">

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className="text-[#EBBA6F] font-medium"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Plan your journey
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setJourneyType('oneway')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                !isReturn
                  ? 'bg-[#EBBA6F] text-[#0C0F1C]'
                  : 'border border-white/20 text-white/65 hover:border-white/40 hover:text-white'
              }`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ArrowRight size={13} aria-hidden />
              One way
            </button>
            <button
              type="button"
              onClick={() => setJourneyType('return')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isReturn
                  ? 'bg-[#EBBA6F] text-[#0C0F1C]'
                  : 'border border-white/20 text-white/65 hover:border-white/40 hover:text-white'
              }`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ArrowLeftRight size={13} aria-hidden />
              Return
            </button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} noValidate>

          {/* Row 1: main fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

            {/* Pickup location */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pickup"
                className="text-white/55 text-xs"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Pickup location
              </label>
              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" aria-hidden />
                <Input
                  id="pickup"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                  className={`pl-8 ${fieldClass}`}
                />
              </div>
            </div>

            {/* Destination */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="destination"
                className="text-white/55 text-xs"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Destination
              </label>
              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" aria-hidden />
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className={`pl-8 ${fieldClass}`}
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="passengers"
                className="text-white/55 text-xs"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Passengers
              </label>
              <div className="relative">
                <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger id="passengers" className={`pl-8 ${selectTriggerClass}`}>
                    <SelectValue placeholder="Number of passengers" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D1221] border-white/10">
                    {PASSENGER_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt}
                        value={opt}
                        className="text-white focus:bg-[#EBBA6F]/15 focus:text-white cursor-pointer"
                      >
                        {opt} {opt === '1' ? 'passenger' : 'passengers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Travel date */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="travelDate"
                className="text-white/55 text-xs"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Travel date
              </label>
              <div className="relative">
                <CalendarDays size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Input
                  id="travelDate"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={today}
                  className={`pl-8 [color-scheme:dark] ${fieldClass}`}
                />
              </div>
            </div>

            {/* Pickup time */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pickupTime"
                className="text-white/55 text-xs"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Pickup time
              </label>
              <div className="relative">
                <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                <Select value={pickupTime} onValueChange={setPickupTime}>
                  <SelectTrigger id="pickupTime" className={`pl-8 ${selectTriggerClass}`}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D1221] border-white/10 max-h-52">
                    {TIME_OPTIONS.map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="text-white focus:bg-[#EBBA6F]/15 focus:text-white cursor-pointer"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Return fields — animated */}
          <AnimatePresence>
            {isReturn && (
              <motion.div {...REVEAL} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="returnDate"
                      className="text-white/55 text-xs"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Return date
                    </label>
                    <div className="relative">
                      <CalendarDays size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                      <Input
                        id="returnDate"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={travelDate || today}
                        className={`pl-8 [color-scheme:dark] ${fieldClass}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="returnTime"
                      className="text-white/55 text-xs"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Return time
                    </label>
                    <div className="relative">
                      <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none z-10" aria-hidden />
                      <Select value={returnTime} onValueChange={setReturnTime}>
                        <SelectTrigger id="returnTime" className={`pl-8 ${selectTriggerClass}`}>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0D1221] border-white/10 max-h-52">
                          {TIME_OPTIONS.map((t) => (
                            <SelectItem
                              key={t}
                              value={t}
                              className="text-white focus:bg-[#EBBA6F]/15 focus:text-white cursor-pointer"
                            >
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email + Phone — progressive reveal */}
          <AnimatePresence>
            {showContactFields && (
              <motion.div {...REVEAL} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-white/55 text-xs"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="phone"
                      className="text-white/55 text-xs"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      Phone number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7000 000000"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-7 py-3 bg-[#EBBA6F] text-[#0C0F1C] font-semibold rounded-lg hover:bg-[#E2B36A] active:bg-[#AC864C] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Get Instant Quote
              <ArrowRight size={16} aria-hidden />
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-7 py-3 bg-[#0C0F1C] text-white font-medium rounded-lg border border-white/15 hover:border-white/35 transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <MessageCircle size={16} className="text-[#25D366]" aria-hidden />
              Chat on WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
bun run test:run __tests__/QuoteForm.test.tsx
```

Expected: 7 tests pass.

- [ ] **Step 5: Verify in browser**

Check: toggle switches active state (gold fill). Selecting a time in "Pickup time" triggers email/phone row to slide in. Switching to "Return" slides in the return date/time row. All fields have gold border on focus.

- [ ] **Step 6: Commit**

```bash
git add app/components/QuoteForm.tsx __tests__/QuoteForm.test.tsx
git commit -m "feat: add QuoteForm with one-way/return toggle and progressive contact field reveal"
```

---

## Task 7: TrustBar component

**Files:**
- Create: `app/components/TrustBar.tsx`
- Create: `__tests__/TrustBar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/TrustBar.test.tsx
import { render, screen } from '@testing-library/react'
import TrustBar from '@/app/components/TrustBar'

describe('TrustBar', () => {
  it('renders all four trust items', () => {
    render(<TrustBar />)
    expect(screen.getByText('Fully Licensed & Insured')).toBeInTheDocument()
    expect(screen.getByText('Professional Drivers')).toBeInTheDocument()
    expect(screen.getByText('24/7 Availability')).toBeInTheDocument()
    expect(screen.getByText('UK & Europe Coverage')).toBeInTheDocument()
  })

  it('renders subtitles for each item', () => {
    render(<TrustBar />)
    expect(screen.getByText('Your safety, our priority')).toBeInTheDocument()
    expect(screen.getByText('Experienced & courteous')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
bun run test:run __tests__/TrustBar.test.tsx
```

- [ ] **Step 3: Create app/components/TrustBar.tsx**

```tsx
import { Shield, User, Clock, MapPin } from 'lucide-react'

const ITEMS = [
  {
    Icon: Shield,
    title: 'Fully Licensed & Insured',
    sub: 'Your safety, our priority',
  },
  {
    Icon: User,
    title: 'Professional Drivers',
    sub: 'Experienced & courteous',
  },
  {
    Icon: Clock,
    title: '24/7 Availability',
    sub: 'Here when you need us',
  },
  {
    Icon: MapPin,
    title: 'UK & Europe Coverage',
    sub: 'Travel across the UK & Europe',
  },
]

export default function TrustBar() {
  return (
    <section className="bg-[#0C0F1C] border-t border-white/8 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {ITEMS.map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3.5">
              <Icon
                size={26}
                className="text-[#EBBA6F] shrink-0 mt-0.5"
                strokeWidth={1.5}
                aria-hidden
              />
              <div>
                <p
                  className="text-white text-sm font-semibold leading-snug"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {title}
                </p>
                <p
                  className="text-white/45 text-sm mt-0.5"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
bun run test:run __tests__/TrustBar.test.tsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/components/TrustBar.tsx __tests__/TrustBar.test.tsx
git commit -m "feat: add TrustBar component with 4-column icon grid"
```

---

## Task 8: StatsStrip component

**Files:**
- Create: `app/components/StatsStrip.tsx`
- Create: `__tests__/StatsStrip.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/StatsStrip.test.tsx
import { render, screen } from '@testing-library/react'
import StatsStrip from '@/app/components/StatsStrip'

describe('StatsStrip', () => {
  it('renders all stat values', () => {
    render(<StatsStrip />)
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('10+')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
  })

  it('renders Trustpilot rating', () => {
    render(<StatsStrip />)
    expect(screen.getByText(/4\.8\/5/)).toBeInTheDocument()
    expect(screen.getByText(/200\+ reviews/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
bun run test:run __tests__/StatsStrip.test.tsx
```

- [ ] **Step 3: Create app/components/StatsStrip.tsx**

```tsx
const STATS = [
  { value: '500+', label: 'Happy Customers' },
  { value: '50+', label: 'Modern Vehicles' },
  { value: '10+', label: 'Years of Experience' },
  { value: '24/7', label: 'Customer Support' },
]

export default function StatsStrip() {
  return (
    <section className="bg-[#0D1221] border-t border-white/8 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center">

          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center lg:text-left">
              <p
                className="text-[#EBBA6F] text-4xl lg:text-5xl leading-none mb-1.5"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
              >
                {value}
              </p>
              <p
                className="text-white/50 text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {label}
              </p>
            </div>
          ))}

          {/* Trustpilot */}
          <div className="col-span-2 sm:col-span-1 flex flex-col items-center lg:items-start gap-1">
            <div className="flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#00B67A" aria-hidden>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span
                className="text-[#00B67A] font-bold text-sm tracking-wide"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Trustpilot
              </span>
            </div>
            <div className="flex gap-0.5" aria-label="5 stars">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#00B67A" aria-hidden>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p
              className="text-white/50 text-xs"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <strong className="text-white text-sm">4.8/5</strong>{' '}
              From 200+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
bun run test:run __tests__/StatsStrip.test.tsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/components/StatsStrip.tsx __tests__/StatsStrip.test.tsx
git commit -m "feat: add StatsStrip with gold stats and Trustpilot badge"
```

---

## Task 9: Page assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
import Header from '@/app/components/Header'
import Hero from '@/app/components/Hero'
import QuoteForm from '@/app/components/QuoteForm'
import TrustBar from '@/app/components/TrustBar'
import StatsStrip from '@/app/components/StatsStrip'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <QuoteForm />
      <TrustBar />
      <StatsStrip />
    </main>
  )
}
```

- [ ] **Step 2: Run all tests**

```bash
bun run test:run
```

Expected: all tests pass.

- [ ] **Step 3: Full visual check in browser**

```bash
bun dev
```

Checklist:
- [ ] Header: logo, nav, CTA button — sticky on scroll
- [ ] Hero: full viewport, image behind gradient, 3-line headline, stars
- [ ] QuoteForm: overlaps hero bottom, toggle works, return fields animate in, email/phone reveal works, CTAs visible
- [ ] All form inputs show gold border on focus
- [ ] TrustBar: 4 columns with gold icons
- [ ] StatsStrip: gold numbers, Trustpilot badge
- [ ] Resize to 375px (mobile): everything stacks, form is single-column, hamburger visible

- [ ] **Step 4: Final commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble homepage with Header, Hero, QuoteForm, TrustBar, StatsStrip"
```

---

## Out of scope (Phase 2)

- Services section
- Fleet gallery
- Testimonials
- Corporate CTA block
- Service sub-pages
- Footer
- Quote form API submission
- WhatsApp deep link
