import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Wedding Coach Hire London',
  description: 'Luxury wedding coach, minibus and chauffeur-driven transport for couples, guests and event logistics in London and Surrey.',
  path: '/services/weddings-events',
})

export default function WeddingsEventsPage() {
  return <ServiceDetail slug="weddings-events" />
}
