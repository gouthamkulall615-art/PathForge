import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { ClipboardCheck, Map, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    num: '01',
    icon: ClipboardCheck,
    title: 'Take the skill-check quiz',
    desc: 'Answer 5 deterministic questions per concept area. Easy to hard questions test real comprehension of foundational patterns and tools.',
    badge: '15 Questions',
  },
  {
    num: '02',
    icon: Map,
    title: 'Automated phase evaluation',
    desc: 'Score 4/5 or higher to test out of mastered phases entirely. Lower scores flag phases for review with real calendar milestones.',
    badge: 'Mastered vs. Review',
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Forge your roadmap',
    desc: 'Explore your roadmap as an interactive node tree. Check off topics as you learn, sync progress via Google sign-in, and watch nodes heat up.',
    badge: 'Cold → Heating → Forged',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const pinContainerRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const mm = gsap.matchMedia()

    // Desktop: Pin left and scrub active step index as user scrolls
    mm.add('(min-width: 768px)', () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1400',
        pin: pinContainerRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const stepIndex = Math.min(2, Math.floor(self.progress * 3))
          setActiveStep(stepIndex)
        },
      })
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="how-heading"
      className="bg-[#f5f7fa] dark:bg-[#0b0d14] border-y border-black/[0.08] dark:border-white/[0.08]"
    >
      <div ref={pinContainerRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-20 min-h-[580px] flex flex-col justify-center">
        <div className="mb-12">
          <p className="font-mono text-xs text-[#0A66C2] uppercase tracking-widest mb-2 font-semibold">
            Process &amp; Methodology
          </p>
          <h2
            id="how-heading"
            className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#eef0f5] tracking-tight"
          >
            How PathForge works
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Step List with Active Highlighting */}
          <div className="md:col-span-5 flex flex-col gap-3">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              const isActive = activeStep === idx

              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer p-5 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'border-[#0A66C2] bg-white dark:bg-[#11141c] shadow-sm'
                      : 'border-transparent bg-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-[#0A66C2] text-white' : 'bg-black/[0.05] dark:bg-white/[0.05] text-[#6b7487] dark:text-[#7a8296]'
                      }`}>
                        <Icon className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#0A66C2]">
                        STEP {step.num}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296]">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Right Column: Dynamic Visual that changes per step */}
          <div className="md:col-span-7">
            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-6 sm:p-8 min-h-[360px] flex flex-col justify-center shadow-sm">
              {activeStep === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
                    <span className="font-mono text-[10px] text-[#0A66C2] uppercase tracking-wider font-semibold">
                      ASSESSMENT 01 / JAVASCRIPT
                    </span>
                    <span className="font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296]">
                      QUESTION 3 OF 5
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5] leading-snug">
                    Which browser API mechanism executes microtasks before next rendering cycle?
                  </p>
                  <div className="space-y-2 pt-1 font-mono text-xs">
                    <div className="p-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-[#4b5565] dark:text-[#a3a9b8]">
                      A. setTimeout(..., 0)
                    </div>
                    <div className="p-3 rounded-lg border border-[#0A66C2] bg-[#0A66C2]/[0.08] text-[#0A66C2] font-semibold flex items-center justify-between">
                      <span>B. queueMicrotask() / Promise.resolve()</span>
                      <CheckCircle2 className="w-4 h-4 text-[#0A66C2]" />
                    </div>
                    <div className="p-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-[#4b5565] dark:text-[#a3a9b8]">
                      C. requestAnimationFrame()
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
                    <span className="font-mono text-[10px] text-[#0A66C2] uppercase tracking-wider font-semibold">
                      DIAGNOSTIC REPORT
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      40% TIME SAVED
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5]">Phase 01: HTML &amp; Semantics</div>
                        <div className="text-[11px] text-[#6b7487] dark:text-[#7a8296]">Score: 5/5 · Tested out</div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> MASTERED
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5]">Phase 02: Async JavaScript</div>
                        <div className="text-[11px] text-[#6b7487] dark:text-[#7a8296]">Score: 3/5 · 2 weeks targeted practice</div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> REVIEW
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5]">Phase 03: React &amp; State</div>
                        <div className="text-[11px] text-[#6b7487] dark:text-[#7a8296]">Scheduled · Target: Dec 2026</div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-[#6b7487] dark:text-[#7a8296]">
                        UPCOMING
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
                    <span className="font-mono text-[10px] text-[#0A66C2] uppercase tracking-wider font-semibold">
                      THE FORGE · NODE PROGRESS
                    </span>
                    <span className="font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296]">
                      LIVE HEAT DYNAMICS
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="p-3 rounded-xl border border-[#0A66C2]/40 bg-[#0A66C2]/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0A66C2]" />
                        <span className="text-xs font-semibold text-[#0A66C2]">HTML &amp; Semantic Web (100%)</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#0A66C2] font-semibold">FORGED</span>
                    </div>
                    <div className="p-3 rounded-xl border border-amber-400/50 bg-amber-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Promises &amp; Event Loop (50%)</span>
                      </div>
                      <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400 font-semibold">HEATING</span>
                    </div>
                    <div className="p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between opacity-50">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <span className="text-xs font-semibold text-[#4b5565] dark:text-[#a3a9b8]">React 19 &amp; Architecture (0%)</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296]">COLD</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
