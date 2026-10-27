export interface LandingSection {
  heading: string
  text: string
  links?: { label: string; href: string }[]
}

export interface LandingPageContent {
  heading: string
  intro: string
  sections: LandingSection[]
}

// Existing URLs own these topics. Keep commercial terms in the conditions of
// hire rather than duplicating deposits or cancellation figures in page copy.
export const LANDING_CONTENT: Record<string, LandingPageContent> = {
  home: {
    heading: 'London coach hire, planned around your group',
    intro: 'Our depot is in Feltham, serving London, Surrey and the surrounding areas. Hire a coach or minibus with a driver for a single transfer, a return trip or a longer itinerary across the UK and Europe.',
    sections: [
      {
        heading: 'Choose the vehicle for the passengers and the luggage',
        text: 'Our group vehicles range from a 7-seat MPV and 16 or 19-seat minibuses to 35, 49, 53 and 55-seat coaches. Seating capacity alone is not enough for an airport group or a team carrying equipment. Send us your headcount and luggage requirements so we can advise on the configuration.',
        links: [{ label: 'Compare minibuses with drivers', href: '/fleet/luxury-minibuses' }, { label: 'Compare executive coaches', href: '/fleet/executive-coaches' }, { label: 'West London coach hire', href: '/areas/west-london' }],
      },
      {
        heading: 'School trips, corporate events and private journeys',
        text: 'We arrange school visits and fixtures, conference transfers, wedding guest transport and private days out. Tell us about collection points, venue timings and the return journey, including any stops along the way. The transport can then be planned as one itinerary.',
        links: [{ label: 'School coach hire in London', href: '/services/school-trips' }, { label: 'Corporate coach hire', href: '/services/corporate' }, { label: 'Private coach and minibus hire', href: '/services/private-hire' }],
      },
      {
        heading: 'How much does coach hire in London cost?',
        text: 'The quote depends on the vehicle, date, route, waiting time and full itinerary. Driver hours and overnight arrangements can also affect longer journeys. Send the travel date, passenger numbers, pickup and destination, departure and return times, luggage and any additional stops. We will reply with a tailored price rather than a rate that may not fit your journey.',
        links: [{ label: 'Request a journey quote', href: '/book' }, { label: 'London coach hire pricing guide', href: '/guides/coach-hire-prices-london' }],
      },
      {
        heading: 'Know what your quote covers',
        text: 'The price covers the vehicle, driver and fuel. Other costs are charged separately unless your quotation says otherwise. Ask us to confirm parking, airport charges, road charges, crossings and driver accommodation where relevant. A quote becomes a booking once confirmed in writing and any required deposit has been paid.',
        links: [{ label: 'Read the conditions of hire', href: '/conditions-of-hire' }, { label: 'London airport group transfers', href: '/services/airport-transfers' }],
      },
    ],
  },
  'school-trips': {
    heading: 'School coach hire in London and Surrey',
    intro: 'Arrange transport for educational visits, school sports fixtures, longer tours and regular school journeys. Share the timetable and the needs of your group so the vehicle and route can be planned before the trip.',
    sections: [
      {
        heading: 'Count pupils, staff and equipment together',
        text: 'Include every pupil and accompanying adult in the passenger total. Tell us about sports kit, instruments, suitcases or other equipment, as well as any mobility requirements. We can discuss minibuses for smaller groups and 35 to 55-seat coaches for larger parties. Wheelchair arrangements and their effect on seating must be confirmed for the allocated vehicle.',
        links: [{ label: 'Compare school trip coaches', href: '/fleet/executive-coaches' }, { label: 'Minibuses for smaller school groups', href: '/fleet/luxury-minibuses' }],
      },
      {
        heading: 'Documentation for your school’s planning',
        text: 'Drivers on school work are DBS checked. Ask for the vehicle and driver documentation your school needs for its own risk assessment. Tell us about seatbelt, accessibility and supervision requirements when requesting the quote so these can be discussed before the booking is confirmed.',
        links: [{ label: 'School transport questions', href: '/faqs' }],
      },
      {
        heading: 'Plan arrival, collection and the return',
        text: 'Give us the school collection address, venue entrance, required arrival time and expected departure time. Let us know if the coach is needed during the visit or only for the outward and return journeys. Changes and waiting time should be planned into the itinerary, with driver breaks allowed for on longer days.',
      },
      {
        heading: 'Request a school transport quote',
        text: 'Send the date, pupil and adult numbers, route, timetable, equipment and accessibility requirements. For regular school runs or a series of fixtures, include the dates and frequency so we can discuss the full requirement. Confirm any essential onboard facilities before booking.',
        links: [{ label: 'Get a school trip quote', href: '/book' }, { label: 'Sports team transport', href: '/services/sports-team-travel' }],
      },
    ],
  },
  'private-hire': {
    heading: 'Your own coach and driver in London',
    intro: 'Private hire gives your group a vehicle for the agreed journey, whether that is a family day out, a celebration, a theatre visit or a longer trip from London. The route and timings are arranged around your booking.',
    sections: [
      {
        heading: 'Day trips, celebrations and evenings out',
        text: 'Book transport for family outings, birthdays, theatre trips or private events. Tell us if the driver should wait or return at an agreed time, and whether guests need collecting from several addresses. Wedding transport has its own service page for ceremony, reception and guest shuttle planning.',
        links: [{ label: 'Wedding guest transport', href: '/services/weddings-events' }, { label: 'Group tours and longer itineraries', href: '/services/group-travel' }],
      },
      {
        heading: 'A minibus or a full-size coach?',
        text: 'A 16 or 19-seat minibus can suit a smaller group; 35, 49, 53 and 55-seat coaches give larger groups more options. Tell us about suitcases, pushchairs, instruments or sports bags as well as passenger numbers. Confirm the luggage arrangement and any essential facilities for the selected vehicle.',
        links: [{ label: 'Compare private-hire minibuses', href: '/fleet/luxury-minibuses' }, { label: 'Compare coach sizes', href: '/fleet/executive-coaches' }],
      },
      {
        heading: 'Multiple pickups and a driver who waits',
        text: 'Include every collection point and stop in your enquiry, along with the final return time. Extended waiting and changes on the day depend on availability and the driver’s remaining hours, and may cost extra. If your event may run late, discuss that before booking so the schedule can allow for it.',
      },
      {
        heading: 'What we need to price your journey',
        text: 'Send your date, group size, pickup address, destination and departure and return times. Add luggage, accessibility needs and any extra stops. The quote covers the agreed itinerary; check which parking, road or venue charges apply. Bring your own child seats and discuss fitting with us before booking, as we do not supply them.',
        links: [{ label: 'Request a private-hire quote', href: '/book' }, { label: 'Booking conditions', href: '/conditions-of-hire' }],
      },
    ],
  },
  minibuses: {
    heading: 'Minibus hire with a driver in London',
    intro: 'Compare our 7-seat MPV, 16-seat minibuses and 19-seat minibus for private groups, airport transfers, weddings and business travel across London and Surrey.',
    sections: [
      {
        heading: 'Passenger numbers and luggage both matter',
        text: 'A full passenger load and a full set of suitcases may need a different configuration from a short local trip. Vehicle listings describe luggage space, but tell us the number and size of cases, pushchairs or equipment so we can confirm the allocation. For a group larger than 19, explore the 35-seat midi coach.',
        links: [{ label: '35-seat midi coach hire', href: '/fleet/executive-coaches/35-seater-turas-midi' }],
      },
      {
        heading: 'Luxury and VIP options',
        text: 'Compare the standard 16-seat luxury minibus with the VIP option using their individual photographs and specifications. Confirm any facility that matters to your group, including accessibility, WiFi and luggage capacity, before booking. Every hire includes a professional driver.',
        links: [{ label: '16-seat luxury minibus', href: '/fleet/luxury-minibuses/16-seater-minibus' }, { label: '16-seat VIP minibus', href: '/fleet/luxury-minibuses/16-seater-vip-sprinter' }, { label: '19-seat minibus', href: '/fleet/luxury-minibuses/19-seater-minibus' }],
      },
      {
        heading: 'Arrange the journey as well as the vehicle',
        text: 'Send the pickup, destination, travel date, passenger total, luggage and return time. Add any stops or waiting required. For airport journeys include the flight number. We do not supply child seats; bring your own and discuss the fitting arrangements with us in advance.',
        links: [{ label: 'Airport minibus transfers', href: '/services/airport-transfers' }, { label: 'Get a minibus quote', href: '/book' }],
      },
    ],
  },
  coaches: {
    heading: 'Executive and luxury coach hire in London',
    intro: 'Compare 35, 49, 53 and 55-seat coaches for school trips, conferences, private hire and UK or European tours. Each booking includes a driver, with the route and timetable agreed for your group.',
    sections: [
      {
        heading: 'Choose a coach by capacity and journey',
        text: 'The 35-seat Turas Midi offers a smaller coach option. The 49, 53 and 55-seat vehicles accommodate larger groups. Leave room for all passengers, including accompanying staff, and tell us about luggage or equipment. A larger seating capacity does not by itself confirm the space available for every case.',
        links: [{ label: '35-seat midi coach', href: '/fleet/executive-coaches/35-seater-turas-midi' }, { label: '49-seat coach', href: '/fleet/executive-coaches/49-seater-mercedes-turismo' }, { label: '53-seat coach', href: '/fleet/executive-coaches/53-seater-coach' }, { label: '55-seat coach', href: '/fleet/executive-coaches/55-seater-neoplan-tourliner' }],
      },
      {
        heading: 'Confirm the facilities you need',
        text: 'Use each vehicle page to compare seating, charging, climate control and entertainment. WC and refreshment facilities are listed on the larger coaches and should be confirmed for your booking. Tell us about wheelchair or other mobility needs before a vehicle is allocated.',
        links: [{ label: 'Corporate coach transport', href: '/services/corporate' }, { label: 'School trip transport', href: '/services/school-trips' }],
      },
      {
        heading: 'Price the full itinerary',
        text: 'Coach hire is quoted around the vehicle, date, route and time required. Include extra pickups, waiting and the final return time. Multi-day journeys may also need crossings and driver accommodation. Ask us to set out the inclusions and any additional charges in the written quotation.',
        links: [{ label: 'Request a coach quote', href: '/book' }, { label: 'Private coach hire', href: '/services/private-hire' }, { label: 'Conditions of hire', href: '/conditions-of-hire' }],
      },
    ],
  },
}

