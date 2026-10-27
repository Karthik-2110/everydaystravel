import Navbar from '../../../components/Navbar'
import Hero from '../../../components/Hero'
import LandingContent from '../../../components/LandingContent'
import Footer from '../../../components/Footer'
import { AIRPORT_TRANSFER_IMAGES } from '../../../components/ServiceList'
import { createPageMetadata, serviceSchema } from '../../../lib/seo'
import { HEATHROW_PATH } from '../../../data/seo-pages'

const description = 'Private Heathrow coach and minibus hire with professional drivers. Premium group transfers to London hotels, venues and beyond, backed by 17+ years of industry experience.'

export const metadata = createPageMetadata({
  title: 'Heathrow Coach & Minibus Hire with Driver',
  description,
  path: HEATHROW_PATH,
})

export default function HeathrowCoachHirePage() {
  const schema = serviceSchema({
    name: 'Heathrow Coach & Minibus Hire',
    description,
    path: HEATHROW_PATH,
    category: 'Airport Transfers',
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <Navbar />
      <Hero
        badge="Private airport transfers"
        lines={[{ text: 'Heathrow coach', accent: false }, { text: '& minibus hire', accent: true }]}
        subtext="Premium group transfers with professional drivers, flight tracking and a journey planned around your itinerary. Bringing 17+ years of industry experience to every booking."
        imageSrc={AIRPORT_TRANSFER_IMAGES[0]}
      />
      <LandingContent page="heathrow" />
      <Footer />
    </>
  )
}
