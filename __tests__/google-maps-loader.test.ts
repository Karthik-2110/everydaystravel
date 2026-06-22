import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@googlemaps/js-api-loader', () => ({
  setOptions: vi.fn(),
  importLibrary: vi.fn().mockResolvedValue(undefined),
}))

describe('loadGoogleMaps', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('resolves without throwing', async () => {
    const { loadGoogleMaps } = await import('@/app/lib/google-maps-loader')
    await expect(loadGoogleMaps()).resolves.toBeUndefined()
  })

  it('returns the same promise on repeated calls (singleton)', async () => {
    const { loadGoogleMaps } = await import('@/app/lib/google-maps-loader')
    const p1 = loadGoogleMaps()
    const p2 = loadGoogleMaps()
    expect(p1).toBe(p2)
  })
})
