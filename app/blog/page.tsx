import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogHero, { BLOG_IMAGE } from '../components/BlogHero'
import BlogQuoteLayout from '../components/BlogQuoteLayout'
import { BLOG_POSTS } from '../data/blog'
import { createPageMetadata } from '../lib/seo'

export const metadata = createPageMetadata({ title: 'Coach Hire Blog & Group Travel Guides', description: 'Practical London coach hire advice for airport transfers, school trips, weddings and choosing the right vehicle. Plan your journey with Everydays Travel.', path: '/blog' })

export default function BlogPage() {
  const [lead, ...posts] = BLOG_POSTS
  return <><Navbar /><main><BlogQuoteLayout>
    <BlogHero title="The journey journal." category="Everydays Travel · Advice & inspiration" intro="For the person bringing everyone together. Practical advice on choosing your vehicle, planning your route and making the day run smoothly." />
    <section aria-labelledby="guides-title">
      <h2 id="guides-title" className="text-xs uppercase tracking-[0.16em] text-white/60 border-b border-white/20 pb-4">Latest travel guides</h2>
      <article className="py-7 border-b border-white/20">
        <Link href={`/blog/${lead.slug}`} tabIndex={-1} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BLOG_IMAGE} alt="" width={1600} height={1000} fetchPriority="high" className="w-full aspect-[16/9] object-cover" />
        </Link>
        <p className="mt-5 mb-3 text-xs uppercase tracking-widest text-[#EBBA6F]">Editor’s pick · {lead.category}</p>
        <h3 className="text-3xl sm:text-4xl leading-tight" style={{ fontFamily: 'Georgia, serif' }}><Link href={`/blog/${lead.slug}`} className="hover:text-[#EBBA6F]">{lead.title}</Link></h3>
        <p className="mt-4 text-white/75 leading-relaxed">{lead.description}</p>
        <Link href={`/blog/${lead.slug}`} className="inline-block mt-4 text-[#EBBA6F] underline underline-offset-4">Read the guide →</Link>
      </article>
      {posts.map(post => <article key={post.slug} className="py-7 border-b border-white/20">
        <p className="text-xs uppercase tracking-widest text-[#EBBA6F] mb-3">{post.category}</p>
        <h3 className="text-2xl sm:text-3xl leading-snug" style={{ fontFamily: 'Georgia, serif' }}><Link className="hover:text-[#EBBA6F]" href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p className="mt-3 leading-relaxed text-white/75">{post.description}</p>
        <Link href={`/blog/${post.slug}`} className="inline-block mt-4 text-[#EBBA6F] underline underline-offset-4" aria-label={`Read guide: ${post.title}`}>Read the guide →</Link>
      </article>)}
    </section>
  </BlogQuoteLayout></main><Footer /></>
}
