import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { gsap } from '../../lib/gsapSetup'
import { parseDuration } from '../../lib/parseDuration'
import { FIELDS } from '../../data/fields'
import { CheckCircle2, Circle, Clock, Calendar } from 'lucide-react'

const _m = motion

const HOURS_OPTIONS = [5, 10, 20]

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export default function Calibrator() {
  const track = useMemo(
    () => FIELDS.find((f) => f.id === 'fullstack') || FIELDS[0],
    []
  )
  const phases = useMemo(() => track.phases.slice(0, 4), [track])

  // Known phases state: default phase 1 mastered to demonstrate the concept
  const [knownPhases, setKnownPhases] = useState(() => new Set([phases[0]?.id]))
  const [hoursPerWeek, setHoursPerWeek] = useState(10)

  // Toggle phase mastery
  const togglePhase = (phaseId) => {
    setKnownPhases((prev) => {
      const next = new Set(prev)
      if (next.has(phaseId)) next.delete(phaseId)
      else next.add(phaseId)
      return next
    })
  }

  // Calculate total hours and projected finish date using real durations
  const { totalHours, totalWeeks } = useMemo(() => {
    let hours = 0
    let weeks = 0
    phases.forEach((p) => {
      const isMastered = knownPhases.has(p.id)
      if (!isMastered) {
        const { baseHours } = parseDuration(p.duration)
        hours += baseHours
        weeks += Math.max(1, Math.ceil(baseHours / hoursPerWeek))
      }
    })
    return { totalHours: hours, totalWeeks: weeks }
  }, [phases, knownPhases, hoursPerWeek])

  const finishDateStr = useMemo(() => {
    const target = addDays(new Date(), totalWeeks * 7)
    return target.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }, [totalWeeks])

  // GSAP animated hours counter directly writing to DOM ref (no per-frame React re-render)
  const hoursRef = useRef(null)
  const prevHoursRef = useRef(totalHours)

  useEffect(() => {
    const proxy = { val: prevHoursRef.current }
    const tween = gsap.to(proxy, {
      val: totalHours,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => {
        if (hoursRef.current) {
          hoursRef.current.textContent = `${Math.round(proxy.val)} hrs`
        }
      },
    })
    prevHoursRef.current = totalHours
    return () => tween.kill()
  }, [totalHours])

  return (
    <section
      id="calibrator"
      aria-labelledby="calibrator-title"
      className="py-24 px-4 sm:px-6 bg-[var(--forge-canvas)] border-t border-black/[0.08] dark:border-white/[0.08]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-[var(--forge-accent)] uppercase tracking-widest mb-2 font-semibold">
              Interactive Calibrator
            </p>
            <h2
              id="calibrator-title"
              className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--forge-ink)]"
            >
              Test out what you know. Recalibrate in real time.
            </h2>
            <p className="mt-3 text-sm text-[var(--forge-muted)] max-w-xl leading-relaxed">
              Toggle phases you have already mastered. The finish date and total study commitment
              recompute dynamically using PathForge&apos;s deterministic scheduling engine.
            </p>
          </div>

          {/* Weekly Hours Segmented Control */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="font-mono text-[10px] text-[var(--forge-muted)] uppercase tracking-wider">
              Study Pace Commitment
            </span>
            <div className="flex p-1 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] relative">
              {HOURS_OPTIONS.map((h) => {
                const active = hoursPerWeek === h
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHoursPerWeek(h)}
                    className={`relative px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors z-10 ${
                      active ? 'text-white' : 'text-[var(--forge-muted)] hover:text-[var(--forge-ink)]'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="calibrator-hours"
                        className="absolute inset-0 bg-[#0A66C2] rounded-lg -z-10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {h} hrs/wk
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Calibrator Card */}
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] shadow-sm overflow-hidden">
          {/* Header Strip with Metrics */}
          <div className="px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-raised)]/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[var(--forge-ink)] uppercase tracking-wider">
                {track.name} Track
              </span>
              <span className="w-px h-3.5 bg-black/10 dark:bg-white/10" />
              <span className="font-mono text-xs text-[var(--forge-muted)]">
                {knownPhases.size} of {phases.length} phases mastered
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="font-mono text-[10px] text-[var(--forge-muted)] uppercase tracking-wider block">
                  Remaining Study
                </span>
                <span
                  ref={hoursRef}
                  className="font-mono text-xs sm:text-sm font-semibold text-[var(--forge-accent)] tabular-nums"
                >
                  {totalHours} hrs
                </span>
              </div>
              <div className="text-right border-l border-black/10 dark:border-white/10 pl-6">
                <span className="font-mono text-[10px] text-[var(--forge-muted)] uppercase tracking-wider block">
                  Projected Finish
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-[var(--forge-ink)] tabular-nums flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                  {finishDateStr}
                </span>
              </div>
            </div>
          </div>

          {/* Phases List with Interactive "I already know this" Toggles */}
          <div className="p-6 divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {phases.map((phase, idx) => {
              const isMastered = knownPhases.has(phase.id)

              return (
                <div
                  key={phase.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-[var(--forge-muted)] w-6 shrink-0 pt-1">
                      0{idx + 1}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[var(--forge-ink)]">
                          {phase.name}
                        </h3>

                        {isMastered ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-[#0A66C2] text-white font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            mastered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--forge-accent)] text-[var(--forge-accent)] font-medium">
                            <Clock className="w-3 h-3" />
                            scheduled · {phase.duration}
                          </span>
                        )}
                      </div>

                      {/* Collapsible topic preview */}
                      <AnimatePresence initial={false}>
                        {!isMastered && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-[var(--forge-muted)] max-w-lg leading-relaxed pt-1">
                              Topics:{' '}
                              {phase.topics
                                .slice(0, 3)
                                .map((t) => (typeof t === 'string' ? t : t.name))
                                .join(' · ')}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div className="flex items-center justify-end pl-10 md:pl-0 shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePhase(phase.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        isMastered
                          ? 'border-[#0A66C2]/40 bg-[#0A66C2]/10 text-[var(--forge-accent)] font-medium'
                          : 'border-black/[0.08] dark:border-white/[0.08] text-[var(--forge-muted)] hover:text-[var(--forge-ink)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      {isMastered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0A66C2]" />
                          <span>Known (tested out)</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-[var(--forge-muted)]" />
                          <span>I already know this</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
