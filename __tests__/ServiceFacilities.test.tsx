import { render, screen, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import ServiceFacilities from '@/app/components/service/ServiceFacilities'
import { SERVICES } from '@/app/components/ServiceList'
import { DEFAULT_SERVICES } from '@/app/components/ServicesGrid'

afterEach(cleanup)

describe('service photography and facilities', () => {
  it('covers every service in the listing with a real mixed gallery', () => {
    expect(DEFAULT_SERVICES).toHaveLength(SERVICES.length)
    for (const service of SERVICES) {
      expect(service.images!.length).toBeGreaterThanOrEqual(3)
      expect(service.image).toBe(service.images![0])
      expect(service.images!.every(image => image.includes('/dp4cbs8c2/'))).toBe(true)
      expect(new Set(service.images).size).toBe(service.images!.length)
    }
  })

  it.each(SERVICES.map(service => [service.slug, service.name]))('shows facilities and quote access for %s', (slug, name) => {
    render(<ServiceFacilities slug={slug} />)
    expect(screen.getByRole('region', { name: `${name} vehicles and facilities` })).toBeVisible()
    expect(screen.getAllByRole('img')).toHaveLength(3)
    expect(screen.getByRole('link', { name: /Request a .* quote/ })).toHaveAttribute('href', '/book')
    expect(screen.getByRole('link', { name: 'Compare vehicles and facilities' })).toHaveAttribute('href', '/fleet')
    expect(screen.getByText(/Facilities vary by vehicle/)).toBeVisible()
  })
})
