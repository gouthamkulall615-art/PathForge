import { useState } from 'react'
import { ChevronDown, ExternalLink, PlayCircle, BookOpen } from 'lucide-react'

const LEVEL_STYLES = {
  beginner: {
    label: 'Beginner',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  intermediate: {
    label: 'Intermediate',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  advanced: {
    label: 'Advanced',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
}

const RESOURCE_ICON = {
  yt: PlayCircle,
  docs: BookOpen,
}

export default function PhaseCard({ phase, index }) {
  const [expanded, setExpanded] = useState(index === 0)
  const level = LEVEL_STYLES[phase.level] || LEVEL_STYLES.beginner
  const formattedIndex = String(index + 1).padStart(2, '0')

  return (
    <div className="bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl overflow-hidden transition-colors duration-150">
      {/* Clickable Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
        aria-expanded={expanded}
      >
        {/* Milestone Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center font-mono text-xs font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums">
          {formattedIndex}
        </div>

        {/* Phase title & meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm sm:text-base font-medium text-[#111827] dark:text-[#eef0f5] truncate">
              {phase.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${level.badge}`}>
              {level.label}
            </span>
          </div>
          <p className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
            {phase.duration} · {phase.topics?.length || 0} milestones
          </p>
        </div>

        {/* Chevron Indicator */}
        <ChevronDown
          className={`h-4 w-4 text-[#6b7487] dark:text-[#7a8296] transition-transform duration-150 ${
            expanded ? 'rotate-180' : ''
          }`}
          strokeWidth={1.5}
        />
      </button>

      {/* Expanded Phase Content */}
      {expanded && (
        <div className="border-t border-black/[0.06] dark:border-white/[0.06] px-4 sm:px-5 py-4 space-y-5">
          {/* Phase summary */}
          {phase.desc && (
            <p className="text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
              {phase.desc}
            </p>
          )}

          {/* Topics to cover */}
          <div>
            <h4 className="text-xs font-medium text-[#111827] dark:text-[#eef0f5] mb-2.5">
              Topics to cover
            </h4>
            <div className="space-y-2">
              {phase.topics?.map((topic, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]"
                >
                  <p className="text-xs sm:text-sm font-medium text-[#111827] dark:text-[#eef0f5] mb-0.5">
                    {topic.name}
                  </p>
                  <p className="text-xs text-[#6b7487] dark:text-[#7a8296] leading-relaxed">
                    {topic.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Resources */}
          {phase.resources?.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-[#111827] dark:text-[#eef0f5] mb-2.5">
                Curated resources
              </h4>
              <div className="space-y-2">
                {phase.resources.map((res, i) => {
                  const Icon = RESOURCE_ICON[res.type] || ExternalLink
                  return (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="h-4 w-4 text-[#0A66C2] flex-shrink-0" strokeWidth={1.75} />
                        <span className="text-xs font-medium text-[#111827] dark:text-[#eef0f5] truncate">
                          {res.label}
                        </span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-[#6b7487] dark:text-[#7a8296] flex-shrink-0" strokeWidth={1.5} />
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
