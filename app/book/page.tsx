import Image from 'next/image'
import type { Metadata } from 'next'
import { UserCheck, ShieldCheck, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BookingForm from '../components/booking/BookingForm'
import Testimonials from '../components/Testimonials'

export const metadata: Metadata = {
  title: 'Book Your Journey | Everyday Travels',
  description:
    'Tell us about your trip and we will prepare a personalised quotation — chauffeur cars, luxury minibuses and executive coaches across the UK.',
}

const HERO_IMAGE =
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783785511/IMG_6138_n9khty.jpg'

const CHIPS = [
  { icon: UserCheck,   label: 'Professional Drivers' },
  { icon: ShieldCheck, label: 'Luxury Fleet'         },
  { icon: Clock,       label: '24/7 Support'         },
]

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      {/* ── Hero band ─────────────────────────────────────────────────────── */}
      <section aria-label="Book your journey" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0F1C] via-[#0C0F1C]/85 to-[#0C0F1C]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F1C] via-transparent to-[#0C0F1C]/70" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-12 lg:pt-36 lg:pb-14">
          <h1
            className="text-white leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)' }}
          >
            <span className="text-[#EBBA6F]">Book</span> Your Journey
          </h1>

          <div className="w-14 h-px bg-[#EBBA6F]/70 mt-5 mb-5" aria-hidden />

          <p
            className="text-white/60 text-[15px] leading-relaxed max-w-[520px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tell us more about your trip and we&rsquo;ll prepare a personalised quotation.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-7 sm:divide-x sm:divide-white/[0.12]">
            {CHIPS.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5 sm:pr-5 last:sm:pr-0">
                <c.icon size={20} strokeWidth={1} className="text-[#EBBA6F] shrink-0" aria-hidden />
                <span
                  className="text-white/75 text-[13px] font-medium"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Form ──────────────────────────────────────────────────────────── */}
      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
        <BookingForm />
      </main>

      <Testimonials />

      <Footer />
    </div>
  )
}
