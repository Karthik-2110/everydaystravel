import {
  PlaneLanding, TimerReset, Handshake, Hourglass, Car, BadgePoundSterling,
  Plane, UserCheck, Briefcase, BadgeCheck, Baby, Clock,
  MapPin, Timer, Repeat, Bus, MapPinned,
  CalendarClock, ReceiptPoundSterling, Wifi,
  Armchair, Usb, Snowflake, Volume2, Table, Toilet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AIRPORT_TRANSFER_IMAGES, CORPORATE_IMAGES } from '../components/ServiceList'

/**
 * The persuasion copy that sits between a service page's spec and its
 * "explore other services" cards.
 *
 * Service pages render through `VehicleDetail`, which is built to describe a
 * vehicle: a gallery, a two-line description, amenities, "preferred for". That
 * answers *what you get* and stops, leaving a page aimed at a commercial search
 * term with almost nothing on it and no answer to the questions somebody has
 * before they enquire.
 *
 * Services land here one at a time. A service with no entry renders exactly the
 * page it rendered before, so there is never a half-built page in public.
 *
 * Every claim is one the site already makes elsewhere — the amenities come from
 * the service's own `features`, the airports from `businessSchema.areaServed`.
 * Nothing here invents an accreditation, a fleet age or a response time.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * A heading in two tones, the way the hero already sets its lines. Keeping the
 * split in the data rather than in markup means the emphasis can fall on the
 * first phrase or the last without a component knowing which.
 *
 * Parts carry no spacing of their own; `SectionHeading` joins them with a
 * space. A trailing space inside a part would render but be trimmed out of the
 * accessible name, leaving a screen reader to announce "forairport".
 */
export interface HeadingPart {
  text:    string
  accent?: boolean
}

export interface Titled {
  title: string
  text:  string
}

/**
 * A line with an icon beside it. The icon is named here rather than matched
 * from the text the way `VehicleDetail` matches its amenity words — these are
 * phrases rather than fixed labels, and string-matching one picks the wrong
 * icon the first time somebody rewrites it.
 */
export interface IconPoint {
  icon: LucideIcon
  text: string
}

export interface WhyChooseBlock {
  heading: HeadingPart[]
  points:  IconPoint[]
}

export interface CarouselSlide {
  src: string
  alt: string
}

export interface SolutionsBlock {
  heading:   HeadingPart[]
  /** A standfirst under the heading. Carries the detail worth reading first. */
  intro:     string
  /** Accordion rows. The first is open on load; the rest are a step away. */
  accordion: Titled[]
  carousel:  CarouselSlide[]
}

export interface CallToAction {
  label: string
  href:  string
  /** The filled pill. One per group, so the eye has a single obvious action. */
  primary?: boolean
}

export interface FleetBlock {
  heading:         HeadingPart[]
  intro:           string
  includedHeading: string
  included:        IconPoint[]
  extrasHeading:   string
  extras:          IconPoint[]
  image:           string
  imageAlt:        string
  ctas:            CallToAction[]
}

export interface ServiceContent {
  whyChoose?: WhyChooseBlock
  solutions?: SolutionsBlock
  fleet?:     FleetBlock
}

// ── Content ───────────────────────────────────────────────────────────────────

const cdn = (path: string) =>
  `https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1400,c_limit/${path}`

/** The two vehicles most often sent on a transfer, from `app/data/fleet.ts`. */
const V_CLASS_PHOTO = cdn('v1783787244/2d6095da-5ce2-48b0-a84f-5453ad8d3db0_pmmmbz.jpg')
const S_CLASS_PHOTO = cdn('v1783787266/837f9f74-eb75-4beb-9553-2424ced64ace_rhx7vy.jpg')

const AIRPORT_FLEET_PHOTO =
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1400,c_limit/v1783784630/20260211_134438550_iOS_okfp39.jpg'

/** The midi coach, for the away day that does not fill a full-size coach. */
const TURAS_35_PHOTO = cdn('v1783787232/0712a7cf-b45c-45e5-86cf-71de3a21ab55_zrwpei.jpg')

/** A different frame from the carousel's, so the band is not a repeat. */
const CORPORATE_FLEET_PHOTO = cdn('v1783783909/IMG_8109_hqk5fk.jpg')

