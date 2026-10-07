import SectionHeading from './SectionHeading'
import type { WhyChooseBlock } from '../../data/service-content'

/**
 * The opening argument, as a third item in the specification column.
 *
 * Set exactly like "Features & Amenities" and "Preferred for" above it — same
 * heading, same two-column grid, same icon size and weight — because it is a
 * sibling of those two, not a different kind of thing. They answer what you
 * get; this one answers why it is worth having.
 */
export default function ServiceWhyChoose({ block }: { block: WhyChooseBlock }) {
  return (
    <div className="mb-10">
      <SectionHeading parts={block.heading} variant="spec" />

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {block.points.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3.5">
            <Icon
              size={20}
              strokeWidth={1.3}
              className="text-[#EBBA6F] shrink-0"
              aria-hidden
            />
            <span
              className="text-white text-[15px] leading-snug"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
