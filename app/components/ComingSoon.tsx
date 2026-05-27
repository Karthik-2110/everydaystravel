import Navbar from './Navbar'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ComingSoon({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C0F1C]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-5">
        <div className="text-center max-w-xl">

          <p
            className="text-[#EBBA6F] text-[11px] font-semibold tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {label}
          </p>

          <h1
            className="text-white leading-[0.9] tracking-[-0.02em] mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(4rem, 10vw, 8rem)',
            }}
          >
            Coming<br />Soon
          </h1>

          <p
            className="text-white/40 text-[15px] leading-relaxed mb-10 max-w-[360px] mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            We're putting the finishing touches on this page. In the meantime, get in touch directly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:02089418334"
              className="h-11 px-7 flex items-center justify-center bg-[#EBBA6F] text-[#0C0F1C] text-[13.5px] font-semibold rounded-full hover:bg-[#E2B36A] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              020 8941 8334
            </a>
            <Link
              href="/"
              className="h-11 px-7 flex items-center gap-2 border border-white/15 text-white/60 text-[13.5px] font-medium rounded-full hover:border-white/30 hover:text-white transition-all duration-150"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <ArrowLeft size={14} aria-hidden />
              Back to home
            </Link>
          </div>
        </div>
      </main>

      {/* Subtle bottom gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#EBBA6F]/15 to-transparent" />
    </div>
  )
}
