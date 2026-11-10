/**
 * NodePanel.jsx
 *
 * Slide-in side panel (desktop) or bottom sheet (mobile) for inspection and actions.
 * - Shows topic name, detail, parent phase, "Mark as done" toggle, and curated resources.
 * - Optional language toggle ('en' | 'hi') if any resource contains a `lang` field.
 * - Shows phase details & progress stats when a Phase Hub is selected.
 * - Shows paid courses list when the Final "Level Up" node is selected.
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import {
  X,
  Check,
  PlayCircle,
  BookOpen,
  ExternalLink,
  Layers,
  GraduationCap,
  Globe,
} from 'lucide-react'
import { useProgress } from '../../contexts/ProgressContext'
import { getTopicId } from '../../lib/topicId'

export function NodePanel({ node, onClose }) {
  const { completed, toggleTopic } = useProgress()
  const panelRef = useRef(null)
  const [langFilter, setLangFilter] = useState('all') // 'all' | 'en' | 'hi'

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Focus panel on open
  useEffect(() => {
    panelRef.current?.focus()
  }, [node])

  if (!node) return null

  const isTopic = node.type === 'topic'
  const isPhase = node.type === 'phase'
  const isFinal = node.type === 'final'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Side Panel on md+, Bottom Sheet on mobile) */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={
          isTopic
            ? `Topic details: ${node.data?.name}`
            : isPhase
            ? `Phase details: ${node.data?.name}`
            : 'Level up details'
        }
        className="fixed z-50 bottom-0 inset-x-0 md:inset-x-auto md:top-0 md:right-0 md:bottom-0 w-full md:w-[380px] max-h-[85vh] md:max-h-full bg-white dark:bg-[#11141c] border-t md:border-t-0 md:border-l border-black/[0.08] dark:border-white/[0.08] shadow-2xl flex flex-col focus:outline-none animate-in slide-in-from-bottom md:slide-in-from-right duration-200"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            {isTopic && (
              <>
                <span>{node.phase?.label}</span>
                <span>·</span>
                <span>Topic {node.topicIndex + 1}</span>
              </>
            )}
            {isPhase && (
              <>
                <span>Phase {String(node.phaseIndex + 1).padStart(2, '0')}</span>
                <span>·</span>
                <span className="capitalize">{node.data?.level}</span>
              </>
            )}
            {isFinal && (
              <span className="flex items-center gap-1.5 text-[#0A66C2]">
                <GraduationCap className="h-4 w-4" />
                Advanced certifications
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* ─────────────────── TOPIC VIEW ─────────────────── */}
          {isTopic && (
            <TopicContent
              topicNode={node}
              completed={completed}
              toggleTopic={toggleTopic}
              langFilter={langFilter}
              onLangChange={setLangFilter}
            />
          )}

          {/* ─────────────────── PHASE VIEW ─────────────────── */}
          {isPhase && (
            <PhaseContent
              phaseNode={node}
              completed={completed}
              toggleTopic={toggleTopic}
              langFilter={langFilter}
              onLangChange={setLangFilter}
            />
          )}

          {/* ─────────────────── FINAL VIEW ─────────────────── */}
          {isFinal && <FinalContent courses={node.data} />}
        </div>
      </aside>
    </>
  )
}

