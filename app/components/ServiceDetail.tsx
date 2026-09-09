import { redirect } from 'next/navigation'
import VehicleDetail from './VehicleDetail'
import { SERVICES } from './ServiceList'

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug)
  // No such service — send them to the services listing rather than a 404.
  if (!service) redirect('/services')

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
