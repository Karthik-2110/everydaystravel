import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BlogHero, { BLOG_IMAGE } from '../../components/BlogHero'
import BlogQuoteLayout from '../../components/BlogQuoteLayout'
import { BLOG_POSTS } from '../../data/blog'
import { createPageMetadata, organisationId, siteUrl } from '../../lib/seo'

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() { return BLOG_POSTS.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find(post => post.slug === slug)
  if (!post) notFound()
  return { ...createPageMetadata({ title: post.title, description: post.description, path: `/blog/${slug}` }), openGraph: { type: 'article', title: post.title, description: post.description, url: `${siteUrl}/blog/${slug}`, publishedTime: post.date, modifiedTime: post.date } }
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find(post => post.slug === slug)
  if (!post) notFound()
  const url = `${siteUrl}/blog/${slug}`
  const schema = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`, headline: post.title, description: post.description, datePublished: post.date, dateModified: post.date, author: { '@type': 'Organization', name: 'Everydays Travel', '@id': organisationId, url: siteUrl }, publisher: { '@id': organisationId }, mainEntityOfPage: url, inLanguage: 'en-GB' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` }, { '@type': 'ListItem', position: 3, name: post.title, item: url }] },
  ]
  return <><Navbar /><main><BlogQuoteLayout><article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <BlogHero title={post.title} intro={post.answer} category={post.category} />
    <div className="pb-10">
      <div className="max-w-[72ch]">
        <figure className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BLOG_IMAGE} alt="An Everydays Travel vehicle, part of our group travel fleet" width={1600} height={1000} fetchPriority="high" className="w-full aspect-[16/9] object-cover" />
          <figcaption className="mt-3 text-xs text-white/55">Everydays Travel fleet · Vehicle suitability is confirmed around your group and itinerary.</figcaption>
        </figure>
        <p className="text-sm text-white/60 mb-8">By Everydays Travel · <time dateTime={post.date}>29 October 2026</time></p>
        <nav aria-label="In this guide" className="mb-10 border-y border-white/15 py-6"><h2 className="text-xl mb-4">In this guide</h2><ol className="space-y-3">{post.sections.map((section, index) => <li key={section.title}><a href={`#section-${index + 1}`} className="text-[#EBBA6F] underline underline-offset-4">{section.title}</a></li>)}</ol></nav>
        {post.sections.map((section, index) => <section key={section.title} id={`section-${index + 1}`} className="mb-10 scroll-mt-28"><h2 className="text-2xl sm:text-3xl leading-snug mb-5" style={{ fontFamily: 'Georgia, serif' }}>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph} className="text-base sm:text-lg leading-relaxed text-white/80 mb-4">{paragraph}</p>)}</section>)}
        <Link href={post.service.href} className="text-[#EBBA6F] underline underline-offset-4">{post.service.label} →</Link>
      </div>

    </div>
    <section className="border-t border-white/20 pt-8 pb-6" aria-labelledby="related-title"><h2 id="related-title" className="text-2xl mb-5">More planning advice</h2><ul className="grid gap-4 sm:grid-cols-3">{BLOG_POSTS.filter(other => other.slug !== slug).map(other => <li key={other.slug}><Link href={`/blog/${other.slug}`} className="text-[#EBBA6F] underline underline-offset-4">{other.title}</Link></li>)}</ul></section>
  </article></BlogQuoteLayout></main><Footer /></>
}
