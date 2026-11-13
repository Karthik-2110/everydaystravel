import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServicesGrid from '../components/ServicesGrid'
import Footer from '../components/Footer'
import { createPageMetadata } from '../lib/seo'
import { CHAUFFEUR_CARS, LUXURY_MINIBUSES, EXECUTIVE_COACHES } from '../data/fleet'

export const metadata = createPageMetadata({
  title: 'Coach & Minibus Fleet',
  description:
    'Browse the Everydays Travel fleet: luxury minibuses, executive coaches and chauffeur-driven cars for hire across London, Surrey and the UK.',
  path: '/fleet',
})

const carImage = CHAUFFEUR_CARS.find(vehicle => vehicle.slug === 'mercedes-s-class')!.image
const minibusImage = LUXURY_MINIBUSES.find(vehicle => vehicle.slug === '16-seater-minibus')!.image
const coachImage = EXECUTIVE_COACHES.find(vehicle => vehicle.slug === '53-seater-coach')!.images!
  .find(image => image.includes('IMG_4946_ye0wnd'))!

const FLEET = [
  {
    name:        'Executive Cars',
    description: 'Chauffeur-driven luxury sedans ideal for executive travel, airport transfers, and corporate events.',
    image:       carImage,
    href:        '/fleet/chauffeur-cars',
  },
  {
    name:        'Luxury Minibuses',
    description: 'Premium minibuses for small groups, with comfort and style for up to 19 passengers.',
    image:       minibusImage,
    href:        '/fleet/luxury-minibuses',
  },
  {
    name:        'Executive Coaches',
    description: '35 to 55-seat executive coaches for group days out, events and longer journeys across the UK and Europe.',
    image:       coachImage,
    href:        '/fleet/executive-coaches',
  },
]

export default function FleetPage() {
  return (
    <>
      <Navbar />
      <Hero
        badge="Our Fleet"
        lines={[
          { text: 'Vehicles Built',  accent: false },
          { text: 'for Comfort &',   accent: false },
          { text: 'Every Occasion',  accent: true  },
        ]}
        subtext="From executive chauffeur cars to luxury minibuses and premium coaches. Every vehicle in our fleet is maintained to the highest standard."
        imageSrc={coachImage.replace('w_1600', 'w_2400')}
      />
      <ServicesGrid
        services={FLEET}
        heading="Our Fleet"
        subtext="Explore our range of premium vehicles designed to offer exceptional comfort and safety for all your travel needs."
      />
      <Footer />
    </>
  )
}
