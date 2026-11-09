/**
 * TopicNode.jsx
 *
 * Compact topic node in "The Forge" map layout (~220x52px).
 * Displays topic name, status icon (Circle / Flame / Check), hairline border,
 * and heat state styling.
 */

import { memo } from 'react'
import { Check, Flame, Circle } from 'lucide-react'
import { getTopicState } from '../../lib/nodeState'
import { HighlightText } from '../../lib/highlight'

function TopicNodeComponent({
  node,
  completedSet,
  personalizedPhase,
  isSelected,
  isDimmed,
  isSearchMatch,
  searchQuery,
  onSelect,
}) {
  const { data: topic, phase, topicId, width, height } = node
  const { isDone, heatState } = getTopicState(topicId, phase, completedSet, personalizedPhase)

  // Forge heat state visual styling
  let containerStyle = 'bg-white dark:bg-[#11141c] border-black/[0.08] dark:border-white/[0.08]'
  let textStyle = 'text-neutral-800 dark:text-neutral-200'
  let iconContainer = 'bg-black/[0.04] dark:bg-white/[0.06] text-neutral-400'

  if (isDone) {
    containerStyle =
      'bg-[#0A66C2]/[0.08] dark:bg-[#0A66C2]/[0.15] border-[#0A66C2]/40 dark:border-[#0A66C2]/50 text-neutral-900 dark:text-neutral-100 shadow-xs'
    textStyle = 'text-neutral-900 dark:text-white font-medium'
    iconContainer = 'bg-[#0A66C2] text-white'
  } else if (heatState === 'heating') {
    containerStyle =
      'bg-amber-500/[0.03] dark:bg-amber-500/[0.06] border-amber-500/30 dark:border-amber-400/40'
    iconContainer = 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
  }

  if (isSearchMatch) {
    containerStyle += ' ring-2 ring-[#0A66C2]/50 border-[#0A66C2]'
  }

  if (isSelected) {
    containerStyle += ' ring-2 ring-[#0A66C2] border-[#0A66C2]'
  }

  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(node)
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
      aria-label={`Topic: ${topic.name}, ${phase.label}, ${isDone ? 'completed' : 'not completed'}`}
      className={`absolute z-10 text-left rounded-lg px-2.5 py-1.5 border ${containerStyle} transition-all duration-150 cursor-pointer select-none group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
        isDimmed ? 'opacity-30 scale-[0.98]' : 'opacity-100'
      } ${isDone ? 'forge-completed' : ''}`}
    >
      {/* Status icon badge */}
      <div
        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${iconContainer}`}
      >
        {isDone ? (
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
        ) : heatState === 'heating' ? (
          <Flame className="h-3.5 w-3.5" />
        ) : (
          <Circle className="h-2.5 w-2.5 stroke-[2]" />
        )}
      </div>

      {/* Topic Title & Phase Tag */}
      <div className="flex-1 min-w-0">
        <div className={`text-xs truncate ${textStyle}`}>
          {searchQuery ? (
            <HighlightText text={topic.name} query={searchQuery} />
          ) : (
            topic.name
          )}
        </div>
        <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 truncate">
          {phase.label}
        </div>
      </div>
    </button>
  )
}

export const TopicNode = memo(TopicNodeComponent)