export const SERVICE_CONTENT: Record<string, ServiceContent> = {

  'airport-transfers': {

    whyChoose: {
      heading: [
        { text: 'Why choose' },
        { text: 'Everydays Travel', accent: true },
      ],
      points: [
        { icon: PlaneLanding,       text: 'Pickups timed to your flight, not your booking' },
        { icon: TimerReset,         text: 'A delay moves your driver rather than losing them' },
        { icon: Handshake,          text: 'Met inside the terminal when you land' },
        { icon: Hourglass,          text: 'Margin built in for drop-off traffic' },
        { icon: Car,                text: 'One vehicle and one driver, door to door' },
        { icon: BadgePoundSterling, text: 'A price agreed before you travel' },
      ],
    },

    solutions: {
      heading: [
        { text: 'Airport transfers', accent: true },
        { text: 'for every kind of journey' },
      ],
      intro:
        'We cover Heathrow, Gatwick, Stansted, Luton, City and Southend, along with the regional airports further north.',
      accordion: [
        {
          title: 'Business travel',
          text:  'A quiet car and a driver who knows the terminal, with the arrival planned around the meeting at the other end rather than the flight alone.',
        },
        {
          title: 'Family holidays',
          text:  'The family, the cases and the pushchair in one vehicle, instead of splitting across two cars at six in the morning.',
        },
        {
          title: 'Group departures',
          text:  'Wedding parties, teams and tour groups moving to one terminal on a single schedule, so the whole party checks in together.',
        },
        {
          title: 'Early and late flights',
          text:  'The hours when public transport has stopped and a taxi is a gamble. We run 24/7, so a four in the morning departure is an ordinary booking.',
        },
        {
          title: 'Connecting transfers',
          text:  'Airport to airport, or airport to a port or station, with the luggage handled at both ends and the connection planned as one journey.',
        },
        {
          title: 'Staff and crew moves',
          text:  'Repeat transfers on a standing schedule, for companies moving people through the London airports regularly.',
        },
        {
          title: 'Tracking your flight',
          text:  'Give us the flight number when you book and we will track it, so an early landing or a two-hour delay changes our schedule rather than yours.',
        },
        {
          title: 'Arrivals and departures',
          text:  'On arrival a driver can meet you inside the terminal with a name board and give you a hand with the luggage. For departures we work backwards from your check-in time, not from the published flight time, and we allow for the drop-off traffic at the terminal you are actually flying from.',
        },
        {
          title: 'More than one pickup',
          text:  'A team collected from three addresses, or a family joining on the way. Tell us the stops when you enquire and we will build them into the route and the price.',
        },
      ],
      carousel: [
        { src: AIRPORT_TRANSFER_IMAGES[0], alt: 'An Everydays Travel airport transfer' },
        { src: V_CLASS_PHOTO,              alt: 'Mercedes-Benz V-Class, used for family and small-group transfers' },
        { src: S_CLASS_PHOTO,              alt: 'Mercedes-Benz S-Class, used for executive transfers' },
        { src: AIRPORT_TRANSFER_IMAGES[1], alt: 'An Everydays Travel vehicle' },
      ],
    },


    fleet: {
      heading: [
        { text: 'The vehicles', accent: true },
        { text: 'we run transfers in' },
      ],
      intro:
        'From a chauffeur-driven car for one passenger to a 55-seat coach for a full group. Every transfer goes out with one of our professional drivers.',
      includedHeading: 'Every transfer includes:',
      included: [
        { icon: Plane,      text: 'Live flight tracking' },
        { icon: UserCheck,  text: 'Meet & greet service' },
        { icon: Briefcase,  text: 'Luggage assistance' },
        { icon: BadgeCheck, text: 'Professional uniformed drivers' },
        { icon: Baby,       text: 'Child seats on request' },
        { icon: Clock,      text: '24/7 availability' },
      ],
      extrasHeading: 'You can also ask for:',
      extras: [
        { icon: MapPin,    text: 'Additional stops en route' },
        { icon: Timer,     text: 'Extended waiting beyond the included period' },
        { icon: Repeat,    text: 'The return leg booked at the same time' },
        { icon: Bus,       text: 'A second vehicle when one will not hold the group' },
        { icon: MapPinned, text: 'Drop-offs at several addresses on the way home' },
      ],
      image:    AIRPORT_FLEET_PHOTO,
      imageAlt: 'An Everydays Travel vehicle on an airport transfer',
      ctas: [
        { label: 'Get a quote',    href: '/book',  primary: true },
        { label: 'View our fleet', href: '/fleet' },
      ],
    },
  },

  'corporate': {

    whyChoose: {
      heading: [
        { text: 'Why choose' },
        { text: 'Everydays Travel', accent: true },
      ],
      points: [
        { icon: CalendarClock,        text: 'Timed to the meeting, with the traffic already allowed for' },
        { icon: BadgeCheck,           text: 'Uniformed chauffeurs, briefed on the day before they arrive' },
        { icon: Wifi,                 text: 'Onboard WiFi, so the journey is working time' },
        { icon: ReceiptPoundSterling, text: 'Regular work set up on account, not paid trip by trip' },
        { icon: Briefcase,            text: 'One point of contact from the quote to the invoice' },
        { icon: BadgePoundSterling,   text: 'A price agreed before anyone travels' },
      ],
    },

    solutions: {
      heading: [
        { text: 'Corporate coach hire', accent: true },
        { text: 'for every kind of business journey' },
      ],
      intro:
        'We run corporate work across London and the Home Counties, into the exhibition halls at ExCeL, Olympia and the QEII Centre, out to the London airports, and anywhere in the UK the working day reaches.',
      accordion: [
        {
          title: 'Conferences and exhibitions',
          text:  'Delegates moved to ExCeL, Olympia or the QEII Centre on a schedule built around the doors opening rather than the diary. The return leg is booked at the same time, so nobody is left on the pavement at six.',
        },
        {
          title: 'Staff shuttles',
          text:  'A standing run between the office, the station and the site, on the same vehicle and the same driver each day. Set up on account and invoiced monthly rather than booked trip by trip.',
        },
        {
          title: 'Away days and team building',
          text:  'The whole team in one vehicle, which is usually the point of the day. A 35-seat midi coach when a full-size one is more than you need.',
        },
        {
          title: 'Client hospitality and VIP guests',
          text:  'An S-Class or V-Class with a chauffeur for the visitor you would rather not put in a taxi, and a driver who waits between appointments instead of being re-booked each time.',
        },
        {
          title: 'Business airport groups',
          text:  'A team flying out together and met on the way back. Give us the flight number and we will track it, so a delayed landing moves your driver rather than losing them.',
        },
        {
          title: 'Roadshows and multi-city programmes',
          text:  'Several cities over several days on one vehicle and one driver, with the luggage and the kit staying aboard between stops.',
        },
        {
          title: 'Meetings and site visits',
          text:  'Two or three addresses in a morning. Tell us the stops when you enquire and we will build them into the route and the price, rather than charging for the detour afterwards.',
        },
        {
          title: 'Staff parties and end-of-year events',
          text:  'Guests collected from the office and dropped home afterwards, however late that is. We run 24/7, so the last leg is an ordinary booking rather than a favour.',
        },
        {
          title: 'Corporate accounts',
          text:  'Recurring work can be set up on account, so a booking is a phone call and the paperwork arrives once a month. It is a lot of what we already do for clubs and schools.',
        },
      ],
      carousel: [
        { src: CORPORATE_IMAGES[0], alt: 'An Everydays Travel coach on corporate work' },
        { src: S_CLASS_PHOTO,       alt: 'Mercedes-Benz S-Class, used for client and executive transfers' },
        { src: CORPORATE_IMAGES[1], alt: 'A 49-seater Mercedes Turismo, used for conference groups' },
        { src: TURAS_35_PHOTO,      alt: 'The 35-seater Turas Midi, used for away days and smaller teams' },
      ],
    },

    fleet: {
      heading: [
        { text: 'The vehicles', accent: true },
        { text: 'we run corporate work in' },
      ],
      intro:
        'From a chauffeur-driven car for one director to a 55-seat coach for a full conference group. Every journey goes out with one of our professional drivers.',
      includedHeading: 'Every corporate journey includes:',
      included: [
        { icon: Armchair,   text: 'Individual reclining seats' },
        { icon: Wifi,       text: 'Onboard WiFi' },
        { icon: Usb,        text: 'USB & 240v charging' },
        { icon: Snowflake,  text: 'Climate control throughout' },
        { icon: Volume2,    text: 'PA & entertainment system' },
        { icon: BadgeCheck, text: 'Professional uniformed drivers' },
      ],
      extrasHeading: 'You can also ask for:',
      extras: [
        { icon: Toilet, text: 'Onboard WC and refreshment area on the larger coaches' },
        { icon: Table,  text: 'Seat-back tables for working en route' },
        { icon: MapPin, text: 'Additional pickups on the way' },
        { icon: Timer,  text: 'Extended waiting between appointments' },
        { icon: Bus,    text: 'A second vehicle when one will not hold the group' },
      ],
      image:    CORPORATE_FLEET_PHOTO,
      imageAlt: 'An Everydays Travel vehicle on a corporate booking',
      ctas: [
        { label: 'Get a quote',    href: '/book',  primary: true },
        { label: 'View our fleet', href: '/fleet' },
      ],
    },
  },

}

/** Content for a service, or undefined when none has been written yet. */
export function serviceContent(slug: string): ServiceContent | undefined {
  return SERVICE_CONTENT[slug]
}
