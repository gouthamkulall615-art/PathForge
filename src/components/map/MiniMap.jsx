/**
 * MiniMap.jsx
 *
 * Desktop-only mini-map overlay (160x100px) showing overview and current viewport box.
 * Allows clicking or dragging to navigate the canvas.
 */

import { memo, useRef, useCallback } from 'react'

function MiniMapComponent({
  bounds,
  nodes,
  edges,
  completedSet,
  transform,
  containerRect,
  onNavigate,
}) {
  const miniMapRef = useRef(null)

  const MINI_WIDTH = 160
  const MINI_HEIGHT = 100
  const PADDING = 8

  const hasValidBounds = Boolean(bounds && bounds.width > 0 && bounds.height > 0)

  // Calculate scaling factor to fit bounds into minimap box
  const availableW = MINI_WIDTH - PADDING * 2
  const availableH = MINI_HEIGHT - PADDING * 2
  const scale = hasValidBounds
    ? Math.min(availableW / bounds.width, availableH / bounds.height)
    : 1

  const offsetX = hasValidBounds ? (MINI_WIDTH - bounds.width * scale) / 2 : 0
  const offsetY = hasValidBounds ? (MINI_HEIGHT - bounds.height * scale) / 2 : 0

  // Handle click / drag on minimap to navigate
  const handleInteract = useCallback(
    (e) => {
      if (!hasValidBounds) return
      const rect = miniMapRef.current?.getBoundingClientRect()
      if (!rect) return

      const clickMiniX = e.clientX - rect.left
      const clickMiniY = e.clientY - rect.top

      const targetWorldX = (clickMiniX - offsetX) / scale + bounds.minX
      const targetWorldY = (clickMiniY - offsetY) / scale + bounds.minY

      onNavigate(targetWorldX, targetWorldY)
    },
    [hasValidBounds, bounds, scale, offsetX, offsetY, onNavigate]
  )

  if (!hasValidBounds) return null

  // Transform world coordinates to minimap coordinates
  const toMiniX = (worldX) => (worldX - bounds.minX) * scale + offsetX
  const toMiniY = (worldY) => (worldY - bounds.minY) * scale + offsetY

  // Viewport box in world coordinates
  const viewportW = containerRect?.width || 800
  const viewportH = containerRect?.height || 600

  const worldViewX = (0 - transform.x) / transform.zoom
  const worldViewY = (0 - transform.y) / transform.zoom
  const worldViewW = viewportW / transform.zoom
  const worldViewH = viewportH / transform.zoom

  const viewMiniX = toMiniX(worldViewX)
  const viewMiniY = toMiniY(worldViewY)
  const viewMiniW = Math.max(worldViewW * scale, 12)
  const viewMiniH = Math.max(worldViewH * scale, 8)

  const handlePointerDown = (e) => {
    e.stopPropagation()
    handleInteract(e)
  }

  return (
    <div
      ref={miniMapRef}
      onPointerDown={handlePointerDown}
      style={{ width: `${MINI_WIDTH}px`, height: `${MINI_HEIGHT}px` }}
      aria-label="Map overview thumbnail"
      className="hidden md:block absolute bottom-4 right-4 z-20 rounded-xl bg-white/90 dark:bg-[#11141c]/90 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.08] shadow-md overflow-hidden cursor-crosshair select-none"
    >
      <svg
        width={MINI_WIDTH}
        height={MINI_HEIGHT}
        className="w-full h-full pointer-events-none"
      >
        {/* Simplified edges */}
        {edges.map((e) => {
          const fromX = toMiniX(e.fromPoint.x)
          const fromY = toMiniY(e.fromPoint.y)
          const toX = toMiniX(e.toPoint.x)
          const toY = toMiniY(e.toPoint.y)
          const isDone = e.topicId ? completedSet.has(e.topicId) : false

          return (
            <line
              key={e.id}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={isDone ? '#0A66C2' : 'currentColor'}
              strokeWidth={e.kind === 'trunk' ? 1.5 : 0.75}
              className={isDone ? '' : 'text-neutral-300 dark:text-neutral-700'}
            />
          )
        })}

        {/* Simplified nodes */}
        {nodes.map((n) => {
          const x = toMiniX(n.x)
          const y = toMiniY(n.y)
          const w = Math.max(n.width * scale, 4)
          const h = Math.max(n.height * scale, 3)

          const isHub = n.type === 'phase'
          const isDone = n.topicId ? completedSet.has(n.topicId) : false

          return (
            <rect
              key={n.id}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={1.5}
              fill={
                isDone
                  ? '#0A66C2'
                  : isHub
                  ? 'currentColor'
                  : 'currentColor'
              }
              className={
                isDone
                  ? ''
                  : isHub
                  ? 'text-neutral-600 dark:text-neutral-400'
                  : 'text-neutral-400 dark:text-neutral-600'
              }
            />
          )
        })}

        {/* Viewport Box */}
        <rect
          x={viewMiniX}
          y={viewMiniY}
          width={viewMiniW}
          height={viewMiniH}
          rx={2}
          fill="rgba(10, 102, 194, 0.12)"
          stroke="#0A66C2"
          strokeWidth={1.25}
        />
      </svg>
    </div>
  )
}

export const MiniMap = memo(MiniMapComponent)
