import LegalPage, { Section, P, List, A, DataTable } from '../components/legal/LegalPage'
import { createPageMetadata } from '../lib/seo'
import { EMAIL, PHONE, PHONE_HREF } from '../components/contact/contact-details'
import { LEGAL_NAME, LEGAL_UPDATED, COMPANY_NUMBER } from '../components/legal/company-details'
import {
  DRAFT, DEPOSIT_PERCENT, BALANCE_DUE_DAYS, LATE_INTEREST_ABOVE_BASE,
  INCLUDED_PARKING_PER_DAY, CANCELLATION_SCALE, LUGGAGE_ALLOWANCE,
  LUGGAGE_LIABILITY_CAP, FACILITY_FAILURE_CAP, SOILING_CHARGE,
} from '../components/legal/hire-terms'

export const metadata = {
  ...createPageMetadata({
    title: 'Conditions of Hire',
    description:
      'The terms on which Everydays Travel supplies coach, minibus and chauffeur hire: booking and payment, cancellation charges, what the price includes, drivers’ hours, luggage and liability.',
    path: '/conditions-of-hire',
  }),
  // Draft terms have no business appearing in search results as though settled.
  ...(DRAFT ? { robots: { index: false, follow: true } } : {}),
}

/** Shown until the commercial figures have been signed off — see `hire-terms`. */
function DraftNotice() {
  return (
    <div className="mb-8 rounded-xl border border-[#EBBA6F]/35 bg-[#EBBA6F]/[0.07] px-5 py-4">
      <p
        className="text-[#EBBA6F] text-[13px] font-semibold mb-1"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        These conditions are being finalised
      </p>
      <p
        className="text-white/65 text-[13.5px] leading-relaxed"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        The terms below are in preparation and are not yet in force. The conditions that
        apply to your hire are the ones issued with your written quotation. If you need
        them before booking, ask us and we will send them to you.
      </p>
    </div>
  )
}

