import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Testimonials from '../components/Testimonials'

export const metadata: Metadata = {
  title: 'Reviews | Everydays Travel',
  description:
    'What our clients say — real reviews from weddings, school trips, airport transfers and corporate travel across the UK and Europe.',
}

const HERO_PHOTO =
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783787064/IMG_6170_fxbudt.jpg'

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      {/* ── Hero band ─────────────────────────────────────────────────────── */}
      <section aria-label="Client reviews" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={HERO_PHOTO} alt="" fill priority unoptimized className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0F1C] via-[#0C0F1C]/85 to-[#0C0F1C]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F1C] via-transparent to-[#0C0F1C]/70" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-12 lg:pt-36 lg:pb-14">
          <p
            className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.2em] uppercase mb-5"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Reviews
          </p>

          <h1
            className="text-white leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)' }}
          >
            What our <span className="text-[#EBBA6F]">clients say</span>
          </h1>

          <div className="w-14 h-px bg-[#EBBA6F]/70 mt-6 mb-6" aria-hidden />

          <p
            className="text-white/60 text-[15px] leading-relaxed max-w-[560px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Every review below is a real one, written by a real customer on a public platform. Nothing here was
            written for this website.
          </p>
        </div>
      </section>

      <main>

        {/* ── Every review ────────────────────────────────────────────────── */}
        <Testimonials />

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20 text-center">
          <h2
            className="text-white leading-[1.05] tracking-[-0.02em] mb-5"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)' }}
          >
            Ready to write the next one?
          </h2>
          <p
            className="text-white/55 text-[15px] leading-relaxed max-w-[520px] mx-auto mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tell us about your journey and we&rsquo;ll prepare a personalised quotation.
          </p>
          <Link
            href="/book"
            className="h-12 px-8 inline-flex items-center justify-center gap-2 bg-[#EBBA6F] text-[#0C0F1C] text-[14.5px] font-semibold rounded-lg hover:bg-[#E2B36A] active:bg-[#D4A85E] transition-colors duration-150"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Book your journey
            <ArrowRight size={16} aria-hidden />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  )
}
