import LegalPage, { Section, P, List, A, DataTable } from '../components/legal/LegalPage'
import CookieSettingsButton from '../components/CookieSettingsButton'
import { createPageMetadata } from '../lib/seo'
import { ADDRESS, EMAIL, PHONE, PHONE_HREF } from '../components/contact/contact-details'
import { LEGAL_NAME, LEGAL_UPDATED, ICO_REGISTRATION, COMPANY_NUMBER } from '../components/legal/company-details'

export const metadata = createPageMetadata({
  title: 'Privacy Notice',
  description:
    'What personal data Everydays Travel collects when you request a quote, why we hold it, how long we keep it, who we share it with, and the rights you have over it.',
  path: '/privacy',
})

// Why we are allowed to hold each kind of data. Under the UK GDPR a lawful
// basis has to be identified per purpose, not per company, which is why this
// is a grid rather than a sentence.
const LAWFUL_BASES: string[][] = [
  [
    'Quote and booking enquiries',
    'Name, email, phone, journey details (pickup, destination, dates, times, passenger numbers, vehicle, company name where given)',
    'To price your journey, reply to you, and arrange the hire',
    'Taking steps at your request before entering a contract, and performing that contract',
  ],
  [
    'Replying to a general enquiry',
    'Name, email, phone, your message',
    'To answer what you asked',
    'Our legitimate interest in responding to people who contact us',
  ],
  [
    'Booking and payment records',
    'Enquiry details, plus the record of the hire itself',
    'To run the business and meet our tax and accounting obligations',
    'Legal obligation, and our legitimate interest in keeping proper records',
  ],
  [
    'Optional cookies',
    'Whatever the relevant third party sets — see the cookie policy',
    'To count visits with Google Analytics, and to load the map on our Contact page',
    'Your consent, which you can withdraw at any time',
  ],
]

