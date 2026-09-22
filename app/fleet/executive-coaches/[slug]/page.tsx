import { redirect } from 'next/navigation'
import { createPageMetadata } from '../../../lib/seo'
import VehicleDetail from '../../../components/VehicleDetail'
import { EXECUTIVE_COACHES } from '../../../components/VehicleList'

export function generateStaticParams() {
  return EXECUTIVE_COACHES.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = EXECUTIVE_COACHES.find((item) => item.slug === slug)
  if (!vehicle) return {}

  return createPageMetadata({
    title: `${vehicle.name} Hire`,
    description: vehicle.description,
    path: `/fleet/executive-coaches/${vehicle.slug}`,
  })
}

export default async function CoachDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = EXECUTIVE_COACHES.find((v) => v.slug === slug)
  // No such vehicle — send them to the category listing rather than a 404.
  if (!vehicle) redirect('/fleet')

  const others = EXECUTIVE_COACHES.filter((v) => v.slug !== slug)

  return (
    <VehicleDetail
      vehicle={vehicle}
      category="executive-coaches"
      categoryLabel="Executive Coaches"
      otherVehicles={others}
    />
  )
}
