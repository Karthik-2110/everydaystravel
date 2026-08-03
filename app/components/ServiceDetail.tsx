import { notFound } from 'next/navigation'
import VehicleDetail from './VehicleDetail'
import { SERVICES } from './ServiceList'

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) notFound()

  return (
    <VehicleDetail
      vehicle={service}
      category="services"
      categoryLabel="Services"
      otherVehicles={SERVICES.filter((s) => s.slug !== slug)}
      hrefBase="/services"
      exploreHeading="Explore other services"
      cardCta="View service"
      preselectVehicle={false}
    />
  )
}
