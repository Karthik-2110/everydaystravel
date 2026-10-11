import { vehicleContent } from '../../data/vehicle-content'
import ServiceWhyChoose from '../service/ServiceWhyChoose'

/**
 * The vehicle copy that belongs in the specification column, beneath
 * "preferred for": the reasons to pick this vehicle, set as a third sibling of
 * "Features & Amenities" and "Preferred for" rather than as a band of its own.
 *
 * Renders nothing for a vehicle nobody has written yet.
 */
export default function VehicleSpecBlocks({ slug }: { slug: string }) {
  const content = vehicleContent(slug)
  if (!content?.whyChoose) return null

  return <ServiceWhyChoose block={content.whyChoose} />
}
