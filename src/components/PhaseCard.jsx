import { useState, useMemo } from 'react'
import { ChevronDown, ExternalLink, PlayCircle, BookOpen, Check } from 'lucide-react'
import { useProgress } from '../contexts/ProgressContext'
import { getTopicId } from '../lib/topicId'
import { HighlightText } from '../lib/highlight'

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

export default function PhaseCard({ phase, index, searchQuery = '' }) {
  const { completed, toggleTopic, getPhaseProgress } = useProgress()
  const [userExpanded, setUserExpanded] = useState(null)

  const level = LEVEL_STYLES[phase.level] || LEVEL_STYLES.beginner
  const formattedIndex = String(index + 1).padStart(2, '0')

  // Calculate phase progress
  const { done, total, percent } = getPhaseProgress(phase)
  const isAllDone = total > 0 && done === total

  // Determine if the search query matches within this phase
  const hasSearchMatch = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return false
    const q = searchQuery.trim().toLowerCase()
    if (phase.name?.toLowerCase().includes(q)) return true
    if (phase.desc?.toLowerCase().includes(q)) return true
    if (
      phase.topics?.some(
        (t) => t.name?.toLowerCase().includes(q) || t.detail?.toLowerCase().includes(q)
      )
    )
      return true
    if (phase.resources?.some((r) => r.label?.toLowerCase().includes(q))) return true
    return false
  }, [phase, searchQuery])

  // Derive expanded state without synchronous setState inside an effect
  const expanded = userExpanded !== null ? userExpanded : (hasSearchMatch || index === 0)

  return (
    <div className="bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl overflow-hidden transition-colors duration-150">
      {/* Clickable Header */}
      <button
        onClick={() => setUserExpanded(!expanded)}
        className="w-full p-4 sm:p-5 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-inset"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Milestone Number */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center font-mono text-xs font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums">
            {formattedIndex}
          </div>

          {/* Phase title & meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm sm:text-base font-medium text-[#111827] dark:text-[#eef0f5] truncate">
                <HighlightText text={phase.name} query={searchQuery} />
              </h3>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${level.badge}`}
              >
                {level.label}
              </span>

              {isAllDone && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                  Completed
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
              <span>{phase.duration}</span>
              <span className="text-black/20 dark:text-white/20">·</span>
              <span>
                {done}/{total} topics
              </span>
              {percent > 0 && (
                <>
                  <span className="text-black/20 dark:text-white/20">·</span>
                  <span className="text-[#0A66C2]">{percent}%</span>
                </>
              )}
            </div>
          </div>

          {/* Chevron Indicator */}
          <ChevronDown
            className={`h-4 w-4 text-[#6b7487] dark:text-[#7a8296] transition-transform duration-150 flex-shrink-0 ${
              expanded ? 'rotate-180' : ''
            }`}
            strokeWidth={1.5}
          />
        </div>

        {/* Thin progress bar in phase header */}
        <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full transition-[width] duration-300 ease-out motion-reduce:transition-none ${
              isAllDone ? 'bg-emerald-500' : 'bg-[#0A66C2]'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </button>

      {/* Expanded Phase Content */}
      {expanded && (
        <div className="border-t border-black/[0.06] dark:border-white/[0.06] px-4 sm:px-5 py-4 space-y-5">
          {/* Phase summary */}
          {phase.desc && (
            <p className="text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
              <HighlightText text={phase.desc} query={searchQuery} />
            </p>
          )}

          {/* Topics to cover with checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-medium text-[#111827] dark:text-[#eef0f5]">
                Topics to cover
              </h4>
              <span className="text-[11px] font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
                {done} of {total} completed
              </span>
            </div>

            <div className="space-y-2">
              {phase.topics?.map((topic, i) => {
                const topicId = getTopicId(phase.id, topic.name)
                const isDone = completed.has(topicId)

                return (
                  <label
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04] cursor-pointer hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors group select-none"
                  >
                    <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleTopic(topicId)}
                        className="sr-only peer"
                        aria-label={`Mark topic "${topic.name}" as completed`}
                      />
                      <div className="w-4 h-4 rounded border border-black/30 dark:border-white/30 peer-checked:border-[#0A66C2] peer-checked:bg-[#0A66C2] peer-focus-visible:ring-2 peer-focus-visible:ring-[#0A66C2] peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-[#12151e] flex items-center justify-center text-white transition-colors">
                        <Check
                          className={`h-3 w-3 stroke-[2.5] transition-opacity ${
                            isDone ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-medium transition-colors ${
                          isDone
                            ? 'line-through text-[#6b7487] dark:text-[#7a8296]'
                            : 'text-[#111827] dark:text-[#eef0f5]'
                        }`}
                      >
                        <HighlightText text={topic.name} query={searchQuery} />
                      </p>
                      <p
                        className={`text-xs leading-relaxed mt-0.5 transition-colors ${
                          isDone
                            ? 'text-[#6b7487]/70 dark:text-[#7a8296]/70'
                            : 'text-[#6b7487] dark:text-[#7a8296]'
                        }`}
                      >
                        <HighlightText text={topic.detail} query={searchQuery} />
                      </p>
                    </div>
                  </label>
                )
              })}
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
                        <Icon
                          className="h-4 w-4 text-[#0A66C2] flex-shrink-0"
                          strokeWidth={1.75}
                        />
                        <span className="text-xs font-medium text-[#111827] dark:text-[#eef0f5] truncate">
                          <HighlightText text={res.label} query={searchQuery} />
                        </span>
                      </div>
                      <ExternalLink
                        className="h-3.5 w-3.5 text-[#6b7487] dark:text-[#7a8296] flex-shrink-0"
                        strokeWidth={1.5}
                      />
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
