import Link from 'next/link'
import Navbar from '../../components/Navbar'
import LandingContent from '../../components/LandingContent'
import Footer from '../../components/Footer'
import FleetFilm from '../../components/FleetFilm'
import { BUSINESS_SERVICES } from '../../data/business-services'
import { createPageMetadata, organisationId, siteUrl } from '../../lib/seo'
import { PRICING_PATH } from '../../data/seo-pages'

const title = 'London Coach Hire Pricing Guide'
const description = 'Understand what goes into a tailored London coach hire quote. Premium vehicles, professional drivers and thoughtful planning, backed by 17+ years of industry experience.'

export const metadata = createPageMetadata({ title, description, path: PRICING_PATH })

export default function LondonCoachHirePricingGuide() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${siteUrl}${PRICING_PATH}#webpage`,
      name: title,
      description,
      url: `${siteUrl}${PRICING_PATH}`,
      inLanguage: 'en-GB',
      publisher: { '@id': organisationId },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: title, item: `${siteUrl}${PRICING_PATH}` },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <Navbar />
      <main>
        <header className="site-container pt-36 pb-16 lg:pt-44 lg:pb-24">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/70">
            <Link href="/" className="underline underline-offset-4">Home</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">London coach hire pricing guide</span>
          </nav>
          <div className="max-w-[75ch]">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08] text-white/95">
                London coach hire.<br /><span className="text-[#EBBA6F]">What goes into your quote.</span>
              </h1>
              <p className="mt-7 max-w-[65ch] text-lg leading-relaxed text-white/75">
                A premium journey starts with the right vehicle, a professional driver and a plan that fits your day. With 17+ years of industry experience, we help you understand the service behind your tailored quote.
              </p>
              <Link href="/book" className="mt-8 inline-flex rounded-full bg-[#EBBA6F] px-7 py-4 font-semibold text-[#0C0F1C] hover:bg-[#DDA85E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBBA6F]">
                Discuss your journey
              </Link>
            </div>

          </div>
        </header>
        <FleetFilm film={{ ...BUSINESS_SERVICES['staff-shuttles'].hero, caption: 'Explore the Everydays Travel fleet for premium group journeys.' }} />
        <LandingContent page="london-pricing" />
      </main>
      <Footer />
    </>
  )
}
