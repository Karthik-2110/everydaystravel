import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FleetCarousel from './components/FleetCarousel'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero
        videoSrc="https://res.cloudinary.com/dckyndryf/video/upload/v1780222799/hero_xgrraa"
        story={[
          'Everydays Travel Limited began in 2009 with a single 16-seater minibus and a clear vision.',
          "Founding director Thaya Nadarajah entered the passenger transport industry at age 23 as a London bus driver, quickly progressing to manage one of the capital's top startup transport companies within four years. Drawing on that rich operational experience, he launched Everydays Travel to deliver an unmatched standard of service.",
          'Today, we have built an elite reputation across London for luxury vehicles, chauffeur-style drivers, and absolute reliability.',
        ]}
        storyCta="Ready to Book Your Group Transport?"
        subtext=""
        showContact
      />
      <FleetCarousel />
      <Testimonials />
      <Footer />
    </>
  )
}
