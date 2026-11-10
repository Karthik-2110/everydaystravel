import type { CSSProperties } from 'react'
import styles from './ChristmasBanner.module.css'

// A seeded sequence keeps the natural variation stable across server/client renders.
const variation = (index: number, salt: number) => {
  let value = Math.imul(index + 1, 374761393) ^ Math.imul(salt, 668265263)
  value = Math.imul(value ^ (value >>> 13), 1274126177)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296
}
function makeSnowflakes(banner: boolean) {
  return Array.from({ length: 24 }, (_, index) => {
    const size = .35 + variation(index, 1) * .65
    const fall = 9 + (1 - size) * 9 + variation(index, 2) * 5
    const duration = banner ? fall : fall * 2.5
    return {
      left: `${(index * 100 / 24 + variation(index, 3) * 4).toFixed(2)}%`,
      '--size': size,
      '--opacity': .2 + variation(index, 4) * (banner ? .55 : .3),
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
}

const bannerSnow = makeSnowflakes(true)
const pageSnow = makeSnowflakes(false)

// Keep the exported illustration layers at their original intrinsic dimensions.
export function ChristmasLayer({ index, left, top }: { index: number; left: number; top: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/images/christmas/layer-${index}.svg`} alt="" className={styles.layer} style={{ left, top }} />
  )
}

export default function ChristmasSnow({ banner = false }: { banner?: boolean }) {
  const snowflakes = banner ? bannerSnow : pageSnow

  return (
    <>
      {snowflakes.map((style, index) => (
        <span key={index} className={styles.fallingSnow} style={style}>
          <span className={styles.snowDrift}>
            <span className={styles.snowSway}>
              <span className={styles.snowflake}>
                <ChristmasLayer index={0} left={6.912} top={-0.019} />
                <ChristmasLayer index={1} left={0} top={4.584} />
                <ChristmasLayer index={2} left={0.482} top={3.341} />
              </span>
            </span>
          </span>
        </span>
      ))}
      {banner && (
        <span className={`${styles.fallingSnow} ${styles.largeSnow}`} style={snowflakes[23]}>
          <span className={styles.snowDrift}>
            <span className={styles.snowSway}>
              <span className={styles.largeSnowflake}>
                <ChristmasLayer index={3} left={23.501} top={-0.064} />
                <ChristmasLayer index={4} left={0} top={15.499} />
                <ChristmasLayer index={5} left={1.639} top={11.296} />
              </span>
            </span>
          </span>
        </span>
      )}
    </>
  )
}
