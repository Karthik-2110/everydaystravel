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
          "Founding director Thaya Nadarajah started out at 23 as a London bus driver, and within four years was managing one of the capital's leading startup transport companies. He built Everydays Travel on that experience, to set a higher standard of service.",
          'Today we hold an elite reputation across London for luxury vehicles, chauffeur-style drivers and absolute reliability.',
        ]}
        storyCta="Ready to book your group transport?"
        subtext=""
        showContact
      />
      <FleetCarousel />
      <Testimonials />
      <Footer />
    </>
  )
}
