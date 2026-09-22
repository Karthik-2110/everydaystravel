import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'School Trip Coach Hire',
  description: 'Safe, reliable coach and minibus transport for school trips, educational tours and fixtures across the UK.',
  path: '/services/school-trips',
})

export default function SchoolTripsPage() {
  return <ServiceDetail slug="school-trips" />
}
