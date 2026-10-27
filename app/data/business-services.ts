import { CORPORATE_IMAGES } from '../components/ServiceList'
import { V_CLASS_VIDEOS } from './fleet'
import { videoVariants } from '../lib/cloudinary'

export interface ServiceFilm {
  src: string
  poster: string
  caption: string
}

const coachFilm = (path: string, caption: string): ServiceFilm => ({
  src: videoVariants(`https://res.cloudinary.com/dp4cbs8c2/video/upload/${path}.mov`).mp4,
  poster: `https://res.cloudinary.com/dp4cbs8c2/video/upload/so_0,f_jpg,q_auto,w_1600/${path}.jpg`,
  caption,
})

export interface BusinessService {
  slug: string
  path?: string
  title: string
  description: string
  intro: string
  hero: ServiceFilm
  sections: { heading: string; text: string; links?: { label: string; href: string }[] }[]
  cabin: ServiceFilm
  image: string
  imageAlt: string
  closing: string
}

export const BUSINESS_SERVICES: Record<string, BusinessService> = {
  'staff-shuttles': {
    slug: 'staff-shuttles',
    title: 'Staff Shuttle Services in London',
    description: 'Premium staff shuttle services in London with professional drivers. Employee transport, station connections and inter-site journeys, backed by 17+ years of industry experience.',
    intro: 'A considered start and finish to the working day. Bring your team together with premium vehicles, professional drivers and an employee transport plan shaped around your workplace. We bring 17+ years of industry experience to the details that make a regular service work.',
    hero: coachFilm('v1790949398/IMG_3033_unp5tm', 'Explore our coach fleet. Speak to us about the vehicle specification for your staff service.'),
    sections: [
      {
        heading: 'From the station to the workplace',
        text: 'Connect an agreed railway station or local collection point with your office, campus or site. Share your working hours, expected passenger numbers and preferred stops so we can discuss a route and timetable. Morning arrivals, evening departures and shift patterns can all form part of the planning conversation.',
        links: [{ label: 'Discuss your staff route', href: '/contact' }],
      },
      {
        heading: 'Professional drivers. A properly planned service.',
        text: 'Our team works through the collection points, arrival times and return movements with you before journeys begin. Professional, uniformed drivers and well-presented vehicles support the standard you want employees and visitors to experience. Discuss site access, passenger information and contact arrangements with us when setting up the service.',
      },
      {
        heading: 'The right vehicle for the people travelling',
        text: 'From smaller groups in executive vehicles to 35, 49, 53 and 55-seat coaches, match capacity to the people using the service. Tell us about bags, equipment and mobility requirements. Compare the seating and facilities of the proposed vehicle, and confirm any essential accessibility, charging or WiFi arrangements before booking.',
        links: [{ label: 'Compare executive coaches', href: '/fleet/executive-coaches' }, { label: 'Explore minibuses', href: '/fleet/luxury-minibuses' }],
      },
      {
        heading: 'Inter-site travel and recurring journeys',
        text: 'Move employees between offices, stations and working locations on an agreed schedule. Send the anticipated frequency, dates and number of journeys, including any different shift times. Recurring work can be discussed on account, with booking and invoicing arrangements agreed for your organisation.',
        links: [{ label: 'Corporate travel services', href: '/services/corporate' }],
      },
      {
        heading: 'Build your staff transport brief',
        text: 'Tell us the workplaces and collection addresses, start date, service days, shift or office hours, expected numbers on each journey and any site restrictions. Add mobility needs and the person coordinating the service. We will discuss the practical arrangement and provide a tailored quotation for the agreed programme.',
        links: [{ label: 'Request a staff shuttle proposal', href: '/book' }, { label: 'Read customer reviews', href: '/reviews' }],
      },
    ],
    cabin: { ...V_CLASS_VIDEOS[2], caption: 'Inside our V-Class: an executive option for smaller groups. Larger shuttle vehicles have their own specifications.' },
    image: CORPORATE_IMAGES[0],
    imageAlt: 'An Everydays Travel coach available for larger staff transport groups',
    closing: 'A better-planned journey to work.',
  },
  'event-coach-hire': {
    slug: 'event-coach-hire',
    title: 'Event Coach Hire in London',
    description: 'Premium event coach hire in London for conferences, exhibitions and private occasions. Professional drivers and tailored group transport with 17+ years of industry experience.',
    intro: 'The journey is part of the occasion. Welcome guests with premium coach and minibus transport, professional drivers and a schedule built around your event. Our 17+ years of industry experience helps bring the hotel, venue and return journey into one considered plan.',
    hero: coachFilm('v1787915285/IMG_5928_1_esggvf', 'A closer look at our fleet. Vehicles for your event are agreed around capacity, luggage and facilities.'),
    sections: [
      {
        heading: 'Conferences, exhibitions and guest arrivals',
        text: 'Plan group movements between London hotels, offices, stations and venues, including ExCeL, Olympia and the QEII Centre. Send the event schedule and passenger requirements so we can discuss collection points, arrival windows and the return. For guests flying in, airport transfers can be planned alongside the venue journeys.',
        links: [{ label: 'Heathrow group transfers', href: '/services/airport-transfers/heathrow' }, { label: 'Corporate transport', href: '/services/corporate' }],
      },
      {
        heading: 'Premium presentation, professional drivers',
        text: 'Well-presented vehicles and uniformed drivers help make the arrival feel considered. Choose a vehicle around the guest experience as well as passenger numbers. Our team discusses your itinerary, contact arrangements and any specific requirements before the booking, so the service reflects the occasion.',
      },
      {
        heading: 'One event. Several collection points.',
        text: 'If guests are staying at different hotels or travelling in separate groups, include each pickup and the required arrival time. For larger movements, ask about coordinating more than one vehicle and timed departures. Share venue access information and the organiser’s contact details so the collection and return arrangements can be agreed.',
        links: [{ label: 'Compare event coaches', href: '/fleet/executive-coaches' }, { label: 'Minibuses for smaller guest groups', href: '/fleet/luxury-minibuses' }],
      },
      {
        heading: 'Hospitality, concerts and private occasions',
        text: 'Arrange group journeys to hospitality events, concerts, sporting occasions and celebrations, with the return planned at the same time. Tell us if the driver is needed between venues or if the finish time may change. For wedding guest movements between the ceremony, reception and hotels, explore our dedicated wedding service.',
        links: [{ label: 'Wedding guest transport', href: '/services/weddings-events' }, { label: 'Private coach hire', href: '/services/private-hire' }],
      },
      {
        heading: 'Give us the running order',
        text: 'Send the event date, guest numbers, collection addresses, venue, arrival deadline and final departure time. Add luggage, mobility requirements, stops and any guest groups arriving separately. We will discuss suitable vehicles and provide a personal quotation for the agreed itinerary, with the inclusions set out for your booking.',
        links: [{ label: 'Plan your event transport', href: '/book' }, { label: 'Meet Everydays Travel', href: '/about' }],
      },
    ],
    cabin: { ...V_CLASS_VIDEOS[2], caption: 'Our V-Class interior, an option for smaller VIP parties. Ask us about the facilities on your chosen event vehicle.' },
    image: CORPORATE_IMAGES[1],
    imageAlt: 'An Everydays Travel coach for event and conference group transport',
    closing: 'Give your guests a considered arrival.',
  },
}