LANDING_CONTENT["16-seater-minibus"] = {
  "heading": "16 seater minibus hire in London",
  "intro": "A smaller group vehicle for private outings, wedding guests and airport transfers. Compare the standard luxury specification with the VIP minibus before choosing.",
  "sections": [
    {
      "heading": "Capacity, luggage and facilities",
      "text": "For an airport booking, send the number and size of suitcases as well as the passenger count. The vehicle listing describes space for 16 standard cases; confirm your actual luggage, pushchairs and any mobility requirements before booking.",
      "links": [
        {
          "label": "Compare the VIP minibus",
          "href": "/fleet/luxury-minibuses/16-seater-vip-sprinter"
        }
      ]
    },
    {
      "heading": "Plan your London journey",
      "text": "Send the travel date, passenger count, pickup and destination, outward and return times, luggage and any additional stops. Include waiting time or an overnight itinerary where needed. Every hire includes a professional driver; the quotation sets out the agreed journey and any additional charges.",
      "links": [
        {
          "label": "Request a vehicle quote",
          "href": "/book"
        },
        {
          "label": "Private hire planning",
          "href": "/services/private-hire"
        },
        {
          "label": "Booking questions",
          "href": "/faqs"
        }
      ]
    }
  ]
}

LANDING_CONTENT["16-seater-vip-sprinter"] = {
  "heading": "VIP minibus hire in London",
  "intro": "The 16-seat VIP option is for groups choosing an executive minibus for client travel, hospitality or a private occasion. Use the vehicle photographs and specification to decide which facilities matter to your booking.",
  "sections": [
    {
      "heading": "Capacity, luggage and facilities",
      "text": "Tell us about the passengers, luggage and appointments on the itinerary. Confirm the exact facilities and configuration in your quote rather than assuming every minibus is equipped identically.",
      "links": [
        {
          "label": "Compare the luxury minibus",
          "href": "/fleet/luxury-minibuses/16-seater-minibus"
        }
      ]
    },
    {
      "heading": "Plan your London journey",
      "text": "Send the travel date, passenger count, pickup and destination, outward and return times, luggage and any additional stops. Include waiting time or an overnight itinerary where needed. Every hire includes a professional driver; the quotation sets out the agreed journey and any additional charges.",
      "links": [
        {
          "label": "Request a vehicle quote",
          "href": "/book"
        },
        {
          "label": "Private hire planning",
          "href": "/services/private-hire"
        },
        {
          "label": "Booking questions",
          "href": "/faqs"
        }
      ]
    }
  ]
}

