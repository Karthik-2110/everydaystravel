import LegalPage, { Section, SubHeading, P, A, DataTable } from '../components/legal/LegalPage'
import CookieSettingsButton from '../components/CookieSettingsButton'
import { createPageMetadata } from '../lib/seo'
import { LEGAL_UPDATED } from '../components/legal/company-details'
import { GA_MEASUREMENT_ID } from '../lib/analytics'

export const metadata = createPageMetadata({
  title: 'Cookie Policy',
  description:
    'What Everydays Travel stores on your device, why, and how to change or withdraw your consent at any time.',
  path: '/cookies',
})

// Everything the site can place on a device. Keep this in step with the
// categories in `CookieConsent` — the policy is only useful while it is true.
const ROWS: string[][] = [
  [
    'et_cookie_consent',
    'Everydays Travel (first party)',
    'Remembers the cookie choice you made, so we do not ask again on every page and so a refusal is honoured.',
    '6 months',
  ],
  [
    '_ga',
    'Google Analytics, set as a first-party cookie by us',
    'Tells one visitor apart from another so visits can be counted. Only set if you turn Analytics on.',
    '6 months',
  ],
  [
    `_ga_${GA_MEASUREMENT_ID.replace(/^G-/, '')}`,
    'Google Analytics, set as a first-party cookie by us',
    'Holds the state of your visit for the same count. Only set if you turn Analytics on.',
    '6 months',
  ],
  [
    'Google Maps cookies (NID and similar)',
    'Google (third party)',
    'Set by Google when our maps load — either the address suggestions you request by typing into a booking form, or the Contact page map, which waits for your consent.',
    'Set by Google — see their policy',
  ],
]

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" updated={LEGAL_UPDATED}>
      <Section title="The short version">
        <P>
          We store as little as we can. Three things can end up on your device: a cookie
          that remembers the choice you make here, two Google Analytics cookies that count
          visits if you allow them, and the cookies Google sets when one of its maps loads.
          We run no advertising cookies, nothing that follows you to other websites, and we
          do not sell or share what we hold.
        </P>
        <P>
          Nothing optional is stored until you say yes. Refusing is one click, exactly like
          accepting, and you can change your answer whenever you like.
        </P>
        <CookieSettingsButton className="mt-2 h-11 px-6 inline-flex items-center rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold hover:bg-[#DDA85E] transition-colors duration-150">
          Change your cookie settings
        </CookieSettingsButton>
      </Section>

      <Section title="What the law requires of us">
        <P>
          The Privacy and Electronic Communications Regulations (PECR) and the UK GDPR say
          we must tell you what we store on your device, and get your consent before
          storing anything that is not strictly necessary. Consent has to be freely given
          and unambiguous, which means we cannot pre-tick boxes, cannot read continued
          browsing as agreement, and cannot make refusing harder than accepting. You may
          withdraw consent at any point.
        </P>
        <P>
          Cookies are not the only thing covered. The same rules apply to anything that
          reads from or writes to your device, including local storage, session storage and
          cached files. We treat them all the same way.
        </P>
      </Section>

      <Section title="The categories we use">
        <SubHeading>Strictly necessary — always on</SubHeading>
        <P>
          One cookie, recording the choice you made. It is exempt from consent because
          without it we could not remember that you refused, and would have to ask you
          again on every page.
        </P>
        <P>
          The address suggestions on our booking forms sit here too. They only run when you
          start typing an address, they exist to deliver the quote you came to ask for, and
          the form cannot do its job without them &mdash; so we treat them as part of the
          service you requested rather than as something optional. Google sets its own
          cookies at that point.
        </P>

        <SubHeading>Functional — off unless you turn it on</SubHeading>
        <P>
          The interactive Google map on our Contact page. Google sets its own cookies the
          moment that map loads, so it stays out of the page until you say yes. Leave this
          off and we show our address as plain text, with a link you can follow to Google
          Maps yourself if you want to.
        </P>

        <SubHeading>Analytics — off unless you turn it on</SubHeading>
        <P>
          Google Analytics, which counts visits and shows us which pages people actually
          use, so we know what is worth improving. Nothing is loaded and nothing is sent to
          Google until you turn this on. Leave it off and we count nothing.
        </P>
        <P>
          Where we have been able to narrow it, we have. Google Signals and ad
          personalisation are switched off, so the measurement cannot be folded into
          advertising audiences. The two cookies are set to expire after six months rather
          than Google&rsquo;s default two years, so they never outlive the consent that
          allowed them. And if you switch this category off, we delete both cookies and
          stop sending straight away.
        </P>
      </Section>

      <Section title="Everything we can store">
        <DataTable headings={['Name', 'Set by', 'Purpose', 'Expires']} rows={ROWS} />
      </Section>

      <Section title="Changing your mind">
        <P>
          Use the <strong className="text-white/85 font-medium">Cookie settings</strong>{' '}
          link in the footer of any page, or the button above. Your new choice takes effect
          immediately.
        </P>
        <P>
          Turning Analytics off deletes the two Google Analytics cookies there and then,
          and stops the tag sending, without you having to reload the page. Those are set
          on our own domain, so they are ours to clear.
        </P>
        <P>
          The Maps cookies are different: they live on Google&rsquo;s own domain, so we
          cannot delete them for you. Your browser&rsquo;s privacy settings will clear
          them, and every major browser lets you block third-party cookies outright.
        </P>
        <P>
          We ask again after six months, so a choice you made long ago never stands in for
          one you would make today.
        </P>
      </Section>

      <Section title="Questions or complaints">
        <P>
          Email us at <A href="mailto:info@everydaystravel.co.uk">info@everydaystravel.co.uk</A>.
          How we handle the data you send us is set out in our{' '}
          <A href="/privacy">privacy notice</A>. If you are not satisfied with our answer,
          you can complain to the Information Commissioner&rsquo;s Office at{' '}
          <A href="https://ico.org.uk/make-a-complaint/">ico.org.uk</A>.
        </P>
      </Section>
    </LegalPage>
  )
}
