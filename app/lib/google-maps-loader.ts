import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

let loaderPromise: Promise<void> | null = null

export function loadGoogleMaps(): Promise<void> {
  if (loaderPromise) return loaderPromise

  setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    v: 'weekly',
  })

  loaderPromise = importLibrary('places').then(() => undefined)
  return loaderPromise
}