LANDING_CONTENT["19-seater-minibus"] = {
  "heading": "19 seater minibus hire in London",
  "intro": "Keep a group of up to 19 together for an event, airport transfer or private journey. This is the larger minibus option in our fleet, between the 16-seat vehicles and the 35-seat midi coach.",
  "sections": [
    {
      "heading": "Capacity, luggage and facilities",
      "text": "Include every passenger in your total and tell us about suitcases or equipment. For a group with substantial luggage or additional passengers, ask whether the midi coach is a more suitable allocation.",
      "links": [
        {
          "label": "Compare the 35-seat midi coach",
          "href": "/fleet/executive-coaches/35-seater-turas-midi"
        }
      ]
    },
    {
      "heading": "Plan your London journey",
      "text": "Send the travel date, passenger count, pickup and destination, outward and return times, luggage and any additional stops. Include waiting time or an overnight itinerary where needed. Every hire includes a professional driver; the quotation sets out the agreed journey and any additional charges.",
      "links": [
        {
          "label": "Request a vehicle quote",
          "href": "/book"
        },
        {
          "label": "Private hire planning",
          "href": "/services/private-hire"
        },
        {
          "label": "Booking questions",
          "href": "/faqs"
        }
      ]
    }
  ]
}

LANDING_CONTENT["35-seater-turas-midi"] = {
  "heading": "35 seater midi coach hire in London",
  "intro": "The Turas Midi suits a group that needs more room than a minibus without booking a full-size coach. Consider it for school visits, corporate away days and private tours from London or Surrey.",
  "sections": [
    {
      "heading": "Capacity, luggage and facilities",
      "text": "The listing includes reclining seats, climate control and an underfloor luggage hold. Tell us about the cases and equipment you need to carry, and confirm any essential facility before booking.",
      "links": [
        {
          "label": "Compare the 49-seat coach",
          "href": "/fleet/executive-coaches/49-seater-mercedes-turismo"
        }
      ]
    },
    {
      "heading": "Plan your London journey",
      "text": "Send the travel date, passenger count, pickup and destination, outward and return times, luggage and any additional stops. Include waiting time or an overnight itinerary where needed. Every hire includes a professional driver; the quotation sets out the agreed journey and any additional charges.",
      "links": [
        {
          "label": "Request a vehicle quote",
          "href": "/book"
        },
        {
          "label": "Private hire planning",
          "href": "/services/private-hire"
        },
        {
          "label": "Booking questions",
          "href": "/faqs"
        }
      ]
    }
  ]
}

