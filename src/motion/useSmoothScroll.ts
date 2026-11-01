import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap'

/**
 * Smooth page scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger
 * stays in sync. Skipped entirely for reduced-motion users. Scrollable panels
 * (the topic drawer) opt out with `data-lenis-prevent`.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ autoRaf: false, lerp: 0.12 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
