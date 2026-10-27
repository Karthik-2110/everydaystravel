import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Private Coach & Minibus Hire London',
  description: 'Private coach and minibus hire with a driver in London and Surrey. Plan day trips, celebrations and journeys with multiple stops. Request a tailored quote.',
  path: '/services/private-hire',
})

export default function PrivateHirePage() {
  return <ServiceDetail slug="private-hire" />
}
