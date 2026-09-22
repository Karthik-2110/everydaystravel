import { render, screen, fireEvent, within } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import Navbar from '@/app/components/Navbar'
import { FLEET_CATEGORIES } from '@/app/data/fleet'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} onClick={onClick} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src as string} {...props} />,
}))

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const openMobileMenu = () => {
  const toggle = screen.getByRole('button', { name: /toggle navigation menu/i })
  fireEvent.click(toggle)
  return toggle
}

describe('Navbar', () => {
  it('renders the banner and the logo link', () => {
    render(<Navbar />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /everydays travel home/i })).toBeInTheDocument()
  })

  it('renders all top-level navigation items', () => {
    render(<Navbar />)
    for (const label of ['Home', 'Services', 'Our Fleet', 'More', 'Contact us']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    }
  })

  it('marks Home as the active page when pathname is /', () => {
    render(<Navbar />)
    // Exact match so we get the nav "Home" link, not the logo (aria-label "Everydays Travel home")
    const homeLinks = screen.getAllByRole('link', { name: 'Home' })
    expect(homeLinks[0]).toHaveAttribute('aria-current', 'page')
  })

  it('renders the Book your journey CTA button', () => {
    render(<Navbar />)
    expect(screen.getAllByText('Book your journey').length).toBeGreaterThan(0)
  })

  it('renders mobile menu toggle button', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /toggle navigation menu/i })).toBeInTheDocument()
  })

  it('opens mobile menu when hamburger is clicked', () => {
    render(<Navbar />)
    const toggle = openMobileMenu()
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes mobile menu when a nav link is clicked', () => {
    render(<Navbar />)
    const toggle = openMobileMenu()
    const mobileDrawer = screen.getByTestId('mobile-nav')
    fireEvent.click(within(mobileDrawer).getByRole('link', { name: 'Contact us' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('Navbar — Our Fleet menu', () => {
  it('lists exactly the three fleet categories on desktop', () => {
    render(<Navbar />)
    const panel = screen.getByTestId('desktop-submenu-Our Fleet')
    const rows = within(panel).getAllByTestId(/^fleet-category-/)
    expect(rows.map((r) => r.getAttribute('data-testid'))).toEqual([
      'fleet-category-chauffeur-cars',
      'fleet-category-luxury-minibuses',
      'fleet-category-executive-coaches',
    ])
  })

  it('nests each category vehicles in its own sub-dropdown, linking to the detail page', () => {
    render(<Navbar />)
    for (const category of FLEET_CATEGORIES) {
      const submenu = screen.getByTestId(`fleet-submenu-${category.slug}`)
      const links = within(submenu).getAllByRole('link')
      expect(links.map((l) => l.textContent)).toEqual(
        category.vehicles.map((v) => `${v.name}${v.seats}`),
      )
      expect(links.map((l) => l.getAttribute('href'))).toEqual(
        category.vehicles.map((v) => `/fleet/${category.slug}/${v.slug}`),
      )
    }
  })

  it('does not offer a 33-seater anywhere in the nav', () => {
    render(<Navbar />)
    expect(screen.queryByText(/33[- ]seater/i)).not.toBeInTheDocument()
  })

  it('expands a fleet category into its vehicles in the mobile drawer', () => {
    render(<Navbar />)
    openMobileMenu()
    const drawer = screen.getByTestId('mobile-nav')

    // Vehicles stay hidden until both levels are expanded.
    expect(within(drawer).queryByText('55-Seater Neoplan Tourliner')).not.toBeInTheDocument()

    fireEvent.click(within(drawer).getByRole('button', { name: /toggle our fleet submenu/i }))
    expect(within(drawer).getByText('Executive Coaches')).toBeInTheDocument()
    expect(within(drawer).queryByText('55-Seater Neoplan Tourliner')).not.toBeInTheDocument()

    fireEvent.click(within(drawer).getByRole('button', { name: /toggle executive coaches vehicles/i }))
    expect(within(drawer).getByText('55-Seater Neoplan Tourliner')).toBeInTheDocument()
  })

  it('collapses an open fleet category when another is opened', () => {
    render(<Navbar />)
    openMobileMenu()
    const drawer = screen.getByTestId('mobile-nav')
    fireEvent.click(within(drawer).getByRole('button', { name: /toggle our fleet submenu/i }))

    fireEvent.click(within(drawer).getByRole('button', { name: /toggle executive coaches vehicles/i }))
    expect(within(drawer).getByText('55-Seater Neoplan Tourliner')).toBeInTheDocument()

    fireEvent.click(within(drawer).getByRole('button', { name: /toggle chauffeur cars vehicles/i }))
    expect(within(drawer).getByText('Lamborghini Huracán')).toBeInTheDocument()
    expect(within(drawer).queryByText('55-Seater Neoplan Tourliner')).not.toBeInTheDocument()
  })
})

describe('Navbar — links to pages that do not exist yet', () => {
  const UNBUILT = ['Our Team', 'Vacancies', 'Travel Inspirations', 'FAQs']

  it('renders unbuilt "More" entries as inert, not as links', () => {
    render(<Navbar />)
    for (const label of UNBUILT) {
      const entry = screen.getByText(label).closest('[aria-disabled="true"]')
      expect(entry).not.toBeNull()
      expect(entry).not.toHaveAttribute('href')
    }
  })

  it('still links Gallery, which does exist', () => {
    render(<Navbar />)
    const gallery = screen.getByText('Gallery').closest('a')
    expect(gallery).toHaveAttribute('href', '/gallery')
  })

  it('keeps unbuilt entries inert in the mobile drawer too', () => {
    render(<Navbar />)
    openMobileMenu()
    const drawer = screen.getByTestId('mobile-nav')
    fireEvent.click(within(drawer).getByRole('button', { name: /toggle more submenu/i }))

    const faqs = within(drawer).getByText('FAQs').closest('[aria-disabled="true"]')
    expect(faqs).not.toBeNull()
    expect(faqs).not.toHaveAttribute('href')
  })
})