export default function ConditionsOfHirePage() {
  return (
    <LegalPage
      title="Conditions of Hire"
      updated={LEGAL_UPDATED}
      intro={
        <>
          {DRAFT && <DraftNotice />}
          <P>
            These conditions apply when {LEGAL_NAME}
            {COMPANY_NUMBER ? ` (company number ${COMPANY_NUMBER})` : ''} supplies a
            vehicle with a driver. &ldquo;We&rdquo; is us; &ldquo;you&rdquo; is the person
            or organisation booking the hire, who is responsible for the booking even where
            the passengers are somebody else.
          </P>
          <P>
            They are separate from our <A href="/terms">terms of use</A>, which cover the
            website rather than a journey.
          </P>
        </>
      }
    >
      <Section title="1. Quotations and booking">
        <List
          items={[
            'A quotation is based on the details you give us — route, timings, passenger numbers and any stops. If those change, the price may change.',
            'A quotation is valid for the period stated on it, and is not a booking.',
            'A booking exists only once we have confirmed it to you in writing and any deposit has been paid. Until then the vehicle is not held for you.',
            'We reserve the right to decline a booking.',
          ]}
        />
      </Section>

      <Section title="2. Payment">
        <List
          items={[
            `A deposit of ${DEPOSIT_PERCENT}% of the hire charge is payable to confirm a booking, unless we have agreed an account with you.`,
            `The balance is payable so that it clears at least ${BALANCE_DUE_DAYS} days before departure. A booking made inside that window is payable in full on confirmation.`,
            'We may ask for a refundable bond on certain hires, returned after the journey if the vehicle comes back undamaged and needing no more than normal cleaning.',
            `Overdue amounts carry interest at ${LATE_INTEREST_ABOVE_BASE}% a year above the Bank of England base rate, accruing daily.`,
            'Where payment is not received by the due date we may treat the booking as cancelled by you, and the cancellation charges below apply.',
          ]}
        />
      </Section>

      <Section title="3. What the price includes">
        <P>Unless your quotation says otherwise, the price covers the vehicle, the driver, fuel and our operating costs. It does not cover:</P>
        <List
          items={[
            `Parking and tolls beyond £${INCLUDED_PARKING_PER_DAY} a day, which we absorb; anything above that is recharged at cost.`,
            'Congestion Charge, ULEZ and other road-user charges, unless the quotation states they are included.',
            'Ferry, tunnel or Eurotunnel crossings, and any overseas road charges.',
            'Driver accommodation and subsistence on multi-day hires.',
            'Admission charges, meals, guides or anything else bought on your behalf.',
            'Additional mileage or hours beyond the itinerary quoted, charged pro rata on the same basis as the original quotation.',
          ]}
        />
      </Section>

      <Section title="4. If you cancel">
        <P>
          Cancellation takes effect when we receive it in writing. The charge depends on
          how much notice we get, because the closer to departure a cancellation comes, the
          less chance we have of re-letting the vehicle.
        </P>
        <DataTable
          headings={['Notice given', 'Charge']}
          rows={CANCELLATION_SCALE.map(({ notice, charge }) => [notice, charge])}
        />
        <P>
          Anything we have already bought for you that cannot be refunded — ferry crossings,
          accommodation, tickets — is charged in full on top, whatever the notice period.
          Where we have committed more than one vehicle, higher charges may apply and will
          be set out in your quotation.
        </P>
        <P>
          We would rather move a booking than lose it. Where a date change is possible we
          will offer it, though we cannot promise availability.
        </P>
      </Section>

      <Section title="5. If we cancel or change the vehicle">
        <List
          items={[
            'We may substitute a vehicle of equivalent or higher specification, or subcontract the hire to another licensed operator of equivalent standard. We remain responsible for the hire.',
            'If we have to cancel for a reason within our control, you get a full refund of everything you have paid us.',
            'If we cannot perform the hire because of something outside our reasonable control — severe weather, road closure, industrial action, accident, an act of government — we will refund what you have paid less any costs already properly incurred, but we are not liable for consequential loss.',
            'On a hire of more than one day, a mechanical failure that delays you by more than an hour and cannot be remedied earns a refund of one day’s hire charge.',
          ]}
        />
      </Section>

      <Section title="6. Drivers’ hours">
        <P>
          Drivers are bound by law on how long they may drive and when they must rest.
          These rules exist to keep passengers safe and we will not breach them for any
          reason.
        </P>
        <List
          items={[
            'Your quotation is built around the itinerary you gave us, including the breaks the driver must take.',
            'If your party delays departure or overruns the itinerary, the driver may have to stop. We will do what we can, but we cannot extend a journey beyond what the law allows.',
            'Where a delay caused by you means a second driver or an overnight stay becomes necessary, that cost is yours.',
            'The driver has final say on route, on where the vehicle can safely stop, and on whether it is safe to proceed.',
          ]}
        />
      </Section>

      <Section title="7. Passengers and luggage">
        <List
          items={[
            'The number of passengers may not exceed the vehicle’s licensed capacity. Standing is not permitted, and every passenger must be counted — including children, whatever seat they occupy — because insurance depends on it.',
            'Seatbelts are fitted and passengers must wear them where the law requires.',
            `Luggage allowance is ${LUGGAGE_ALLOWANCE}, unless agreed in advance. Tell us if you are carrying more, or carrying skis, instruments or sports equipment, so we can send the right vehicle.`,
            'We do not carry child car seats. You are welcome to bring your own and fit it to a three-point belt.',
            'Luggage is carried at your risk. Please do not leave valuables on board.',
          ]}
        />
      </Section>

      <Section title="8. Conduct on board">
        <List
          items={[
            'Smoking and vaping are not permitted on any vehicle.',
            'Alcohol may only be consumed on board with our prior written agreement, and is prohibited outright on some journeys — including most school and sports fixtures — by law or by the venue.',
            'The driver may refuse to carry, or may remove, any passenger whose behaviour puts the safety of others at risk or who is abusive to the driver.',
            'You are responsible for the behaviour of your party.',
          ]}
        />
      </Section>

      <Section title="9. Damage and cleaning">
        <P>
          Normal use is expected and is not charged for. Where a vehicle is returned damaged
          or needing more than ordinary cleaning — including after sickness — the cost of
          putting it right is yours, from £{SOILING_CHARGE} depending on what is needed.
          We will tell you what we are charging and why, with evidence.
        </P>
      </Section>

      <Section title="10. Delays">
        <P>
          We plan realistic journey times, but traffic, weather and road closures are outside
          our control. We are not liable for missed flights, sailings, connections or events
          where a delay is not our fault. Please allow sensible margins, and tell us the time
          you must arrive by so that we can build the schedule around it.
        </P>
      </Section>

      <Section title="11. Lost property">
        <P>
          Property left on board is handled under the Public Service Vehicles (Lost Property)
          Regulations 1978. Contact us as soon as you can and we will search the vehicle.
          Unclaimed items are disposed of after three months.
        </P>
      </Section>

      <Section title="12. Accessibility">
        <P>
          Tell us at the time of booking if anyone in your party is a wheelchair user or has
          mobility needs, so we can allocate a suitable vehicle. Not every vehicle in the
          fleet is accessible, and we may not be able to accommodate a request made on the
          day. We would far rather know early than turn someone away at the kerb.
        </P>
      </Section>

      <Section title="13. Insurance and licensing">
        <P>
          We hold the operator&rsquo;s licence, public liability insurance and vehicle
          insurance the law requires of a public service vehicle operator, and our vehicles
          are maintained and inspected to the standards set by the DVSA. We recommend you
          arrange travel insurance for your party&rsquo;s own possessions and for
          circumstances that might cause you to cancel.
        </P>
      </Section>

      <Section title="14. Our liability">
        <P>
          Nothing here limits our liability for death or personal injury caused by our
          negligence, for fraud, or for anything else that cannot lawfully be limited. If
          you are a consumer, your statutory rights are unaffected.
        </P>
        <P>Subject to that:</P>
        <List
          items={[
            `Our liability for a passenger’s property is limited to £${LUGGAGE_LIABILITY_CAP} per passenger.`,
            `Where an on-board facility — fridge, WC, PA, screens, wifi — is not working, our liability is limited to £${FACILITY_FAILURE_CAP} per facility.`,
            'Our total liability arising from a hire is limited to the total charge for that hire.',
            'We are not liable for indirect or consequential loss, including loss of profit or of an opportunity.',
          ]}
        />
      </Section>

      <Section title="15. Complaints">
        <P>
          Tell the driver at the time if something is wrong — most things can be fixed on the
          spot. Otherwise contact us at <A href={`mailto:${EMAIL}`}>{EMAIL}</A> or{' '}
          <A href={PHONE_HREF}>{PHONE}</A> within 28 days of the journey, and we will
          investigate and reply.
        </P>
      </Section>

      <Section title="16. General">
        <List
          items={[
            'These conditions, together with your written quotation and booking confirmation, are the whole agreement between us. Where the quotation and these conditions differ, the quotation wins.',
            'If any part of these conditions turns out to be unenforceable, the rest continues to apply.',
            'The agreement is governed by the law of England and Wales, and the courts of England and Wales have jurisdiction. If you live elsewhere in the United Kingdom you may bring proceedings in your own jurisdiction.',
          ]}
        />
      </Section>
    </LegalPage>
  )
}
