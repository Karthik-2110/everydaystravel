import LandingContent from '../../components/LandingContent'
import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import StatBand from '../../components/StatBand'
import VehicleList, { EXECUTIVE_COACHES } from '../../components/VehicleList'
import Footer from '../../components/Footer'
import { Users, Wifi, ShieldCheck } from 'lucide-react'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Executive Coach Hire London',
  description:
    'Executive coach hire from 35 to 55 seats for group travel across London, Surrey and the UK: Mercedes-Benz Turismo, Neoplan Tourliner and more.',
  path: '/fleet/executive-coaches',
})

const STATS = [
  { icon: Users,       label: 'Up to 55 Passengers' },
  { icon: Wifi,        label: 'Facilities vary by vehicle' },
  { icon: ShieldCheck, label: 'Fully Licensed & Insured' },
]

export default function ExecutiveCoachesPage() {
  return (
    <>
      <Navbar />
      <Hero
        badge="Executive Coaches"
        lines={[
          { text: 'Executive',  accent: false },
          { text: 'Coach',      accent: false },
          { text: 'Hire in London', accent: true },
        ]}
        subtext="Premium coaches for large groups, events, and long-distance travel. Trusted by schools, sports clubs, and corporate clients across the UK."
      />
      <StatBand stats={STATS} />
      <VehicleList
        vehicles={EXECUTIVE_COACHES}
        category="executive-coaches"
        heading="Our executive coaches"
        subtext="Full-size coaches with all the amenities your group needs for a comfortable journey, wherever you're headed."
      />
      <LandingContent page="coaches" />
      <Footer />
    </>
  )
}
