import type { Metadata } from 'next'
import Image from 'next/image'
import { EXECUTIVE_COACHES, LUXURY_MINIBUSES } from '../data/fleet'
import Navbar from '../components/Navbar'
import ChristmasSnow from '../components/ChristmasSnow'
import { ArrowRight, Minus, Pin, Plus, ShieldCheck, Snowflake } from 'lucide-react'
import ChristmasQuoteForm from './ChristmasQuoteForm'
import styles from './christmas.module.css'

const title = 'Christmas Coach & Minibus Hire'
const campaignCoach = EXECUTIVE_COACHES[1]
const questions = [
  {
    title: 'Can we book a return journey?',
    answer: 'Yes. Select Return on the form and we’ll confirm your return pickup time when we prepare the quote.',
  },
  {
    title: 'What if I’m unsure which vehicle to choose?',
    answer: 'Send us your passenger count and route. We’ll suggest a coach or minibus that fits your group.',
  },
  {
    title: 'What happens after I request a quote?',
    answer: 'We’ll confirm availability and prepare a personalised quote for your Christmas dinner or party transport.',
  },
]

const description = 'Planning a Christmas dinner or party? Get 15% off your quoted coach or minibus hire price.'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['Christmas party transport', 'Christmas coach hire', 'festive minibus hire'],
  alternates: { canonical: '/christmas', languages: { 'en-GB': '/christmas' } },
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_GB',
    url: '/christmas',
    images: [{ url: campaignCoach.image, alt: campaignCoach.name }],
  },
}

const campaignFleet = [
  { vehicle: LUXURY_MINIBUSES[0], note: 'A comfortable choice for small teams and family gatherings.' },
  { vehicle: EXECUTIVE_COACHES[0], note: 'Room for a bigger office party, with one pickup plan for the group.' },
  { vehicle: EXECUTIVE_COACHES[3], note: 'Bring a large group to the same venue in one coach.' },
]

