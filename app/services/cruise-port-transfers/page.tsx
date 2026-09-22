import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'UK Cruise Port Transfers',
  description: 'Door-to-dock transfers to major UK cruise ports, with luggage assistance and spacious transport for families and groups.',
  path: '/services/cruise-port-transfers',
})

export default function CruisePortTransfersPage() {
  return <ServiceDetail slug="cruise-port-transfers" />
}
