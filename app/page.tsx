import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FleetCarousel from './components/FleetCarousel'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FleetCarousel />
      <Testimonials />
      <Footer />
    </>
  )
}
