import { redirect } from 'next/navigation'
import LandingContent from './LandingContent'
import VehicleDetail from './VehicleDetail'
import ServiceSections from './service/ServiceSections'
import ServiceSpecBlocks from './service/ServiceSpecBlocks'
import { SERVICES } from './ServiceList'

const SERVICE_HEADINGS: Record<string, string> = {
  'school-trips': 'School Coach Hire London',
  'private-hire': 'Private Coach & Minibus Hire London',
  corporate: 'Corporate Coach Hire London',
  'airport-transfers': 'Airport Coach & Minibus Transfers London',
}

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug)
  // No such service — send them to the services listing rather than a 404.
  if (!service) redirect('/services')

  return (
    <VehicleDetail
      vehicle={{ ...service, name: SERVICE_HEADINGS[slug] ?? service.name }}
      category="services"
      categoryLabel="Services"
      otherVehicles={SERVICES.filter((s) => s.slug !== slug)}
      hrefBase="/services"
      exploreHeading="Explore other services"
      cardCta="View service"
      preselectVehicle={false}
      specSections={<ServiceSpecBlocks slug={slug} />}
      extraSections={<><ServiceSections slug={slug} /><LandingContent page={slug} />{slug === 'corporate' && <LandingContent page="business-services" />}{slug === 'airport-transfers' && <LandingContent page="airport-links" />}</>}
    />
  )
}
