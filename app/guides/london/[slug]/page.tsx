import Image from 'next/image'
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
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: guide.photo.src, alt: guide.name }] } }
}

export default async function VenueGuide(props: Props) {
  const { title, area, plan, about, photo } = await getGuide(props)
  return (
    <>
      <header className="relative isolate flex min-h-72 items-end overflow-hidden bg-[#101522] sm:min-h-96 lg:min-h-[28rem]">
        <Image fill sizes="100vw" src={photo.src} alt="" fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="site-container w-full py-10">
          <p className="mb-3 text-sm text-[#EBBA6F]">{area}, London</p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
        </div>
      </header>
      <div className="site-container mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
      <article className="max-w-prose">
        <p className="text-lg leading-relaxed text-white/85">{about}</p>
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
    </>
  )
}
