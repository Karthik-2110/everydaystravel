import Image from 'next/image'
import Link from 'next/link'
import { londonGuides, londonGuidePath } from '../../data/london-guides'
import { createPageMetadata } from '../../lib/seo'

const title = 'London hotel transfers and sightseeing coach hire'
const description = 'Plan group transport for London hotels, museums and landmarks. Find venue-specific journey advice and compare chauffeur cars, minibuses and coaches.'
export const metadata = createPageMetadata({ title, description, path: londonGuidePath })

export default function LondonGuidesPage() {
  return <div className="site-container">
    <h1 className="max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
    <p className="mt-5 max-w-prose text-lg text-white/75">{description}</p>
    {(['Hotels', 'Attractions'] as const).map(kind => <section key={kind} className="mt-12">
      <h2 className="mb-5 text-2xl text-[#EBBA6F]">{kind}</h2>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {londonGuides.filter(guide => guide.kind === kind).map(guide => <li key={guide.slug}>
          <div className="group relative isolate flex aspect-square items-end overflow-hidden rounded-2xl border border-white/15 bg-[#101522]">
            <Image fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" src={guide.photo.src} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#04060E] via-[#04060E]/40 to-transparent" />
            <div className="p-6">
              <p className="text-sm text-white/85">{guide.area}</p>
              <h3 className="mt-1 text-2xl font-medium"><Link href={`${londonGuidePath}/${guide.slug}`} className="after:absolute after:inset-0">{guide.name}</Link></h3>
              <Link href={`${londonGuidePath}/${guide.slug}#quote`} aria-label={`Get quote for ${guide.name}`} className="relative mt-4 inline-flex rounded-full bg-[#EBBA6F] px-5 py-2 font-medium text-[#101522] hover:bg-white">Get quote</Link>
            </div>
          </div>
        </li>)}
      </ul>
    </section>)}
    <details className="mt-12 text-sm text-white/70">
      <summary className="cursor-pointer">Photography sources</summary>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {londonGuides.map(guide => <li key={guide.slug}>
          <a href={guide.photo.credit} className="underline underline-offset-4">{guide.name}</a>
        </li>)}
      </ul>
    </details>
  </div>
}
