import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'School Coach Hire London',
  description: 'School coach hire in London and Surrey for educational trips, sports fixtures and regular transport. DBS-checked drivers and vehicle documentation on request.',
  path: '/services/school-trips',
})

export default function SchoolTripsPage() {
  return <ServiceDetail slug="school-trips" />
}
