/**
 * Highlights matches of `query` within `text` safely without regex injection.
 */
export function HighlightText({ text, query, className = '' }) {
  if (!text) return null
  const trimmed = typeof query === 'string' ? query.trim() : ''
  if (!trimmed) {
    return <span className={className}>{text}</span>
  }

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = String(text).split(regex)

  return (
    <span className={className}>
      {parts.map((part, idx) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark
            key={idx}
            className="bg-[#0A66C2]/20 dark:bg-[#0A66C2]/35 text-[#111827] dark:text-[#eef0f5] rounded-[2px] px-0.5 font-medium"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}

