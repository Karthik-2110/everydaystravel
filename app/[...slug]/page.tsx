import { redirect } from 'next/navigation'

/**
 * Catch-all for URLs that match no real route — a stale bookmark, a search
 * result for a page we removed, or a typo. Rather than show a 404 screen we
 * send the visitor to the homepage.
 *
 * Real routes are matched before this one, so nothing that exists is affected.
 */
export default function CatchAllPage(): never {
  redirect('/')
}
