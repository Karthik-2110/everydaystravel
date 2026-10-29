import Link from 'next/link'

const IMAGE = 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_2400,c_limit/v1783785511/IMG_6138_n9khty.jpg'

export default function BlogHero({ title, intro, category }: { title: string; intro: string; category: string }) {
  return (
    <header className="relative isolate overflow-hidden bg-[#0C0F1C]">
      {/* Existing fleet photograph, with a scrim to keep the opening copy legible. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMAGE} alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0C0F1C]/95 via-[#0C0F1C]/85 to-[#0C0F1C]/55" />
      <div className="site-container pt-32 pb-10 lg:pt-40 lg:pb-14">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-white/75"><Link href="/">Home</Link> / <Link href="/blog">Blog</Link></nav>
        <p className="mb-3 text-sm font-medium text-[#EBBA6F]">{category}</p>
        <h1 className="max-w-[22ch] text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight font-medium">{title}</h1>
        <p className="mt-5 max-w-[65ch] text-base sm:text-lg leading-relaxed text-white/85">{intro}</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#EBBA6F]" aria-label="Our service"><span>17+ years of industry experience</span><span>Professional drivers</span><span>Premium group travel</span></div>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <Link href="/book" className="inline-flex rounded-full bg-[#EBBA6F] px-7 py-3.5 font-semibold text-[#0C0F1C] hover:bg-[#DDA85E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBBA6F]">Get your tailored quote →</Link>
          <a href="tel:02089418354" className="text-white/90 underline underline-offset-4">Call 020 8941 8354</a>
        </div>
      </div>
    </header>
  )
}
