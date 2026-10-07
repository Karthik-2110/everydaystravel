import Link from 'next/link'
import { ChevronDown, Phone, MessageCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { createPageMetadata, siteUrl, organisationId } from '../lib/seo'
import { FAQ_GROUPS, ALL_FAQS } from '../data/faqs'
import { PHONE, PHONE_HREF } from '../components/contact/contact-details'
import { WHATSAPP_HREF } from '../components/icons/social'

export const metadata = createPageMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers on booking and quotes, vehicle sizes and capacity, luggage, drivers’ hours, airport transfers, school trips and what happens on the day.',
  path: '/faqs',
})

/**
 * Google narrowed FAQ rich results to authoritative sites, so this is not a
 * bet on star-style snippets. It is here because it states, in machine
 * readable form, what we tell customers — which is what assistants and search
 * features read when they answer on our behalf.
 */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteUrl}/faqs#faq`,
  inLanguage: 'en-GB',
  publisher: { '@id': organisationId },
  mainEntity: ALL_FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />

      <main className="site-container pt-32 lg:pt-40 pb-20">
        <div className="max-w-[820px]">
          <h1
            className="text-white leading-[1.05] tracking-[-0.02em] mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)' }}
          >
            Frequently asked questions
          </h1>
          <p
            className="text-white/60 text-[16px] leading-relaxed mb-10 max-w-[62ch]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            The things people ask us most often, answered straight. If yours is not here,
            call us. Most questions about a journey are quicker to talk through than to
            read about.
          </p>

          {FAQ_GROUPS.map((group) => (
            <section key={group.title} className="mb-12">
              <h2
                className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.18em] uppercase pb-3 mb-2 border-b border-[#EBBA6F]/15"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {group.title}
              </h2>

              {group.faqs.map((faq) => (
                /* A native disclosure, so it opens with the keyboard, is findable
                   by in-page search, and needs no JavaScript to work at all. */
                <details
                  key={faq.question}
                  className="group border-b border-white/[0.07] py-1"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-4 [&::-webkit-details-marker]:hidden">
                    <span
                      className="text-white text-[15.5px] font-medium leading-snug"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden
                      className="text-[#EBBA6F] shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>

                  <div className="pb-5 pr-8">
                    <p
                      className="text-white/65 text-[15px] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {faq.answer}
                    </p>
                    {faq.link && (
                      <Link
                        href={faq.link.href}
                        className="inline-block mt-3 text-[#EBBA6F] text-[14px] underline underline-offset-2 hover:text-[#DDA85E] transition-colors duration-150"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {faq.link.label}
                      </Link>
                    )}
                  </div>
                </details>
              ))}
            </section>
          ))}

          {/* ── Still stuck ── */}
          <section className="rounded-2xl border border-[#EBBA6F]/25 bg-[#0D1221] p-6 sm:p-8">
            <h2
              className="text-white text-[20px] font-semibold mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Still not sure?
            </h2>
            <p
              className="text-white/60 text-[15px] leading-relaxed mb-6 max-w-[54ch]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Tell us what you are planning and we will tell you what it takes. No
              obligation, and no pressure if the answer is that we are not the right fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={PHONE_HREF}
                className="h-11 px-6 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold hover:bg-[#DDA85E] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <Phone size={16} aria-hidden />
                {PHONE}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 text-white text-[14px] font-medium hover:border-[#EBBA6F]/60 hover:text-[#EBBA6F] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <MessageCircle size={16} aria-hidden />
                Message us on WhatsApp
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
