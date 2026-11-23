import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STATES = [
  {
    id: 'cold',
    label: 'Cold',
    mono: '00',
    desc: 'Unstarted. Clean hairline border, unlit background, and minimal contrast. Represents pending curriculum.',
    indicator: 'border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c]',
    dot: 'bg-[#6b7487] dark:bg-[#5a6177]',
    textColor: 'text-[#4b5565] dark:text-[#a3a9b8]',
    badge: 'COLD · 0%',
  },
  {
    id: 'heating',
    label: 'Heating',
    mono: '01',
    desc: 'In progress. The node activates a warm amber outline and glowing pulse indicator. Material currently in the forge.',
    indicator: 'border border-amber-400/60 dark:border-amber-400/40 bg-amber-50/70 dark:bg-amber-900/[0.12]',
    dot: 'bg-amber-500',
    textColor: 'text-amber-700 dark:text-amber-400',
    badge: 'HEATING · 50%',
  },
  {
    id: 'forged',
    label: 'Forged',
    mono: '11',
    desc: 'Complete. Solid accent fill with checkmark, firing a spark pulse animation upon completion. Topic permanently locked in.',
    indicator: 'border border-[#0A66C2]/60 bg-[#0A66C2]/[0.08] dark:bg-[#0A66C2]/[0.15]',
    dot: 'bg-[#0A66C2]',
    textColor: 'text-[#0A66C2]',
    badge: 'FORGED · 100%',
  },
]

export default function HeatMetaphor() {
  const sectionRef = useRef(null)
  const scrubberNodeRef = useRef(null)
  const [scrubIndex, setScrubIndex] = useState(1)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // GSAP ScrollTrigger to scrub demo node state as user scrolls past
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(2, Math.floor(self.progress * 3))
        setScrubIndex(idx)
      },
    })
  }, { scope: sectionRef })

  const currentScrub = STATES[scrubIndex]

  return (
    <section
      id="heat-metaphor"
      ref={sectionRef}
      aria-labelledby="heat-heading"
      className="py-20 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-[#0A66C2] uppercase tracking-widest mb-2 font-semibold">
              The Forge Metaphor
            </p>
            <h2
              id="heat-heading"
              className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#eef0f5] tracking-tight"
            >
              Every node has a material heat state
            </h2>
            <p className="mt-2 text-sm text-[#4b5565] dark:text-[#a3a9b8] max-w-lg leading-relaxed">
              Progress is not an abstract progress bar. Topics are treated like raw metal: cold by default,
              heating up under active study, and forged into permanent mastery.
            </p>
          </div>

          {/* Interactive Scrub Demonstration Box */}
          <div className="p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#11141c] shrink-0 min-w-[280px]">
            <span className="font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296] block mb-2 uppercase tracking-wider">
              Scrub Preview · Click to test
            </span>
            <div
              ref={scrubberNodeRef}
              onClick={() => setScrubIndex((i) => (i + 1) % 3)}
              className={`cursor-pointer transition-all duration-300 p-3 rounded-lg flex items-center justify-between gap-3 ${currentScrub.indicator}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${currentScrub.dot}`} />
                <span className={`text-xs font-semibold ${currentScrub.textColor}`}>
                  CSS Grid &amp; Flexbox
                </span>
              </div>
              {scrubIndex === 2 ? (
                <div className="w-5 h-5 rounded-md bg-[#0A66C2] text-white flex items-center justify-center">
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                </div>
              ) : (
                <span className={`font-mono text-[10px] ${currentScrub.textColor}`}>
                  {currentScrub.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3 Column Explainer Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {STATES.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setScrubIndex(idx)}
              className={`cursor-pointer p-5 rounded-xl transition-all duration-200 ${s.indicator} flex flex-col gap-4 ${
                scrubIndex === idx ? 'ring-2 ring-[#0A66C2]' : ''
              }`}
            >
              {/* Mock Node */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-md ${s.indicator}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} aria-hidden="true" />
                  <span className={`text-xs font-medium ${s.textColor}`}>
                    Web Core Principles
                  </span>
                </div>
                {idx === 2 && <Check className="w-3.5 h-3.5 text-[#0A66C2]" strokeWidth={2.5} />}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-[10px] ${s.textColor}`}>{s.mono}</span>
                  <span className={`text-sm font-semibold ${s.textColor}`}>{s.label}</span>
                </div>
                <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
