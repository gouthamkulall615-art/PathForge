import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle2, Map as MapIcon, List as ListIcon } from 'lucide-react'
import PhaseCard from './PhaseCard'
import FieldIcon from './FieldIcon'
import RoadmapMap from './map/RoadmapMap'
import { useProgress } from '../contexts/ProgressContext'
import { HighlightText } from '../lib/highlight'
import { loadUiPrefs, saveUiPrefs } from '../lib/progressStorage'

export default function RoadmapView({ field, onBack, searchQuery = '' }) {
  const { getFieldProgress, resetField, setLastVisited } = useProgress()
  const [confirmingReset, setConfirmingReset] = useState(false)

  // Default to Map on screens >=640px, List on <640px
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 'list' : 'map'
    }
    return 'map'
  })

  // Load user's saved UI preference
  useEffect(() => {
    let mounted = true
    loadUiPrefs().then((prefs) => {
      if (mounted && prefs?.viewMode) {
        setViewMode(prefs.viewMode)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  const handleViewChange = useCallback((mode) => {
    setViewMode(mode)
    saveUiPrefs({ viewMode: mode })
  }, [])

  // Track as last visited field
  useEffect(() => {
    if (field?.id) {
      setLastVisited(field.id)
    }
  }, [field?.id, setLastVisited])

  if (!field) return null

  const phaseCount = field.phases?.length || 0
  const resourceCount =
    field.phases?.reduce((sum, p) => sum + (p.resources?.length || 0), 0) || 0

  const { done, total, percent } = getFieldProgress(field)
  const isComplete = total > 0 && done === total

  const handleReset = () => {
    resetField(field.id)
    setConfirmingReset(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button & Title header */}
      <div className="pb-6 border-b border-black/[0.08] dark:border-white/[0.08]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] py-1.5 px-2.5 -ml-2.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          All roadmaps
        </button>

        <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
              <FieldIcon fieldId={field.id} className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] dark:text-[#eef0f5] tracking-tight">
              <HighlightText text={field.name} query={searchQuery} />
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Switcher: Map | List */}
            <div className="inline-flex rounded-lg border border-black/[0.08] dark:border-white/[0.08] p-0.5 bg-black/[0.02] dark:bg-[#1a1e28] text-xs font-mono">
              <button
                type="button"
                onClick={() => handleViewChange('map')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-[#11141c] text-[#0A66C2] shadow-xs font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Interactive Forge map view"
                aria-pressed={viewMode === 'map'}
              >
                <MapIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>Map</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#11141c] text-[#0A66C2] shadow-xs font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Vertical accordion list view"
                aria-pressed={viewMode === 'list'}
              >
                <ListIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>List</span>
              </button>
            </div>

            {/* Reset progress button with confirmation step */}
            {done > 0 && (
              <div>
                {confirmingReset ? (
                  <div className="flex items-center gap-2 p-1 bg-black/[0.04] dark:bg-[#1a1e28] rounded-lg border border-black/[0.08] dark:border-white/[0.08]">
                    <span className="text-[11px] text-[#4b5565] dark:text-[#a3a9b8] px-2 font-mono">
                      Reset progress?
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-[11px] font-medium px-2 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmingReset(false)}
                      className="text-[11px] px-2 py-1 rounded-md text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingReset(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#6b7487] dark:text-[#7a8296] hover:text-red-600 dark:hover:text-red-400 py-1.5 px-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/30 transition-colors"
                    title="Reset completed milestones for this track"
                  >
                    <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed max-w-2xl mb-4">
          <HighlightText text={field.desc} query={searchQuery} />
        </p>

        {/* Quiet Meta Stats */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
          <span>
            {phaseCount} {phaseCount === 1 ? 'phase' : 'phases'}
          </span>
          <span className="text-black/20 dark:text-white/20">·</span>
          <span>{total} total topics</span>
          <span className="text-black/20 dark:text-white/20">·</span>
          <span>{resourceCount} curated links</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VIEW SWITCH: MAP VIEW vs LIST VIEW                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'map' ? (
        <RoadmapMap
          field={field}
          searchQuery={searchQuery}
          onSwitchToList={() => handleViewChange('list')}
        />
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overall Progress Summary Bar */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#11141c] border border-black/[0.08] dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#111827] dark:text-[#eef0f5]">
                  Overall roadmap progress
                </span>
                {isComplete && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 stroke-[2]" />
                    100% Completed
                  </span>
                )}
              </div>
              <div className="text-xs font-mono tabular-nums text-[#6b7487] dark:text-[#7a8296]">
                <span className="font-medium text-[#111827] dark:text-[#eef0f5]">
                  {done}
                </span>
                /{total} topics ({percent}%)
              </div>
            </div>

            {/* Progress Bar with smooth transition */}
            <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-[width] duration-300 ease-out motion-reduce:transition-none ${
                  isComplete ? 'bg-emerald-500' : 'bg-[#0A66C2]'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Phase Timeline */}
          <div className="relative">
            <div className="space-y-3">
              {field.phases?.map((phase, index) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  index={index}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </div>

          {/* Quiet End Note */}
          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#11141c] border border-black/[0.08] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] mb-1">
                Self-paced progression
              </h3>
              <p className="text-xs text-[#6b7487] dark:text-[#7a8296] leading-relaxed">
                Begin with Phase 01. Complete milestones sequentially before advancing to subsequent phases.
              </p>
            </div>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-lg text-[#111827] dark:text-[#eef0f5] bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.06] transition-colors flex-shrink-0"
            >
              Explore other tracks
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
