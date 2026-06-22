import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the loader package before importing our module
vi.mock('@googlemaps/js-api-loader', () => ({
  Loader: vi.fn().mockImplementation(function () {
    return { importLibrary: vi.fn().mockResolvedValue(undefined) }
  }),
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
