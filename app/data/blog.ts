export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  date: string
  answer: string
  service: { label: string; href: string }
  checklist: string[]
  sections: { title: string; paragraphs: string[] }[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-choose-coach-size-london',
    title: 'What size coach do you need for your London group?',
    description: 'Compare minibus and coach sizes for London group travel. Plan around passengers, luggage and your itinerary before requesting a tailored quote.',
    category: 'Fleet advice', date: '2026-10-29',
    answer: 'Start with your passenger count, then allow for luggage, equipment and boarding needs. A vehicle with enough seats is only the right choice if it can also accommodate everything your group brings.',
    service: { label: 'Explore our executive coaches', href: '/fleet/executive-coaches' },
    checklist: ['Passenger count, including organisers', 'Suitcases, equipment and mobility requirements', 'Pickup points, destination and journey times'],
    sections: [
      { title: 'Count everyone travelling before comparing vehicles', paragraphs: ['Include organisers, teachers, guides and any other accompanying passengers in the headcount. If attendance is still changing, tell us your expected number and when it will be confirmed. Do not choose a smaller vehicle on the assumption that some guests will travel separately.', 'Everydays Travel offers 7-seat group MPVs, 16- and 19-seat minibuses, and 35-, 49-, 53- and 55-seat coaches. These are seating capacities rather than a promise that every configuration will suit every journey. Availability and the requirements of your group determine the recommendation.'] },
      { title: 'Match the luggage to the vehicle as well as the seats', paragraphs: ['A day trip with small bags is different from an airport transfer with a suitcase for every passenger. Sports kit, instruments, exhibition materials and pushchairs also need to be considered. Send a practical luggage list rather than simply saying that the group has bags.', 'For example, a group of 16 people carrying large suitcases may need a different recommendation from 16 guests travelling to a local dinner. Ask us to confirm luggage space for the proposed vehicle before you accept the quote. Keep aisles and exits clear rather than treating unused seats as storage.'] },
      { title: 'Consider the journey and boarding requirements', paragraphs: ['Share the duration of the trip, additional stops and any facilities that matter to your passengers. If you need a particular feature, ask us to confirm it for the allocated vehicle; do not assume that every vehicle has the same specification.', 'Tell us about mobility aids, boarding assistance and access needs before booking. The team can then discuss suitability instead of discovering a mismatch at collection. For children requiring a seat, speak to us about bringing your own and confirming compatibility in advance.'] },
      { title: 'Give us the whole itinerary for a useful recommendation', paragraphs: ['Include all pickup points, required arrival times, waiting periods and the return plan. A larger vehicle may require a different meeting point from a car or smaller minibus, particularly at narrow entrances or restricted venue approaches.', 'A professional driver and a realistic itinerary are part of the service, alongside the vehicle itself. With 17+ years of industry experience, our team can discuss your requirements and prepare a tailored quote. Send your headcount and luggage list even if you are unsure which vehicle to choose.'] },
    ],
  },
  {
    slug: 'heathrow-group-transfer-planning-checklist',
    title: 'Heathrow group transfers: a planning checklist for organisers',
    description: 'Plan a Heathrow coach or minibus transfer with flight details, terminal information, luggage requirements and a clear group meeting plan.',
    category: 'Airport travel', date: '2026-10-29',
    answer: 'For a well-planned Heathrow transfer, share the flight number, terminal, passenger count and luggage details first. Then agree the meeting arrangements and onward itinerary with your transport team.',
    service: { label: 'Heathrow coach hire', href: '/services/airport-transfers/heathrow' },
    checklist: ['Flight number, date and terminal', 'Passenger count and luggage list', 'Lead passenger contact and onward address'],
    sections: [
      { title: 'Build the plan around the flight, not just a collection time', paragraphs: ['Provide the flight number, travel date and terminal, including whether you are arriving or departing. For an arriving group, the scheduled landing time is not the time everyone will be ready to board: baggage collection, immigration and gathering the party can all affect readiness.', 'For a departure, work backwards from your airline’s check-in requirements and leave room for the journey from your pickup point. Share the airline’s requirements with us rather than relying on a fixed travel-time estimate. Traffic and the route can change what is practical.'] },
      { title: 'Agree a meeting plan that works for a group', paragraphs: ['Nominate one lead passenger and provide a mobile number that will work in the UK. Agree who will contact the transport team when the group is ready, and share the final instructions with everyone travelling. A screenshot of a generic terminal map is not a substitute for confirmed collection arrangements.', 'Coach collection arrangements can differ from car pickups. Confirm the exact meeting instructions with us before travel and follow the instructions supplied for your booking. Do not assume a coach can wait at a car drop-off point or outside a terminal door.'] },
      { title: 'Describe the luggage and the onward journey', paragraphs: ['Tell us the number and approximate size of suitcases as well as any bulky items. A group travelling with exhibition equipment or musical instruments needs a different conversation from passengers with cabin bags only. Share any boarding or mobility needs at the same time.', 'Give full destination addresses, hotel names and any planned intermediate stops. If several hotels are involved, list them before requesting a quote so that the route and time allocation can be considered together.'] },
      { title: 'Confirm what happens if the schedule changes', paragraphs: ['Ask how to contact the team about a delayed flight, terminal change or a passenger who has not arrived. Confirm waiting arrangements and any additional charges in your quotation; do not assume unlimited waiting is included.', 'Our premium service combines professional drivers with a journey planned around your group. Send us the flight details and onward itinerary for a tailored quote. We will discuss the arrangements needed for your booking without relying on a generic airport transfer price.'] },
    ],
  },
  {
    slug: 'wedding-guest-coach-transport-checklist',
    title: 'How to plan wedding guest coach transport in London',
    description: 'Organise wedding guest transport with practical advice on hotel pickups, venue access, ceremony arrivals and evening return journeys.',
    category: 'Weddings & events', date: '2026-10-29',
    answer: 'Plan wedding transport around the ceremony arrival time, guest pickup locations and evening returns. One clear itinerary helps guests travel together and gives your driver the detail needed to prepare.',
    service: { label: 'Wedding and event transport', href: '/services/weddings-events' },
    checklist: ['Guest numbers at each collection point', 'Ceremony and reception venue addresses', 'Arrival deadline and evening departure plan'],
    sections: [
      { title: 'Choose pickup points guests can find easily', paragraphs: ['Start with where guests are staying. A small number of clear hotel or meeting-point pickups can be easier to communicate than collecting each guest from a different address. Confirm passenger numbers at each stop and provide the final collection instructions before the day.', 'Check with each hotel that the proposed meeting point is suitable for a coach. Include the correct entrance and an organiser’s contact number. Guests should know when to be ready to board, rather than assuming the departure time is when they should start arriving.'] },
      { title: 'Work backwards from the ceremony', paragraphs: ['Give the transport team the time guests must arrive at the venue, separately from the ceremony start time. Allow time for boarding, unloading and guests walking to the entrance. Discuss a realistic schedule rather than treating a map estimate as a guaranteed journey time.', 'If the ceremony and reception are at different locations, include both movements in your quote request. Share photography plans or other events that affect when the group will be ready to leave. Agree who can authorise a change if the day runs behind.'] },
      { title: 'Check venue access before finalising the vehicle', paragraphs: ['Ask the venue about coach entrances, turning space and where a vehicle may collect or set down guests. A country-house driveway or a central London street can need different arrangements from the main entrance used by cars.', 'Tell us about any guests needing boarding assistance and discuss vehicle suitability in advance. If particular facilities matter, have them confirmed for the proposed vehicle. Premium travel starts with matching the transport to the people and the venue.'] },
      { title: 'Make the evening return as clear as the outward journey', paragraphs: ['Decide whether everyone returns together or whether you need separate departure times. Give the team the final destination for each return and ask how waiting or additional journeys will be reflected in the quote.', 'Share the agreed departure points and times with guests and nominate a contact who will be available on the day. With 17+ years of industry experience and professional drivers, Everydays Travel can help you discuss the full itinerary. Request a tailored quote with both the outward and return arrangements.'] },
    ],
  },
  {
    slug: 'school-trip-coach-booking-checklist',
    title: 'School trip coach hire: a checklist for London teachers',
    description: 'Prepare a school coach hire enquiry with pupil and staff numbers, venue access, equipment, boarding needs and return arrangements.',
    category: 'School travel', date: '2026-10-29',
    answer: 'Count pupils and accompanying adults, confirm the venue arrival window and share your school’s transport requirements before requesting a coach. A complete itinerary gives you a clearer basis for assessing the proposal.',
    service: { label: 'School coach hire', href: '/services/school-trips' },
    checklist: ['Total pupils and accompanying adults', 'School collection and venue arrival times', 'Equipment, boarding needs and school requirements'],
    sections: [
      { title: 'Include staff and equipment in the enquiry', paragraphs: ['Count everyone who will travel, including teachers, support staff and other accompanying adults. Explain whether the trip involves sports bags, instruments, packed lunches or overnight luggage. These details help the team consider the right vehicle alongside the passenger total.', 'Tell us if the trip needs several vehicles and whether groups must arrive together. If numbers are provisional, make that clear and ask when the final headcount is needed. Do not assume a change in numbers can always be accommodated in the same vehicle.'] },
      { title: 'Confirm the school and venue access arrangements', paragraphs: ['Supply full addresses and the entrance used for coach access. Ask the venue about collection and set-down arrangements, arrival slots and whether a coach can wait. Tell us about school-gate restrictions or roads that may make collection difficult.', 'Share the required arrival time separately from the start of an activity. Time is needed for boarding, counting the group and reaching the venue entrance after the coach arrives. The return plan should include a clear meeting point and the time pupils are expected back at school.'] },
      { title: 'Discuss your school’s requirements before booking', paragraphs: ['Your school should apply its own visit approval, supervision and transport assessment procedures. Share any documents or vehicle and driver requirements you need the transport provider to confirm. Request the relevant evidence rather than relying on a general description of a service.', 'Raise accessibility, boarding assistance and any child-seat questions early. Everydays Travel does not supply child seats; discuss bringing your own and confirming fit where needed. Passenger supervision and the arrangements for checking the group on and off the coach should be agreed by the school.'] },
      { title: 'Give the driver a clear itinerary and a contact', paragraphs: ['Nominate a trip leader and a contact number for the day. Include each stop, any fixed activity times and the planned return. If a visit could overrun, ask in advance how schedule changes should be communicated and what may affect the booking.', 'Our team brings 17+ years of industry experience to planning group journeys with professional drivers. Send the route, timetable and requirements for a tailored school travel quote, then review the proposal through your school’s normal approval process.'] },
    ],
  },
]
