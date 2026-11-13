import type { Vehicle } from './VehicleList'
import { EXECUTIVE_COACHES, LUXURY_MINIBUSES, CHAUFFEUR_CARS } from '../data/fleet'

// Services reuse the Vehicle shape so service pages render through VehicleDetail
// with an identical layout. `seats` holds the card tagline; `luggage` is unused.

const fleet = [...EXECUTIVE_COACHES, ...LUXURY_MINIBUSES, ...CHAUFFEUR_CARS]
const photos = (slug: string) => {
  const vehicle = fleet.find(vehicle => vehicle.slug === slug)!
  return vehicle.images ?? [vehicle.image]
}
const coach = photos('53-seater-coach')
const tourer = photos('55-seater-neoplan-tourliner')
const midi = photos('35-seater-turas-midi')
const minibus = photos('16-seater-minibus')
const saloon = photos('mercedes-s-class')
const mpv = photos('7-seater-mpv-v-class')

// Mix vehicle sizes and cabin views so visitors can compare their journey options.
export const SERVICE_IMAGES: Record<string, string[]> = {
  'private-hire': [midi[0], midi[3], minibus[0], coach[0]],
  corporate: [coach[6], mpv[1], saloon[0], midi[3]],
  'weddings-events': [saloon[0], mpv[1], minibus[0], coach[6]],
  'school-trips': [coach[0], midi[3], midi[0], minibus[0]],
  'group-travel': [tourer[0], midi[3], coach[0], minibus[0]],
  'sports-team-travel': [photos('49-seater-mercedes-turismo')[1], midi[3], tourer[0], minibus[0]],
  'cruise-port-transfers': [tourer[0], mpv[1], coach[6], minibus[0]],
  'executive-travel': [saloon[0], mpv[1], saloon[5], mpv[0]],
  'staff-shuttles': [coach[6], midi[3], minibus[0], mpv[1]],
  'event-coach-hire': [tourer[0], midi[3], saloon[0], coach[6]],
}


/** Real airport photos — first is the card, the rest fill the service gallery. */
export const AIRPORT_TRANSFER_IMAGES = [
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1200,c_limit/v1783787064/IMG_6170_fxbudt.jpg',
  'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1200,c_limit/v1783784630/20260211_134438550_iOS_okfp39.jpg',
]

/**
 * Corporate work photographed as it actually goes out: the 53-seater that
 * carries a conference group, the 49-seater, and the S-Class that carries one
 * director. Same reason the airport service has its own photos rather than the
 * stand-in — a placeholder argues we have nothing to show.
 */
export const CORPORATE_IMAGES = [coach[6], photos('49-seater-mercedes-turismo')[1], saloon[0]]

