import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FleetCarousel from './components/FleetCarousel'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero videoSrc="https://res.cloudinary.com/dckyndryf/video/upload/v1780222799/hero_xgrraa" />
      <FleetCarousel />
      <Testimonials />
      <Footer />
    </>
  )
}
