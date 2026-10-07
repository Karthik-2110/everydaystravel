import { serviceContent } from '../../data/service-content'
import ServiceWhyChoose from './ServiceWhyChoose'

/**
 * The service content that belongs in the specification column, beneath
 * "preferred for". Renders nothing for a service nobody has written yet.
 */
export default function ServiceSpecBlocks({ slug }: { slug: string }) {
  const content = serviceContent(slug)
  if (!content?.whyChoose) return null

  return <ServiceWhyChoose block={content.whyChoose} />
}
