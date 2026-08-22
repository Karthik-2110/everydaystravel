import Image from 'next/image'

// A photo beside a block of prose. Two of these, mirrored, give the About page
// its rhythm — set `reverse` to put the photo on the right.

interface Props {
  kicker:   string
  heading:  string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
  priority?: boolean
  children: React.ReactNode
}

export default function SplitSection({
  kicker,
  heading,
  imageSrc,
  imageAlt,
  reverse = false,
  priority = false,
  children,
}: Props) {
  return (
    <section
      aria-label={heading}
      className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 lg:py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

        {/* Photo */}
        <div className={reverse ? 'lg:order-2' : ''}>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0D1221] shadow-[0_0_0_1px_rgba(235,186,111,0.12),0_24px_60px_rgba(0,0,0,0.5)]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              unoptimized
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/45 via-transparent to-transparent" />
          </div>
        </div>

        {/* Prose */}
        <div className={reverse ? 'lg:order-1' : ''}>
          <p
            className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {kicker}
          </p>

          <h2
            className="text-white leading-[1.05] tracking-[-0.02em] mb-5"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}
          >
            {heading}
          </h2>

          <div className="w-14 h-px bg-[#EBBA6F]/70 mb-6" aria-hidden />

          <div
            className="text-white/60 text-[15px] leading-[1.75] flex flex-col gap-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {children}
          </div>
        </div>

      </div>
    </section>
  )
}
