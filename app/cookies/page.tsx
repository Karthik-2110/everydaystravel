import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CookieSettingsButton from '../components/CookieSettingsButton'
import { createPageMetadata } from '../lib/seo'

export const metadata = createPageMetadata({
  title: 'Cookie Policy',
  description:
    'What Everydays Travel stores on your device, why, and how to change or withdraw your consent at any time.',
  path: '/cookies',
})

// Everything the site can place on a device. Keep this in step with the
// categories in `CookieConsent` — the policy is only useful while it is true.
const ROWS: { name: string; provider: string; purpose: string; duration: string }[] = [
  {
    name:     'et_cookie_consent',
    provider: 'Everydays Travel (first party)',
    purpose:  'Remembers the cookie choice you made, so we do not ask again on every page and so a refusal is honoured.',
    duration: '6 months',
  },
  {
    name:     'Google Maps cookies (NID and similar)',
    provider: 'Google (third party)',
    purpose:  'Set by Google when our maps load — either the address suggestions you request by typing into a booking form, or the Contact page map, which waits for your consent.',
    duration: 'Set by Google — see their policy',
  },
]

const SECTION = 'mb-10'
const H2 = 'text-white text-[20px] font-semibold mb-3'
const P  = 'text-white/65 text-[15px] leading-relaxed mb-3 max-w-[70ch]'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      <main className="site-container pt-32 lg:pt-40 pb-20">
        <h1
          className="text-white leading-[1.05] tracking-[-0.02em] mb-4"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)' }}
        >
          Cookie Policy
        </h1>
        <p className="text-white/45 text-[13px] mb-10" style={{ fontFamily: 'var(--font-ui)' }}>
          Last updated 30 September 2026
        </p>

        <section className={SECTION}>
          <h2 className={H2} style={{ fontFamily: 'var(--font-ui)' }}>The short version</h2>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            We store as little as we can. Only two things are ever placed on your device:
            a cookie that remembers your choice here, and the cookies Google sets when one
            of its maps loads. We run no advertising or tracking cookies, and we do not
            sell or share what we hold.
          </p>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            Nothing optional is stored until you say yes. Refusing is one click, exactly
            like accepting, and you can change your answer whenever you like.
          </p>
          <CookieSettingsButton
            className="mt-2 h-11 px-6 inline-flex items-center rounded-full bg-[#EBBA6F] text-[#0C0F1C] text-[14px] font-semibold hover:bg-[#DDA85E] transition-colors duration-150"
          >
            Change your cookie settings
          </CookieSettingsButton>
        </section>

        <section className={SECTION}>
          <h2 className={H2} style={{ fontFamily: 'var(--font-ui)' }}>What the law requires of us</h2>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            The Privacy and Electronic Communications Regulations (PECR) and the UK GDPR
            say we must tell you what we store on your device, and get your consent before
            storing anything that is not strictly necessary. Consent has to be freely
            given and unambiguous, which means we cannot pre-tick boxes, cannot read
            continued browsing as agreement, and cannot make refusing harder than
            accepting. You may withdraw consent at any point.
          </p>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            Cookies are not the only thing covered. The same rules apply to anything that
            reads from or writes to your device, including local storage, session storage
            and cached files. We treat them all the same way.
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2} style={{ fontFamily: 'var(--font-ui)' }}>The categories we use</h2>

          <h3 className="text-white text-[15px] font-medium mb-1.5 mt-5" style={{ fontFamily: 'var(--font-ui)' }}>
            Strictly necessary — always on
          </h3>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            One cookie, recording the choice you made. It is exempt from consent because
            without it we could not remember that you refused, and would have to ask you
            again on every page.
          </p>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            The address suggestions on our booking forms sit here too. They only run when
            you start typing an address, they exist to deliver the quote you came to ask
            for, and the form cannot do its job without them &mdash; so we treat them as
            part of the service you requested rather than as something optional. Google
            sets its own cookies at that point.
          </p>

          <h3 className="text-white text-[15px] font-medium mb-1.5 mt-5" style={{ fontFamily: 'var(--font-ui)' }}>
            Functional — off unless you turn it on
          </h3>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            The interactive Google map on our Contact page. Google sets its own cookies
            the moment that map loads, so it stays out of the page until you say yes. Leave
            this off and we show our address as plain text, with a link you can follow to
            Google Maps yourself if you want to.
          </p>

          <h3 className="text-white text-[15px] font-medium mb-1.5 mt-5" style={{ fontFamily: 'var(--font-ui)' }}>
            Analytics — off unless you turn it on
          </h3>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            We do not currently run any analytics, so this category sets nothing today.
            The control exists so that if we ever add audience measurement, it cannot run
            until you have agreed to it. We will update this page and ask again before
            anything changes.
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2} style={{ fontFamily: 'var(--font-ui)' }}>Everything we can store</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="bg-white/[0.04]">
                  {['Name', 'Set by', 'Purpose', 'Expires'].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="text-left text-[#EBBA6F] text-[11px] font-semibold tracking-[0.14em] uppercase px-4 py-3"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.name} className="border-t border-white/[0.07] align-top">
                    <td className="px-4 py-3.5 text-white text-[13px]" style={{ fontFamily: 'var(--font-ui)' }}>
                      {row.name}
                    </td>
                    <td className="px-4 py-3.5 text-white/60 text-[13px]" style={{ fontFamily: 'var(--font-body)' }}>
                      {row.provider}
                    </td>
                    <td className="px-4 py-3.5 text-white/60 text-[13px] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {row.purpose}
                    </td>
                    <td className="px-4 py-3.5 text-white/60 text-[13px] whitespace-nowrap" style={{ fontFamily: 'var(--font-body)' }}>
                      {row.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={SECTION}>
          <h2 className={H2} style={{ fontFamily: 'var(--font-ui)' }}>Changing your mind</h2>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            Use the <strong className="text-white/85 font-medium">Cookie settings</strong> link
            in the footer of any page, or the button above. Your new choice takes effect
            immediately.
          </p>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            Cookies already set by Google live on Google&rsquo;s own domain, so we cannot
            delete them for you. Your browser&rsquo;s privacy settings will clear them, and
            every major browser lets you block third-party cookies outright.
          </p>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            We ask again after six months, so a choice you made long ago never stands in
            for one you would make today.
          </p>
        </section>

        <section>
          <h2 className={H2} style={{ fontFamily: 'var(--font-ui)' }}>Questions or complaints</h2>
          <p className={P} style={{ fontFamily: 'var(--font-body)' }}>
            Email us at{' '}
            <a href="mailto:info@everydaystravel.co.uk" className="text-[#EBBA6F] underline underline-offset-2">
              info@everydaystravel.co.uk
            </a>
            . If you are not satisfied with our answer, you can complain to the Information
            Commissioner&rsquo;s Office at{' '}
            <a
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EBBA6F] underline underline-offset-2"
            >
              ico.org.uk
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
