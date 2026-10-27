import {
  Users, Armchair, Table, DoorOpen, EyeOff, BadgePoundSterling,
  Luggage, Baby, Clock, UserCheck, BadgeCheck, MapPin, Timer, Repeat,
  Bus, Snowflake, Usb, Volume2, Maximize2, Car,
} from 'lucide-react'
import type { ServiceContent } from './service-content'
import { V_CLASS_IMAGES, V_CLASS_VIDEOS } from './fleet'

/**
 * The persuasion copy for a fleet page, in the shape the service pages already
 * use.
 *
 * A fleet page and a service page render through the same `VehicleDetail`
 * component, so they have the same hole in them: a gallery, a two-line
 * description, amenities, "preferred for", and then nothing. That answers *what
 * you get* and stops, on a page aimed at a commercial search term.
 *
 * The blocks, their components and their types are the service pages' — only
 * the lookup is new, keyed by vehicle slug rather than service slug. A vehicle
 * with no entry renders exactly the page it rendered before, so there is never
 * a half-built page in public.
 *
 * The two V-Class entries describe one vehicle from two directions, because
 * they are two pages competing for different searches: the chauffeur-cars page
 * answers "Mercedes V-Class chauffeur hire", the minibuses page answers
 * "7-seater MPV hire". Writing them from one draft would leave two pages of
 * near-identical copy, which is worth less to a reader and to a search engine
 * than either page alone.
 *
 * Every claim here is one the site already makes elsewhere, or one the
 * photographs on the page plainly show. Nothing invents a figure, an
 * accreditation or a response time.
 */

/** Content for a vehicle, or undefined when none has been written yet. */
export type VehicleContent = ServiceContent

// ── Photos and clips ──────────────────────────────────────────────────────────
// Drawn from the fleet gallery so the bands cannot drift from the strip at the
// top of the page. Indices: 0 exterior, 1–4 the cabin.

const [V_EXTERIOR, V_CABIN_SEATS, V_FRONT_TRAYS, V_SIDE_TABLE, V_TWIN_TABLES] =
  V_CLASS_IMAGES

/**
 * The clips, in gallery order: around the outside, up to the front, then
 * inside. Only the cabin one is placed in a band — the two bands are both
 * specification, and an exterior shot beside a list of seats and sockets
 * argues for the wrong thing.
 */
const V_CLIP_CABIN = V_CLASS_VIDEOS[2]

// ── Content ───────────────────────────────────────────────────────────────────