LANDING_CONTENT["49-seater-mercedes-turismo"] = {
  "heading": "49 seater coach hire in London",
  "intro": "A full-size coach option for group tours, sports teams and corporate events. Share the complete itinerary, including collection points and the final return, so the schedule can be planned around your group.",
  "sections": [
    {
      "heading": "Capacity, luggage and facilities",
      "text": "The listed specification includes an onboard WC, charging and luggage storage. Confirm the facilities and luggage allocation for your booking, particularly on airport transfers, sports trips or multi-day tours.",
      "links": [
        {
          "label": "Compare the 53-seat coach",
          "href": "/fleet/executive-coaches/53-seater-coach"
        }
      ]
    },
    {
      "heading": "Plan your London journey",
      "text": "Send the travel date, passenger count, pickup and destination, outward and return times, luggage and any additional stops. Include waiting time or an overnight itinerary where needed. Every hire includes a professional driver; the quotation sets out the agreed journey and any additional charges.",
      "links": [
        {
          "label": "Request a vehicle quote",
          "href": "/book"
        },
        {
          "label": "Private hire planning",
          "href": "/services/private-hire"
        },
        {
          "label": "Booking questions",
          "href": "/faqs"
        }
      ]
    }
  ]
}

LANDING_CONTENT["53-seater-coach"] = {
  "heading": "53 seater coach hire in London",
  "intro": "For school trips, events and larger private groups, the 53-seat coach offers a single vehicle for up to 53 passengers. Count accompanying staff and all other travellers in that total.",
  "sections": [
    {
      "heading": "Capacity, luggage and facilities",
      "text": "The vehicle listing includes an onboard WC and refreshment area. Confirm any essential facilities, luggage and mobility arrangements before booking. If your party exceeds 53, compare the 55-seat option or ask about more than one vehicle.",
      "links": [
        {
          "label": "Compare the 55-seat coach",
          "href": "/fleet/executive-coaches/55-seater-neoplan-tourliner"
        }
      ]
    },
    {
      "heading": "Plan your London journey",
      "text": "Send the travel date, passenger count, pickup and destination, outward and return times, luggage and any additional stops. Include waiting time or an overnight itinerary where needed. Every hire includes a professional driver; the quotation sets out the agreed journey and any additional charges.",
      "links": [
        {
          "label": "Request a vehicle quote",
          "href": "/book"
        },
        {
          "label": "Private hire planning",
          "href": "/services/private-hire"
        },
        {
          "label": "Booking questions",
          "href": "/faqs"
        }
      ]
    }
  ]
}

