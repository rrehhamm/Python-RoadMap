import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../../motion/gsap'

/**
 * Number that counts to its new value whenever it changes.
 * Inspired by React Bits "CountUp", rebuilt on GSAP so we don't need a second
 * animation library. Only the text node's value is touched (React keeps owning
 * the node), and the accessible label always carries the final number.
 */
export function CountUp({ value, duration = 0.9 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const shown = useRef(0)

  useGSAP(
    () => {
      const node = ref.current?.firstChild
      if (!node || prefersReducedMotion() || shown.current === value) {
        shown.current = value
        return
      }
      const counter = { n: shown.current }
      node.nodeValue = String(counter.n)
      const tween = gsap.to(counter, {
        n: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          node.nodeValue = String(Math.round(counter.n))
          shown.current = Math.round(counter.n)
        },
      })
      return () => {
        tween.kill()
        node.nodeValue = String(value)
      }
    },
    { dependencies: [value] },
  )

  return <span ref={ref}>{value}</span>
}
