import { motion } from 'motion/react'
import SpotlightCard from '../reactbits/SpotlightCard'
import {
  Map,
  Compass,
  CheckSquare,
  SlidersHorizontal,
  Keyboard,
  Globe,
  Share2,
  BookOpen,
} from 'lucide-react'

const _m = motion

const FEATURES = [
  {
    icon: Map,
    tag: 'CANVAS ENGINE',
    title: 'Interactive node-tree map',
    desc: 'Smooth pan, zoom (0.4x to 1.6x), and minimap. Responsive topology transitions from horizontal desktop flow to vertical mobile stack.',
    wide: true,
    snippet: '0.4x – 1.6x zoom · Minimap',
  },
  {
    icon: Compass,
    tag: 'ASSESSMENT',
    title: 'Deterministic personalization',
    desc: 'No black-box AI hallucinations. Evaluates 5 concept questions per area to test out mastered phases with real calendar projections.',
    snippet: '5-question checks · Projected dates',
  },
  {
    icon: Keyboard,
    tag: 'A11Y & INPUT',
    title: 'Keyboard-first navigation',
    desc: 'Operate the entire map without touching the mouse.',
    legend: [
      { key: 'X', label: 'Toggle Done' },
      { key: 'F', label: 'Focus Mode' },
      { key: '+ / -', label: 'Zoom' },
      { key: '← ↑ → ↓', label: 'Pan' },
    ],
  },
  {
    icon: CheckSquare,
    tag: 'PROGRESS',
    title: 'Per-topic progress tracking',
    desc: 'Check off granular milestones. Phase completion rings update automatically with animated sparks upon reaching 100%.',
    snippet: 'Instant localStorage sync',
  },
  {
    icon: Share2,
    tag: 'CLOUD SYNC',
    title: 'Google sign-in & guest merge',
    desc: 'Start as an anonymous guest with full privacy. Sign in with Google anytime to merge guest progress across all your devices.',
    snippet: 'Zero data loss on login',
  },
  {
    icon: Globe,
    tag: 'CURATION',
    title: 'English & Hindi resource filters',
    desc: 'Toggle between verified international docs and high-yield Hindi technical video tutorials curated from trusted practitioners.',
    snippet: 'Docs · Video courses · Free only',
  },
  {
    icon: SlidersHorizontal,
    tag: 'SEARCH',
    title: 'Multi-criteria filter controls',
    desc: 'Filter by difficulty level (Beginner/Intermediate/Advanced), media type, and completion state. URLs sync state automatically.',
    snippet: 'Sharable URL search params',
  },
  {
    icon: BookOpen,
    tag: 'INTEGRITY',
    title: '100% Free resources only',
    desc: 'Every single resource link is strictly verified and free. Zero paywalled courses, zero affiliate traps, zero subscriptions.',
    snippet: 'Open community education',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 px-4 sm:px-6 bg-[#f5f7fa] dark:bg-[#0b0d14] border-y border-black/[0.08] dark:border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <p className="font-mono text-xs text-[#0A66C2] uppercase tracking-widest mb-2 font-semibold">
            Technical Architecture
          </p>
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#eef0f5] tracking-tight"
          >
            Built for focused, self-directed developers
          </h2>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={item}
                className={f.wide ? 'sm:col-span-2 lg:col-span-1' : ''}
              >
                <SpotlightCard className="h-full p-5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c]">
                  <div className="flex flex-col gap-3 h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/[0.08] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-[#0A66C2]" strokeWidth={1.5} />
                        </div>
                        <span className="font-mono text-[9px] text-[#6b7487] dark:text-[#7a8296] uppercase tracking-wider">
                          {f.tag}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5] mb-1">
                        {f.title}
                      </h3>
                      <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
                        {f.desc}
                      </p>
                    </div>

                    {/* Key Legend Snippet for Keyboard Card */}
                    {f.legend ? (
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
                        {f.legend.map((k) => (
                          <div key={k.key} className="flex items-center justify-between text-[10px] font-mono">
                            <span className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.06] text-[#111827] dark:text-[#eef0f5] font-semibold">
                              {k.key}
                            </span>
                            <span className="text-[#6b7487] dark:text-[#7a8296]">{k.label}</span>
                          </div>
                        ))}
                      </div>
                    ) : f.snippet ? (
                      <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] font-mono text-[10px] text-[#0A66C2]">
                        {f.snippet}
                      </div>
                    ) : null}
                  </div>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
