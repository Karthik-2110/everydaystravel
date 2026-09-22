import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FleetCarousel from './components/FleetCarousel'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      {/* The story copy that used to sit here is coming back once the card
          layout is settled — pass `story` and `storyCta` again to restore it. */}
      <Hero
        videoSrc="https://res.cloudinary.com/dckyndryf/video/upload/v1780222799/hero_xgrraa"
        lines={[
          { text: 'Choose Everydays Travel', accent: false },
          { text: 'for coach hire in London', accent: true },
        ]}
        subtext=""
        inlineForm
      />
      <FleetCarousel />
      <Testimonials />
      <Footer />
    </>
  )
}
