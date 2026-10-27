import type { LandingPageContent } from './landing-content'

export const HEATHROW_PATH = '/services/airport-transfers/heathrow'
export const PRICING_PATH = '/guides/coach-hire-prices-london'

export const SEO_PAGE_CONTENT: Record<string, LandingPageContent> = {
  'business-services': {
    heading: 'A service shaped around your business',
    intro: 'Explore dedicated support for recurring employee journeys and event guest transport, with premium vehicles and professional drivers.',
    sections: [
      { heading: 'Staff shuttle services', text: 'Plan station connections, workplace transfers and inter-site journeys around your team’s schedule.', links: [{ label: 'Explore staff shuttles in London', href: '/services/staff-shuttles' }] },
      { heading: 'Event coach hire', text: 'Bring airport, hotel and venue movements into an agreed itinerary for your guests and delegates.', links: [{ label: 'Explore event coach hire in London', href: '/services/event-coach-hire' }] },
    ],
  },
  'airport-links': {
    heading: 'Planning a Heathrow group transfer?',
    intro: 'Explore our dedicated Heathrow service for airport collections, hotel transfers and onward journeys with a private vehicle and driver.',
    sections: [{
      heading: 'Your airport journey, planned together',
      text: 'Tell us about the flight, passengers, luggage and destination. We will discuss the appropriate vehicle, collection arrangements and the service included in your quotation.',
      links: [{ label: 'Heathrow coach and minibus hire', href: HEATHROW_PATH }, { label: 'Understand your tailored quote', href: PRICING_PATH }],
    }],
  },
  heathrow: {
    heading: 'Private Heathrow transfers for your whole group',
    intro: 'With 17+ years of industry experience, Everydays Travel operates from Feltham, arranging private coach and minibus transfers between Heathrow, London hotels, venues, offices and destinations elsewhere in the UK. Your vehicle and driver are booked around an agreed itinerary, rather than a shared airport service.',
    sections: [
      {
        heading: 'Arriving at Heathrow',
        text: 'Send your flight number, arrival date, terminal if known, passenger count and destination. We track flights, but the collection also needs to allow for passport control and baggage reclaim. Your booking confirmation should set out the meeting point, contact arrangements and waiting allowance. Confirm the arrangements for your allocated vehicle before travelling.',
      },
      {
        heading: 'Coach collections and meet-and-greet',
        text: 'A coach collection and a chauffeur-car pickup need different arrangements. Tell us if you require a named meet-and-greet service and how the group will stay together after collecting luggage. We will agree the collection plan for the terminal and vehicle. Do not assume the driver can wait at the terminal door or that every vehicle uses the same pickup point.',
      },
      {
        heading: 'Choose seats and luggage space together',
        text: 'Compare 16 and 19-seat minibuses with 35, 49, 53 and 55-seat coaches. For a smaller party, ask about the V-Class MPV. Give us suitcase numbers and sizes, hand luggage, pushchairs and any equipment. We will confirm the passenger and luggage combination before allocating a vehicle; seat count alone does not establish luggage capacity.',
        links: [{ label: 'Compare airport minibuses', href: '/fleet/luxury-minibuses' }, { label: 'Compare coach capacities', href: '/fleet/executive-coaches' }, { label: '16-seat minibus hire', href: '/fleet/luxury-minibuses/16-seater-minibus' }],
      },
      {
        heading: 'Hotels, conferences and onward journeys',
        text: 'Arrange a single airport-to-hotel transfer, a return booking, or transport between hotels and venues after your flight. Corporate groups can include conference arrivals, staff movements and roadshows in the enquiry. For tours or a cruise connection, send the full itinerary and luggage requirements so the onward journey can be planned together.',
        links: [{ label: 'Corporate transport', href: '/services/corporate' }, { label: 'Group tours from London', href: '/services/group-travel' }, { label: 'Cruise port transfers', href: '/services/cruise-port-transfers' }],
      },
      {
        heading: 'Departures and early flights',
        text: 'For a journey to Heathrow, provide the flight departure time and the check-in time advised by your airline, as well as your collection address. Tell us about extra pickups and the size of the group. Early and late journeys can be arranged in advance; office hours and the hours vehicles operate are different.',
      },
      {
        heading: 'Delays, waiting and changes',
        text: 'Give us your flight number for tracking and contact us if the itinerary changes. Ask what waiting time the quote includes and how additional waiting is charged. A changed flight or late departure may require a revised schedule, subject to vehicle availability and the driver’s remaining hours. Agree these details before confirming your booking.',
        links: [{ label: 'Airport and booking FAQs', href: '/faqs' }],
      },
      {
        heading: 'Heathrow coach hire prices',
        text: 'Your quote depends on the vehicle, passenger and luggage requirements, terminal, destination, date, timings and any waiting or additional stops. Ask for airport collection and parking charges to be identified, along with any applicable road charges. A return transfer is quoted around both journeys and their timings.',
        links: [{ label: 'London coach hire pricing guide', href: PRICING_PATH }, { label: 'Request a Heathrow transfer quote', href: '/book' }],
      },
      {
        heading: 'Accessibility and travelling with children',
        text: 'Tell us about wheelchair access or other mobility needs before we allocate the vehicle. Accessible arrangements and any effect on seating must be confirmed for your booking. We do not supply child seats; bring your own and discuss fitting and the appropriate vehicle with us in advance. Include every child in your passenger total.',
        links: [{ label: 'Discuss your group’s requirements', href: '/contact' }, { label: 'All London airport transfers', href: '/services/airport-transfers' }, { label: 'West London coach hire', href: '/areas/west-london' }],
      },
    ],
  },
  'london-pricing': {
    heading: 'Premium service, tailored to your journey',
    intro: 'With 17+ years of industry experience, Everydays Travel brings together premium vehicles, professional drivers and itinerary planning for London group travel. We provide a personal quotation for your journey. This guide explains the service behind that quote and the details we need to plan it well.',
    sections: [
      {
        heading: 'Professional drivers and thoughtful planning',
        text: 'Your driver is part of the service, from a well-presented arrival to the agreed collections and return. Our team plans around the full itinerary, including stops and waiting, and discusses any requirements before the journey. For school work, drivers are DBS checked. Ask us about the vehicle and driver documentation relevant to your booking.',
        links: [{ label: 'About Everydays Travel', href: '/about' }, { label: 'Read customer reviews', href: '/reviews' }, { label: 'Coach hire in West London', href: '/areas/west-london' }],
      },
      {
        heading: 'Vehicle size and specification',
        text: 'Passenger count, luggage and the facilities you need determine which vehicle is suitable. A smaller vehicle is worth considering when it comfortably holds the whole party and its bags. Compare the actual specification, including any required WC or accessibility arrangements, rather than assuming all coaches of the same size are identical.',
        links: [{ label: 'Compare 35 to 55-seat coaches', href: '/fleet/executive-coaches' }, { label: 'Compare 7 to 19-seat group vehicles', href: '/fleet/luxury-minibuses' }],
      },
      {
        heading: 'Route, duration and waiting time',
        text: 'An airport transfer, a local return journey and a full-day itinerary use the vehicle differently. Include every pickup, stop and return leg in your enquiry. State whether the driver needs to wait at the venue or return later. The quote must allow for the complete schedule and appropriate driver breaks, not just the time passengers spend aboard.',
      },
      {
        heading: 'Travel dates and availability',
        text: 'The date and timings affect the vehicles and drivers available. If your schedule is flexible, give us alternative dates or departure times and ask us to compare them. Requesting a quote early gives you more time to choose and confirm a suitable option; it does not guarantee a particular discount.',
      },
      {
        heading: 'What is included, and what needs checking?',
        text: 'The vehicle, driver and fuel are included in the quoted hire. Ask for parking, airport collection charges, tolls and any applicable London road charges to be listed as included or additional. For overnight or overseas journeys, check driver accommodation, crossings and other itinerary costs. Your written quotation should identify which charges apply to your booking.',
        links: [{ label: 'Ask about your price inclusions', href: '/contact' }, { label: 'Booking FAQs', href: '/faqs' }],
      },
      {
        heading: 'One-way, return and full-day hire',
        text: 'Tell us which arrangement you need. A one-way quote covers the agreed transfer; a return quote needs both departure times; a day-hire enquiry needs the itinerary, waiting and final finish time. Do not compare a short transfer price with a vehicle retained for a whole day. Ask each provider to quote for the same movements.',
        links: [{ label: 'Private coach hire', href: '/services/private-hire' }, { label: 'Heathrow coach transfers', href: HEATHROW_PATH }],
      },
      {
        heading: 'How to compare cost per passenger',
        text: 'Divide the total quoted price, including any additional charges, by the number of passengers actually travelling. Use that same passenger count when comparing alternatives. Filling more seats reduces the share per passenger only when the vehicle and total booking price stay the same.',
      },
      {
        heading: 'Compare quotations on the same basis',
        text: 'Check the passenger and luggage capacity, vehicle standard, driver, route, dates, waiting time and price inclusions. Ask what happens if timings change, how long the quote remains valid and what confirms the booking. Payment, deposits and cancellation arrangements should be supplied in writing for your booking; do not assume another operator’s terms apply.',
      },
      {
        heading: 'Get your London coach hire price',
        text: 'Send your travel date, total passengers, pickup and destination addresses, outward and return times, stops and waiting requirements. Add luggage, mobility needs and any essential facilities. For Heathrow arrivals include the flight number; for multi-day work include each day’s programme. We can then recommend a suitable vehicle and quote for the actual journey.',
        links: [{ label: 'Request your tailored quote', href: '/book' }, { label: 'School trip planning', href: '/services/school-trips' }, { label: 'Corporate transport planning', href: '/services/corporate' }],
      },
    ],
  },
}
