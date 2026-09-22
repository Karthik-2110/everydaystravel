import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Airport Transfers London',
  description: 'Reliable airport transfers to Heathrow, Gatwick and all major UK airports, with luxury coaches, minibuses and chauffeur cars for every group size.',
  path: '/services/airport-transfers',
})

export default function AirportTransfersPage() {
  return <ServiceDetail slug="airport-transfers" />
}
