import { motion } from 'motion/react'
import { Calendar, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react'

const _m = motion

const MILESTONES = [
  {
    phase: '01',
    name: 'Web Foundations & Semantics',
    status: 'mastered',
    duration: 'Skipped',
    score: '5/5 score',
    note: 'Tested out via skill check',
    date: 'Pre-completed',
  },
  {
    phase: '02',
    name: 'Advanced JavaScript & Async Patterns',
    status: 'review',
    duration: '2 weeks',
    score: '3/5 score',
    note: 'Reinforce event loop & closures',
    date: 'Nov 24 – Dec 08',
  },
  {
    phase: '03',
    name: 'React 19 & Component Architecture',
    status: 'learn',
    duration: '4 weeks',
    score: 'Core phase',
    note: 'Hooks, state primitives & render cycles',
    date: 'Dec 09 – Jan 06',
  },
  {
    phase: '04',
    name: 'Backend APIs & Database Design',
    status: 'upcoming',
    duration: '5 weeks',
    score: 'Scheduled',
    note: 'REST, PostgreSQL & connection pooling',
    date: 'Jan 07 – Feb 11',
  },
]

export default function PersonalizedPathPreview() {
  return (
    <section
      id="personalized-path"
      aria-labelledby="preview-heading"
      className="py-20 px-4 sm:px-6 max-w-5xl mx-auto"
    >
      <div className="mb-12 text-center">
        <p className="font-mono text-xs text-[#0A66C2] uppercase tracking-widest mb-2">
          Deterministic personalization
        </p>
        <h2
          id="preview-heading"
          className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#eef0f5] tracking-tight"
        >
          A roadmap built around what you already know
        </h2>
        <p className="mt-2 text-sm text-[#4b5565] dark:text-[#a3a9b8] max-w-xl mx-auto leading-relaxed">
          The onboarding quiz tests you out of phases you have already mastered, flags gaps for
          targeted review, and calculates realistic completion milestones based on your available weekly hours.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] shadow-sm overflow-hidden"
      >
        {/* Mock Top Banner */}
        <div className="px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.08] bg-[#f5f7fa]/60 dark:bg-[#1a1e28]/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0A66C2] animate-pulse" aria-hidden="true" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5]">
                  Full Stack Engineer Track
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-[#6b7487] dark:text-[#7a8296]">
                  10 hrs / week
                </span>
              </div>
              <p className="text-[11px] text-[#6b7487] dark:text-[#7a8296]">
                Generated via 15-question concept assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296] block uppercase tracking-wider">
                Target Completion
              </span>
              <span className="font-mono text-xs font-semibold text-[#0A66C2] tabular-nums">
                FEB 11, 2027
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="p-6 divide-y divide-black/[0.06] dark:divide-white/[0.06]">
          {MILESTONES.map((m, idx) => (
            <motion.div
              key={m.phase}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start sm:items-center gap-4">
                <span className="font-mono text-xs text-[#6b7487] dark:text-[#7a8296] w-6 shrink-0 pt-0.5 sm:pt-0">
                  {m.phase}
                </span>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5]">
                      {m.name}
                    </h3>

                    {/* Status Chip */}
                    {m.status === 'mastered' && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                        mastered
                      </span>
                    )}
                    {m.status === 'review' && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        <AlertCircle className="w-3 h-3" strokeWidth={2} />
                        review
                      </span>
                    )}
                    {m.status === 'learn' && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-[#0A66C2]/30 bg-[#0A66C2]/10 text-[#0A66C2] dark:text-[#388bfd]">
                        <Clock className="w-3 h-3" strokeWidth={2} />
                        in progress
                      </span>
                    )}
                    {m.status === 'upcoming' && (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-black/[0.08] dark:border-white/[0.08] text-[#6b7487] dark:text-[#7a8296]">
                        scheduled
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#6b7487] dark:text-[#7a8296]">
                    {m.note}
                  </p>
                </div>
              </div>

              {/* Right Side Date & Duration */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pl-10 sm:pl-0">
                <span className="font-mono text-xs text-[#4b5565] dark:text-[#a3a9b8] tabular-nums">
                  {m.duration}
                </span>
                <span className="font-mono text-xs text-[#6b7487] dark:text-[#7a8296] tabular-nums flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 opacity-60" strokeWidth={1.5} />
                  {m.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
