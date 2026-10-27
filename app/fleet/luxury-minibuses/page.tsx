import LandingContent from '../../components/LandingContent'
import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import StatBand from '../../components/StatBand'
import VehicleList, { LUXURY_MINIBUSES } from '../../components/VehicleList'
import Footer from '../../components/Footer'
import { Users, Wifi, UserCheck } from 'lucide-react'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Luxury Minibus Hire London',
  description:
    'Luxury minibus hire with driver across London and Surrey: 7 to 19 seaters with onboard WiFi, reclining seats and professional chauffeurs.',
  path: '/fleet/luxury-minibuses',
})

const STATS = [
  { icon: Users,     label: 'Up to 19 Passengers' },
  { icon: Wifi,      label: 'Onboard WiFi' },
  { icon: UserCheck, label: 'Professional Drivers' },
]

export default function LuxuryMinibusesPage() {
  return (
    <>
      <Navbar />
      <Hero
        badge="Luxury Minibuses"
        lines={[
          { text: 'Luxury',    accent: false },
          { text: 'Minibus',   accent: false },
          { text: 'Hire in London', accent: true },
        ]}
        subtext="Minibus hire with a driver in London and Surrey, with 7, 16 and 19-seat options for airport transfers, weddings and private groups. Tell us your passenger numbers and luggage so we can recommend the right vehicle."
        imageSrc="https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783785511/IMG_6138_n9khty.jpg"
      />
      <StatBand stats={STATS} />
      <VehicleList
        vehicles={LUXURY_MINIBUSES}
        category="luxury-minibuses"
        heading="Our luxury minibuses"
        subtext="Spacious, well-equipped vehicles for groups who expect the same premium standard as our chauffeur fleet."
      />
      <LandingContent page="minibuses" />
      <Footer />
    </>
  )
}