function QuoteLink({ onPaper = false }: { onPaper?: boolean }) {
  return (
    <a href="#christmas-quote" className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${onPaper ? 'bg-[#821D2B] text-white hover:bg-[#6F1422] focus-visible:outline-[#821D2B]' : 'bg-[#FAEBD9] text-[#6F1422] hover:bg-white focus-visible:outline-white'}`}>
      Get a Christmas quote <ArrowRight size={16} aria-hidden />
    </a>
  )
}

export default function ChristmasPage() {
  return (
    <>
      <Navbar surfaceColor="#123A2A" />
      <main className="relative isolate flex flex-1 flex-col overflow-hidden text-white">
        <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden motion-reduce:hidden">
          <ChristmasSnow />
        </div>

        <section aria-labelledby="christmas-offer" className={styles.redSection}>
          <div className="site-header-clearance mx-auto grid w-full max-w-7xl items-center gap-9 px-5 pb-14 sm:px-10 sm:pb-20 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em]">
                <Snowflake size={15} aria-hidden />
                Christmas party transport
              </p>
              <h1 id="christmas-offer" className="mt-5 max-w-[12ch] text-[clamp(2.6rem,5.3vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                Get the whole party there.
              </h1>
              <p className="mb-7 mt-5 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
                Hire a coach or minibus with a driver for your Christmas dinner or party and get <strong className="font-semibold text-white">15% off your quoted price.</strong>
              </p>
              <QuoteLink />
            </div>
            <figure className={`${styles.fleetPhoto} relative mx-1 bg-[#FAEBD9] p-2 pb-3 text-[#153F2C] sm:mx-2 sm:p-3`}>
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={campaignCoach.image}
                  alt={`${campaignCoach.name} available for private group hire`}
                  fill
                  sizes="(min-width: 1024px) 42vw, 86vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 pt-2 text-xs font-semibold sm:text-sm">{campaignCoach.name}</figcaption>
              <span className={styles.offerStamp} aria-hidden>15% OFF</span>
            </figure>
          </div>
        </section>

        <section aria-labelledby="christmas-journey" className={`${styles.greenSection} relative px-5 py-12 sm:px-10 sm:py-16`}>
          <div className="mx-auto max-w-6xl">
            <h2 id="christmas-journey" className="text-3xl font-semibold tracking-tight text-[#FAEBD9] sm:text-4xl">Find the right ride for your party</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              From a small Christmas dinner to a full office party, tell us how many are travelling and we’ll suggest a vehicle for your group.
            </p>
            <div className="relative isolate mb-8 mt-10">
              <svg aria-hidden="true" className={styles.fleetTrail} viewBox="0 0 1000 350" preserveAspectRatio="none" fill="none">
                <path d="M -40 130 C 140 40 230 320 410 258 S 650 58 778 145 S 911 295 1040 182" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 11" vectorEffect="non-scaling-stroke" />
              </svg>
              <ol className={styles.fleetGrid}>
                {campaignFleet.map(({ vehicle, note }) => (
                  <li key={vehicle.slug} className={styles.fleetStop}>
                    <figure className={`${styles.fleetPhoto} relative bg-[#FAEBD9] p-2 pb-5 sm:p-3 sm:pb-6`}>
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <Image src={vehicle.image} alt={vehicle.name} fill sizes="(min-width: 768px) 29vw, 86vw" className="object-cover" />
                      </div>
                    </figure>
                    <div className={styles.paperNote}>
                      <Pin size={23} className={styles.paperPin} fill="currentColor" aria-hidden />
                      <h3 className="text-lg font-semibold leading-tight">{vehicle.name}</h3>
                      <p className="mt-1 text-xs font-semibold text-[#821D2B]">{vehicle.seats}</p>
                      <p className="mt-2 text-sm leading-relaxed">{note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mb-4 flex items-center gap-2 text-sm text-white/85">
              <ShieldCheck size={17} className="shrink-0" aria-hidden />
              Professional drivers and fully licensed, insured transport.
            </p>
            <QuoteLink />
          </div>
        </section>

        <section aria-label="Christmas quote" className={`${styles.redSection} relative px-5 py-12 sm:px-10 sm:py-16`}>
          <div className="mx-auto max-w-3xl">
            <ChristmasQuoteForm />
          </div>
        </section>

        <section aria-labelledby="christmas-faqs" className={`${styles.greenSection} relative px-5 py-12 sm:px-10 sm:py-16`}>
          <div className="mx-auto max-w-6xl">
            <h2 id="christmas-faqs" className="mb-8 text-center text-3xl font-semibold tracking-tight text-[#FAEBD9] sm:text-4xl">Christmas transport FAQs</h2>
            <div className="grid items-start gap-9 md:grid-cols-[1.25fr_1fr] md:gap-12">
              <div className="grid gap-3">
                {questions.map(({ title, answer }) => (
                  <details key={title} className="group rounded-md border border-[#FAEBD9]/50 px-4 sm:px-5">
                    <summary className={`${styles.faqSummary} flex min-h-14 cursor-pointer items-center justify-between gap-3 py-3 text-sm font-semibold text-white sm:text-base`}>
                      {title}
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#A52434] text-[#FAEBD9]" aria-hidden>
                        <Plus size={16} className="group-open:hidden" />
                        <Minus size={16} className="hidden group-open:block" />
                      </span>
                    </summary>
                    <p className="pb-4 pr-8 text-sm leading-relaxed text-white/85">{answer}</p>
                  </details>
                ))}
              </div>
              <div className="mx-auto w-full max-w-sm px-2 pt-2">
                <figure className={`${styles.fleetPhoto} relative bg-[#FAEBD9] p-2 pb-6 sm:p-3 sm:pb-7`}>
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image src={EXECUTIVE_COACHES[2].image} alt={EXECUTIVE_COACHES[2].name} fill sizes="(min-width: 768px) 34vw, 90vw" className="object-cover" />
                  </div>
                </figure>
                <div className={styles.paperNote}>
                  <Pin size={23} className={styles.paperPin} fill="currentColor" aria-hidden />
                  <p className="mb-3 text-base font-semibold">Ready to sort your Christmas transport?</p>
                  <QuoteLink onPaper />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer aria-labelledby="christmas-footer-title" className={`${styles.redSection} border-t border-[#FAEBD9]/20 px-5 py-12 text-white sm:px-10 sm:py-16`}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#FAEBD9]">A note from Everydays Travel</p>
          <h2 id="christmas-footer-title" className="text-3xl font-semibold tracking-tight text-[#FAEBD9] sm:text-4xl">
            Bring your favourite people together this Christmas
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            Thinking of hosting a Christmas dinner, an office party or a festive get-together? We’d love to help you get everyone there. We’re Everydays Travel, a London coach and minibus hire team, and we’ll guide you through choosing a vehicle, planning pickups and getting everyone home.
          </p>
          <p className="mb-6 mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            Tell us what you have in mind, even if you’re still working out the details. We’ll help you make a plan so you can enjoy the celebration too.
          </p>
          <QuoteLink />
        </div>
      </footer>
    </>
  )
}
