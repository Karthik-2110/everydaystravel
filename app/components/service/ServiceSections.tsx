import { serviceContent } from '../../data/service-content'
import ServiceSolutions from './ServiceSolutions'
import ServiceFleet from './ServiceFleet'

/**
 * The full-width bands below the spec, in reading order: the kinds of journey,
 * then the vehicles and a way through to the fleet.
 *
 * The opening argument is not here — it sits in the specification column as a
 * sibling of "preferred for", via `ServiceSpecBlocks`.
 *
 * Each band renders only if the service has content for it, so a service nobody
 * has written yet renders exactly the page it rendered before.
 */
export default function ServiceSections({ slug }: { slug: string }) {
  const content = serviceContent(slug)
  if (!content) return null

  return (
    <>
      {content.solutions && <ServiceSolutions block={content.solutions} />}
      {content.fleet     && <ServiceFleet     block={content.fleet} />}
    </>
  )
}
