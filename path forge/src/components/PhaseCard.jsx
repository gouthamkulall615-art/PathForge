import { useState } from 'react'
import { ChevronDown, ExternalLink, PlayCircle, BookOpen } from 'lucide-react'

const LEVEL_STYLES = {
  beginner: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/50',
  },
  intermediate: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50',
  },
  advanced: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/50',
  },
}

const RESOURCE_ICON = {
  yt: PlayCircle,
  docs: BookOpen,
}

export default function PhaseCard({ phase, index }) {
  const [expanded, setExpanded] = useState(false)
  const level = LEVEL_STYLES[phase.level] || LEVEL_STYLES.beginner

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
      rounded-xl shadow-sm overflow-hidden transition-all duration-200">

      {/* Phase header — clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left
          hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {/* Phase number circle */}
        <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full
          bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 text-sm font-bold text-[#0A66C2]">
          {index + 1}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {phase.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px]
              font-semibold uppercase tracking-wider border
              ${level.bg} ${level.text} ${level.border}`}>
              {phase.level}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {phase.duration}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown className={`h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500
          transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-800">
          {/* Description */}
          <div className="px-5 sm:px-6 pt-4 pb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {phase.desc}
            </p>
          </div>

          {/* Topics */}
          <div className="px-5 sm:px-6 py-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Topics to Cover
            </h4>
            <div className="space-y-3">
              {phase.topics?.map((topic, i) => (
                <div key={i}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
                    {topic.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {topic.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          {phase.resources?.length > 0 && (
            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                Curated Resources
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
                      className="group flex items-center gap-3 p-3
                        bg-gray-50 dark:bg-gray-800/50 rounded-lg
                        hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10
                        transition-colors"
                    >
                      <div className="flex-shrink-0 inline-flex items-center justify-center
                        w-8 h-8 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15">
                        <Icon className="h-4 w-4 text-[#0A66C2]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300
                        group-hover:text-[#0A66C2] transition-colors truncate">
                        {res.label}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-gray-400
                        dark:text-gray-500 ml-auto" />
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