const PROCESSORS: string[][] = [
  ['Resend', 'Delivers the enquiry email to our inbox', 'United States'],
  ['Vercel', 'Hosts the website and runs the form endpoints', 'United States / EU'],
  ['Google', 'Address suggestions on the forms; visit measurement and the Contact page map, if you allow them', 'United States'],
  ['Cloudinary', 'Serves the photography and video on the site', 'United States / EU'],
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Notice"
      updated={LEGAL_UPDATED}
      intro={
        <P>
          This notice explains what we do with personal data when you ask us for a quote,
          contact us, or simply read this website. It is written to be understood rather
          than to cover us, so if anything here is unclear, ask and we will explain it.
        </P>
      }
    >
      <Section title="Who is responsible for your data">
        <P>
          {LEGAL_NAME} is the data controller — the business that decides why and how your
          data is used. We operate from {ADDRESS}.
        </P>
        {COMPANY_NUMBER && <P>We are registered in England and Wales, company number {COMPANY_NUMBER}.</P>}
        {ICO_REGISTRATION && (
          <P>
            We are registered with the Information Commissioner&rsquo;s Office under
            registration number {ICO_REGISTRATION}.
          </P>
        )}
        <P>
          For anything about this notice, email <A href={`mailto:${EMAIL}`}>{EMAIL}</A> or call{' '}
          <A href={PHONE_HREF}>{PHONE}</A>.
        </P>
      </Section>

      <Section title="What we collect, and why we are allowed to">
        <P>
          We only ask for what we need to quote and run a journey. We do not collect
          special category data, we do not buy data from anyone, and we do not build
          advertising or marketing profiles of visitors.
        </P>
        <DataTable
          headings={['Why', 'What', 'What we do with it', 'Our lawful basis']}
          rows={LAWFUL_BASES}
        />
        <P>
          Our forms ask for a phone number as well as an email. That is so we can reach you
          quickly about a journey; giving it is optional on the quote form.
        </P>
      </Section>

      <Section title="Technical data">
        <P>
          Our hosting provider keeps standard server logs — IP address, browser, the pages
          requested — which are used to keep the site running and secure, and are not used
          to identify you or to advertise to you. The only other storage on your device is
          covered by our <A href="/cookies">cookie policy</A>, and nothing optional is set
          without your consent.
        </P>
        <P>
          If you agree to the analytics cookie, we use Google Analytics to count visits and
          see which pages get used. We read it as totals, not as individuals; Google&rsquo;s
          advertising features are switched off, so it cannot feed ad targeting; and turning
          the category off deletes those cookies and stops the measurement immediately.
        </P>
        <CookieSettingsButton className="mt-1 mb-2 h-10 px-5 inline-flex items-center rounded-full border border-white/25 text-white text-[13.5px] font-medium hover:border-[#EBBA6F]/60 hover:text-[#EBBA6F] transition-colors duration-150" />
      </Section>

      <Section title="Who else sees it">
        <P>
          We do not sell your data, and we do not share it for anyone else&rsquo;s
          marketing. It is seen by the people at {LEGAL_NAME} who need it to answer you and
          run your journey, and by the suppliers below, who process it on our instructions
          and may not use it for their own purposes.
        </P>
        <DataTable headings={['Supplier', 'What they do', 'Where']} rows={PROCESSORS} />
        <P>
          Where a supplier processes data outside the UK, that transfer is covered by UK
          adequacy regulations or by the International Data Transfer Agreement, which is
          the safeguard the UK GDPR requires.
        </P>
        <P>
          We will also disclose data where the law requires it — for example to HMRC, or to
          the police in response to a lawful request.
        </P>
      </Section>

      <Section title="How long we keep it">
        <P>
          We do not keep enquiries indefinitely on the chance they become useful.
        </P>
        <List
          items={[
            <>
              <strong className="text-white/85 font-medium">Enquiries that do not become a
              booking</strong> — kept for 24 months, then deleted. Long enough to recognise
              you if you come back, short enough not to hoard.
            </>,
            <>
              <strong className="text-white/85 font-medium">Bookings that go ahead</strong> —
              kept for 6 years after the end of the tax year they fall in, because tax and
              accounting law requires it.
            </>,
            <>
              <strong className="text-white/85 font-medium">Your cookie choice</strong> —
              6 months, after which we ask again.
            </>,
          ]}
        />
      </Section>

      <Section title="Your rights">
        <P>
          The UK GDPR gives you rights over your data, and exercising them is free and
          should be straightforward. You can ask us to:
        </P>
        <List
          items={[
            <><strong className="text-white/85 font-medium">Give you a copy</strong> of the data we hold about you.</>,
            <><strong className="text-white/85 font-medium">Correct it</strong> if it is wrong or incomplete.</>,
            <><strong className="text-white/85 font-medium">Delete it</strong>, where we have no continuing reason to hold it.</>,
            <><strong className="text-white/85 font-medium">Restrict</strong> what we do with it while a question about it is resolved.</>,
            <><strong className="text-white/85 font-medium">Hand it over</strong> to you or another provider in a portable format.</>,
            <><strong className="text-white/85 font-medium">Stop</strong> processing based on our legitimate interests, where you object to it.</>,
            <><strong className="text-white/85 font-medium">Withdraw consent</strong> you have given, at any time, as easily as you gave it.</>,
          ]}
        />
        <P>
          Email <A href={`mailto:${EMAIL}`}>{EMAIL}</A> and we will respond within one
          month. We may ask you to confirm who you are first, so that we do not hand your
          data to somebody else.
        </P>
      </Section>

      <Section title="Complaints">
        <P>
          If you are unhappy with how we have handled your data, tell us first and we will
          try to put it right. You also have the right to complain to the Information
          Commissioner&rsquo;s Office at{' '}
          <A href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</A> or
          on 0303 123 1113. You do not have to come to us first.
        </P>
      </Section>

      <Section title="Security">
        <P>
          The site runs over HTTPS, enquiry forms are validated before anything is sent, and
          access to the inbox that receives them is limited to the people who need it. No
          system is perfectly secure, but we do not store card details on this site, and
          payment is handled separately.
        </P>
      </Section>

      <Section title="Children">
        <P>
          This site is aimed at people booking travel, not at children, and we do not
          knowingly collect data from anyone under 16. We do of course carry children as
          passengers — their details reach us from the adult or the school making the
          booking, and are held under the same terms as the rest of that booking.
        </P>
      </Section>

      <Section title="Changes to this notice">
        <P>
          If we change how we use data, we will update this page and change the date at the
          top. Where the change is significant, we will say so plainly rather than rely on
          you noticing.
        </P>
      </Section>
    </LegalPage>
  )
}
