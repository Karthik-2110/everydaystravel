import { Loader } from '@googlemaps/js-api-loader'

let loaderPromise: Promise<void> | null = null

export function loadGoogleMaps(): Promise<void> {
  if (loaderPromise) return loaderPromise

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    version: 'weekly',
  })

  loaderPromise = loader.importLibrary('places').then(() => undefined)
  return loaderPromise
}
