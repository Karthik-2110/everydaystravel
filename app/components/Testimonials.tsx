import { ALL_REVIEWS, type Review } from '@/app/data/reviews'
import ReviewMarquee from './ReviewMarquee'

export default function Testimonials({ reviews = ALL_REVIEWS }: { reviews?: Review[] }) {
  return <ReviewMarquee reviews={reviews} />
}
