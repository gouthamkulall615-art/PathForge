import { useState, useMemo } from 'react'
import {
  Compass,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sliders,
  Check,
  ChevronDown,
  ExternalLink,
  PlayCircle,
  BookOpen,
  Layers,
  Target,
} from 'lucide-react'
import { useProfile } from '../contexts/ProfileContext'
import { useProgress } from '../contexts/ProgressContext'
import { getTopicId } from '../lib/topicId'
import FieldIcon from './FieldIcon'

export default function MyPath({ onRetakeQuiz, onViewStandardRoadmap }) {
  const { profile, roadmap, updatePreferences, isLoading } = useProfile()
  const { completed, toggleTopic } = useProgress()

  // State for quick schedule preference modal/dialog
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)
  const [tempHours, setTempHours] = useState(profile?.answers?.hoursPerWeek || '6-10')
  const [tempTimeframe, setTempTimeframe] = useState(profile?.answers?.targetTimeframe || '6m')

  // Expanded phases map
  const [expandedPhases, setExpandedPhases] = useState(() => {
    const map = {}
    if (roadmap?.phases) {
      roadmap.phases.forEach((p, idx) => {
        // Expand first non-mastered phase or phase 0
        if (p.phaseId === roadmap.startHerePhaseId || idx === 0) {
          map[p.phaseId] = true
        } else if (p.status === 'mastered') {
          map[p.phaseId] = false
        } else {
          map[p.phaseId] = idx < 2
        }
      })
    }
    return map
  })

  const togglePhaseExpanded = (phaseId) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }))
  }

  // Calculate upcoming 4-5 uncompleted topics for "This Week" card
  const upcomingTopics = useMemo(() => {
    if (!roadmap?.phases) return []
    const list = []

    for (const phase of roadmap.phases) {
      if (phase.status === 'mastered') continue

      for (const topic of phase.topics) {
        const topicId = getTopicId(phase.phaseId, topic.name)
        const isDone = completed.has(topicId)
        list.push({
          topicId,
          topic,
          phase,
          isDone,
        })
      }
    }

    // Sort to show uncompleted first, then pick up to 5
    const uncompleted = list.filter((t) => !t.isDone)
    if (uncompleted.length >= 4) {
      return uncompleted.slice(0, 5)
    }

    // If near end, show last few with some completed
    return list.slice(0, 5)
  }, [roadmap, completed])

  // Count total completed topics across roadmap
  const roadmapStats = useMemo(() => {
    if (!roadmap?.phases) return { total: 0, done: 0, percent: 0 }
    let total = 0
    let done = 0

    roadmap.phases.forEach((p) => {
      p.topics.forEach((t) => {
        total += 1
        const topicId = getTopicId(p.phaseId, t.name)
        if (completed.has(topicId)) {
          done += 1
        }
      })
    })

    const percent = total > 0 ? Math.round((done / total) * 100) : 0
    return { total, done, percent }
  }, [roadmap, completed])

  // Handle preference save
  const handleSavePreferences = async (e) => {
    e.preventDefault()
    await updatePreferences({
      hoursPerWeek: tempHours,
      targetTimeframe: tempTimeframe,
    })
    setIsEditingPreferences(false)
  }

  // Format date helper: "Oct 2026" or "October 15, 2026"
  const formatMonthYear = (dateStr) => {
    if (!dateStr) return 'TBD'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const formatShortDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Compass className="h-6 w-6 text-[#0A66C2]" strokeWidth={1.5} />
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="h-12 w-12 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center mx-auto mb-4 border border-[#0A66C2]/20">
          <Compass className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
          No personalized roadmap yet
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8] max-w-md mx-auto leading-relaxed">
          Take the rapid onboarding assessment to evaluate your skills, set weekly hours, and generate your personalized milestones.
        </p>
        <button
          type="button"
          onClick={onRetakeQuiz}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-medium transition-colors"
        >
          <Compass className="h-4 w-4" strokeWidth={1.5} />
          Take assessment
        </button>
      </div>
    )
  }

  const allPhasesMastered = roadmap.phases.every((p) => p.status === 'mastered')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP SUMMARY CARD                                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20">
                <FieldIcon fieldId={roadmap.primaryFieldId} className="h-3.5 w-3.5" />
                {roadmap.primaryFieldName} Track
              </span>
              {roadmap.profileSummary?.motivationBadge && (
                <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 border border-black/[0.08] dark:border-white/[0.08]">
                  {roadmap.profileSummary.motivationBadge}
                </span>
              )}
              {roadmap.secondaryFieldName && (
                <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 border border-black/[0.08] dark:border-white/[0.08]">
                  + {roadmap.secondaryFieldName} Foundations
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Personalized path
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              {roadmap.profileSummary?.motivationTip ||
                'Calibrated to your skill assessment, study capacity, and target timeframe.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTempHours(profile?.answers?.hoursPerWeek || '6-10')
                setTempTimeframe(profile?.answers?.targetTimeframe || '6m')
                setIsEditingPreferences(true)
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] hover:bg-neutral-50 dark:hover:bg-[#202532] text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Sliders className="h-3.5 w-3.5" strokeWidth={1.5} />
              Adjust schedule
            </button>
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] hover:bg-neutral-50 dark:hover:bg-[#202532] text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              Retake quiz
            </button>
            {onViewStandardRoadmap && (
              <button
                type="button"
                onClick={() => onViewStandardRoadmap(roadmap.primaryFieldId)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              >
                Standard curriculum
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
              Projected finish
            </span>
            <div className="text-base sm:text-lg font-mono font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#0A66C2]" strokeWidth={1.5} />
              {formatMonthYear(roadmap.projectedFinishDate)}
            </div>
            <span className="text-xs font-mono text-neutral-500 block">
              {roadmap.totalCalendarWeeks} calendar weeks
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
              Weekly target
            </span>
            <div className="text-base sm:text-lg font-mono font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-neutral-500" strokeWidth={1.5} />
              {roadmap.profileSummary?.hoursPerWeek || 8} hrs/wk
            </div>
            <span className="text-xs font-mono text-neutral-500 block">
              ~{roadmap.totalEstimatedHours} hours total
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
              Progress
            </span>
            <div className="text-base sm:text-lg font-mono font-medium text-neutral-900 dark:text-neutral-100">
              {roadmapStats.percent}%
            </div>
            <div className="w-full bg-neutral-100 dark:bg-white/[0.06] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#0A66C2] h-full rounded-full transition-all duration-300"
                style={{ width: `${roadmapStats.percent}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
              Status
            </span>
            <div>
              {roadmap.fitsTimeframe ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
                  On track
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <AlertTriangle className="h-3 w-3" strokeWidth={1.5} />
                  Pacing alert
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-neutral-500 block">
              {roadmap.fitsTimeframe ? 'Fits target timeframe' : 'Exceeds duration'}
            </span>
          </div>
        </div>

        {/* Warning / Suggestion banner if deadline is tight */}
        {!roadmap.fitsTimeframe && roadmap.warning && (
          <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] dark:bg-amber-500/[0.08] text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="space-y-1.5 text-xs sm:text-sm">
                <p className="font-medium">{roadmap.warning}</p>
                {roadmap.suggestions?.length > 0 && (
                  <ul className="list-disc pl-4 space-y-1 text-xs text-amber-800 dark:text-amber-300">
                    {roadmap.suggestions.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Mastered Banner */}
        {allPhasesMastered && (
          <div className="mt-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" strokeWidth={1.5} />
            <div className="text-xs sm:text-sm">
              <p className="font-medium">Foundations mastered</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                You tested out of the initial phases. Review advanced specialization topics below.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* QUICK PREFERENCES EDIT MODAL                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isEditingPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-6 space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#0A66C2]" strokeWidth={1.5} />
                Adjust schedule preferences
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingPreferences(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xs font-mono"
              >
                esc
              </button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                  Weekly study hours
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '3-5', label: '3–5 hrs/wk' },
                    { id: '6-10', label: '6–10 hrs/wk' },
                    { id: '11-20', label: '11–20 hrs/wk' },
                    { id: '20+', label: '20+ hrs/wk' },
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setTempHours(h.id)}
                      className={`p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                        tempHours === h.id
                          ? 'border-[#0A66C2] bg-[#0A66C2]/10 text-[#0A66C2]'
                          : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.02] dark:hover:bg-[#202532]'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                  Target timeframe
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '3m', label: '3 months' },
                    { id: '6m', label: '6 months' },
                    { id: '12m', label: '12 months' },
                    { id: 'flexible', label: 'Flexible' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTempTimeframe(t.id)}
                      className={`p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                        tempTimeframe === t.id
                          ? 'border-[#0A66C2] bg-[#0A66C2]/10 text-[#0A66C2]'
                          : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.02] dark:hover:bg-[#202532]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsEditingPreferences(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#1a1e28] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-medium transition-colors"
                >
                  Recalculate schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* "THIS WEEK" MILESTONE CARD                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {upcomingTopics.length > 0 && (
        <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-7 w-7 rounded-md bg-[#0A66C2]/10 text-[#0A66C2]">
                <Target className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  This week's focus topics
                </h2>
                <p className="text-[11px] font-mono text-neutral-500">
                  Direct milestones from your current phase
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {upcomingTopics.map(({ topicId, topic, phase, isDone }) => (
              <div
                key={topicId}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  isDone
                    ? 'border-black/[0.04] dark:border-white/[0.04] bg-neutral-50/50 dark:bg-[#1a1e28]/40 opacity-60'
                    : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] hover:border-black/20 dark:hover:border-white/20'
                }`}
              >
                <label className="relative flex items-center justify-center h-4 w-4 mt-0.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleTopic(topicId)}
                    className="sr-only"
                    aria-label={`Mark ${topic.name} as complete`}
                  />
                  <div
                    className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-[#0A66C2] border-[#0A66C2] text-white'
                        : 'border-black/30 dark:border-white/30 bg-white dark:bg-[#11141c] hover:border-[#0A66C2]'
                    }`}
                  >
                    {isDone && <Check className="h-3 w-3 stroke-[2]" />}
                  </div>
                </label>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium truncate ${
                        isDone
                          ? 'line-through text-neutral-400 dark:text-neutral-500'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {topic.name}
                    </span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.04] text-neutral-500 border border-black/[0.06] dark:border-white/[0.06]">
                      {phase.label}
                    </span>
                  </div>
                  {topic.detail && (
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {topic.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VERTICAL TIMELINE OF PERSONALIZED PHASES                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Curriculum timeline
          </h2>
          <span className="text-xs font-mono text-neutral-500">
            {roadmap.phases.length} phases total
          </span>
        </div>

        <div className="relative border-l border-black/[0.08] dark:border-white/[0.08] ml-3.5 sm:ml-4 space-y-6">
          {roadmap.phases.map((phase, index) => {
            const isMastered = phase.status === 'mastered'
            const isReview = phase.status === 'review'
            const isStartHere = phase.phaseId === roadmap.startHerePhaseId
            const isExpanded = expandedPhases[phase.phaseId]

            // Calculate progress for this phase
            let phaseDone = 0
            phase.topics.forEach((t) => {
              const tid = getTopicId(phase.phaseId, t.name)
              if (completed.has(tid)) phaseDone += 1
            })
            const phaseTotal = phase.topics.length
            const phasePercent = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0

            return (
              <div key={phase.phaseId} className="relative pl-6 sm:pl-7">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-[15px] top-4 flex items-center justify-center h-7 w-7 rounded-full border transition-colors ${
                    isMastered
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                      : isStartHere
                      ? 'border-[#0A66C2] bg-[#0A66C2] text-white ring-4 ring-[#0A66C2]/15'
                      : 'border-black/[0.12] dark:border-white/[0.12] bg-white dark:bg-[#11141c] text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {isMastered ? (
                    <Check className="h-3.5 w-3.5 stroke-[2]" />
                  ) : (
                    <span className="text-[11px] font-mono font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Phase Card Content */}
                <div
                  className={`rounded-xl border transition-colors overflow-hidden ${
                    isMastered
                      ? 'border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/50 dark:bg-[#11141c]/60 opacity-80'
                      : isStartHere
                      ? 'border-[#0A66C2]/40 bg-white dark:bg-[#11141c] ring-1 ring-[#0A66C2]/20'
                      : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c]'
                  }`}
                >
                  {/* Phase Card Header */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider">
                            {phase.label}
                          </span>

                          {/* Status Badge */}
                          {isMastered ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <Check className="h-3 w-3 stroke-[2]" />
                              Skipped – Already mastered
                            </span>
                          ) : isReview ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Accelerated review (~{phase.estimatedHours}h)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20">
                              Core milestone (~{phase.estimatedHours}h)
                            </span>
                          )}

                          {isStartHere && !isMastered && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-medium bg-[#0A66C2] text-white uppercase tracking-wider">
                              Start here
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          {phase.name}
                        </h3>
                      </div>

                      {/* Dates and expand button */}
                      <div className="flex items-center gap-3">
                        {phase.startDate && phase.finishDate && (
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300 block">
                              {formatShortDate(phase.startDate)} – {formatShortDate(phase.finishDate)}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-500">
                              {phase.calendarWeeks} {phase.calendarWeeks === 1 ? 'week' : 'weeks'}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => togglePhaseExpanded(phase.phaseId)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#1a1e28] text-neutral-500 transition-colors"
                          aria-label={isExpanded ? 'Collapse phase' : 'Expand phase'}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-150 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {phase.desc}
                    </p>

                    {/* Progress Bar within Phase */}
                    {!isMastered && (
                      <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between gap-4">
                        <div className="flex-1 bg-neutral-100 dark:bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0A66C2] h-full rounded-full transition-all duration-300"
                            style={{ width: `${phasePercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-neutral-500 flex-shrink-0">
                          {phaseDone}/{phaseTotal} topics
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Content: Topics, Stretch Topics, Resources */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 pt-3 border-t border-black/[0.04] dark:border-white/[0.04] space-y-5 bg-neutral-50/40 dark:bg-black/15">
                      {/* Topics Section */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                          Core topics
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {phase.topics.map((t) => {
                            const topicId = getTopicId(phase.phaseId, t.name)
                            const isDone = completed.has(topicId)

                            return (
                              <div
                                key={topicId}
                                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
                                  isDone
                                    ? 'border-black/[0.04] dark:border-white/[0.04] bg-neutral-100/40 dark:bg-[#1a1e28]/40 opacity-60'
                                    : 'border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#1a1e28]'
                                }`}
                              >
                                <label className="relative flex items-center justify-center h-4 w-4 mt-0.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() => toggleTopic(topicId)}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                                      isDone
                                        ? 'bg-[#0A66C2] border-[#0A66C2] text-white'
                                        : 'border-black/30 dark:border-white/30 bg-white dark:bg-[#11141c]'
                                    }`}
                                  >
                                    {isDone && <Check className="h-3 w-3 stroke-[2]" />}
                                  </div>
                                </label>
                                <div className="flex-1">
                                  <span
                                    className={`text-xs font-medium ${
                                      isDone
                                        ? 'line-through text-neutral-400 dark:text-neutral-500'
                                        : 'text-neutral-900 dark:text-neutral-100'
                                    }`}
                                  >
                                    {t.name}
                                  </span>
                                  {t.detail && (
                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                                      {t.detail}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Stretch / Specialization Topics if present */}
                      {phase.stretchTopics && phase.stretchTopics.length > 0 && (
                        <div className="space-y-2.5 p-4 rounded-xl border border-[#0A66C2]/20 bg-[#0A66C2]/[0.03] dark:bg-[#0A66C2]/[0.06]">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A66C2]">
                            <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
                            <span>Advanced specialization</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {phase.stretchTopics.map((st, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-2.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#1a1e28]"
                              >
                                <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100 block">
                                  {st.name}
                                </span>
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed block mt-0.5">
                                  {st.detail}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sorted Resources Section */}
                      {phase.resources && phase.resources.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                            Recommended resources
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {phase.resources.map((r, rIdx) => {
                              const isVideo = r.type === 'yt'
                              const ResIcon = isVideo ? PlayCircle : BookOpen

                              return (
                                <a
                                  key={rIdx}
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center justify-between p-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] hover:border-[#0A66C2]/40 transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <ResIcon
                                      className={`h-4 w-4 flex-shrink-0 ${
                                        isVideo ? 'text-neutral-600 dark:text-neutral-400' : 'text-[#0A66C2]'
                                      }`}
                                      strokeWidth={1.5}
                                    />
                                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white truncate">
                                      {r.label}
                                    </span>
                                  </div>
                                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 flex-shrink-0 ml-2" strokeWidth={1.5} />
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
