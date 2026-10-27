import LandingContent from '../LandingContent'
import { vehicleContent } from '../../data/vehicle-content'
import ServiceSolutions from '../service/ServiceSolutions'
import ServiceFleet from '../service/ServiceFleet'

/**
 * The full-width bands below a fleet page's spec, in reading order: what the
 * vehicle is used for, then what comes with it and a way through to a quote.
 *
 * The same two components the service pages render — a band is a band, and a
 * fleet page that invented its own would read as a different site halfway down.
 *
 * The opening argument is not here. It sits in the specification column as a
 * sibling of "preferred for", via `VehicleSpecBlocks`.
 *
 * Vehicles land one at a time, so a vehicle nobody has written yet renders
 * exactly the page it rendered before.
 */
export default function VehicleSections({ slug }: { slug: string }) {
  const content = vehicleContent(slug)
  if (!content) return <LandingContent page={slug} />

  return (
    <>
      {content.solutions && <ServiceSolutions block={content.solutions} />}
      {content.fleet     && <ServiceFleet     block={content.fleet} />}
    </>
  )
}
