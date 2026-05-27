# Everydays Travel — Homepage Design Spec
**Date:** 2026-05-25  
**Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript  
**Scope:** Homepage — Header through Stats Strip (Sections 1–5)

---

## Brand Tokens

```css
/* Backgrounds */
--color-bg-primary: #0C0F1C;
--color-bg-secondary: #0D1221;
--color-bg-dark: #050505;
--color-bg-card-light: #EEEEE0;
--color-bg-off-white: #FAF9F5;

/* Accent Gold */
--color-accent: #EBBA6F;
--color-accent-warm: #E2B36A;
--color-accent-dark: #AC864C;
--color-accent-mid: #C7A879;

/* Text */
--color-text-primary: #FFFFFF;
--color-text-muted: rgba(255,255,255,0.75);
--color-text-grey-light: #ADB1B8;
--color-text-dark: #0C0F1C;

/* Fonts */
--font-display: 'Formula Condensed Light', sans-serif; /* weight 300 */
--font-body: 'Source Sans 3', sans-serif;
--font-ui: 'Inter', sans-serif;
```

**Input focus state:** `2px solid #EBBA6F` outline, no default browser ring.

---

## Responsive Breakpoints

| Breakpoint | Width | Priority |
|---|---|---|
| Mobile | < 768px | High |
| Tablet | 768–1024px | Medium |
| Desktop | ≥ 1024px | Highest |

Mobile: form fields stack to single column. Nav collapses to hamburger.

---

## Section 1 — Header / Nav

**Desktop:**
- Full-width, dark bg (`#0C0F1C`), ~72px height
- Left: Logo (crown SVG + "EVERYDAYS / TRAVEL" wordmark, gold)
- Centre: Nav links — Home (gold underline active), Services ↓, Our fleet ↓, Reviews, About us, Contact us
- Right: "Get Instant Quote" — outlined gold button, pill/rounded

**Mobile:**
- Logo left, hamburger menu right
- Drawer or dropdown opens with nav links stacked
- "Get Instant Quote" CTA visible in drawer

**Behaviour:** Sticky on scroll. Slight background blur/darken when scrolled past hero.

---

## Section 2 — Hero

**Desktop:**
- Full viewport height (100vh min), full-width background image
- Image: luxury coach at night, UK cityscape (Big Ben visible)
- Dark gradient overlay (bottom-heavy, left-heavy) for text legibility
- Content left-aligned, vertically centred

**Content (left column, ~50% width):**
- Badge pill: crown icon + "PREMIUM COACH & MINIBUS HIRE" — dark semi-transparent bg, gold text/icon
- H1 line 1: "Luxury Coach &" (white, Formula Condensed Light, ~72px desktop)
- H1 line 2: "Minibus Hire" (white)
- H1 line 3: "Across the UK" (gold `#EBBA6F`)
- Body: "Reliable, professional transport for airport transfers, events and group travel."
- Trust row: 4 gold stars + "Trusted by **500+** customers"

**Mobile:** Text scales down (~40px H1), full-width, image crops to portrait.

---

## Section 3 — Quote Form Panel

**Container:** Dark card (`#0D1221`), rounded-xl, sits below/overlapping hero bottom edge. Max-width ~1200px, centred, horizontal padding 32px.

**Header row:**
- Left: "Plan your journey" label — gold, Source Sans 3, medium weight
- Toggle: "One way" | "Return" — pill toggle, active state has gold fill + dark text, inactive is outlined

### One-Way Form (default)

**Row 1 — 5 fields + 2 CTAs:**

| Field | Input type | Icon |
|---|---|---|
| Pickup location | Text / autocomplete | Pin icon |
| Destination | Text / autocomplete | Pin icon |
| Passengers | Select dropdown | Person icon |
| Travel date | Date picker | Calendar icon |
| Pickup time | Time picker / select | Clock icon |

Fields: dark bg (`#0C0F1C`), `1px solid rgba(255,255,255,0.1)` border, white text, placeholder in grey-muted. **Focus:** `2px solid #EBBA6F`, no box-shadow ring.

**Row 2 — appears after pickup time has a value (progressive reveal):**

| Field | Input type |
|---|---|
| Email address | Email input |
| Phone number | Tel input (UK format) |

Row 2 slides in with a subtle fade/slide-down animation (150ms ease-out).

**CTAs (right column, stacked vertically):**
1. "Get Instant Quote →" — gold fill (`#EBBA6F`), dark text, bold, full-width within column
2. "Chat on WhatsApp" — dark fill, white text, WhatsApp icon, outlined border

### Return Form

Same as One-Way Row 1 + CTAs, but adds:
- **Return date** field
- **Return time** field
(These appear between the main fields row and the email/phone row)

Email + phone row still appears after pickup time is filled.

**Mobile:** All fields stack to single column. CTAs go full-width below.

---

## Section 4 — Trust Icon Bar

4-column grid (2×2 on mobile):

| Icon | Headline | Sub |
|---|---|---|
| Shield | Fully Licensed & Insured | Your safety, our priority |
| Person | Professional Drivers | Experienced & courteous |
| Clock 24 | 24/7 Availability | Here when you need us |
| Map pin | UK & Europe Coverage | Travel across the UK & Europe |

Icons: gold, ~32px. Headline: white, Source Sans 3 semibold. Sub: muted grey. Background: `#0C0F1C`. Light top border separating from form.

---

## Section 5 — Stats Strip

5 columns (scrollable row on mobile):

| Stat | Label |
|---|---|
| 500+ | Happy Customers |
| 50+ | Modern Vehicles |
| 10+ | Years of Experience |
| 24/7 | Customer Support |
| Trustpilot 4.8/5 | From 200+ reviews |

Stats: gold, Formula Condensed Light, ~48px. Label: muted white, Source Sans 3. Trustpilot logo (green) + star rating badge.

Background: slight separation from trust bar — can use `#0D1221` or a thin divider line.

---

## Component Build Order

| # | Component | File path |
|---|---|---|
| 1 | Header / Nav | `app/components/Header.tsx` |
| 2 | Hero section | `app/components/Hero.tsx` |
| 3 | Quote Form Panel | `app/components/QuoteForm.tsx` |
| 4 | Trust Icon Bar | `app/components/TrustBar.tsx` |
| 5 | Stats Strip | `app/components/StatsStrip.tsx` |
| — | Page assembly | `app/page.tsx` |

Each component is self-contained with its own styles via Tailwind. Brand CSS variables added to `globals.css`.

---

## Fonts Setup

- `Formula Condensed Light` — load via `@font-face` (local or CDN, weight 300)
- `Source Sans 3` — Google Fonts via `next/font/google`
- `Inter` — Google Fonts via `next/font/google`

---

## Out of Scope (Phase 2)

- Services section
- Fleet / vehicle gallery
- Testimonials
- Corporate CTA block
- Service sub-pages (/airport-transfers, /corporate, etc.)
- Footer
