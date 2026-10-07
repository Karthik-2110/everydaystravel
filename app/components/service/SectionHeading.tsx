import { Fragment } from 'react'
import type { HeadingPart } from '../../data/service-content'

/**
 * A heading set in two tones, the way the hero already sets its lines.
 *
 * Which phrase carries the gold is a property of the sentence, not of the
 * component — "Airport transfers for every kind of journey" wants it on the
 * first phrase, "Why choose Everydays Travel" on the last.
 *
 * Two variants, and no size knob: every band heading is the same size, so the
 * sections read as siblings rather than as a hierarchy that does not exist.
 * `spec` matches "Features & Amenities" and "Preferred for" exactly, for a
 * block that sits in the specification column as a third sibling of those two —
 * the values are copied from `VehicleDetail` rather than approximated, so the
 * three headings cannot drift a half-step apart.
 *
 * The space between parts is its own text node rather than padding inside a
 * span, because the accessible-name algorithm trims each element before joining
 * them: a trailing space inside the span renders correctly and is then dropped
 * from the name, which is how a heading ends up announced as "forairport".
 */
export default function SectionHeading({
  parts, variant = 'band',
}: {
  parts:    HeadingPart[]
  variant?: 'band' | 'spec'
}) {
  const spec = variant === 'spec'

  return (
    <h2
      className={spec
        ? 'text-white mb-5 tracking-[-0.01em]'
        : 'text-white leading-[1.04] tracking-[-0.02em]'}
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 300,
        fontSize: spec ? 'clamp(1.5rem, 2vw, 2rem)' : 'clamp(2rem, 3.8vw, 3.1rem)',
      }}
    >
      {parts.map(({ text, accent }, i) => (
        <Fragment key={text}>
          {i > 0 && ' '}
          <span className={accent ? 'text-[#EBBA6F]' : undefined}>{text}</span>
        </Fragment>
      ))}
    </h2>
  )
}
