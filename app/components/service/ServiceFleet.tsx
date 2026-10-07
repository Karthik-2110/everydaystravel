import Image from 'next/image'
import Link from 'next/link'
import SectionHeading from './SectionHeading'
import type { FleetBlock } from '../../data/service-content'

/**
 * What comes as standard, what you ask for, and a way through to the fleet.
 *
 * The two lists are the point: "included" and "you can also ask for" only mean
 * something as a pair, because the line between them is what a customer is
 * actually trying to work out.
 *
 * Nothing in the copy column carries a measure of its own: the standfirst runs
 * to the same edge as the two lists under it. The column is the measure.
 *
 * The photo runs to the edge of the screen rather than sitting in a card, so
 * the section reads as a band rather than as one more panel in a page that
 * already has several. `site-container` is a 7% inline padding, so the copy
 * matches the page's measure by taking that padding on its own left side.
 */
export default function ServiceFleet({ block }: { block: FleetBlock }) {
  return (
    <section aria-label="The vehicles we use" className="bg-[#0F1322] border-t border-white/[0.05]">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">

        {/* Copy.
            `site-container` insets by 7% of the full section width. This cell is
            half the grid once the photo moves beside it, so the same inset is
            14% of the cell — matching the sections above instead of landing at
            half their margin. Percentages rather than `vw` so the scrollbar is
            excluded here exactly as it is there. */}
        <div className="px-[7%] lg:pl-[14%] lg:pr-12 py-16 lg:py-24">
          <SectionHeading parts={block.heading} />

          <p
            className="text-white/60 text-[15.5px] leading-relaxed mt-5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {block.intro}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-9 mt-10">
            {[
              { heading: block.includedHeading, items: block.included },
              { heading: block.extrasHeading,   items: block.extras },
            ].map(({ heading, items }) => (
              <div key={heading}>
                <h3
                  className="text-[#EBBA6F] mb-5"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.15rem, 1.6vw, 1.35rem)' }}
                >
                  {heading}
                </h3>
                <ul className="space-y-3.5">
                  {items.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3.5">
                      <Icon
                        size={18}
                        strokeWidth={1.4}
                        aria-hidden
                        className="text-[#EBBA6F] shrink-0 mt-[1px]"
                      />
                      <span
                        className="text-white/80 text-[14.5px] leading-snug"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-10">
            {block.ctas.map(({ label, href, primary }) => (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center justify-center px-7 py-3 rounded-full text-[14px] transition-colors duration-150 ${
                  primary
                    ? 'bg-[#EBBA6F] text-[#1A1205] font-semibold hover:bg-[#DDA85E]'
                    : 'border border-white/20 text-white font-medium hover:border-[#EBBA6F]/60 hover:text-[#EBBA6F]'
                }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Photo — stacked above the copy on a narrow screen, full-bleed beside it on
            a wide one, meeting the band on a hard edge rather than a fade. */}
        <div className="relative min-h-[260px] sm:min-h-[360px] lg:min-h-full order-first lg:order-last">
          <Image
            src={block.image}
            alt={block.imageAlt}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

      </div>
    </section>
  )
}
