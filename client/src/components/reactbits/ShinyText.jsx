/**
 * ShinyText — a text element with an animated shine sweep.
 * Uses CSS animation only; no GSAP/Framer.
 */
export default function ShinyText({ text = '', className = '' }) {
  return (
    <span
      className={`shiny-text relative inline-block ${className}`}
      style={{
        background:
          'linear-gradient(90deg, currentColor 0%, currentColor 40%, #fff 50%, currentColor 60%, currentColor 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'shinySwipe 2.4s linear infinite',
      }}
    >
      {text}
    </span>
  )
}

