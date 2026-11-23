import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * SplitText — splits a string into animated char spans.
 * Props:
 *   text: string
 *   className: string
 *   delay: number (seconds, default 0)
 *   duration: number (seconds per char, default 0.05)
 *   stagger: number (default 0.03)
 *   y: number (px offset to animate from, default 24)
 *   onComplete: fn
 */
export default function SplitText({
  text = '',
  className = '',
  delay = 0,
  duration = 0.6,
  stagger = 0.025,
  y = 28,
  onComplete,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check reduced motion preference
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      if (onComplete) onComplete()
      return
    }

    const chars = el.querySelectorAll('.split-char')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          delay,
          ease: 'power3.out',
          onComplete,
        }
      )
    }, el)

    return () => ctx.revert()
  }, [text, delay, duration, stagger, y, onComplete])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="split-char inline-block"
          aria-hidden="true"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