function TopicContent({ topicNode, completed, toggleTopic, langFilter, onLangChange }) {
  const { data: topic, phase, topicId } = topicNode
  const isDone = completed.has(topicId)
  const resources = useMemo(() => phase?.resources || [], [phase?.resources])

  // Check if any resource has `lang` defined
  const hasLangField = useMemo(
    () => resources.some((r) => r.lang === 'en' || r.lang === 'hi'),
    [resources]
  )

  const filteredResources = useMemo(() => {
    if (!hasLangField || langFilter === 'all') return resources
    return resources.filter((r) => !r.lang || r.lang === langFilter)
  }, [resources, hasLangField, langFilter])

  return (
    <>
      {/* Title & Checkbox */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
          {topic.name}
        </h2>

        {/* Toggle Checkbox */}
        <label className="flex items-center gap-3 p-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-[#1a1e28] cursor-pointer hover:border-[#0A66C2]/40 transition-colors select-none">
          <input
            type="checkbox"
            checked={isDone}
            onChange={() => toggleTopic(topicId)}
            className="sr-only"
            aria-label={`Mark ${topic.name} as complete`}
          />
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              isDone
                ? 'bg-[#0A66C2] border-[#0A66C2] text-white'
                : 'border-black/30 dark:border-white/30 bg-white dark:bg-[#11141c]'
            }`}
          >
            {isDone && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
          </div>
          <span
            className={`text-xs font-medium ${
              isDone ? 'text-[#0A66C2]' : 'text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {isDone ? 'Milestone forged' : 'Mark as done'}
          </span>
        </label>
      </div>

      {/* Description / Details */}
      {topic.detail && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
            Scope & concept
          </span>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {topic.detail}
          </p>
        </div>
      )}

      {/* Recommended Learning Resources */}
      {resources.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Phase resources ({resources.length})
            </span>

            {/* Optional Language Filter Toggle */}
            {hasLangField && (
              <div className="inline-flex rounded-md border border-black/[0.08] dark:border-white/[0.08] p-0.5 text-[10px] font-mono bg-black/[0.02] dark:bg-[#1a1e28]">
                <button
                  type="button"
                  onClick={() => onLangChange('all')}
                  className={`px-1.5 py-0.5 rounded ${
                    langFilter === 'all'
                      ? 'bg-white dark:bg-[#11141c] text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => onLangChange('en')}
                  className={`px-1.5 py-0.5 rounded ${
                    langFilter === 'en'
                      ? 'bg-white dark:bg-[#11141c] text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onLangChange('hi')}
                  className={`px-1.5 py-0.5 rounded ${
                    langFilter === 'hi'
                      ? 'bg-white dark:bg-[#11141c] text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  HI
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {filteredResources.map((res, idx) => {
              const isVideo = res.type === 'yt'
              const ResIcon = isVideo ? PlayCircle : BookOpen

              return (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] hover:border-[#0A66C2]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ResIcon
                      className={`h-4 w-4 flex-shrink-0 ${
                        isVideo ? 'text-neutral-600 dark:text-neutral-400' : 'text-[#0A66C2]'
                      }`}
                      strokeWidth={1.5}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white truncate block">
                        {res.label}
                      </span>
                      {res.lang && (
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">
                          {res.lang === 'hi' ? 'Hindi' : 'English'}
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink
                    className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 flex-shrink-0 ml-2"
                    strokeWidth={1.5}
                  />
                </a>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

function PhaseContent({ phaseNode, completed, toggleTopic, langFilter, onLangChange }) {
  const { data: phase } = phaseNode
  const topics = phase.topics || []
  const resources = useMemo(() => phase.resources || [], [phase.resources])

  let doneCount = 0
  topics.forEach((t) => {
    const tid = getTopicId(phase.id, t.name)
    if (completed.has(tid)) doneCount += 1
  })
  const percent = topics.length > 0 ? Math.round((doneCount / topics.length) * 100) : 0

  const hasLangField = useMemo(
    () => resources.some((r) => r.lang === 'en' || r.lang === 'hi'),
    [resources]
  )

  const filteredResources = useMemo(() => {
    if (!hasLangField || langFilter === 'all') return resources
    return resources.filter((r) => !r.lang || r.lang === langFilter)
  }, [resources, hasLangField, langFilter])

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {phase.name}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {phase.desc}
        </p>

        {/* Phase progress stats */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-1">
            <span>Progress</span>
            <span>
              {doneCount}/{topics.length} topics ({percent}%)
            </span>
          </div>
          <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0A66C2] h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics Checklist */}
      <div className="space-y-2.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
          Phase milestones ({topics.length})
        </span>

        <div className="space-y-1.5">
          {topics.map((t) => {
            const topicId = getTopicId(phase.id, t.name)
            const isDone = completed.has(topicId)

            return (
              <label
                key={topicId}
                className="flex items-start gap-2.5 p-2 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#1a1e28] cursor-pointer hover:border-black/20 dark:hover:border-white/20 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleTopic(topicId)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 transition-colors flex-shrink-0 ${
                    isDone
                      ? 'bg-[#0A66C2] border-[#0A66C2] text-white'
                      : 'border-black/30 dark:border-white/30 bg-white dark:bg-[#11141c]'
                  }`}
                >
                  {isDone && <Check className="h-3 w-3 stroke-[2]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs block ${
                      isDone
                        ? 'line-through text-neutral-400 dark:text-neutral-500'
                        : 'text-neutral-800 dark:text-neutral-200 font-medium'
                    }`}
                  >
                    {t.name}
                  </span>
                  {t.detail && (
                    <span className="text-[11px] text-neutral-500 block truncate mt-0.5">
                      {t.detail}
                    </span>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Resources */}
      {resources.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Phase resources ({resources.length})
            </span>

            {hasLangField && (
              <div className="inline-flex rounded-md border border-black/[0.08] dark:border-white/[0.08] p-0.5 text-[10px] font-mono bg-black/[0.02] dark:bg-[#1a1e28]">
                <button
                  type="button"
                  onClick={() => onLangChange('all')}
                  className={`px-1.5 py-0.5 rounded ${
                    langFilter === 'all' ? 'bg-white dark:bg-[#11141c] text-neutral-900 dark:text-white' : 'text-neutral-500'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => onLangChange('en')}
                  className={`px-1.5 py-0.5 rounded ${
                    langFilter === 'en' ? 'bg-white dark:bg-[#11141c] text-neutral-900 dark:text-white' : 'text-neutral-500'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onLangChange('hi')}
                  className={`px-1.5 py-0.5 rounded ${
                    langFilter === 'hi' ? 'bg-white dark:bg-[#11141c] text-neutral-900 dark:text-white' : 'text-neutral-500'
                  }`}
                >
                  HI
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            {filteredResources.map((res, idx) => {
              const isVideo = res.type === 'yt'
              const ResIcon = isVideo ? PlayCircle : BookOpen

              return (
                <a
                  key={idx}
                  href={res.url}
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
                      {res.label}
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 flex-shrink-0 ml-2" strokeWidth={1.5} />
                </a>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

function FinalContent({ courses }) {
  const courseList = Array.isArray(courses) ? courses : []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Level Up: Advanced Specialization
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
          Industry-recognized certifications and deep-dive specializations to advance beyond foundational mastery.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {courseList.map((c, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1e28] space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0A66C2] block">
                  {c.platform || 'Certification'}
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {c.title}
                </h3>
                {c.instructor && (
                  <p className="text-xs text-neutral-500">Instructor: {c.instructor}</p>
                )}
              </div>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:border-[#0A66C2] text-[#0A66C2] transition-colors"
                  aria-label={`Open ${c.title}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {c.bestFor && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Best for: </span>
                {c.bestFor}
              </p>
            )}

            {c.covers && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {Array.isArray(c.covers) ? (
                  c.covers.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-1.5 py-0.5 rounded-md font-mono text-[10px] bg-black/[0.04] dark:bg-white/[0.04] text-neutral-500"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-neutral-500">{c.covers}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