LANDING_CONTENT["55-seater-neoplan-tourliner"] = {
  "heading": "55 seater coach hire in London",
  "intro": "The largest coach listed in our fleet, the Neoplan Tourliner accommodates up to 55 passengers for events, group tours and cruise transfers. It is also an option when the whole party will not fit a 53-seat coach.",
  "sections": [
    {
      "heading": "Capacity, luggage and facilities",
      "text": "A large passenger capacity still needs to be matched to the luggage. For cruise journeys or extended tours, send suitcase numbers and dimensions and discuss the hold space. Confirm onboard facilities and any accessibility arrangements in advance.",
      "links": [
        {
          "label": "Cruise port transfer planning",
          "href": "/services/cruise-port-transfers"
        }
      ]
    },
    {
      "heading": "Plan your London journey",
      "text": "Send the travel date, passenger count, pickup and destination, outward and return times, luggage and any additional stops. Include waiting time or an overnight itinerary where needed. Every hire includes a professional driver; the quotation sets out the agreed journey and any additional charges.",
      "links": [
        {
          "label": "Request a vehicle quote",
          "href": "/book"
        },
        {
          "label": "Private hire planning",
          "href": "/services/private-hire"
        },
        {
          "label": "Booking questions",
          "href": "/faqs"
        }
      ]
    }
  ]
}
