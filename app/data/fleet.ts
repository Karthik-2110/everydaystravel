// The fleet — the single source of truth for vehicles across the site.
//
// Everything that needs to know what we operate reads from here: the fleet
// listing and detail pages, the nav dropdown, the homepage carousel, the
// booking form's vehicle picker, and the quote email that resolves a slug back
// to a vehicle name. Add a vehicle here and it appears everywhere at once.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Vehicle {
  slug:        string
  name:        string
  badge:       string
  image:       string
  images?:     string[]  // gallery photos — falls back to `image` when absent
  seats:       string
  luggage:     string
  description: string
  features:    string[]
  idealFor:    string[]
}

// ── Placeholder ───────────────────────────────────────────────────────────────

/** Stand-in for vehicles we have not photographed yet. */
export const PH = 'https://res.cloudinary.com/dckyndryf/image/upload/f_auto,q_auto,w_900,c_limit/IMG_0938_fhylhh'

// ── Real vehicle photos ───────────────────────────────────────────────────────

const cdn = (path: string) =>
  `https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1600,c_limit/${path}`

const S_CLASS_IMAGES = [
  cdn('v1783787266/837f9f74-eb75-4beb-9553-2424ced64ace_rhx7vy.jpg'),
  cdn('v1783787261/6d2f6a06-f8a1-4dfd-a346-d2bdf3b6b048_ouhnoc.jpg'),
  cdn('v1783787257/63c156f9-9bb3-4f2e-9167-24a4ad993660_dk6xmg.jpg'),
  cdn('v1783787248/31a87e08-d69e-4473-b50c-94832025b0a7_cekc7t.jpg'),
  cdn('v1783787240/19ed3b38-0619-41ed-8fe7-d098ba14b037_rbhzvy.jpg'),
]

const V_CLASS_IMAGES = [
  cdn('v1783787244/2d6095da-5ce2-48b0-a84f-5453ad8d3db0_pmmmbz.jpg'),
  cdn('v1783787235/18a2fa3f-a225-4225-b2ac-85490b7e2751_qly7qs.jpg'),
  cdn('v1783785281/0fd86aa5-d02a-4357-aa60-b4b79cb2c2ba_oitvek.jpg'),
]

const TURAS_35_IMAGE = cdn('v1783787232/0712a7cf-b45c-45e5-86cf-71de3a21ab55_zrwpei.jpg')

const COACH_49_IMAGES = [
  cdn('v1783783940/IMG_3023.JPG_y0gruj.jpg'),
  cdn('v1783783910/IMG_8052_aixyc2.jpg'),
  cdn('v1783783909/IMG_8109_hqk5fk.jpg'),
  cdn('v1783783904/IMG_8018_mthmcm.jpg'),
]

const COACH_53_IMAGES = [
  cdn('v1783787451/IMG_0419_kkqxkq.jpg'),
  cdn('v1783784005/C0348T01_qztkqo.jpg'),
  cdn('v1783784004/C0345T01_e5jzje.jpg'),
]

const COACH_55_IMAGES = [
  cdn('v1783787281/IMG_0469_akacrg.heic'),
  cdn('v1783787275/IMG_0395_zjwz1c.heic'),
  cdn('v1783787271/IMG_0338_zs5i46.jpg'),
]

// ── Data ──────────────────────────────────────────────────────────────────────

