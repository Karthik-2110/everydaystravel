import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Executive & Corporate Coach Hire London',
  description: 'Executive and corporate coach hire across London and the UK: conference transport, staff shuttles, roadshows and client transfers, from chauffeur cars to 55-seat coaches.',
  path: '/services/corporate',
})

export default function CorporatePage() {
  return <ServiceDetail slug="corporate" />
}
