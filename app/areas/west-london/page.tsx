import BusinessServicePage from '../../components/BusinessServicePage'
import { WEST_LONDON_SERVICE } from '../../data/business-services'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: WEST_LONDON_SERVICE.title,
  description: WEST_LONDON_SERVICE.description,
  path: '/areas/west-london',
})

export default function WestLondonCoachHirePage() {
  return <BusinessServicePage service={WEST_LONDON_SERVICE} />
}
