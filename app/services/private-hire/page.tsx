import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Private Coach & Minibus Hire',
  description: 'Flexible private coach and minibus hire for day trips, special occasions and bespoke journeys across the UK.',
  path: '/services/private-hire',
})

export default function PrivateHirePage() {
  return <ServiceDetail slug="private-hire" />
}
