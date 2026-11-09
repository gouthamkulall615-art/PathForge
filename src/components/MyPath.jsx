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
  Sparkles,
  Trophy,
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
        <Compass className="h-8 w-8 animate-spin text-[#0A66C2]" />
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="h-16 w-16 rounded-2xl bg-blue-500/10 text-[#0A66C2] flex items-center justify-center mx-auto mb-4">
          <Compass className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          No Personalized Roadmap Yet
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          Take the rapid onboarding assessment to evaluate your skills, set your weekly hours, and generate a tailored engineering roadmap.
        </p>
        <button
          type="button"
          onClick={onRetakeQuiz}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white text-sm font-semibold transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Take the Assessment
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
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#12151e] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-[#0A66C2]">
                <FieldIcon fieldId={roadmap.primaryFieldId} className="h-3.5 w-3.5" />
                {roadmap.primaryFieldName} Track
              </span>
              {roadmap.profileSummary?.motivationBadge && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {roadmap.profileSummary.motivationBadge}
                </span>
              )}
              {roadmap.secondaryFieldName && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  + {roadmap.secondaryFieldName} Foundations
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              My Personalized Path
            </h1>
            <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              {roadmap.profileSummary?.motivationTip ||
                'Tailored to your current skill level, weekly study capacity, and goal timeframe.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setTempHours(profile?.answers?.hoursPerWeek || '6-10')
                setTempTimeframe(profile?.answers?.targetTimeframe || '6m')
                setIsEditingPreferences(true)
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#151924] hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm"
            >
              <Sliders className="h-3.5 w-3.5" />
              Adjust Schedule
            </button>
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#151924] hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Quiz
            </button>
            {onViewStandardRoadmap && (
              <button
                type="button"
                onClick={() => onViewStandardRoadmap(roadmap.primaryFieldId)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              >
                Standard Curriculum
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Projected Finish
            </span>
            <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#0A66C2]" />
              {formatMonthYear(roadmap.projectedFinishDate)}
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
              {roadmap.totalCalendarWeeks} calendar weeks
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Weekly Target
            </span>
            <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-neutral-500" />
              {roadmap.profileSummary?.hoursPerWeek || 8} hrs/wk
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
              ~{roadmap.totalEstimatedHours} hours total
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Curriculum Progress
            </span>
            <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {roadmapStats.percent}%
            </div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#0A66C2] h-full rounded-full transition-all duration-300"
                style={{ width: `${roadmapStats.percent}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Schedule Status
            </span>
            <div>
              {roadmap.fitsTimeframe ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  On Track
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Pacing Alert
                </span>
              )}
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
              {roadmap.fitsTimeframe ? 'Fits target timeframe' : 'Exceeds target duration'}
            </span>
          </div>
        </div>

        {/* Warning / Suggestion banner if deadline is tight */}
        {!roadmap.fitsTimeframe && roadmap.warning && (
          <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] dark:bg-amber-500/[0.08] text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs sm:text-sm">
                <p className="font-semibold">{roadmap.warning}</p>
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

        {/* All Mastered Celebratory Banner */}
        {allPhasesMastered && (
          <div className="mt-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
            <Trophy className="h-6 w-6 text-emerald-500 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold">Curriculum Foundations Mastered</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                You tested out of the core phases. Explore our advanced specialization and stretch topics below!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* QUICK PREFERENCES EDIT MODAL                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isEditingPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#12151e] p-6 shadow-xl space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#0A66C2]" />
                Adjust Schedule Preferences
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingPreferences(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Weekly Study Hours
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
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        tempHours === h.id
                          ? 'border-[#0A66C2] bg-blue-500/10 text-[#0A66C2]'
                          : 'border-black/[0.08] dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Target Timeframe
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
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        tempTimeframe === t.id
                          ? 'border-[#0A66C2] bg-blue-500/10 text-[#0A66C2]'
                          : 'border-black/[0.08] dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300'
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
                  className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Recalculate Schedule
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
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#12151e] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-500/10 text-[#0A66C2]">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                This Week's Focus Topics
              </h2>
            </div>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Linked to your progress tracker
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {upcomingTopics.map(({ topicId, topic, phase, isDone }) => (
              <div
                key={topicId}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  isDone
                    ? 'border-black/[0.04] dark:border-white/[0.04] bg-neutral-50/50 dark:bg-neutral-900/40 opacity-70'
                    : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#151924] hover:border-black/15 dark:hover:border-white/15'
                }`}
              >
                <label className="relative flex items-center justify-center h-5 w-5 mt-0.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleTopic(topicId)}
                    className="sr-only"
                    aria-label={`Mark ${topic.name} as complete`}
                  />
                  <div
                    className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-[#0A66C2] border-[#0A66C2] text-white'
                        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-[#0A66C2]'
                    }`}
                  >
                    {isDone && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                  </div>
                </label>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isDone
                          ? 'line-through text-neutral-500 dark:text-neutral-400'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {topic.name}
                    </span>
                    <span className="text-[11px] px-2 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
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
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Personalized Curriculum Timeline
          </h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {roadmap.phases.length} Phases Total
          </span>
        </div>

        <div className="relative border-l-2 border-black/[0.08] dark:border-white/[0.08] ml-4 sm:ml-6 space-y-6">
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
              <div key={phase.phaseId} className="relative pl-6 sm:pl-8">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-[17px] top-4 flex items-center justify-center h-8 w-8 rounded-full border-2 transition-all ${
                    isMastered
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                      : isStartHere
                      ? 'border-[#0A66C2] bg-[#0A66C2] text-white ring-4 ring-blue-500/20'
                      : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12151e] text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {isMastered ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Phase Card Content */}
                <div
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isMastered
                      ? 'border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/50 dark:bg-[#10131a] opacity-85'
                      : isStartHere
                      ? 'border-[#0A66C2]/50 bg-white dark:bg-[#12151e] shadow-sm ring-1 ring-[#0A66C2]/30'
                      : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#12151e] shadow-sm'
                  }`}
                >
                  {/* Phase Card Header */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            {phase.label}
                          </span>

                          {/* Status Badge */}
                          {isMastered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <Check className="h-3 w-3 stroke-[2.5]" />
                              Skipped – Already Mastered
                            </span>
                          ) : isReview ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Accelerated Review (~{phase.estimatedHours}h)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-[#0A66C2] border border-blue-500/20">
                              Core Milestone (~{phase.estimatedHours}h)
                            </span>
                          )}

                          {isStartHere && !isMastered && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0A66C2] text-white uppercase tracking-wider">
                              Start Here
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                          {phase.name}
                        </h3>
                      </div>

                      {/* Dates and expand button */}
                      <div className="flex items-center gap-3">
                        {phase.startDate && phase.finishDate && (
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                              {formatShortDate(phase.startDate)} – {formatShortDate(phase.finishDate)}
                            </span>
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                              {phase.calendarWeeks} {phase.calendarWeeks === 1 ? 'week' : 'weeks'}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => togglePhaseExpanded(phase.phaseId)}
                          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                          aria-label={isExpanded ? 'Collapse phase' : 'Expand phase'}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      {phase.desc}
                    </p>

                    {/* Progress Bar within Phase */}
                    {!isMastered && (
                      <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between gap-4">
                        <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0A66C2] h-full rounded-full transition-all duration-300"
                            style={{ width: `${phasePercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                          {phaseDone}/{phaseTotal} topics
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Content: Topics, Stretch Topics, Resources */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-black/[0.04] dark:border-white/[0.04] space-y-6 bg-neutral-50/30 dark:bg-black/10">
                      {/* Topics Section */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          Core Topics
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {phase.topics.map((t) => {
                            const topicId = getTopicId(phase.phaseId, t.name)
                            const isDone = completed.has(topicId)

                            return (
                              <div
                                key={topicId}
                                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                                  isDone
                                    ? 'border-black/[0.04] dark:border-white/[0.04] bg-neutral-100/40 dark:bg-neutral-900/30 opacity-70'
                                    : 'border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#151924]'
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
                                    className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${
                                      isDone
                                        ? 'bg-[#0A66C2] border-[#0A66C2] text-white'
                                        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                                    }`}
                                  >
                                    {isDone && <Check className="h-3 w-3 stroke-[2.5]" />}
                                  </div>
                                </label>
                                <div className="flex-1">
                                  <span
                                    className={`text-xs font-semibold ${
                                      isDone
                                        ? 'line-through text-neutral-500 dark:text-neutral-400'
                                        : 'text-neutral-900 dark:text-neutral-100'
                                    }`}
                                  >
                                    {t.name}
                                  </span>
                                  {t.detail && (
                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
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
                        <div className="space-y-2.5 p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.03] dark:bg-blue-500/[0.06]">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A66C2] uppercase tracking-wider">
                            <Sparkles className="h-3.5 w-3.5" />
                            Advanced Specialization & Stretch Topics
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {phase.stretchTopics.map((st, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-2.5 rounded-lg border border-blue-500/10 bg-white/60 dark:bg-neutral-900/60"
                              >
                                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
                                  {st.name}
                                </span>
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                  {st.detail}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sorted Resources Section */}
                      {phase.resources && phase.resources.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            Recommended Resources
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
                                  className="group flex items-center justify-between p-2.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#151924] hover:border-[#0A66C2]/40 transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <ResIcon
                                      className={`h-4 w-4 flex-shrink-0 ${
                                        isVideo ? 'text-red-500' : 'text-blue-500'
                                      }`}
                                    />
                                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white truncate">
                                      {r.label}
                                    </span>
                                  </div>
                                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 flex-shrink-0 ml-2" />
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