const SERVICE_CATALOGUE: Vehicle[] = [
  {
    slug:        'airport-transfers',
    name:        'Airport Transfers',
    badge:       'Transfers',
    image:       AIRPORT_TRANSFER_IMAGES[0],
    images:      AIRPORT_TRANSFER_IMAGES,
    seats:       'All major UK airports',
    luggage:     'Luggage assistance included',
    description: 'Reliable airport transfers to and from all major UK airports: on-time pickups, luggage assistance and stress-free journeys for individuals and groups.',
    features:    ['Live flight tracking', 'Meet & greet service', '24/7 availability', 'Luggage assistance', 'Professional uniformed drivers', 'Bring your own child seat; tell us when booking'],
    idealFor:    ['Business Travellers', 'Family Holidays', 'Group Travel', 'Wedding Parties', 'Sports Teams', 'Tour Groups'],
  },
  {
    slug:        'corporate',
    name:        'Corporate Travel',
    badge:       'Corporate',
    image:       CORPORATE_IMAGES[0],
    images:      CORPORATE_IMAGES,
    seats:       'Executive business transport',
    luggage:     'Luggage assistance included',
    description: 'Bring colleagues and clients together for meetings, conferences and airport connections. Compare chauffeur cars, executive minibuses and coaches, and tell us which cabin facilities and arrival times matter for your business journey.',
    features:    ['Punctual, professional service', 'Uniformed chauffeurs', 'Onboard WiFi', 'Privacy glass', 'Account management available', 'Flexible scheduling'],
    idealFor:    ['Corporate Events', 'Conferences & Exhibitions', 'Staff Shuttles', 'Away Days', 'Business Roadshows', 'Airport Transfers'],
  },
  {
    slug:        'private-hire',
    name:        'Private Hire',
    badge:       'Private Hire',
    image:       CORPORATE_IMAGES[1],
    seats:       'Your schedule, your route',
    luggage:     'Luggage assistance included',
    description: 'Keep your group together for days out, celebrations and journeys with multiple stops. Choose a minibus or coach around your passenger numbers, bags and itinerary, with a professional driver and a return planned before you travel.',
    features:    ['Fully flexible itineraries', 'Door-to-door service', 'Premium vehicles', 'Professional uniformed drivers', 'Extended waiting available', 'Refreshments on request'],
    idealFor:    ['Day Trips', 'Special Occasions', 'Family Travel', 'Private Groups'],
  },
  {
    slug:        'weddings-events',
    name:        'Wedding & Events',
    badge:       'Weddings',
    image:       coach[0],
    seats:       'Bridal & guest logistics',
    luggage:     'Luggage assistance included',
    description: 'Bring guests from hotels to the ceremony and reception with collection and return times agreed around your day. Combine chauffeur cars, minibuses and coaches to suit your party, so guests can enjoy the celebration without arranging separate journeys.',
    features:    ['Ribbons & decoration on request', 'Bridal car & guest shuttles', 'Red carpet on arrival', 'Champagne on request', 'Dedicated event coordinator', 'Immaculate presentation'],
    idealFor:    ['Weddings', 'Proms', 'Special Occasions'],
  },
  {
    slug:        'school-trips',
    name:        'School Transport',
    badge:       'Education',
    image:       CORPORATE_IMAGES[0],
    seats:       'Safe, reliable school travel',
    luggage:     'Luggage assistance included',
    description: 'Plan school trips, educational visits and sports fixtures with passenger numbers, seatbelts, equipment and timings discussed before booking. Tell us your access requirements and we will help match a minibus or coach to your group.',
    features:    ['DBS-checked drivers', 'Seatbelts on every seat', 'Risk-assessment support', 'Wheelchair-accessible options', 'Experienced school-run drivers', 'Air conditioning'],
    idealFor:    ['School Trips', 'Educational Tours', 'Sports Fixtures'],
  },
  {
    slug:        'group-travel',
    name:        'Group Travel and Tours',
    badge:       'Tours',
    image:       coach[0],
    seats:       'UK & Europe group tours',
    luggage:     'Large luggage hold',
    description: 'Make the journey part of the day out. Travel together on UK trips and European tours with reclining seating, luggage space and facilities matched to the vehicle you choose. Send your itinerary for a tailored group quote.',
    features:    ['UK & Europe coverage', 'Itinerary planning support', 'Onboard WiFi', 'Reclining seats', 'Large luggage hold', 'Onboard WC on coaches'],
    idealFor:    ['Group Tours', 'Days Out', 'Europe Trips'],
  },
  {
    slug:        'sports-team-travel',
    name:        'Sports Team Travel',
    badge:       'Sports',
    image:       coach[0],
    seats:       'Match-day travel for teams',
    luggage:     'Kit & equipment storage',
    description: 'Get players, coaches and supporters to fixtures together. Share your squad size, kit requirements and match schedule so we can recommend a vehicle with suitable storage and plan the return around your team.',
    features:    ['Kit & equipment storage', 'Flexible match-day scheduling', 'Onboard WiFi', 'USB charging at every seat', 'Air conditioning', 'Experienced team drivers'],
    idealFor:    ['Sports Teams', 'Away Fixtures', 'Tournaments'],
  },
  {
    slug:        'cruise-port-transfers',
    name:        'Cruise Port Transfers',
    badge:       'Transfers',
    image:       coach[0],
    seats:       'Door to dock, luggage and all',
    luggage:     'Luggage assistance included',
    description: 'Start your cruise with one organised journey to the terminal. Tell us your port, sailing time, passenger numbers and case count so we can match the vehicle and luggage space to your party and plan your return transfer.',
    features:    ['All major UK cruise ports', 'Luggage assistance', 'Punctual arrivals', 'Group & family friendly', 'Meet & greet available', '24/7 availability'],
    idealFor:    ['Cruise Departures', 'Family Holidays', 'Group Travel'],
  },
  {
    slug:        'executive-travel',
    name:        'Executive Travel',
    badge:       'VIP',
    image:       coach[0],
    seats:       'First-class travel for VIPs',
    luggage:     'Luggage assistance included',
    description: 'Choose an S-Class or V-Class for client arrivals, meetings and private journeys. Explore the leather seating, privacy and cabin space in our fleet, then share your schedule for a chauffeur-driven quote tailored to your party.',
    features:    ['Luxury chauffeur-driven vehicles', 'Privacy glass', 'Bottled water provided', 'Concierge-level service', 'Discreet professional drivers', 'Flexible scheduling'],
    idealFor:    ['VIP Clients', 'Corporate Travel', 'Airport Transfers'],
  },
  {
    slug: 'staff-shuttles', name: 'Staff Shuttle Services', badge: 'Employee transport',
    image: CORPORATE_IMAGES[0], seats: 'Recurring workplace journeys', luggage: 'Confirm your requirements',
    description: 'Premium employee transport with professional drivers, backed by 17+ years of industry experience.',
    features: ['Professional uniformed drivers', 'Agreed pickup points', 'Workplace connections', 'Inter-site journeys', 'Recurring service planning', 'Account arrangements on request'],
    idealFor: ['Station Connections', 'Office Travel', 'Shift Patterns', 'Inter-site Travel'],
  },
  {
    slug: 'event-coach-hire', name: 'Event Coach Hire', badge: 'Events',
    image: CORPORATE_IMAGES[1], seats: 'Guest and delegate transport', luggage: 'Confirm your requirements',
    description: 'Premium London event transport with professional drivers and a schedule planned around your guests.',
    features: ['Professional uniformed drivers', 'Agreed itineraries', 'Multiple pickup planning', 'Vehicle selection support', 'Airport connections', 'Return journey planning'],
    idealFor: ['Conferences', 'Exhibitions', 'Hospitality', 'Private Events'],
  },

]

export const SERVICES: Vehicle[] = SERVICE_CATALOGUE.map(service => {
  const images = SERVICE_IMAGES[service.slug]
  return images ? { ...service, image: images[0], images } : {
    ...service, images: [...AIRPORT_TRANSFER_IMAGES, mpv[1], midi[3]],
  }
})
