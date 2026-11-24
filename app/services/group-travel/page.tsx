import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Large Group Coach Hire London & UK Coach Tours',
  description: 'Compare 35 to 55-seat coaches with a driver for large groups in London. Plan sightseeing trips, UK days out and European tours with Everydays Travel.',
  path: '/services/group-travel',
})

export default function GroupTravelPage() {
  return <ServiceDetail slug="group-travel" />
}
