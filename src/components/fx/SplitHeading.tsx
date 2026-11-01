import { useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '../../motion/gsap'

/**
 * Heading whose words rise into place once on load.
 * Adapted from React Bits "SplitText" (reactbits.dev), trimmed to the one
 * effect we use. GSAP SplitText keeps the heading readable to screen readers
 * (aria-label on the element, split pieces hidden).
 */
export function SplitHeading({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      const split = SplitText.create(ref.current, {
        type: 'words',
        mask: 'words',
        wordsClass: 'split-word',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, { yPercent: 110, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06, delay }),
      })
      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  )
}
