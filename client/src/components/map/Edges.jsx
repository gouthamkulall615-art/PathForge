/**
 * Edges.jsx
 *
 * Renders SVG trunk lines and cubic-bezier branch connector curves for "The Forge" map.
 * - Completed branches light up in accent color (#0A66C2).
 * - Active personalized route has animated ember dashes.
 * - Highlights path for hovered node.
 */

import { memo } from 'react'

function EdgesComponent({
  edges,
  completedSet,
  hoveredNodeId,
  isPersonalizedRoute,
}) {
  return (
    <g className="edges-layer pointer-events-none select-none">
      {edges.map((edge) => {
        const isTrunk = edge.kind === 'trunk'
        const isTopicDone = edge.topicId ? completedSet.has(edge.topicId) : false
        const isHovered =
          hoveredNodeId && (edge.to === hoveredNodeId || edge.from === hoveredNodeId)

        if (isTrunk) {
          return (
            <g key={edge.id}>
              {/* Subtle background rail */}
              <path
                d={edge.path}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                className="text-black/[0.08] dark:text-white/[0.08]"
              />

              {/* Foreground trunk track */}
              <path
                d={edge.path}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-black/20 dark:text-white/20"
              />

              {/* Animated ember route dash if personalized route is active */}
              {isPersonalizedRoute && (
                <path
                  d={edge.path}
                  fill="none"
                  stroke="#0A66C2"
                  strokeWidth={2}
                  strokeDasharray="6 8"
                  className="animate-ember-flow"
                />
              )}
            </g>
          )
        }

        // Branch curve
        let strokeColor = 'text-black/[0.12] dark:text-white/[0.12]'
        let strokeWidth = 1.25

        if (isTopicDone) {
          strokeColor = 'text-[#0A66C2]'
          strokeWidth = 1.75
        } else if (isHovered) {
          strokeColor = 'text-[#0A66C2]/80'
          strokeWidth = 2
        }

        return (
          <g key={edge.id}>
            {/* Background hairline */}
            <path
              d={edge.path}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className={`${strokeColor} transition-colors duration-200`}
            />

            {/* Ember flow for active route */}
            {isPersonalizedRoute && !isTopicDone && (
              <path
                d={edge.path}
                fill="none"
                stroke="#0A66C2"
                strokeWidth={1.5}
                strokeDasharray="4 6"
                className="animate-ember-flow opacity-70"
              />
            )}
          </g>
        )
      })}
    </g>
  )
}

export const Edges = memo(EdgesComponent)

