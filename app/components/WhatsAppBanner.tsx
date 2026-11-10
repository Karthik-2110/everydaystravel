import { ArrowUpRight, Clock, ShieldCheck } from 'lucide-react'
import { WhatsAppIcon, WHATSAPP_HREF } from './icons/social'

export default function WhatsAppBanner() {
  return (
    <section aria-label="Plan your journey on WhatsApp" className="border-y border-[#25D366]/20 bg-[#10271F]">
      <div className="site-container flex flex-col gap-5 py-7 sm:flex-row sm:items-center lg:gap-7 lg:py-9">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#25D366]/15 text-[#25D366] sm:size-13" aria-hidden>
            <WhatsAppIcon size={25} />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-medium leading-tight text-white lg:text-2xl">Let’s get your group moving</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              Tell us about your trip on WhatsApp and we’ll help you find the right coach or minibus.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-relaxed text-white/65">
              <li className="flex items-start gap-1.5">
                <Clock size={14} className="mt-0.5 shrink-0 text-[#EBBA6F]" aria-hidden />
                We aim to reply within 30 minutes during business hours
              </li>
              <li className="flex items-start gap-1.5">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#EBBA6F]" aria-hidden />
                Fully licensed and insured
              </li>
            </ul>
          </div>
        </div>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#0C0F1C] transition-colors hover:bg-[#42E27B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
        >
          Chat on WhatsApp
          <ArrowUpRight size={16} aria-hidden />
        </a>
      </div>
    </section>
  )
}
