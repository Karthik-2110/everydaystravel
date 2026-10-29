import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogHero from '../components/BlogHero'
import { BLOG_POSTS } from '../data/blog'
import { createPageMetadata } from '../lib/seo'

export const metadata = createPageMetadata({ title: 'Coach Hire Blog & Group Travel Guides', description: 'Practical London coach hire advice for airport transfers, school trips, weddings and choosing the right vehicle. Plan your journey with Everydays Travel.', path: '/blog' })

export default function BlogPage() {
  return <><Navbar /><main>
    <BlogHero title="A better journey starts with a good plan." category="The Everydays Travel blog" intro="Practical guides for the person organising the trip. Find the details that matter, choose your next step and let our team prepare a quote around your group." />
    <section aria-labelledby="guides-title" className="site-container py-12 lg:py-16">
      <h2 id="guides-title" className="text-3xl mb-8">Plan your next group journey</h2>
      <div className="grid gap-6 md:grid-cols-2">{BLOG_POSTS.map(post => <article key={post.slug} className="rounded-2xl border border-white/15 p-6 sm:p-8 bg-[#0D1221]">
        <p className="text-sm text-[#EBBA6F] mb-3">{post.category}</p>
        <h3 className="text-2xl leading-snug"><Link className="hover:text-[#EBBA6F] underline-offset-4 hover:underline" href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p className="mt-4 leading-relaxed text-white/75">{post.description}</p>
        <Link href={`/blog/${post.slug}`} className="inline-block mt-5 text-[#EBBA6F] underline underline-offset-4" aria-label={`Read guide: ${post.title}`}>Read the guide →</Link>
      </article>)}</div>
    </section>
  </main><Footer /></>
}