export const WEST_LONDON_SERVICE: BusinessService = {
  slug: 'west-london',
  path: '/areas/west-london',
  title: 'Coach Hire in West London',
  description: 'Premium West London coach and minibus hire with professional drivers and 17+ years of industry experience. Private, school, corporate and airport group travel.',
  intro: 'Premium group travel from West London, planned around your people and your day. From our Feltham depot, we arrange coach and minibus hire with professional drivers for local collections, Heathrow transfers and journeys further afield. Bringing 17+ years of industry experience to every itinerary.',
  hero: coachFilm('v1790949398/IMG_3033_unp5tm', 'Explore the Everydays Travel fleet, based in Feltham. Your vehicle is selected around your group and itinerary.'),
  sections: [
    {
      heading: 'A local starting point for your journey',
      text: 'Planning a collection in Feltham, Hounslow, Heathrow, Brentford, Ealing or Chiswick? Send the full address and passenger numbers so we can discuss a suitable vehicle and pickup arrangement. We plan around the actual meeting point, access and timetable rather than assuming every London address works for every coach.',
      links: [{ label: 'Discuss your collection point', href: '/contact' }],
    },
    {
      heading: 'Professional drivers. Premium presentation.',
      text: 'A well-presented vehicle and a professional, uniformed driver help set the tone for your journey. Our team discusses the route, timings and requirements before booking, whether you are welcoming clients, moving colleagues or bringing family and friends together. With 17+ years of industry experience, we focus on the details of your itinerary.',
      links: [{ label: 'About Everydays Travel', href: '/about' }, { label: 'Read customer reviews', href: '/reviews' }],
    },
    {
      heading: 'West London to Heathrow and beyond',
      text: 'Arrange a private group transfer between your West London collection point and Heathrow, or an onward journey from the airport to a hotel, workplace or venue. Include the flight number, suitcase quantities and destination. Collection, waiting and meet-and-greet arrangements are agreed for the selected vehicle and terminal.',
      links: [{ label: 'Heathrow coach and minibus transfers', href: '/services/airport-transfers/heathrow' }],
    },
    {
      heading: 'Workdays, school visits and occasions',
      text: 'Plan conference transport, recurring staff shuttles, school trips, wedding guest journeys and private days out. For schools, tell us the pupil and adult totals and any documentation required for your planning; drivers on school work are DBS checked. For events, share the guest collection points and the running order, including the return.',
      links: [{ label: 'Staff shuttle services', href: '/services/staff-shuttles' }, { label: 'Event coach hire', href: '/services/event-coach-hire' }, { label: 'School coach hire', href: '/services/school-trips' }, { label: 'Private hire', href: '/services/private-hire' }],
    },
    {
      heading: 'The right size for your group',
      text: 'Compare 16 and 19-seat minibuses with 35, 49, 53 and 55-seat coaches. Smaller parties can ask about an executive MPV. Tell us about luggage, equipment and mobility needs alongside the passenger count, so the seating, storage and any essential facilities can be confirmed for the booking.',
      links: [{ label: 'Compare executive coaches', href: '/fleet/executive-coaches' }, { label: 'Explore minibuses', href: '/fleet/luxury-minibuses' }, { label: 'Plan your West London journey', href: '/book' }],
    },
  ],
  cabin: { ...V_CLASS_VIDEOS[2], caption: 'Inside our V-Class, an executive option for smaller groups. Each vehicle has its own seating and facilities.' },
  image: CORPORATE_IMAGES[0],
  imageAlt: 'An Everydays Travel coach available for group travel from West London',
  closing: 'Your West London journey starts here.',
}
