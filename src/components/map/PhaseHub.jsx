/**
 * PhaseHub.jsx
 *
 * Phase hub node in "The Forge" map layout.
 * Displays phase index, name, level badge, duration, and SVG progress ring.
 * Follows heat state styling (cold -> heating -> forged 100%).
 */

import { memo } from 'react'
import { Check, ChevronRight, Layers } from 'lucide-react'
import { getPhaseState } from '../../lib/nodeState'

const LEVEL_COLORS = {
  beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  intermediate: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20',
  advanced: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
}

function PhaseHubComponent({
  node,
  completedSet,
  personalizedPhase,
  isSelected,
  isDimmed,
  onSelect,
  onToggleExpand,
}) {
  const { data: phase, phaseIndex, isExpanded, topicsCount, width, height } = node
  const phaseState = getPhaseState(phase, completedSet, personalizedPhase)
  const { percent, isComplete, heatState, isMastered, isReview } = phaseState

  // Progress ring math
  const radius = 18
  const stroke = 3
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  const formattedIndex = String(phaseIndex + 1).padStart(2, '0')

  // Heat state visual styling
  let borderStyle = 'border-black/[0.08] dark:border-white/[0.08]'
  let ringBg = 'text-neutral-400 dark:text-neutral-600'
  let ringStroke = 'text-[#0A66C2]'
  let shadowStyle = 'shadow-xs'

  if (isComplete) {
    borderStyle = 'border-emerald-500/50 dark:border-emerald-500/60 ring-1 ring-emerald-500/30'
    ringStroke = 'text-emerald-500'
    shadowStyle = 'shadow-sm shadow-emerald-500/10'
  } else if (heatState === 'heating') {
    borderStyle = 'border-amber-500/40 dark:border-amber-400/50'
    ringStroke = 'text-amber-500 dark:text-amber-400'
  }

  if (isSelected) {
    borderStyle = 'border-[#0A66C2] ring-2 ring-[#0A66C2]/40'
  }

  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(node)
    onToggleExpand(phase.id)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      aria-label={`Phase ${formattedIndex}: ${phase.name}, ${percent}% complete, ${
        isExpanded ? 'expanded' : 'collapsed'
      }`}
      className={`absolute z-10 text-left rounded-xl p-3 bg-white dark:bg-[#11141c] border ${borderStyle} ${shadowStyle} transition-all duration-150 cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
        isDimmed ? 'opacity-35 scale-[0.98]' : 'opacity-100'
      } ${isMastered ? 'opacity-65' : ''}`}
    >
      <div className="flex items-start justify-between gap-2.5 h-full">
        {/* Left Column: Metadata & Title */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="font-mono text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
                Phase {formattedIndex}
              </span>

              {isMastered ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md font-mono text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Skipped
                </span>
              ) : isReview ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md font-mono text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Review
                </span>
              ) : (
                <span
                  className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] border ${
                    LEVEL_COLORS[phase.level] || LEVEL_COLORS.beginner
                  }`}
                >
                  {phase.level}
                </span>
              )}

              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 truncate">
                {phase.duration}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-[#0A66C2] transition-colors">
              {phase.name}
            </h3>
          </div>

          {/* Bottom status chip */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500">
            {!isExpanded ? (
              <span className="inline-flex items-center gap-0.5 text-[#0A66C2] hover:underline">
                <Layers className="h-3 w-3" />+{topicsCount} topics
              </span>
            ) : (
              <span>
                {phaseState.done}/{phaseState.total} forged
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Progress Ring & Expand indicator */}
        <div className="flex flex-col items-center justify-between h-full flex-shrink-0">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                className={ringBg}
                opacity={0.2}
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${ringStroke} transition-[stroke-dashoffset] duration-300`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
              {isComplete ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
              ) : (
                `${percent}%`
              )}
            </div>
          </div>

          <ChevronRight
            className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-150 ${
              isExpanded ? 'rotate-90 text-[#0A66C2]' : ''
            }`}
          />
        </div>
      </div>
    </button>
  )
}

export const PhaseHub = memo(PhaseHubComponent)

