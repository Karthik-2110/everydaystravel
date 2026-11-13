import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SERVICES } from '../ServiceList'

const BENEFITS: Record<string, [string, string]> = {
  'airport-transfers': ['Start your journey with everyone together', 'Send your flight details and case count. We will help match your group to a vehicle and plan collection around your arrival or departure.'],
  corporate: ['A cabin that suits your working day', 'From a private client transfer to a full-team coach, choose around passenger numbers and the facilities your colleagues need.'],
  'private-hire': ['Your day out, with the transport taken care of', 'Share the stops, passenger numbers and return time. We will recommend a vehicle so your group can enjoy the journey together.'],
  'weddings-events': ['Give your guests a comfortable journey', 'Plan hotel collections, venue transfers and the journey home together. Tell us who is travelling and how each part of the day should run.'],
  'school-trips': ['Room for pupils, staff and the day’s essentials', 'Include staff in your passenger count and tell us about bags, equipment and access needs. Confirm the vehicle and seating arrangements before booking.'],
  'group-travel': ['Comfort for the journey, space for the group', 'For a day out or a longer tour, compare the cabin and storage options. Ask about reclining seats, charging and an onboard WC for your chosen coach.'],
  'sports-team-travel': ['Bring the team and the kit', 'Send your squad size, equipment list and fixture times. Ask about luggage capacity, charging and cabin comfort for the trip home.'],
  'cruise-port-transfers': ['Plan for the passengers and every case', 'Cruise luggage needs room of its own. Share the number and size of your bags alongside terminal details so we can recommend a suitable vehicle.'],
  'executive-travel': ['Choose the cabin your guests will travel in', 'Compare our S-Class and V-Class for individual passengers and smaller parties. Tell us about luggage, privacy and any specific cabin requirements.'],
  'staff-shuttles': ['Make regular journeys comfortable', 'Match your vehicle to the number travelling on each shift. Discuss seating, luggage and the facilities that matter for a recurring workplace route.'],
  'event-coach-hire': ['Make the journey part of the guest experience', 'Choose around guest numbers, collection points and the occasion. We can discuss minibuses, coaches and chauffeur cars for different parts of your event.'],
}

export default function ServiceFacilities({ slug }: { slug: string }) {
  const service = SERVICES.find(service => service.slug === slug)
  const benefit = BENEFITS[slug]
  if (!service || !benefit) return null
  const images = service.images ?? [service.image]
  return (
    <section className="border-t border-white/10 bg-[#0C0F1C] py-16 lg:py-24" aria-label={`${service.name} vehicles and facilities`}>
      <div className="site-container">
        <h2 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-white sm:text-4xl">{benefit[0]}</h2>
        <p className="mt-5 max-w-[70ch] text-base leading-relaxed text-white/70">{benefit[1]}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[{ image: images[0], title: 'Match the vehicle to your group', text: 'Chauffeur cars, minibuses and coaches for different party sizes. Share your passenger count so we can recommend a suitable option.' },
            { image: images[1] ?? images[0], title: 'See the cabin before you book', text: 'Explore our real fleet photos and compare seating and cabin layouts. Tell us about any mobility or access requirements.' },
            { image: images[2] ?? images[0], title: 'Choose the facilities you need', text: 'Ask about WiFi, charging, air conditioning, luggage capacity and onboard WC. Facilities vary by vehicle and are confirmed with your booking.' }].map(item => (
            <figure key={item.title} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1221]">
              <div className="relative aspect-[3/2]"><Image src={item.image} alt={`${service.name}: ${item.title}`} fill unoptimized sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /></div>
              <figcaption className="p-5"><h3 className="text-lg font-semibold text-white">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-white/65">{item.text}</p></figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Link href="/book" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#EBBA6F] px-6 py-3 font-semibold text-[#0C0F1C] hover:bg-[#DDA85E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBBA6F]">Request a {service.name.toLowerCase()} quote<ArrowUpRight size={18} aria-hidden /></Link>
          <Link href="/fleet" className="text-sm font-medium text-[#EBBA6F] underline underline-offset-4 hover:text-white">Compare vehicles and facilities</Link>
        </div>
        <p className="mt-4 text-sm text-white/55">For a tailored quote, include your date, pickup, destination, passenger numbers and any essential facilities.</p>
      </div>
    </section>
  )
}
