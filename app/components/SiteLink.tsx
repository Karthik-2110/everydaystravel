import Link from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { isUnavailable, isExternal } from '../lib/routes'

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href:      string
  children:  ReactNode
  /** Extra classes applied only when the link is inert. */
  mutedClassName?: string
}

/**
 * A link that knows whether its destination exists.
 *
 * Pages we have not built yet render as an inert `<span>`: the label stays in
 * place, but there is nothing to click, so the visitor stays exactly where they
 * are instead of landing on a dead end. External URLs get `target="_blank"` and
 * a safe `rel`. Everything else is a normal Next `Link`.
 */
export default function SiteLink({
  href,
  children,
  className,
  mutedClassName = 'opacity-40 cursor-default pointer-events-none',
  onClick,
  ...rest
}: SiteLinkProps) {
  if (isUnavailable(href)) {
    return (
      <span
        className={[className, mutedClassName].filter(Boolean).join(' ')}
        aria-disabled="true"
        data-unavailable="true"
        {...rest}
      >
        {children}
      </span>
    )
  }

  if (isExternal(href)) {
    const opensNewTab = href.startsWith('http')
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        {...(opensNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  )
}