export const CHAUFFEUR_CARS: Vehicle[] = [
  {
    slug:        'lamborghini-huracan',
    name:        'Lamborghini Huracán',
    badge:       'Supercar',
    image:       PH,
    seats:       '1–2 Passengers',
    luggage:     'Soft bags only',
    description: 'An unforgettable arrival. The Huracán pairs breathtaking performance with head-turning Italian design — for the moments that deserve a grand entrance.',
    features:    ['V10 performance', 'Alcantara sport seats', 'Carbon-fibre interior detailing', 'Dual-zone climate control', 'Premium audio system', 'Professional chauffeur included'],
    idealFor:    ['Weddings', 'Proms', 'Special Occasions'],
  },
  {
    slug:        'bmw-x7',
    name:        'BMW X7',
    badge:       'Luxury SUV',
    image:       PH,
    seats:       '1–6 Passengers',
    luggage:     '4 large + 2 medium cases',
    description: 'BMW’s flagship SUV blends commanding presence with first-class comfort — generous space for passengers and luggage without compromising refinement.',
    features:    ['Heated leather comfort seats', 'Panoramic glass roof', 'Four-zone climate control', 'Ambient interior lighting', 'USB & wireless charging', 'Bottled water provided'],
    idealFor:    ['Airport Transfers', 'Corporate Travel', 'Family Travel'],
  },
  {
    slug:        'mercedes-e-class',
    name:        'Mercedes-Benz E-Class Executive',
    badge:       'Executive',
    image:       PH,
    seats:       '1–3 Passengers',
    luggage:     '2 large + 2 medium cases',
    description: 'The E-Class Executive makes sophistication effortless. Premium climate control, a whisper-quiet ride, and a refined interior designed for discerning passengers.',
    features:    ['Premium black leather reclining seats', 'Privacy glass', 'Dual-zone climate control', 'Heated seats', 'USB ports & 12v charging points', 'Bottled water provided'],
    idealFor:    ['Corporate Travel', 'Airport Transfers'],
  },
  {
    slug:        'mercedes-s-class',
    name:        'Mercedes-Benz S-Class Executive',
    badge:       'Executive',
    image:       S_CLASS_IMAGES[0],
    images:      S_CLASS_IMAGES,
    seats:       '1–2 Passengers',
    luggage:     '2 large + 2 medium cases',
    description: 'The ultimate luxury vehicle, offering prestige, comfort and refinement for airport transfers, corporate events and private travel.',
    features:    ['Plush black leather reclining seats', 'Tinted privacy glass', 'Luxury ambient interior lighting', 'Soft-close doors', 'Champagne cooler', 'Bespoke concierge service'],
    idealFor:    ['VIP Clients', 'Weddings', 'Private Hire'],
  },
  {
    slug:        'mercedes-v-class',
    name:        'Mercedes-Benz V-Class Executive',
    badge:       'Executive MPV',
    image:       V_CLASS_IMAGES[0],
    images:      V_CLASS_IMAGES,
    seats:       '1–6 Passengers',
    luggage:     '6 large + 4 small cases',
    description: 'A spacious MPV ideal for small groups or families, with luxurious flexible seating and ample room for luggage and refined travel.',
    features:    ['Luxury black leather reclining seats', 'Privacy audio & rear entertainment', 'Bluetooth audio & rear climate control', 'Dark privacy glass', 'Extended legroom', 'USB charging for all seats'],
    idealFor:    ['Airport Transfers', 'Events', 'Family Travel'],
  },
]


export const LUXURY_MINIBUSES: Vehicle[] = [
  {
    slug:        '7-seater-mpv-v-class',
    name:        '7-Seater MPV V-Class',
    badge:       'MPV',
    image:       V_CLASS_IMAGES[0],
    images:      V_CLASS_IMAGES,
    seats:       'Up to 7 Passengers',
    luggage:     '5 large + 4 small cases',
    description: 'The V-Class MPV carries a small group in chauffeur-car comfort — flexible leather seating, room for luggage and an easy step-in for every passenger.',
    features:    ['Luxury black leather reclining seats', 'Rear climate control', 'Bluetooth audio & rear entertainment', 'Dark privacy glass', 'Extended legroom', 'USB charging for all seats'],
    idealFor:    ['Airport Transfers', 'Family Travel', 'Corporate Groups'],
  },
  {
    slug:        '16-seater-minibus',
    name:        '16-Seater Luxury Minibus',
    badge:       'Minibus',
    image:       PH,
    seats:       'Up to 16 Passengers',
    luggage:     '16 standard cases',
    description: 'Our flagship minibus seats up to 16 in comfort. Ideal for larger groups requiring a premium experience without the scale of a full coach.',
    features:    ['Individual reclining seats', 'Onboard WiFi', 'Entertainment system', 'Air conditioning throughout', 'Central luggage hold', 'Wheelchair-accessible option'],
    idealFor:    ['Weddings', 'Sports Teams', 'Corporate Events'],
  },
  {
    slug:        '16-seater-vip-sprinter',
    name:        '16-Seater VIP Minibus',
    badge:       'VIP',
    image:       PH,
    seats:       'Up to 16 Passengers',
    luggage:     '16 standard cases',
    description: 'The VIP minibus elevates group travel to first class — luxury captain seats, mood lighting and onboard entertainment for journeys that feel like an event in themselves.',
    features:    ['Luxury captain seats', 'Ambient mood lighting', 'Onboard WiFi', 'Entertainment system with screens', 'Climate control throughout', 'Privacy glass'],
    idealFor:    ['VIP Clients', 'Corporate Events', 'Special Occasions'],
  },
  {
    slug:        '19-seater-minibus',
    name:        '19-Seater Minibus',
    badge:       'Minibus',
    image:       PH,
    seats:       'Up to 19 Passengers',
    luggage:     '19 standard cases',
    description: 'Our largest minibus bridges the gap between a 16-seater and a full coach — the same easy door-to-door access, with room for three more passengers.',
    features:    ['Individual reclining seats', 'Air conditioning throughout', 'USB charging points', 'Panoramic windows', 'Central luggage hold', 'Professional uniformed driver'],
    idealFor:    ['Group Travel', 'School Trips', 'Sports Teams'],
  },
]

