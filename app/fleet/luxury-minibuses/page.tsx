import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import StatBand from '../../components/StatBand'
import VehicleList, { LUXURY_MINIBUSES } from '../../components/VehicleList'
import Footer from '../../components/Footer'
import { Users, Wifi, UserCheck } from 'lucide-react'

const STATS = [
  { icon: Users,     label: 'Up to 16 Passengers' },
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
          { text: 'Hire',      accent: true  },
        ]}
        subtext="Comfort and style for groups up to 16 passengers. Perfect for events, transfers, and group travel across the UK."
        imageSrc="https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783785511/IMG_6138_n9khty.jpg"
      />
      <StatBand stats={STATS} />
      <VehicleList
        vehicles={LUXURY_MINIBUSES}
        heading="Our luxury minibuses"
        subtext="Spacious, well-equipped vehicles for groups who expect the same premium standard as our chauffeur fleet."
      />
      <Footer />
    </>
  )
}
