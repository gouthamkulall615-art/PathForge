/**
 * MapCanvas.jsx
 *
 * Canvas surface hosting the panning SVG layers (edges, dotted grid)
 * and HTML overlay nodes (PhaseHub, TopicNode, FinalNode).
 */

import { memo } from 'react'
import { Edges } from './Edges'
import { PhaseHub } from './PhaseHub'
import { TopicNode } from './TopicNode'
import { FinalNode } from './FinalNode'

function MapCanvasComponent({
  containerRef,
  contentRef,
  panZoomEvents,
  nodes,
  edges,
  bounds,
  completedSet,
  personalizedMap,
  selectedNodeId,
  hoveredNodeId,
  searchQuery,
  searchMatchedTopicIds,
  isPersonalizedRoute,
  onSelectNode,
  onToggleExpandPhase,
  onHoverNode,
}) {
  return (
    <div
      ref={containerRef}
      {...panZoomEvents}
      className="relative w-full h-[640px] sm:h-[720px] overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#f8fafc] dark:bg-[#0b0d14] cursor-grab active:cursor-grabbing select-none focus:outline-none"
      style={{ touchAction: 'none' }}
      tabIndex={0}
      aria-label="Interactive career roadmap tree. Use arrow keys, plus, minus, and drag to navigate."
    >
      {/* Transformed Stage Container */}
      <div
        ref={contentRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{
          width: `${Math.max(bounds.width, 1000)}px`,
          height: `${Math.max(bounds.height, 800)}px`,
        }}
      >
        {/* SVG Layer: Dotted Grid + Edges */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={Math.max(bounds.width, 1000)}
          height={Math.max(bounds.height, 800)}
        >
          <defs>
            {/* Subtle Dotted Pattern */}
            <pattern
              id="forge-dotted-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                className="fill-black/[0.07] dark:fill-white/[0.07]"
              />
            </pattern>
          </defs>

          {/* Dotted Grid Background */}
          <rect
            width="100%"
            height="100%"
            fill="url(#forge-dotted-grid)"
          />

          {/* Connector Edges */}
          <Edges
            edges={edges}
            completedSet={completedSet}
            hoveredNodeId={hoveredNodeId}
            isPersonalizedRoute={isPersonalizedRoute}
          />
        </svg>

        {/* HTML Nodes Layer */}
        <div className="absolute inset-0">
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id
            const isHovered = hoveredNodeId === node.id
            const isDimmed =
              hoveredNodeId && !isHovered && node.id !== hoveredNodeId && node.phaseId !== hoveredNodeId
            const isSearchMatch =
              node.type === 'topic' && searchMatchedTopicIds?.has(node.topicId)

            if (node.type === 'phase') {
              const personalizedPhase = personalizedMap?.get(node.phaseId) || null
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => onHoverNode(node.id)}
                  onMouseLeave={() => onHoverNode(null)}
                >
                  <PhaseHub
                    node={node}
                    completedSet={completedSet}
                    personalizedPhase={personalizedPhase}
                    isSelected={isSelected}
                    isDimmed={isDimmed}
                    onSelect={onSelectNode}
                    onToggleExpand={onToggleExpandPhase}
                  />
                </div>
              )
            }

            if (node.type === 'topic') {
              const personalizedPhase = personalizedMap?.get(node.phaseId) || null
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => onHoverNode(node.id)}
                  onMouseLeave={() => onHoverNode(null)}
                >
                  <TopicNode
                    node={node}
                    completedSet={completedSet}
                    personalizedPhase={personalizedPhase}
                    isSelected={isSelected}
                    isDimmed={isDimmed}
                    isSearchMatch={isSearchMatch}
                    searchQuery={searchQuery}
                    onSelect={onSelectNode}
                  />
                </div>
              )
            }

            if (node.type === 'final') {
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => onHoverNode(node.id)}
                  onMouseLeave={() => onHoverNode(null)}
                >
                  <FinalNode
                    node={node}
                    isSelected={isSelected}
                    isDimmed={isDimmed}
                    onSelect={onSelectNode}
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}

export const MapCanvas = memo(MapCanvasComponent)

