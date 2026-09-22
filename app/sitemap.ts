import type { MetadataRoute } from 'next'
import { contentUpdated, sitemapEntries } from './lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries.map(({ url, priority }) => ({
    url,
    lastModified: contentUpdated,
    changeFrequency: 'monthly',
    priority,
  }))
}
