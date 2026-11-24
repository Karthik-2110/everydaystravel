import Link from 'next/link'
import { notFound } from 'next/navigation'
import { londonGuidePath, londonGuides } from '../../../data/london-guides'
import { createPageMetadata } from '../../../lib/seo'
import VehicleBookingForm from '../../../components/VehicleBookingForm'

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export const generateStaticParams = () => londonGuides.map(({ slug }) => ({ slug }))
async function getGuide({ params }: Props) {
  const { slug } = await params
  return londonGuides.find(guide => guide.slug === slug) ?? notFound()
}

export async function generateMetadata(props: Props) {
  const guide = await getGuide(props)
  const metadata = createPageMetadata({ title: guide.title,
    description: `Plan group travel to or from ${guide.name} in ${guide.area}, London. Arrange airport transfers, sightseeing trips and private group travel.`,
    path: `${londonGuidePath}/${guide.slug}` })
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: guide.image, alt: guide.vehicle.name }] } }
}

export default async function VenueGuide(props: Props) {
  const { title, area, plan, about } = await getGuide(props)
  return (
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
      <article className="max-w-prose">
        <p className="mb-3 text-sm text-[#EBBA6F]">{area}, London</p>
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/85">{about}</p>
        <a href="#quote" className="mt-5 inline-block text-[#EBBA6F] underline underline-offset-4 lg:hidden">Get a free quote</a>
        <h2 className="mt-9 text-2xl font-medium">Planning your journey</h2>
        <p className="mt-3 leading-relaxed text-white/80">{plan}</p>
        <p className="mt-4 leading-relaxed text-white/80">
          Everydays Travel arranges airport and cruise transfers, sightseeing tours, school trips,
          wedding transport, corporate travel, staff shuttles and private hire for events and sports teams.
          Book a chauffeur car, minibus or coach for a one-way trip, a return or a day with several stops.
        </p>
        <Link href="/services" className="mt-4 inline-block text-[#EBBA6F] underline underline-offset-4">View all travel services</Link>
      </article>
      <section id="quote" className="scroll-mt-32">
        <VehicleBookingForm />
      </section>
    </div>
  )
}
