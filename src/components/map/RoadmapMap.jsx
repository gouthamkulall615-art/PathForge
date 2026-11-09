/**
 * RoadmapMap.jsx
 *
 * Primary container for "The Forge" interactive map view.
 * Handles layout generation, pan/zoom interaction, search highlighting,
 * focus mode, personalized route filtering, spatial keyboard navigation,
 * and inspector panel state.
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  Compass,
  Target,
  List,
  CheckCircle2,
  Route,
} from 'lucide-react'
import { useProgress } from '../../contexts/ProgressContext'
import { useProfile } from '../../contexts/ProfileContext'
import { layoutRoadmap } from '../../lib/layoutRoadmap'
import { usePanZoom } from '../../hooks/usePanZoom'
import { getTopicId } from '../../lib/topicId'
import { MapCanvas } from './MapCanvas'
import { MapControls } from './MapControls'
import { MiniMap } from './MiniMap'
import { NodePanel } from './NodePanel'

export default function RoadmapMap({
  field,
  searchQuery = '',
  onSwitchToList,
}) {
  const { completed, toggleTopic, getFieldProgress } = useProgress()
  const { roadmap } = useProfile()

  // Track responsive orientation: horizontal for desktop, vertical under 768px
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const orientation = isMobile ? 'vertical' : 'horizontal'

  // Determine if this field has an active personalized roadmap from onboarding
  const isPersonalizedForField = Boolean(
    roadmap?.primaryFieldId === field.id && Array.isArray(roadmap?.phases)
  )

  const personalizedMap = useMemo(() => {
    const map = new Map()
    if (isPersonalizedForField && roadmap.phases) {
      roadmap.phases.forEach((p) => {
        map.set(p.phaseId, p)
      })
    }
    return map
  }, [isPersonalizedForField, roadmap])

  // "My route" vs "All phases" toggle state
  const [routeFilter, setRouteFilter] = useState(() =>
    isPersonalizedForField ? 'myRoute' : 'all'
  )

  // Find the first phase that is not fully completed (Current Phase)
  const currentPhaseId = useMemo(() => {
    if (!field?.phases) return null
    for (const phase of field.phases) {
      const topics = phase.topics || []
      const isPhaseDone =
        topics.length > 0 &&
        topics.every((t) => completed.has(getTopicId(phase.id, t.name)))
      if (!isPhaseDone) return phase.id
    }
    return field.phases[0]?.id || null
  }, [field, completed])

  // Focus mode toggle (default true)
  const [focusMode, setFocusMode] = useState(true)

  // User manual expansion overrides (map of phaseId -> boolean)
  const [userExpandedOverrides, setUserExpandedOverrides] = useState(() => new Map())

  // Search matching: find matching topics and auto-expand their phases
  const searchMatchedTopicIds = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return null
    const q = searchQuery.toLowerCase().trim()
    const matches = new Set()

    field?.phases?.forEach((phase) => {
      phase.topics?.forEach((t) => {
        if (
          t.name.toLowerCase().includes(q) ||
          (t.detail && t.detail.toLowerCase().includes(q))
        ) {
          const tid = getTopicId(phase.id, t.name)
          matches.add(tid)
        }
      })
    })

    return matches
  }, [field, searchQuery])

  // Compute effective expanded phases declaratively
  const effectiveExpandedPhaseIds = useMemo(() => {
    const set = new Set()

    if (searchMatchedTopicIds && searchMatchedTopicIds.size > 0) {
      field?.phases?.forEach((phase) => {
        const hasMatch = phase.topics?.some((t) =>
          searchMatchedTopicIds.has(getTopicId(phase.id, t.name))
        )
        if (hasMatch) set.add(phase.id)
      })
    }

    if (focusMode) {
      if (currentPhaseId) set.add(currentPhaseId)
    } else if (field?.phases) {
      field.phases.forEach((p) => {
        const pStatus = personalizedMap.get(p.id)?.status
        if (routeFilter === 'myRoute' && pStatus === 'mastered') {
          // keep collapsed
        } else {
          set.add(p.id)
        }
      })
    }

    // Apply manual user overrides
    userExpandedOverrides.forEach((isExpanded, phaseId) => {
      if (isExpanded) set.add(phaseId)
      else set.delete(phaseId)
    })

    return set
  }, [
    searchMatchedTopicIds,
    focusMode,
    currentPhaseId,
    field,
    routeFilter,
    personalizedMap,
    userExpandedOverrides,
  ])

  // Compute Layout via pure algorithm
  const layout = useMemo(() => {
    return layoutRoadmap(field, effectiveExpandedPhaseIds, orientation)
  }, [field, effectiveExpandedPhaseIds, orientation])

  // Pan & Zoom hook
  const {
    containerRef,
    contentRef,
    transform,
    zoomIn,
    zoomOut,
    fitToScreen,
    centerOn,
    reset,
    events: panZoomEvents,
  } = usePanZoom({
    initialZoom: 0.9,
    initialX: 40,
    initialY: 40,
  })

  // Track container dimensions safely for MiniMap
  const [containerRect, setContainerRect] = useState({ width: 800, height: 600 })
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setContainerRect({ width, height })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  // Initial auto-centering on current phase
  const hasAutoCenteredRef = useRef(false)
  useEffect(() => {
    if (hasAutoCenteredRef.current || !layout.nodes.length) return
    hasAutoCenteredRef.current = true

    const targetNode =
      layout.nodes.find((n) => n.phaseId === currentPhaseId && n.type === 'phase') ||
      layout.nodes[0]

    if (targetNode) {
      // Small timeout to allow container bounds to mount
      const timer = setTimeout(() => {
        centerOn(targetNode.x + targetNode.width / 2, targetNode.y + targetNode.height / 2, 0.95, true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [layout.nodes, currentPhaseId, centerOn])

  // Inspector panel state
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNodeId, setHoveredNodeId] = useState(null)

  // Toggle phase expansion
  const handleToggleExpandPhase = useCallback((phaseId) => {
    setUserExpandedOverrides((prev) => {
      const next = new Map(prev)
      const isCurrentlyExpanded = effectiveExpandedPhaseIds.has(phaseId)
      next.set(phaseId, !isCurrentlyExpanded)
      return next
    })
  }, [effectiveExpandedPhaseIds])

  // Toggle focus mode and reset overrides
  const handleToggleFocusMode = useCallback(() => {
    setFocusMode((prev) => {
      setUserExpandedOverrides(new Map())
      return !prev
    })
  }, [])

  // Node selection
  const handleSelectNode = useCallback((node) => {
    setSelectedNode(node)
  }, [])

  // Close inspector panel
  const handleClosePanel = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // MiniMap navigation
  const handleMiniMapNavigate = useCallback(
    (worldX, worldY) => {
      centerOn(worldX, worldY, transform.zoom, true)
    },
    [centerOn, transform.zoom]
  )

  // Field progress stats
  const { done, total, percent } = getFieldProgress(field)

  // Keyboard navigation & Shortcuts
  const [focusedNodeId, setFocusedNodeId] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept typing in inputs
      if (e.target.closest('input, textarea, select')) return

      if (e.key === 'Escape') {
        if (selectedNode) {
          setSelectedNode(null)
          e.preventDefault()
        }
      } else if (e.key === 'f' || e.key === 'F') {
        setFocusMode((prev) => !prev)
        e.preventDefault()
      } else if (e.key === '+' || e.key === '=') {
        zoomIn()
        e.preventDefault()
      } else if (e.key === '-' || e.key === '_') {
        zoomOut()
        e.preventDefault()
      } else if (e.key === '0') {
        fitToScreen(layout.bounds, true)
        e.preventDefault()
      } else if (e.key === 'x' || e.key === 'X') {
        // Toggle completed on focused topic node
        if (focusedNodeId) {
          const focusedNode = layout.nodes.find((n) => n.id === focusedNodeId)
          if (focusedNode?.topicId) {
            toggleTopic(focusedNode.topicId)
            e.preventDefault()
          }
        }
      } else if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        // Spatial navigation
        e.preventDefault()
        const nodes = layout.nodes
        if (!nodes.length) return

        let current = nodes.find((n) => n.id === focusedNodeId)
        if (!current) {
          // Focus first node
          setFocusedNodeId(nodes[0].id)
          return
        }

        const cx = current.x + current.width / 2
        const cy = current.y + current.height / 2

        let bestNode = null
        let bestDist = Infinity

        nodes.forEach((n) => {
          if (n.id === current.id) return
          const nx = n.x + n.width / 2
          const ny = n.y + n.height / 2
          const dx = nx - cx
          const dy = ny - cy

          let inDirection = false
          if (e.key === 'ArrowRight' && dx > 10) inDirection = true
          if (e.key === 'ArrowLeft' && dx < -10) inDirection = true
          if (e.key === 'ArrowDown' && dy > 10) inDirection = true
          if (e.key === 'ArrowUp' && dy < -10) inDirection = true

          if (inDirection) {
            // Distance with penalty for orthogonal deviation
            const dist =
              e.key === 'ArrowRight' || e.key === 'ArrowLeft'
                ? Math.abs(dx) + Math.abs(dy) * 1.5
                : Math.abs(dy) + Math.abs(dx) * 1.5

            if (dist < bestDist) {
              bestDist = dist
              bestNode = n
            }
          }
        })

        if (bestNode) {
          setFocusedNodeId(bestNode.id)
          centerOn(bestNode.x + bestNode.width / 2, bestNode.y + bestNode.height / 2, transform.zoom, true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedNode,
    focusedNodeId,
    layout.nodes,
    layout.bounds,
    zoomIn,
    zoomOut,
    fitToScreen,
    centerOn,
    toggleTopic,
    transform.zoom,
  ])

  return (
    <div
      role="application"
      aria-label={`${field.name} interactive roadmap map view`}
      className="relative w-full space-y-4"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ACCESSIBLE SKIP LINK                                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-2 focus-within:left-2 z-50">
        <button
          type="button"
          onClick={onSwitchToList}
          className="px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-xs font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          Switch to list view
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP OVERVIEW & CONTROLS HEADER BAR                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#11141c] border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        {/* Left: Track Overview Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center flex-shrink-0">
            <Compass className="h-5 w-5" strokeWidth={1.5} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                The Forge: {field.name}
              </h2>
              {percent === 100 && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md font-mono text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3 stroke-[2]" />
                  Forged
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mt-0.5">
              <span>
                {done} of {total} topics forged
              </span>
              <span>·</span>
              <span className="text-[#0A66C2] font-medium">{percent}%</span>
            </div>
          </div>
        </div>

        {/* Right: Route toggle & Mode switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Personalized Route Toggle (if user has taken quiz for this track) */}
          {isPersonalizedForField && (
            <div className="inline-flex rounded-lg border border-black/[0.08] dark:border-white/[0.08] p-0.5 bg-black/[0.02] dark:bg-[#1a1e28] text-xs font-mono">
              <button
                type="button"
                onClick={() => setRouteFilter('myRoute')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  routeFilter === 'myRoute'
                    ? 'bg-white dark:bg-[#11141c] text-[#0A66C2] shadow-xs font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Highlight calibrated path tailored to your assessment"
              >
                <Route className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>My route</span>
              </button>
              <button
                type="button"
                onClick={() => setRouteFilter('all')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                  routeFilter === 'all'
                    ? 'bg-white dark:bg-[#11141c] text-neutral-900 dark:text-white shadow-xs font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                All phases
              </button>
            </div>
          )}

          {/* Focus Mode button */}
          <button
            type="button"
            onClick={handleToggleFocusMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              focusMode
                ? 'border-[#0A66C2]/40 bg-[#0A66C2]/10 text-[#0A66C2] font-medium'
                : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="Focus mode keeps only the current milestone phase expanded (Shortcut: F)"
          >
            <Target className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>{focusMode ? 'Focus active' : 'Full map'}</span>
          </button>

          {/* Switch to List View button */}
          <button
            type="button"
            onClick={onSwitchToList}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] hover:bg-neutral-50 dark:hover:bg-[#202532] text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            title="Switch back to vertical list view"
          >
            <List className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>List view</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE MAP CANVAS CONTAINER                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative">
        <MapCanvas
          containerRef={containerRef}
          contentRef={contentRef}
          panZoomEvents={panZoomEvents}
          nodes={layout.nodes}
          edges={layout.edges}
          bounds={layout.bounds}
          completedSet={completed}
          personalizedMap={personalizedMap}
          selectedNodeId={selectedNode?.id || null}
          hoveredNodeId={hoveredNodeId}
          searchQuery={searchQuery}
          searchMatchedTopicIds={searchMatchedTopicIds}
          isPersonalizedRoute={routeFilter === 'myRoute'}
          onSelectNode={handleSelectNode}
          onToggleExpandPhase={handleToggleExpandPhase}
          onHoverNode={setHoveredNodeId}
        />

        {/* Floating Controls Overlay */}
        <MapControls
          zoom={transform.zoom}
          focusMode={focusMode}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitToScreen={() => fitToScreen(layout.bounds, true)}
          onReset={reset}
          onToggleFocusMode={handleToggleFocusMode}
        />

        {/* Desktop Mini-Map */}
        <MiniMap
          bounds={layout.bounds}
          nodes={layout.nodes}
          edges={layout.edges}
          completedSet={completed}
          transform={transform}
          containerRect={containerRect}
          onNavigate={handleMiniMapNavigate}
        />

        {/* Side Panel / Bottom Sheet */}
        <NodePanel node={selectedNode} onClose={handleClosePanel} />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* KEYBOARD SHORTCUTS HINT FOOTER                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden sm:flex items-center justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-500 px-1 pt-1">
        <div className="flex items-center gap-4">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300">
              Drag
            </kbd>{' '}
            Pan
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300">
              Scroll / Pinch
            </kbd>{' '}
            Zoom
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300">
              Arrows
            </kbd>{' '}
            Navigate nodes
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300">
              X
            </kbd>{' '}
            Toggle done
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300">
              F
            </kbd>{' '}
            Focus mode
          </span>
        </div>

        <span>The Forge · PathForge</span>
      </div>
    </div>
  )
}