export const VEHICLE_CONTENT: Record<string, VehicleContent> = {

  /* The same van, sold as a chauffeur-driven car: one party, door to door,
     a driver waiting at the other end. */
  'mercedes-v-class': {

    whyChoose: {
      heading: [
        { text: 'Why hire the' },
        { text: 'V-Class', accent: true },
      ],
      points: [
        { icon: Users,               text: 'Up to six passengers and their cases in one vehicle' },
        { icon: Armchair,            text: 'Individual leather seats, each one reclining' },
        { icon: Table,               text: 'Tables between the seats, so the journey is working time' },
        { icon: DoorOpen,            text: 'Sliding side doors and a low step in' },
        { icon: EyeOff,              text: 'Dark privacy glass from the middle row back' },
        { icon: BadgePoundSterling,  text: 'A price agreed before you travel' },
      ],
    },

    solutions: {
      ariaLabel: 'What the V-Class is used for',
      heading: [
        { text: 'The V-Class', accent: true },
        { text: 'on the journeys we run it' },
      ],
      intro:
        'We run the V-Class out of London, Surrey and the Home Counties: to Heathrow, Gatwick, Stansted, Luton and City, into the West End and the City for client work, and anywhere in the UK a day of driving reaches.',
      accordion: [
        {
          title: 'Executive airport transfers',
          text:  'Six passengers, the cases and the laptop bags in one vehicle rather than two cars. Give us the flight number and we will track it, so an early landing or a two-hour delay moves your driver rather than losing them.',
        },
        {
          title: 'Corporate travel and client visits',
          text:  'A quiet cabin with tables, for the team that wants the hour between the office and the meeting to count. The driver waits between appointments instead of being re-booked at each one.',
        },
        {
          title: 'Family travel',
          text:  'The pushchair, the cases and everybody in one vehicle, with a sliding door and a low step that a child or a grandparent can manage without help. Bring your own child seat; tell us when booking.',
        },
        {
          title: 'Events, racing and hospitality',
          text:  'Ascot, Twickenham, Wimbledon, a concert at the O2. The V-Class drops the party at the gate and is there when it finishes, which is the part of the evening a taxi app cannot promise.',
        },
        {
          title: 'Weddings',
          text:  'The vehicle that carries the people a wedding car cannot: the parents, the bridesmaids, the photographer and the dresses, between the house, the church and the venue.',
        },
        {
          title: 'Cruise and port transfers',
          text:  'Southampton, Dover, Portsmouth and Tilbury, with the luggage handled at both ends and the sailing time planned into the departure rather than guessed at.',
        },
        {
          title: 'Roadshows and multi-stop days',
          text:  'Three or four addresses in a day on one vehicle and one driver, with the kit and the luggage staying aboard between stops. Tell us the stops when you enquire and we build them into the route and the price.',
        },
        {
          title: 'Six seats, or four and the luggage',
          text:  'The rear seats run on rails and lift out, so the same vehicle is six passengers with cabin bags or four with a full boot. Tell us the party and the cases when you book and we will set it before it leaves us.',
        },
      ],
      carousel: [
        { src: V_EXTERIOR,    alt: 'A Mercedes-Benz V-Class Executive, ready for a chauffeur booking' },
        { src: V_CABIN_SEATS, alt: 'The V-Class cabin, with individual reclining leather seats' },
        { src: V_SIDE_TABLE,  alt: 'A fold-out table between the V-Class seats' },
        { src: V_FRONT_TRAYS, alt: 'Seat-back trays in the front of the V-Class cabin' },
      ],
    },

    fleet: {
      ariaLabel: 'What a V-Class booking includes',
      heading: [
        { text: 'What comes', accent: true },
        { text: 'as standard' },
      ],
      intro:
        'Every V-Class goes out with one of our professional chauffeurs. The specification below is on the vehicle when it arrives, not an upgrade you pay for.',
      includedHeading: 'Every V-Class booking includes:',
      included: [
        { icon: Armchair,   text: 'Individual reclining leather seats' },
        { icon: Table,      text: 'Fold-away tables between the seats' },
        { icon: Snowflake,  text: 'Rear climate control' },
        { icon: Usb,        text: 'USB charging for all seats' },
        { icon: EyeOff,     text: 'Dark privacy glass' },
        { icon: BadgeCheck, text: 'A professional uniformed chauffeur' },
      ],
      extrasHeading: 'You can also ask for:',
      extras: [
        { icon: Baby,    text: 'Your own child seats, with fitting discussed before booking' },
        { icon: Luggage, text: 'A rear row removed for a full boot' },
        { icon: MapPin,  text: 'Additional pickups on the way' },
        { icon: Timer,   text: 'A driver who waits between appointments' },
        { icon: Repeat,  text: 'The return leg booked at the same time' },
      ],
      image:    V_TWIN_TABLES,
      imageAlt: 'The cabin of an Everydays Travel V-Class',
      video:    V_CLIP_CABIN,
      ctas: [
        { label: 'Get a quote',    href: '/book',  primary: true },
        { label: 'View our fleet', href: '/fleet' },
      ],
    },
  },

  /* The same van, sold as the smallest thing in the minibus fleet: a group
     that fits one vehicle, without stepping up to a 16-seater. */
  '7-seater-mpv-v-class': {

    whyChoose: {
      heading: [
        { text: 'Why the' },
        { text: '7-seater V-Class', accent: true },
      ],
      points: [
        { icon: Users,      text: 'A party of seven in one vehicle, not split across two cars' },
        { icon: Car,        text: 'Car-sized, so it parks and drops where a minibus cannot' },
        { icon: Armchair,   text: 'Seven individual seats, none of them a jump seat' },
        { icon: DoorOpen,   text: 'Sliding doors and a low step, with no climb aboard' },
        { icon: Maximize2,  text: 'Seats on rails, set for legroom or for luggage' },
        { icon: UserCheck,  text: 'A professional driver on every booking' },
      ],
    },

    solutions: {
      ariaLabel: 'What the 7-seater MPV is used for',
      heading: [
        { text: '7-seater MPV hire', accent: true },
        { text: 'for the group that fits one vehicle' },
      ],
      intro:
        'The V-Class is where our minibus fleet starts: London, Surrey and the Home Counties for the day, the London airports overnight, and the rest of the UK when the trip runs longer.',
      accordion: [
        {
          title: 'Airport runs for a family or a team',
          text:  'Your group and its luggage on the early flight, with the seating and luggage allocation confirmed before booking, without the six-in-the-morning conversation about whose car takes the luggage. We track the flight number, so a delay moves the pickup rather than costing you the booking.',
        },
        {
          title: 'Family travel and days out',
          text:  'Grandparents, children, a pushchair and a boot full. The sliding door and the low floor matter more than the badge on the front when somebody is getting in and out six times in a day.',
        },
        {
          title: 'Corporate groups and site visits',
          text:  'Seven colleagues to one place, on time, with tables for anyone who wants to work on the way. Regular runs can go on account and be invoiced monthly rather than booked trip by trip.',
        },
        {
          title: 'Weddings and the party around them',
          text:  'The guests a wedding car never carries. Between the hotel, the service and the reception, as many times as the day needs.',
        },
        {
          title: 'Golf, shooting and sports days',
          text:  'Clubs, bags and kit in the back with the seats dropped, and nobody driving home at the end of it.',
        },
        {
          title: 'Nights out, dinners and theatre trips',
          text:  'Collected from the door and brought back to it, however late. We run 24/7, so the last leg is an ordinary booking rather than a favour.',
        },
        {
          title: 'Tours and longer trips',
          text:  'Several days, several stops, one driver and one vehicle, with the luggage staying aboard between hotels. Build the itinerary with us and we will price the whole thing rather than each leg.',
        },
        {
          title: 'When seven is not quite the number',
          text:  'Eight or nine and we move you to the 16-seater, which keeps everybody together; we will quote for the available options. Tell us the headcount and we will say which one actually fits.',
        },
      ],
      carousel: [
        { src: V_CABIN_SEATS,  alt: 'Individual reclining seats in the 7-seater V-Class cabin' },
        { src: V_SIDE_TABLE,   alt: 'A fold-out table beside the 7-seater V-Class seats' },
        { src: V_TWIN_TABLES,  alt: 'Twin fold-out tables in the back of the 7-seater V-Class' },
        { src: V_EXTERIOR,     alt: 'A Mercedes-Benz V-Class 7-seater MPV' },
      ],
    },

    fleet: {
      ariaLabel: 'What a 7-seater MPV booking includes',
      heading: [
        { text: 'What comes', accent: true },
        { text: 'with the vehicle' },
      ],
      intro:
        'The V-Class is a minibus specification in a vehicle the size of a car. Everything below is aboard when it arrives, with one of our professional drivers.',
      includedHeading: 'Every booking includes:',
      included: [
        { icon: Armchair,   text: 'Seven individual reclining seats' },
        { icon: Volume2,    text: 'Bluetooth audio throughout' },
        { icon: Snowflake,  text: 'Rear climate control' },
        { icon: Usb,        text: 'USB charging for all seats' },
        { icon: EyeOff,     text: 'Dark privacy glass' },
        { icon: Clock,      text: '24/7 availability' },
      ],
      extrasHeading: 'You can also ask for:',
      extras: [
        { icon: Baby,       text: 'Your own child seats, with fitting discussed before booking' },
        { icon: Luggage,    text: 'A rear row removed for sports kit or golf clubs' },
        { icon: Repeat,     text: 'The return leg booked at the same time' },
        { icon: MapPin,     text: 'Several pickups on the way out or home' },
        { icon: Bus,        text: 'The 16-seater instead, when seven will not hold the party' },
      ],
      image:    V_FRONT_TRAYS,
      imageAlt: 'The cabin of an Everydays Travel 7-seater V-Class',
      video:    V_CLIP_CABIN,
      ctas: [
        { label: 'Get a quote',       href: '/book',  primary: true },
        { label: 'See the minibuses', href: '/fleet/luxury-minibuses' },
      ],
    },
  },

}

/** Content for a vehicle, or undefined when none has been written yet. */
export function vehicleContent(slug: string): VehicleContent | undefined {
  return VEHICLE_CONTENT[slug]
}
