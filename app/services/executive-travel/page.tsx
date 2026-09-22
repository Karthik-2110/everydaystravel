import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Executive Chauffeur Travel London',
  description: 'Discreet executive and chauffeur-driven travel for VIPs, business meetings, airport journeys and private occasions.',
  path: '/services/executive-travel',
})

export default function ExecutiveTravelPage() {
  return <ServiceDetail slug="executive-travel" />
}
