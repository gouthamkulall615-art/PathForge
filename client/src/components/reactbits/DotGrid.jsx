/**
 * DotGrid — pure CSS dotted grid background. No WebGL.
 * Renders as an absolutely-positioned overlay. Parent must be `relative`.
 */
export default function DotGrid({
  dotColor = 'currentColor',
  gap = 24,
  radius = 1,
  opacity = 0.15,
  className = '',
}) {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${gap}" height="${gap}">` +
      `<circle cx="${gap / 2}" cy="${gap / 2}" r="${radius}" fill="${dotColor}" />` +
      `</svg>`
  )

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundSize: `${gap}px ${gap}px`,
        opacity,
      }}
    />
  )
}

