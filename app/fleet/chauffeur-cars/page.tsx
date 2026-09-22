import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import StatBand from '../../components/StatBand'
import VehicleList, { CHAUFFEUR_CARS } from '../../components/VehicleList'
import Footer from '../../components/Footer'
import { Users, Briefcase, UserCheck } from 'lucide-react'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Chauffeur Car Hire London',
  description:
    'Chauffeur-driven Mercedes-Benz, BMW and luxury cars for hire in London and Surrey — airport transfers, corporate travel and special occasions.',
  path: '/fleet/chauffeur-cars',
})

const STATS = [
  { icon: Users,     label: '1–6 Passengers' },
  { icon: Briefcase, label: 'Luggage-Friendly' },
  { icon: UserCheck, label: 'Professional Chauffeurs' },
]

export default function ChauffeurCarsPage() {
  return (
    <>
      <Navbar />
      <Hero
        badge="Chauffeur Cars"
        lines={[
          { text: 'Executive',   accent: false },
          { text: 'Chauffeur',   accent: false },
          { text: 'Cars',        accent: true  },
        ]}
        subtext="Premium chauffeur-style transport for individuals and small groups. Discreet, punctual, and impeccably presented."
      />
      <StatBand stats={STATS} />
      <VehicleList
        vehicles={CHAUFFEUR_CARS}
        category="chauffeur-cars"
        heading="Our chauffeur cars"
        subtext="Every vehicle is maintained to the highest standard and driven by professional, uniformed chauffeurs."
      />
      <Footer />
    </>
  )
}
