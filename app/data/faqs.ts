/**
 * The questions people actually ask before booking a coach.
 *
 * One source for both the page and its FAQPage schema, so the two can never
 * disagree about what we told somebody.
 *
 * Answers are plain text rather than JSX, because schema.org wants a string
 * and duplicating the wording into two shapes is how a page and its structured
 * data drift apart. Where an answer needs a link, `link` puts one after it.
 *
 * Anything commercial — deposits, cancellation, what the price excludes —
 * points at the conditions of hire rather than restating a figure here. Two
 * copies of a number is one copy too many when the number binds a customer.
 */

export interface Faq {
  question: string
  answer:   string
  /** Optional "read more" link rendered after the answer. */
  link?:    { label: string; href: string }
}

export interface FaqGroup {
  title: string
  faqs:  Faq[]
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Booking and quotes',
    faqs: [
      {
        question: 'How do I get a quote?',
        answer:
          'Fill in the quote form with your pickup, destination, date and passenger numbers, and we will come back to you with a price. If it is easier, call or message us on WhatsApp instead, since some journeys are quicker to talk through than to type out. The more detail you can give us about timings and stops, the more accurate the quote.',
        link: { label: 'Get a quote', href: '/book' },
      },
      {
        question: 'How quickly will you reply?',
        answer:
          'Within one working day, and usually much faster during office hours. If your journey is soon, call us rather than waiting on email.',
      },
      {
        question: 'Is the quote a booking?',
        answer:
          'No. A quote is a price we are offering you. The booking exists once we have confirmed it in writing and any deposit has been paid. Until that point the vehicle is not held for you. If your date is tight, confirm early.',
        link: { label: 'Conditions of hire', href: '/conditions-of-hire' },
      },
      {
        question: 'How far in advance should I book?',
        answer:
          'As early as you can for weddings, school trips and anything in December, when demand is heaviest and the larger coaches go first. At quieter times a few days is often enough. It costs nothing to ask about a date, so ask.',
      },
      {
        question: 'What does the price include, and what is extra?',
        answer:
          'The price covers the vehicle, the driver and fuel. Congestion Charge, ULEZ, ferry crossings, driver accommodation on multi-day trips, and anything bought on your behalf such as tickets or meals are charged separately unless your quotation says otherwise. We set all of this out rather than surprising you with it afterwards.',
        link: { label: 'What the price includes', href: '/conditions-of-hire' },
      },
      {
        question: 'What are your payment and cancellation terms?',
        answer:
          'A deposit confirms a booking, with the balance due before departure. Cancellation charges depend on how much notice you give. The closer to departure, the less chance we have of re-letting the vehicle. The full detail is in our conditions of hire.',
        link: { label: 'Conditions of hire', href: '/conditions-of-hire' },
      },
      {
        question: 'Why do quotes differ so much between operators?',
        answer:
          'Usually it comes down to the vehicle and the driver. A newer coach that meets current emissions standards costs more to run than an older one, and a properly rested driver paid a proper rate costs more than a stretched schedule. A quote that looks unusually cheap is worth asking questions about: the age of the vehicle, whether driver breaks are built in, and what is excluded.',
      },
    ],
  },
  {
    title: 'Vehicles and capacity',
    faqs: [
      {
        question: 'What size vehicles do you have?',
        answer:
          'From chauffeur-driven cars for one or two passengers, through 7, 16 and 19-seat minibuses, up to 35, 49, 53 and 55-seat coaches. If your group falls between two sizes we will tell you which way to go, and why.',
        link: { label: 'See the fleet', href: '/fleet' },
      },
      {
        question: 'How many people can travel?',
        answer:
          'Up to the vehicle’s licensed capacity, and no more. Standing is not permitted on a coach. Everybody travelling has to be counted, including children whatever seat they take, because our insurance depends on the number being right.',
      },
      {
        question: 'Can we get a wheelchair on board?',
        answer:
          'Some of our vehicles are wheelchair accessible and some are not, so tell us at the time of booking rather than on the day and we will allocate one that works. The same goes for anyone in your party with mobility needs. We would far rather know early than have somebody turned away at the kerb.',
      },
      {
        question: 'How much luggage can we bring?',
        answer:
          'Roughly a suitcase and a small bag each on a coach with a luggage hold; less on a minibus, where cases share the passenger space. Tell us in advance if you are carrying skis, instruments, sports kit or a full set of holiday luggage, so we send a vehicle that can actually take it.',
      },
      {
        question: 'What is on board?',
        answer:
          'It varies by vehicle, and each one lists its own facilities. Across the fleet you will find reclining seats, air conditioning, USB charging, wifi on many vehicles, and a WC on the larger coaches. If a particular facility matters to your journey, ask us to confirm it in writing before you book.',
        link: { label: 'Compare vehicles', href: '/fleet' },
      },
      {
        question: 'Will we get the exact vehicle shown on the website?',
        answer:
          'The photographs show our own fleet, and we allocate the vehicle you booked wherever we can. Occasionally, after a breakdown or a late-running job, we substitute another vehicle of the same standard or better. We will not quietly downgrade you.',
      },
    ],
  },
  {
    title: 'On the day',
    faqs: [
      {
        question: 'Do you operate outside office hours?',
        answer:
          'Yes. Our office is open Monday to Friday 7am to 7pm and weekends 8am to 4pm, but vehicles run well outside those hours. Early airport runs and late returns from events are routine. Book the journey during office hours and the driver will be there whatever time you need.',
      },
      {
        question: 'How long can the driver stay with us?',
        answer:
          'Drivers are limited by law on how long they may drive and when they must rest, and we will not breach those rules. Your quote is built around your itinerary with the required breaks included. If you want the option of running late, tell us when booking so we can schedule for it. That is far cheaper than fixing it on the day.',
      },
      {
        question: 'Can we extend the hire on the day?',
        answer:
          'Sometimes, depending on the driver’s remaining hours and whether the vehicle is booked afterwards. Ask the driver early rather than at the last minute, and expect an additional charge. If an overrun is likely, it is better built into the original booking.',
      },
      {
        question: 'What happens if we are delayed?',
        answer:
          'Tell the driver as soon as you know. We will do what we can, but the driver’s legal hours still apply and we cannot extend a journey past them. For flights, give us the flight number and we will track it, so a late arrival does not mean a missed pickup.',
      },
      {
        question: 'Can we eat and drink on board?',
        answer:
          'Soft drinks and sensible snacks are fine. Alcohol needs our agreement in advance, and is not permitted at all on some journeys. Most school trips and many sporting fixtures prohibit it by law or by venue rule. Ask when you book and we will tell you where you stand.',
      },
      {
        question: 'Who pays if the vehicle is damaged or needs cleaning?',
        answer:
          'Normal use is expected and never charged for. Where a vehicle comes back damaged, or needing more than ordinary cleaning, the cost of putting it right falls to whoever made the booking. We will always show you what we are charging for and why.',
        link: { label: 'Conditions of hire', href: '/conditions-of-hire' },
      },
      {
        question: 'Something was left on board. Can we get it back?',
        answer:
          'Contact us as soon as you notice and we will search the vehicle. Lost property is handled under the Public Service Vehicles (Lost Property) Regulations 1978, and unclaimed items are disposed of after three months. Please do not leave valuables on board.',
      },
    ],
  },
  {
    title: 'Specific journeys',
    faqs: [
      {
        question: 'Which airports do you cover?',
        answer:
          'Heathrow, Gatwick, Stansted, Luton and London City, plus regional airports on request. Our depot is in Feltham, minutes from Heathrow, so early-morning Heathrow runs are something we do constantly rather than occasionally.',
        link: { label: 'Airport transfers', href: '/services/airport-transfers' },
      },
      {
        question: 'Do you track flights?',
        answer:
          'Yes. Give us the flight number when you book and we watch it, so the driver arrives when your flight actually lands rather than when it was scheduled to.',
      },
      {
        question: 'Are your drivers DBS checked for school trips?',
        answer:
          'Yes. Drivers on school work are DBS checked, and we can support your risk assessment with the vehicle and driver documentation your school needs for its paperwork. Ask and we will send it.',
        link: { label: 'School transport', href: '/services/school-trips' },
      },
      {
        question: 'Do you provide child car seats?',
        answer:
          'We do not supply them, for insurance reasons. You are welcome to bring your own and fit it to a three-point seatbelt. Tell us how many children are travelling and their ages when you book, so we can advise on the right vehicle.',
      },
      {
        question: 'Can you decorate a wedding car?',
        answer:
          'Yes. Ribbons and decoration are arranged on request, and every vehicle turns up cleaned and presented properly. Weddings run to a tight schedule, so tell us the whole day’s movements and we will plan the timings around them rather than the other way round.',
        link: { label: 'Weddings and events', href: '/services/weddings-events' },
      },
      {
        question: 'Do you travel outside London, and into Europe?',
        answer:
          'We cover the whole of the UK, and we run tours into Europe. Multi-day and continental trips need more planning for driver hours, crossings and overnight accommodation, so give us as much notice as you can and we will build the itinerary with you.',
        link: { label: 'Group travel and tours', href: '/services/group-travel' },
      },
      {
        question: 'Do you work with schools, clubs and companies on an ongoing basis?',
        answer:
          'Yes, and it is a lot of what we do: regular school runs, match-day travel for clubs, and corporate accounts with recurring transfers. Regular work can be set up on account rather than paid trip by trip. Get in touch and we will put something sensible together.',
        link: { label: 'Contact us', href: '/contact' },
      },
    ],
  },
]

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((group) => group.faqs)
