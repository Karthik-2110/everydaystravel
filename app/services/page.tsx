import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServicesGrid from '../components/ServicesGrid'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import { createPageMetadata } from '../lib/seo'

export const metadata = createPageMetadata({
  title: 'Coach & Minibus Hire Services',
  description:
    'Coach and minibus hire across London, Surrey and the UK — airport transfers, corporate travel, weddings, school trips, group travel and private hire.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <Hero
        badge="Our Services"
        lines={[
          { text: 'Transport',     accent: false },
          { text: 'Solutions for', accent: false },
          { text: 'Every Journey', accent: true  },
        ]}
        subtext="From airport transfers to weddings and school trips — we have the right vehicle and the right team for every occasion."
        imageSrc="https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783784630/20260211_134438550_iOS_okfp39.jpg"
      />
      <ServicesGrid />
      <Testimonials />
      <Footer />
    </>
  )
}
