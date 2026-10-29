import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from './data/blog'
import { contentUpdated, sitemapEntries, siteUrl } from './lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...sitemapEntries.map(({ url, priority }) => ({
      url,
      lastModified: contentUpdated,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    { url: `${siteUrl}/blog`, lastModified: '2026-10-29', changeFrequency: 'monthly', priority: 0.7 },
    ...BLOG_POSTS.map(post => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
