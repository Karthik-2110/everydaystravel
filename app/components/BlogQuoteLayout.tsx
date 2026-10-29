import type { ReactNode } from 'react'
import QuoteForm from './QuoteForm'

export default function BlogQuoteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-container pt-28 lg:pt-36 pb-14">
      <div className="sticky top-20 z-30 mb-6 flex items-center justify-between gap-3 border border-[#EBBA6F]/30 bg-[#0C0F1C] px-4 py-3 lg:hidden">
        <span className="text-sm text-white/75">Planning a group journey?</span>
        <a href="#blog-quote" className="shrink-0 text-sm font-semibold text-[#EBBA6F] underline underline-offset-4">Get a quote</a>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,410px)] xl:gap-14">
        <div className="min-w-0">{children}</div>
        <aside id="blog-quote" aria-label="Get a journey quote" className="scroll-mt-40 lg:scroll-mt-28 lg:sticky lg:top-24 min-w-0">
          <div className="mb-4"><h2 className="text-2xl text-[#EBBA6F]">Your journey starts here</h2><p className="mt-2 text-sm leading-relaxed text-white/70">Professional drivers. Premium travel. A quote tailored to your group.</p></div>
          {/* Longer return itineraries remain usable on short laptop screens. */}
          <div tabIndex={0} role="region" aria-label="Journey quote form" className="lg:max-h-[calc(100dvh-205px)] lg:overflow-y-auto lg:overscroll-contain rounded-2xl focus-visible:outline-2 focus-visible:outline-[#EBBA6F]">
            <QuoteForm variant="compact" docked />
          </div>
          <p className="mt-3 text-sm text-white/70">If urgent, <a href="tel:02089418354" className="text-[#EBBA6F] underline">call 020 8941 8354</a>.</p>
        </aside>
      </div>
    </div>
  )
}
