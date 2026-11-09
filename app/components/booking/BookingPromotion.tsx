'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const promotions = [
  {
    image: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_960,c_limit/v1783783988/DSC09031_yjmhzx.jpg',
    title: 'Luxury coach and minibus hire',
    description: 'Travel together in comfort with a professional driver and a vehicle suited to your group.',
  },
  {
    image: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_960,c_limit/v1783784630/20260211_134438550_iOS_okfp39.jpg',
    title: 'Airport transfers for groups',
    description: 'From Heathrow pickups to departures across London, we’ll help plan the journey around your flight.',
  },
  {
    image: 'https://res.cloudinary.com/dp4cbs8c2/image/upload/f_auto,q_auto,w_960,c_limit/v1783785511/IMG_6138_n9khty.jpg',
    title: 'Wedding and event transport',
    description: 'Bring your guests together with transport planned around your venue and timings.',
  },
]

export default function BookingPromotion() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: number | undefined

    const updateRotation = () => {
      window.clearInterval(timer)
      if (!preference.matches) {
        timer = window.setInterval(() => {
          setActiveIndex(index => (index + 1) % promotions.length)
        }, 5000)
      }
    }

    updateRotation()
    preference.addEventListener('change', updateRotation)
    return () => {
      window.clearInterval(timer)
      preference.removeEventListener('change', updateRotation)
    }
  }, [])

  return (
    <aside aria-label="Everydays Travel services" className="relative isolate grid overflow-hidden rounded-2xl border border-[#EBBA6F]/25 bg-[#0D1221]">
      {promotions.map(({ image, title, description }, index) => (
        <div
          key={title}
          aria-hidden={index !== activeIndex}
          className={`col-start-1 row-start-1 motion-safe:transition-opacity motion-safe:duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="relative aspect-[4/3]">
            <Image src={image} alt="" fill sizes="26vw" loading="eager" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1221]/65 via-transparent to-transparent" aria-hidden />
          </div>
          <div className="px-2 py-3 [overflow-wrap:anywhere] sm:px-4 sm:py-5 lg:px-5 lg:pb-6">
            <h2 className="text-xs font-medium leading-tight sm:text-base lg:text-xl text-[#EBBA6F]">{title}</h2>
            <p className="mt-2 text-xs leading-relaxed sm:text-sm text-white/70">{description}</p>
          </div>
        </div>
      ))}
    </aside>
  )
}
