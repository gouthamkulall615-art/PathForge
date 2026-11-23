import { useRef, useState } from 'react'

/**
 * SpotlightCard — card that follows mouse with a subtle radial highlight.
 * Props: children, className, spotlightColor (default accent at 8% opacity)
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(10,102,194,0.08)',
}) {
  const cardRef = useRef(null)
  const [style, setStyle] = useState({})
  const [active, setActive] = useState(false)

  const handleMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setStyle({
      background: `radial-gradient(240px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`,
    })
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => { setActive(false); setStyle({}) }}
    >
      {active && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200"
          style={style}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

