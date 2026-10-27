import Image from 'next/image'
import Link from 'next/link'
import Navbar from './Navbar'
import Footer from './Footer'
import { serviceSchema, siteUrl } from '../lib/seo'
import FleetFilm from './FleetFilm'
import type { BusinessService } from '../data/business-services'

export default function BusinessServicePage({ service }: { service: BusinessService }) {
  const path = service.path ?? `/services/${service.slug}`
  const schema = serviceSchema({ name: service.title, description: service.description, path, category: 'Services' })
  if (service.path) {
    schema[1].itemListElement = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: service.title, item: `${siteUrl}${path}` },
    ]
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <Navbar />
      <main>
        <header className="site-container pt-36 pb-12 lg:pt-44 lg:pb-16">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/65">
            <Link href="/" className="underline underline-offset-4">Home</Link><span aria-hidden="true"> / </span>
            {!service.path && <><Link href="/services" className="underline underline-offset-4">Services</Link><span aria-hidden="true"> / </span></>}
            <span aria-current="page">{service.title}</span>
          </nav>
          <h1 className="max-w-[19ch] text-4xl sm:text-6xl lg:text-7xl leading-[1.08] font-medium tracking-tight text-[#EBBA6F]">{service.title}</h1>
          <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
            <p className="max-w-[65ch] text-lg leading-relaxed text-white/75">{service.intro}</p>
            <Link href="/book" className="shrink-0 self-start rounded-full bg-[#EBBA6F] px-7 py-4 font-semibold text-[#0C0F1C] hover:bg-[#DDA85E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBBA6F]">Plan your journey</Link>
          </div>
        </header>
        <FleetFilm film={service.hero} />
        {service.sections.map((section, index) => (
          <section key={section.heading}>
            <div className="site-container py-12 lg:py-20 grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
              <h2 className="max-w-[25ch] text-3xl sm:text-4xl leading-tight font-medium text-white/95">{section.heading}</h2>
              <div>
                <p className="max-w-[70ch] text-base sm:text-lg leading-relaxed text-white/75">{section.text}</p>
                {section.links && <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-4">{section.links.map(link => <li key={link.href}><Link href={link.href} className="text-[#EBBA6F] underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBBA6F]">{link.label}</Link></li>)}</ul>}
              </div>
            </div>
            {index === 1 && <FleetFilm film={service.cabin} />}
            {index === 3 && <div className="relative w-full aspect-[4/3] sm:aspect-[21/9]"><Image src={service.image} alt={service.imageAlt} fill unoptimized sizes="100vw" className="object-cover" /></div>}
          </section>
        ))}
        <section className="site-container py-16 lg:py-24 border-t border-white/10">
          <h2 className="max-w-[25ch] text-3xl sm:text-5xl font-medium text-[#EBBA6F]">{service.closing}</h2>
          <p className="mt-6 mb-8 max-w-[65ch] text-lg leading-relaxed text-white/75">Premium vehicles, professional drivers and 17+ years of industry experience. Tell us what you need, and we will discuss a service shaped around your group.</p>
          <Link href="/contact" className="inline-flex rounded-full bg-[#EBBA6F] px-7 py-4 font-semibold text-[#0C0F1C] hover:bg-[#DDA85E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBBA6F]">Speak to our team</Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
