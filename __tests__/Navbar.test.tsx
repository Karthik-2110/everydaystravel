import { render, screen, fireEvent, within } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Navbar from '@/app/components/Navbar'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} onClick={onClick} {...props}>{children}</a>
  ),
}))

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Navbar', () => {
  it('renders a logo placeholder container', () => {
    render(<Navbar />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByTestId('logo-container')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(<Navbar />)
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Services').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Our fleet').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Reviews').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Contact us').length).toBeGreaterThan(0)
    expect(screen.getAllByText('See more').length).toBeGreaterThan(0)
  })

  it('marks Home as the active page when pathname is /', () => {
    render(<Navbar />)
    // Use exact match so we get the nav "Home" link, not the logo (aria-label="Everydays Travel home")
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
    const toggle = screen.getByRole('button', { name: /toggle navigation menu/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes mobile menu when a nav link is clicked', () => {
    render(<Navbar />)
    const toggle = screen.getByRole('button', { name: /toggle navigation menu/i })
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const mobileDrawer = screen.getByTestId('mobile-nav')
    const servicesLink = within(mobileDrawer).getByRole('link', { name: /services/i })
    fireEvent.click(servicesLink)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
