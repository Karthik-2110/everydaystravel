import type { ServiceFilm } from '../data/business-services'

// Playback is deliberate: no autoplay, no background downloads, and native
// keyboard-accessible controls. The poster keeps the media present at rest.
export default function FleetFilm({ film }: { film: ServiceFilm }) {
  return (
    <figure>
      <video controls muted loop playsInline preload="none" poster={film.poster}
        aria-label={film.caption} className="block w-full aspect-video lg:aspect-[21/9] object-cover bg-[#0C0F1C]">
        <source src={film.src} type="video/mp4" />
        Your browser does not support this video. <a href={film.src}>Open the fleet film</a>.
      </video>
      <figcaption className="site-container py-4 text-sm leading-relaxed text-white/65">{film.caption}</figcaption>
    </figure>
  )
}
