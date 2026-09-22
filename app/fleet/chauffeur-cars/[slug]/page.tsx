import { redirect } from 'next/navigation'
import { createPageMetadata } from '../../../lib/seo'
import VehicleDetail from '../../../components/VehicleDetail'
import { CHAUFFEUR_CARS } from '../../../components/VehicleList'

export function generateStaticParams() {
  return CHAUFFEUR_CARS.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = CHAUFFEUR_CARS.find((item) => item.slug === slug)
  if (!vehicle) return {}

  return createPageMetadata({
    title: `${vehicle.name} Chauffeur Hire`,
    description: vehicle.description,
    path: `/fleet/chauffeur-cars/${vehicle.slug}`,
  })
}

export default async function ChauffeurCarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = CHAUFFEUR_CARS.find((v) => v.slug === slug)
  // No such vehicle — send them to the category listing rather than a 404.
  if (!vehicle) redirect('/fleet')

  const others = CHAUFFEUR_CARS.filter((v) => v.slug !== slug)

  return (
    <VehicleDetail
      vehicle={vehicle}
      category="chauffeur-cars"
      categoryLabel="Chauffeur Cars"
      otherVehicles={others}
    />
  )
}
