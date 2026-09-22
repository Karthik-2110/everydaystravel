import { redirect } from 'next/navigation'
import { createPageMetadata } from '../../../lib/seo'
import VehicleDetail from '../../../components/VehicleDetail'
import { LUXURY_MINIBUSES } from '../../../components/VehicleList'

export function generateStaticParams() {
  return LUXURY_MINIBUSES.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = LUXURY_MINIBUSES.find((item) => item.slug === slug)
  if (!vehicle) return {}

  return createPageMetadata({
    title: `${vehicle.name} Hire`,
    description: vehicle.description,
    path: `/fleet/luxury-minibuses/${vehicle.slug}`,
  })
}

export default async function MinibusDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = LUXURY_MINIBUSES.find((v) => v.slug === slug)
  // No such vehicle — send them to the category listing rather than a 404.
  if (!vehicle) redirect('/fleet')

  const others = LUXURY_MINIBUSES.filter((v) => v.slug !== slug)

  return (
    <VehicleDetail
      vehicle={vehicle}
      category="luxury-minibuses"
      categoryLabel="Luxury Minibuses"
      otherVehicles={others}
    />
  )
}
