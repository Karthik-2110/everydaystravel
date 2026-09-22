import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Group Travel & UK Coach Tours',
  description: 'Luxury group travel, sightseeing tours and coach hire across London, the UK and Europe, with flexible itinerary support.',
  path: '/services/group-travel',
})

export default function GroupTravelPage() {
  return <ServiceDetail slug="group-travel" />
}
