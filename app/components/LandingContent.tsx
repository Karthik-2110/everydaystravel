import Link from 'next/link'
import { SEO_PAGE_CONTENT } from '../data/seo-pages'
import { LANDING_CONTENT } from '../data/landing-content'

/** Server-rendered booking guidance using the existing site typography. */
export default function LandingContent({ page }: { page: string }) {
  const content = LANDING_CONTENT[page] ?? SEO_PAGE_CONTENT[page]
  if (!content) return null

  return (
    <section aria-label={content.heading} className="border-t border-white/10 bg-[#0F1322]">
      <div className="site-container py-16 lg:py-24">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#EBBA6F] max-w-[28ch]">
          {content.heading}
        </h2>
        <p className="mt-6 max-w-[70ch] text-base leading-relaxed text-white/75">{content.intro}</p>
        <div className="mt-10 divide-y divide-white/10">
          {content.sections.map(({ heading, text, links }) => (
            <div key={heading} className="py-7 grid gap-4 lg:grid-cols-[1fr_2fr] lg:gap-12">
              <h3 className="text-xl font-medium text-white/95">{heading}</h3>
              <div>
                <p className="max-w-[70ch] text-base leading-relaxed text-white/75">{text}</p>
                {links && (
                  <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                    {links.map(({ label, href }) => (
                      <li key={href}>
                        <Link href={href} className="text-[#EBBA6F] underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBBA6F]">{label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
