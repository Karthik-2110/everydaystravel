import LegalPage, { Section, P, List, A } from '../components/legal/LegalPage'
import { createPageMetadata } from '../lib/seo'
import { ADDRESS, EMAIL, PHONE, PHONE_HREF } from '../components/contact/contact-details'
import { LEGAL_NAME, LEGAL_UPDATED, COMPANY_NUMBER } from '../components/legal/company-details'

export const metadata = createPageMetadata({
  title: 'Terms of Use',
  description:
    'The terms on which you may use the Everydays Travel website, including what a quote request does and does not commit either of us to.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated={LEGAL_UPDATED}
      intro={
        <P>
          These terms govern your use of this website. They are not the terms of a hire —
          those are agreed with your quotation when you book a journey.
        </P>
      }
    >
      <Section title="Who we are">
        <P>
          This site is operated by {LEGAL_NAME} of {ADDRESS}.
          {COMPANY_NUMBER ? ` We are registered in England and Wales, company number ${COMPANY_NUMBER}.` : ''}{' '}
          You can reach us at <A href={`mailto:${EMAIL}`}>{EMAIL}</A> or{' '}
          <A href={PHONE_HREF}>{PHONE}</A>.
        </P>
        <P>
          By using this site you accept these terms. If you do not accept them, please do
          not use the site.
        </P>
      </Section>

      <Section title="A quote request is not a booking">
        <P>
          This is the part worth reading. Submitting an enquiry through this website does
          not create a contract, and nothing shown on the site is an offer we are bound by.
        </P>
        <List
          items={[
            'An enquiry is a request for a price. We will come back to you with a quotation.',
            'A booking exists only once we have confirmed it to you in writing and any deposit we ask for has been paid.',
            'Vehicles shown on the site illustrate our fleet. The specific vehicle assigned to your journey is confirmed with your booking, and we may substitute a vehicle of equivalent or better specification.',
            'Prices are quoted per journey and hold for the period stated in the quotation.',
          ]}
        />
        <P>
          The terms on which a confirmed hire runs — payment, cancellation, luggage,
          liability and the rest — are set out in our{' '}
          <A href="/conditions-of-hire">conditions of hire</A> and in the version supplied
          with your quotation, which takes precedence over anything on this page.
        </P>
      </Section>

      <Section title="Using the site">
        <P>You may read this site, and use its forms to enquire about travel. You may not:</P>
        <List
          items={[
            'Use the site for anything unlawful, or in a way that could damage, disable or overburden it.',
            'Submit false enquiries, or anybody else’s personal details without their permission.',
            'Scrape, harvest or systematically copy content from the site.',
            'Attempt to gain unauthorised access to any part of the site or the systems behind it.',
          ]}
        />
        <P>
          We may suspend or withdraw access to the site, in whole or in part, without
          notice. We do not guarantee that the site will always be available or free of
          faults.
        </P>
      </Section>

      <Section title="Accuracy">
        <P>
          We take care to keep the site accurate and current, but we do not warrant that it
          is free of errors. Fleet specifications, availability, service descriptions and
          indicative pricing may change. Where accuracy matters to your decision, ask us and
          we will confirm it in writing.
        </P>
      </Section>

      <Section title="Our content">
        <P>
          The text, photography, video, logos and design on this site belong to{' '}
          {LEGAL_NAME} or are used under licence, and are protected by copyright. You may
          view and print pages for your own use in planning travel with us. You may not
          reproduce, republish or use them commercially without our written permission.
        </P>
      </Section>

      <Section title="Links to other sites">
        <P>
          Where we link to another website — a map, a review platform, a social account —
          we do so for your convenience. We do not control those sites and are not
          responsible for their content or their handling of your data.
        </P>
      </Section>

      <Section title="Our liability to you">
        <P>
          Nothing in these terms limits or excludes our liability for death or personal
          injury caused by our negligence, for fraud or fraudulent misrepresentation, or
          for anything else that cannot lawfully be limited. If you are a consumer, nothing
          here affects your statutory rights.
        </P>
        <P>
          Subject to that, we are not liable for loss arising from your use of this site,
          including loss of profit, business or data, or any loss that was not reasonably
          foreseeable when you used the site. Liability arising from a hire is dealt with in
          the conditions of hire, not here.
        </P>
      </Section>

      <Section title="Your data">
        <P>
          What we do with the personal data you give us is set out in our{' '}
          <A href="/privacy">privacy notice</A>, and what we store on your device is set out
          in our <A href="/cookies">cookie policy</A>.
        </P>
      </Section>

      <Section title="Changes">
        <P>
          We may amend these terms. The version published here at the time you use the site
          is the one that applies, and the date at the top tells you when it last changed.
        </P>
      </Section>

      <Section title="Governing law">
        <P>
          These terms are governed by the law of England and Wales, and the courts of
          England and Wales have jurisdiction over any dispute arising from them. If you
          live elsewhere in the United Kingdom, you may bring proceedings in your own
          jurisdiction.
        </P>
      </Section>
    </LegalPage>
  )
}
