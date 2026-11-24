import Link from 'next/link'
import { londonGuides, londonGuidePath } from '../../data/london-guides'
import { createPageMetadata } from '../../lib/seo'

const title = 'London hotel transfers and sightseeing coach hire'
const description = 'Plan group transport for London hotels, museums and landmarks. Find venue-specific journey advice and compare chauffeur cars, minibuses and coaches.'
export const metadata = createPageMetadata({ title, description, path: londonGuidePath })

export default function LondonGuidesPage() {
  return <>
    <h1 className="max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
    <p className="mt-5 max-w-prose text-lg text-white/75">{description}</p>
    {(['Hotels', 'Attractions'] as const).map(kind => <section key={kind} className="mt-12">
      <h2 className="mb-5 text-2xl text-[#EBBA6F]">{kind}</h2>
      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {londonGuides.filter(guide => guide.kind === kind).map(guide => <li key={guide.slug}>
          <Link className="block border-b border-white/15 py-3 hover:text-[#EBBA6F]" href={`${londonGuidePath}/${guide.slug}`}>{guide.name}</Link>
        </li>)}
      </ul>
    </section>)}
  </>
}
