import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Corporate Events Transport London',
  description: 'Professional corporate events transport and chauffeur-driven business travel across London, Surrey and the UK.',
  path: '/services/corporate',
})

export default function CorporatePage() {
  return <ServiceDetail slug="corporate" />
}
