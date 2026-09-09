// Routes we link to in the nav or footer but have not built yet.
//
// Rather than send visitors to a "coming soon" or 404 screen, links pointing at
// these are rendered inert by `SiteLink` — the label stays visible, clicking
// does nothing, and the visitor stays on the page they were already reading.
// Any URL that reaches the server anyway is redirected home by the catch-all
// route in `app/[...slug]/page.tsx`.
//
// When a page ships, delete its entry here and the link comes alive.

export const UNAVAILABLE_ROUTES: readonly string[] = [
  '/blog',
  '/faqs',
  '/privacy',
  '/team',
  '/terms',
  '/vacancies',
]

/** True for a not-yet-built route, or a bare `#` placeholder href. */
export function isUnavailable(href: string): boolean {
  if (!href || href === '#') return true
  // Ignore query strings and fragments so `/faqs#pricing` is caught too.
  const path = href.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  return UNAVAILABLE_ROUTES.includes(path)
}

/** True for links that leave the site (or open a phone / mail client). */
export function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href)
}
