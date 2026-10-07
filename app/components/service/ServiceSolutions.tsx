import { ChevronDown } from 'lucide-react'
import SectionHeading from './SectionHeading'
import ServiceCarousel from './ServiceCarousel'
import type { SolutionsBlock } from '../../data/service-content'

/**
 * The kinds of journey, as an accordion beside a photo panel.
 *
 * Rows rather than a list because the detail matters to whoever it applies to
 * and is noise to everybody else: a parent booking a family holiday has no use
 * for the crew-rota paragraph. The first row opens on load so the pattern is
 * legible without anybody having to guess that the titles are clickable.
 *
 * `<details name>` makes the group exclusive — opening one closes the last —
 * with no JavaScript at all. Browsers that do not support the attribute simply
 * allow several open at once, which is a perfectly good accordion too. The
 * height transition is CSS on `.accordion-row` in `globals.css`, for the same
 * reason: nothing here needs to become a client component to animate.
 *
 * The photo panel sticks on a wide screen, so it stays beside the rows rather
 * than scrolling away and leaving a column of text next to nothing.
 *
 * Nothing in the column carries a measure of its own: heading, standfirst and
 * row bodies all run to the same edge as the rows. The grid column is the
 * measure, so a cap here only made the heading wrap early against rules that
 * ran past it.
 */
export default function ServiceSolutions({ block }: { block: SolutionsBlock }) {
  return (
    <section aria-label="Kinds of transfer" className="bg-[#0F1322] border-t border-white/[0.05]">
      <div className="site-container py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">

          {/* Title and rows */}
          <div>
            <SectionHeading parts={block.heading} />

            <p
              className="text-white/60 text-[15.5px] leading-relaxed mt-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {block.intro}
            </p>

            <div className="mt-9 border-t border-white/[0.08]">
              {block.accordion.map(({ title, text }, i) => (
                <details
                  key={title}
                  name="transfer-kinds"
                  open={i === 0}
                  className="accordion-row group border-b border-white/[0.08]"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-4 [&::-webkit-details-marker]:hidden">
                    <span
                      className="text-white text-[15.5px] font-medium leading-snug group-open:text-[#EBBA6F] transition-colors duration-150"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {title}
                    </span>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.6}
                      aria-hidden
                      className="text-[#EBBA6F] shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>

                  <p
                    className="text-white/60 text-[14.5px] leading-relaxed pb-5 pr-8"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {text}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className="lg:sticky lg:top-24">
            <ServiceCarousel slides={block.carousel} />
          </div>

        </div>
      </div>
    </section>
  )
}
