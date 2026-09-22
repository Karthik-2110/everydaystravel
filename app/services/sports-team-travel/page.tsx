import ServiceDetail from '../../components/ServiceDetail'
import { createPageMetadata } from '../../lib/seo'

export const metadata = createPageMetadata({
  title: 'Sports Team Coach Hire',
  description: 'Reliable match-day transport for sports teams, clubs and supporters, with room for passengers, kit and equipment.',
  path: '/services/sports-team-travel',
})

export default function SportsTeamTravelPage() {
  return <ServiceDetail slug="sports-team-travel" />
}
