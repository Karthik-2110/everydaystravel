export const BLOG_IMAGE = 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_1600,c_limit/v1783785511/IMG_6138_n9khty.jpg'

export default function BlogHero({ title, intro, category }: { title: string; intro: string; category: string }) {
  return (
    <header className="pb-8">
      <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[#EBBA6F]">{category}</p>
      <h1 className="max-w-[24ch] text-4xl sm:text-5xl xl:text-6xl leading-[1.08] tracking-tight font-medium">{title}</h1>
      <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-white/80">{intro}</p>
      <p className="mt-5 text-xs leading-relaxed text-[#EBBA6F]">17+ years of industry experience · Professional drivers · Premium group travel</p>
    </header>
  )
}
