import Image from 'next/image'
import type { Metadata } from 'next'
import {
  ShieldCheck, Globe, Clock, Sparkles,
  Handshake, HeartHandshake, Route, Gem, Compass, Lightbulb,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatBand from '../components/StatBand'
import Testimonials from '../components/Testimonials'
import SplitSection from '../components/about/SplitSection'

export const metadata: Metadata = {
  title: 'About Us | Everydays Travel',
  description:
    'Our vision, mission and promise — coach and minibus hire built on personalised service, trusted partnerships and the belief that every journey matters.',
}

const PHOTO = (path: string) =>
  `https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1800,c_limit/${path}`

const HERO_PHOTO    = PHOTO('v1783784686/DSC09063_xjmaio.jpg')
const VISION_PHOTO  = PHOTO('v1783783988/DSC09031_yjmhzx.jpg')
const MISSION_PHOTO = PHOTO('v1783785511/IMG_6138_n9khty.jpg')
const PROMISE_PHOTO = PHOTO('v1783784630/20260211_134438550_iOS_okfp39.jpg')

const COMMITMENTS: { icon: LucideIcon; text: string }[] = [
  { icon: HeartHandshake, text: 'Delivering exceptional service and personalised travel experiences.' },
  { icon: Handshake,      text: 'Building strong, long-term relationships with clients and international travel partners.' },
  { icon: Route,          text: 'Providing reliable, flexible, and value-driven travel solutions.' },
  { icon: Gem,            text: 'Maintaining the highest standards of professionalism, quality, and integrity.' },
  { icon: Compass,        text: 'Promoting authentic destinations, cultures, and experiences responsibly.' },
  { icon: Lightbulb,      text: 'Continuously improving our services through innovation, technology, and customer feedback.' },
]

const STATS = [
  { icon: ShieldCheck, label: 'Fully licensed & insured' },
  { icon: Globe,       label: 'UK & Europe coverage' },
  { icon: Clock,       label: '24/7 support' },
  { icon: Sparkles,    label: 'Trusted since 2014' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      {/* ── Hero band ─────────────────────────────────────────────────────── */}
      <section aria-label="About Everydays Travel" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={HERO_PHOTO} alt="" fill priority unoptimized className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0F1C] via-[#0C0F1C]/85 to-[#0C0F1C]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F1C] via-transparent to-[#0C0F1C]/70" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-14 lg:pt-36 lg:pb-16">
          <p
            className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.2em] uppercase mb-5"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            About Us
          </p>

          <h1
            className="text-white leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)' }}
          >
            Every journey <span className="text-[#EBBA6F]">matters</span>
          </h1>

          <div className="w-14 h-px bg-[#EBBA6F]/70 mt-6 mb-6" aria-hidden />

          <p
            className="text-white/60 text-[15px] leading-relaxed max-w-[560px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            We have spent more than a decade moving people across the UK and Europe — weddings, school trips,
            airport runs, tours. The vehicles change. The care does not.
          </p>
        </div>
      </section>

      <main>

        {/* ── Vision ──────────────────────────────────────────────────────── */}
        <SplitSection
          kicker="Our Vision"
          heading="A travel partner you can rely on, anywhere"
          imageSrc={VISION_PHOTO}
          imageAlt="The Everydays Travel fleet"
        >
          <p>
            To be a trusted and recognised global travel partner, inspiring people to explore the world through
            exceptional experiences, personalised service, and seamless travel solutions.
          </p>
          <p>
            We aspire to build lasting relationships with our clients and partners while setting high standards of
            quality, reliability, and professionalism in the travel industry.
          </p>
        </SplitSection>

        {/* ── Mission ─────────────────────────────────────────────────────── */}
        <SplitSection
          kicker="Our Mission"
          heading="Memorable journeys, made hassle-free"
          imageSrc={MISSION_PHOTO}
          imageAlt="An Everydays Travel coach at a wedding venue"
          reverse
        >
          <p>
            At Everydays Travel, our mission is to create memorable and hassle-free travel experiences tailored to
            the unique needs of every client.
          </p>
          <p>
            We combine local expertise, trusted partnerships, personalised attention, and professional service to
            deliver reliable travel solutions from planning to completion.
          </p>
        </SplitSection>

        {/* ── Commitments ─────────────────────────────────────────────────── */}
        <section
          aria-label="We are committed to"
          className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 lg:py-20"
        >
          <div className="flex flex-col items-center text-center mb-10 lg:mb-12">
            <p
              className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              What we stand for
            </p>
            <h2
              className="text-white leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}
            >
              We are committed to
            </h2>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMITMENTS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="bg-[#0D1221] rounded-2xl border border-white/[0.08] p-6 flex flex-col gap-4 transition-colors duration-200 hover:border-[#EBBA6F]/30"
              >
                <span className="w-11 h-11 rounded-full border border-[#EBBA6F]/25 bg-[#EBBA6F]/[0.06] flex items-center justify-center shrink-0">
                  <Icon size={19} strokeWidth={1.25} className="text-[#EBBA6F]" aria-hidden />
                </span>
                <p
                  className="text-white/65 text-[14.5px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Promise ─────────────────────────────────────────────────────── */}
        <section aria-label="Our promise" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image src={PROMISE_PHOTO} alt="" fill unoptimized className="object-cover object-center" />
            <div className="absolute inset-0 bg-[#04060E]/85" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0C0F1C] via-transparent to-[#0C0F1C]" />
          </div>

          <div className="relative max-w-[900px] mx-auto px-5 sm:px-8 py-20 lg:py-28 text-center">
            <p
              className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Our Promise
            </p>

            <blockquote
              className="text-white leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.4rem, 5.4vw, 4.4rem)' }}
            >
              Every journey matters.
            </blockquote>

            <div className="w-14 h-px bg-[#EBBA6F]/70 mx-auto mt-8 mb-7" aria-hidden />

            <p
              className="text-white/70 text-[16px] sm:text-[17px] leading-relaxed italic max-w-[620px] mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              We are committed to making every journey seamless, memorable, and truly worthwhile.
            </p>
          </div>
        </section>

        <StatBand stats={STATS} />

      </main>

      <Testimonials />

      <Footer />
    </div>
  )
}
