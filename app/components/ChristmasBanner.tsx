import type { CSSProperties } from 'react'
import Link from 'next/link'
import styles from './ChristmasBanner.module.css'

// A seeded sequence keeps the natural variation stable across server/client renders.
const variation = (index: number, salt: number) => {
  let value = Math.imul(index + 1, 374761393) ^ Math.imul(salt, 668265263)
  value = Math.imul(value ^ (value >>> 13), 1274126177)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296
}
const snowflakes = Array.from({ length: 24 }, (_, index) => {
  const size = .35 + variation(index, 1) * .65
  const duration = 9 + (1 - size) * 9 + variation(index, 2) * 5
  return {
    left: `${(index * 100 / 24 + variation(index, 3) * 4).toFixed(2)}%`,
    '--size': size,
    '--opacity': .2 + variation(index, 4) * .55,
    '--fall-duration': `${duration}s`,
    '--fall-delay': `${-variation(index, 5) * duration}s`,
    '--drift': `${(variation(index, 6) - .5) * 70}px`,
    '--sway': `${7 + variation(index, 7) * 15}px`,
    '--sway-duration': `${3 + variation(index, 8) * 4}s`,
    '--spin-duration': `${12 + variation(index, 9) * 18}s`,
    '--spin-direction': index % 2 ? 'normal' : 'reverse',
    '--resting-position': `${variation(index, 10) * 90}%`,
  } as CSSProperties
})

// Keep the exported illustration layers at their original intrinsic dimensions.
function Layer({ index, left, top }: { index: number; left: number; top: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/images/christmas/layer-${index}.svg`} alt="" className={styles.layer} style={{ left, top }} />
  )
}

export default function ChristmasBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.artwork} aria-hidden="true">
        {snowflakes.map((style, index) => (
          <span key={index} className={styles.fallingSnow} style={style}>
            <span className={styles.snowDrift}>
              <span className={styles.snowSway}>
                <span className={styles.snowflake}>
                  <Layer index={0} left={6.912} top={-0.019} />
                  <Layer index={1} left={0} top={4.584} />
                  <Layer index={2} left={0.482} top={3.341} />
                </span>
              </span>
            </span>
          </span>
        ))}
        <span className={`${styles.fallingSnow} ${styles.largeSnow}`} style={snowflakes[23]}>
          <span className={styles.snowDrift}>
            <span className={styles.snowSway}>
              <span className={styles.largeSnowflake}>
                <Layer index={3} left={23.501} top={-0.064} />
                <Layer index={4} left={0} top={15.499} />
                <Layer index={5} left={1.639} top={11.296} />
              </span>
            </span>
          </span>
        </span>
        <span className={styles.santa}>
          <Layer index={6} left={61.651} top={35.713} />
          <Layer index={7} left={55.104} top={117.292} />
          <Layer index={8} left={35.606} top={117.32} />
          <Layer index={9} left={12.566} top={56.161} />
          <Layer index={10} left={0.01} top={59.796} />
          <Layer index={11} left={0.797} top={-0.014} />
        </span>
      </div>
      <div className={styles.content}>
        <p>Planning a Christmas dinner or party? Hire a coach or minibus and get a flat 15% off your quoted price.</p>
        <Link href="/book" className={styles.cta}>Get Quote</Link>
      </div>
    </div>
  )
}
