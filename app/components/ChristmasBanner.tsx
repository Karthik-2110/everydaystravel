import Link from 'next/link'
import ChristmasSnow, { ChristmasLayer } from './ChristmasSnow'
import styles from './ChristmasBanner.module.css'

export default function ChristmasBanner({ quoteHref = '/christmas' }: { quoteHref?: string }) {
  return (
    <div className={styles.banner}>
      <div className={styles.artwork} aria-hidden="true">
        <ChristmasSnow banner />
        <span className={styles.santa}>
          <ChristmasLayer index={6} left={61.651} top={35.713} />
          <ChristmasLayer index={7} left={55.104} top={117.292} />
          <ChristmasLayer index={8} left={35.606} top={117.32} />
          <ChristmasLayer index={9} left={12.566} top={56.161} />
          <ChristmasLayer index={10} left={0.01} top={59.796} />
          <ChristmasLayer index={11} left={0.797} top={-0.014} />
        </span>
      </div>
      <div className={styles.content}>
        <p>Planning a Christmas dinner or party? Hire a coach or minibus and get a flat 15% off your quoted price.</p>
        <Link href={quoteHref} className={styles.cta}>Get Quote</Link>
      </div>
    </div>
  )
}