export const EXECUTIVE_COACHES: Vehicle[] = [
  {
    slug:        '35-seater-turas-midi',
    name:        '35-Seater Turas Midi',
    badge:       'Midi Coach',
    image:       TURAS_35_IMAGE,
    seats:       'Up to 35 Passengers',
    luggage:     'Large underfloor hold',
    description: 'The Turas Midi punches above its size — a nimble mid-size coach with full executive specification, perfect when a full-size coach is more than you need.',
    features:    ['Reclining seats with headrests', 'Onboard WiFi', 'USB charging at every seat', 'Climate control', 'PA & entertainment system', 'Large luggage hold'],
    idealFor:    ['Corporate Away-Days', 'Tours', 'School Transport'],
  },
  {
    slug:        '49-seater-mercedes-turismo',
    name:        '49-Seater Mercedes Turismo',
    badge:       'Coach',
    image:       COACH_49_IMAGES[0],
    images:      COACH_49_IMAGES,
    seats:       'Up to 49 Passengers',
    luggage:     'Large underfloor hold',
    description: 'The Mercedes Turismo sets the benchmark for touring comfort — smooth, quiet and superbly appointed for long-distance group travel across the UK and Europe.',
    features:    ['Individual reclining seats', 'Onboard WiFi', 'USB & 240v charging', 'Air conditioning', 'Onboard WC', 'Entertainment system'],
    idealFor:    ['Group Tours', 'Sports Teams', 'Corporate Events'],
  },
  {
    slug:        '53-seater-coach',
    name:        '53-Seater Mercedes Turismo',
    badge:       'Coach',
    image:       COACH_53_IMAGES[0],
    images:      COACH_53_IMAGES,
    seats:       'Up to 53 Passengers',
    luggage:     'Large underfloor hold',
    description: 'Our most popular coach, trusted by sports clubs, schools, and event organisers across the UK. Premium comfort for large groups on any route.',
    features:    ['Individual reclining seats', 'Onboard WiFi', 'USB & 240v charging', 'Air conditioning', 'Onboard WC & refreshment area', 'Luggage hold with easy access'],
    idealFor:    ['Sports Teams', 'School Trips', 'Events & Concerts'],
  },
  {
    slug:        '55-seater-neoplan-tourliner',
    name:        '55-Seater Neoplan Tourliner',
    badge:       'Coach',
    image:       COACH_55_IMAGES[0],
    images:      COACH_55_IMAGES,
    seats:       'Up to 55 Passengers',
    luggage:     'Large underfloor hold',
    description: 'Our largest coach — the flagship Neoplan Tourliner carries up to 55 passengers in premium comfort, ideal for major events, tours and cruise transfers.',
    features:    ['Individual reclining seats', 'Onboard WiFi', 'USB & 240v charging', 'Climate control throughout', 'Onboard WC & refreshment area', 'Easy-access luggage hold'],
    idealFor:    ['Events & Concerts', 'Cruise Port Transfers', 'Group Tours'],
  },
]

// ── Categories ────────────────────────────────────────────────────────────────

export interface FleetCategory {
  /** Matches the `/fleet/<slug>` route segment. */
  slug:        string
  label:       string
  description: string
  vehicles:    Vehicle[]
}

/**
 * The three fleet categories, in the order they appear in the nav and on
 * `/fleet`. Anything rendering a grouped view of the fleet reads this.
 */
export const FLEET_CATEGORIES: FleetCategory[] = [
  {
    slug:        'chauffeur-cars',
    label:       'Chauffeur Cars',
    description: 'Executive & prestige vehicles',
    vehicles:    CHAUFFEUR_CARS,
  },
  {
    slug:        'luxury-minibuses',
    label:       'Luxury Minibuses',
    description: '7 to 19 seat luxury transfers',
    vehicles:    LUXURY_MINIBUSES,
  },
  {
    slug:        'executive-coaches',
    label:       'Executive Coaches',
    description: '35 to 55 seat premium coaches',
    vehicles:    EXECUTIVE_COACHES,
  },
]

// ── All vehicles flat list (for booking form dropdown) ────────────────────────

export const ALL_VEHICLE_OPTIONS = FLEET_CATEGORIES.map(({ label, vehicles }) => ({
  group: label,
  vehicles,
}))
