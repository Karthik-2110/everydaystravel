import { describe, expect, it } from 'vitest'
import { BLOG_POSTS } from '@/app/data/blog'
import sitemap from '@/app/sitemap'

describe('Blog discovery', () => {
  it('includes every article in the sitemap with its actual publication date', () => {
    const entries = sitemap()
    expect(entries.some(entry => entry.url.endsWith('/blog'))).toBe(true)
    for (const post of BLOG_POSTS) {
      expect(entries).toContainEqual(expect.objectContaining({ url: `https://everydaystravel.co.uk/blog/${post.slug}`, lastModified: post.date }))
    }
  })
  it('uses distinct routes and supports each article with practical planning sections', () => {
    expect(new Set(BLOG_POSTS.map(post => post.slug)).size).toBe(BLOG_POSTS.length)
    expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(4)
    for (const post of BLOG_POSTS) {
      expect(post.sections.length).toBeGreaterThanOrEqual(4)
      expect(post.service.href).toMatch(/^\/services\/|^\/fleet\//)
    }
  })
})
