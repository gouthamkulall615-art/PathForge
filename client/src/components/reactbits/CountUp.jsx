import { useEffect, useRef, useState } from 'react'

/**
 * CountUp — animates a number from 0 to `end`.
 * Props: end, duration (ms), suffix, className
 */
export default function CountUp({
  end = 0,
  duration = 1800,
  suffix = '',
  className = '',
  start = 0,
}) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [value, setValue] = useState(reduced ? end : start)
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)
  const observerRef = useRef(null)
  const elRef = useRef(null)

  useEffect(() => {
    if (reduced) return

    const el = elRef.current
    if (!el) return

    const run = () => {
      startTimeRef.current = null
      const animate = (ts) => {
        if (!startTimeRef.current) startTimeRef.current = ts
        const elapsed = ts - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(start + (end - start) * eased))
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate)
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run()
          observerRef.current?.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observerRef.current.observe(el)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observerRef.current?.disconnect()
    }
  }, [end, start, duration, reduced])

  return (
    <span ref={elRef} className={className}>
      {value.toLocaleString()}{suffix}
    </span>
  )
}

