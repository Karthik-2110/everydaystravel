// Real customer reviews, transcribed verbatim from the company's public
// profiles. Nothing here is written for the website — if a review is not on a
// platform, it does not belong in this file.
//
// Trustpilot: https://www.trustpilot.com/review/everydaystravel.co.uk
// Last synced: 22 Aug 2026 — TrustScore 4.4 from 11 reviews, 100% five-star.
//
// Two reviews from 2018 that name "Trivo Travel", the company's former trading
// name, are deliberately not listed here. `count` stays at the platform's real
// total, which still includes them.

export type ReviewSource = 'google' | 'trustpilot'

export interface Review {
  name:     string
  location: string
  reviews:  number          // how many reviews the author has written on that platform
  title:    string
  text:     string
  date:     string
  initials: string
  avatarBg: string
  source:   ReviewSource
}

export interface Platform {
  key:     ReviewSource
  label:   string
  score:   string           // as displayed on the platform
  count:   number
  url:     string
  reviews: Review[]
}

const AVATAR_COLOURS = ['#B8975A', '#7A93B4', '#6A9B7E', '#A07A94', '#4A6B8A', '#B47A6E', '#8A7AB4', '#5F8F8A']

/** Initials from a display name — "Yoga - Spoton Cars" → "YS", "Nicola" → "N". */
function initialsOf(name: string): string {
  const parts = name.split(/[\s-]+/).filter((p) => /[a-z]/i.test(p))
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('')
}

type RawReview = Omit<Review, 'initials' | 'avatarBg' | 'source' | 'location'> & { location?: string }

function build(source: ReviewSource, raw: RawReview[]): Review[] {
  return raw.map((r, i) => ({
    ...r,
    location: r.location ?? 'GB',
    initials: initialsOf(r.name),
    avatarBg: AVATAR_COLOURS[i % AVATAR_COLOURS.length],
    source,
  }))
}

// ── Trustpilot ────────────────────────────────────────────────────────────────

const TRUSTPILOT_REVIEWS: RawReview[] = [
  {
    name: 'john rawlings', reviews: 1, date: 'Jun 21, 2026',
    title: 'From the start it was so good and brand new inside',
    text: "From the start it was so good and brand new in side so clean what made feel confort able the driver was all so good and the driving was so smooth witch made me happy because i had my daugther with me and my wife i would tell my freind's to use this company all day long",
  },
  {
    name: 'Om Sharma', reviews: 1, date: 'Dec 9, 2025',
    title: 'Excellent service from Everydays Travel',
    text: 'Excellent service from Everydays Travel. The driver was very chill, the coach was so comfy and the journey was smooth. Highly recommend would definitely use them again.',
  },
  {
    name: 'Cristina Fernandes', reviews: 4, date: 'Jul 25, 2023',
    title: 'It’s was a great experience booking',
    text: 'It’s was a great experience booking with Everydays Luxury Coach Travel. The Luxury bus was very clean and the driver was very polite and punctual. We enjoyed our trip. Thank you Thaya for all your help.',
  },
  {
    name: 'Nicola', reviews: 35, date: 'May 18, 2022',
    title: 'Great company for vehicle hire',
    text: 'Great service received by this company booked for a corporate event. Not only was the booking process smooth as well as payment but they were very patient with all the changes that had to be made. On the actual day of the booking, we had a few issues with traffic and my group running late and these were all handled extremely professionally and everyone was happy. Would definitely recommend.',
  },
  {
    name: 'Grace Hawkins', reviews: 2, date: 'Mar 14, 2018',
    title: 'Highly recommend this company for coach hire',
    text: 'Great company. Friendly driver, booked for my friends wedding and they was very proffessional and on time. Recommend them highly.',
  },
  {
    name: 'Sandra', reviews: 4, date: 'Nov 14, 2015',
    title: 'Great service with only two hours notice',
    text: "Last Friday, with only two hours notice, we were supplied with a luxury 16 seater minibus for a return trip to Bracknell. The bus turned up 10 mins early, the driver was extremely polite and friendly and the best bit is that they were £75 cheaper than the other local firm who I usually turn to for a taxi. I was initially concerned as I hadn't used this company before. I certainly don't have any concerns about using them again. I really appreciated the great service they provided at such short notice.",
  },
  {
    name: 'Val Foley', reviews: 1, date: 'Jan 26, 2015',
    title: 'Exceptional service',
    text: 'I just wanted to say thank you for the coach service. The drivers service was second to none, and his patience with driving a bus full of ten year old boys doing their best pop star impressions was amazing. Please extend my thanks again to the driver he provided an exceptionally professional service.',
  },
  {
    name: 'Yoga - Spoton Cars', reviews: 1, date: 'Jan 15, 2015',
    title: 'Excellent',
    text: 'Never been let down by Everydays Travel. They always turn up on time and get me to where I need to on time without any hassle. Excellent and friendly drivers.',
  },
  {
    name: 'Dan N', reviews: 2, date: 'Jan 14, 2015',
    title: 'Best coach and driver',
    text: 'Coach arrived 15 minutes early and driver very helpful and patient!',
  },
]

export const TRUSTPILOT: Platform = {
  key:     'trustpilot',
  label:   'Trustpilot',
  score:   '4.4',
  count:   11,
  url:     'https://www.trustpilot.com/review/everydaystravel.co.uk',
  reviews: build('trustpilot', TRUSTPILOT_REVIEWS),
}

// ── Google ────────────────────────────────────────────────────────────────────
// No verified Google Business data yet. Add the score, count, profile URL and
// the review texts here and the Google tab appears automatically everywhere.

export const GOOGLE: Platform = {
  key:     'google',
  label:   'Google',
  score:   '',
  count:   0,
  url:     '',
  reviews: [],
}

// ── Aggregates ────────────────────────────────────────────────────────────────

/** Only platforms we actually have reviews for. */
export const PLATFORMS: Platform[] = [GOOGLE, TRUSTPILOT].filter((p) => p.reviews.length > 0)

/** Every real review, newest platform-order first. */
export const ALL_REVIEWS: Review[] = PLATFORMS.flatMap((p) => p.reviews)
