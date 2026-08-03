import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServicesGrid from '../components/ServicesGrid'
import Footer from '../components/Footer'

const PLACEHOLDER = 'https://res.cloudinary.com/dckyndryf/image/upload/f_auto,q_auto,w_800,c_limit/IMG_0938_fhylhh'

const FLEET = [
  {
    name:        'Executive Cars',
    description: 'Chauffeur-driven luxury sedans ideal for executive travel, airport transfers, and corporate events.',
    image:       PLACEHOLDER,
    href:        '/fleet/chauffeur-cars',
  },
  {
    name:        'Luxury Minibuses',
    description: 'Premium minibuses for small groups — comfort and style for up to 16 passengers.',
    image:       PLACEHOLDER,
    href:        '/fleet/luxury-minibuses',
  },
  {
    name:        'Executive Coaches',
    description: '53 and 70 seater executive coaches — perfect for large groups and long-distance travel.',
    image:       PLACEHOLDER,
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
        subtext="From executive chauffeur cars to luxury minibuses and premium coaches — every vehicle in our fleet is maintained to the highest standard."
        imageSrc="https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783783988/DSC09031_yjmhzx.jpg"
      />
      <ServicesGrid
        services={FLEET}
        heading="Our Fleet"
        subtext="Explore our range of premium vehicles designed to offer exceptional comfort and safety for all your travel needs."
        showKicker={false}
      />
      <Footer />
    </>
  )
}
