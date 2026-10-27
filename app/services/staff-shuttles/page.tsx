import BusinessServicePage from '../../components/BusinessServicePage'
import { BUSINESS_SERVICES } from '../../data/business-services'
import { createPageMetadata } from '../../lib/seo'

const service = BUSINESS_SERVICES['staff-shuttles']

export const metadata = createPageMetadata({
  title: service.title,
  description: service.description,
  path: '/services/staff-shuttles',
})

export default function Page() {
  return <BusinessServicePage service={service} />
}
