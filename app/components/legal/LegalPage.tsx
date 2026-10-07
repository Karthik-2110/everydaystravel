import Navbar from '../Navbar'
import Footer from '../Footer'

/**
 * The shell every legal page shares — cookie policy, privacy notice, terms.
 * Keeping the typography here means the three read as one document set rather
 * than three pages that happened to be written on different days.
 */
export default function LegalPage({
  title, updated, intro, children,
}: {
  title:    string
  /** Date the wording last changed, not the date of the last deploy. */
  updated:  string
  intro?:   React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0C0F1C]">
      <Navbar />

      <main className="site-container pt-32 lg:pt-40 pb-20">
        <div className="max-w-[820px]">
          <h1
            className="text-white leading-[1.05] tracking-[-0.02em] mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)' }}
          >
            {title}
          </h1>
          <p className="text-white/45 text-[13px] mb-10" style={{ fontFamily: 'var(--font-ui)' }}>
            Last updated {updated}
          </p>

          {intro}
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}

// ── Building blocks ─────────────────────────────────────────────────────────

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-white text-[20px] font-semibold mb-3"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-white text-[15px] font-medium mb-1.5 mt-5"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {children}
    </h3>
  )
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-white/65 text-[15px] leading-relaxed mb-3"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {children}
    </p>
  )
}

export function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-4 flex flex-col gap-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-white/65 text-[15px] leading-relaxed pl-5 relative"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span className="absolute left-0 top-[0.65em] w-[5px] h-[5px] rounded-full bg-[#EBBA6F]" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      className="text-[#EBBA6F] underline underline-offset-2 hover:text-[#DDA85E] transition-colors duration-150"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

/** A definition-style table, for cookies and for the lawful-basis grid. */
export function DataTable({
  headings, rows,
}: {
  headings: string[]
  rows:     React.ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 mb-4">
      <table className="w-full min-w-[620px] border-collapse">
        <thead>
          <tr className="bg-white/[0.04]">
            {headings.map((heading) => (
              <th
                key={heading}
                scope="col"
                className="text-left text-[#EBBA6F] text-[11px] font-semibold tracking-[0.14em] uppercase px-4 py-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-white/[0.07] align-top">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3.5 text-[13px] leading-relaxed ${j === 0 ? 'text-white' : 'text-white/60'}`}
                  style={{ fontFamily: j === 0 ? 'var(--font-ui)' : 'var(--font-body)' }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
