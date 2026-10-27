import BusinessServicePage from '../../components/BusinessServicePage'
import { BUSINESS_SERVICES } from '../../data/business-services'
import { createPageMetadata } from '../../lib/seo'

const service = BUSINESS_SERVICES['event-coach-hire']

export const metadata = createPageMetadata({
  title: service.title,
  description: service.description,
  path: '/services/event-coach-hire',
})

export default function Page() {
  return <BusinessServicePage service={service} />
}
