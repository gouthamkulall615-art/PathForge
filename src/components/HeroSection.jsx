import { ArrowDown, CheckCircle2, PlayCircle } from 'lucide-react'
import FieldIcon from './FieldIcon'

export default function HeroSection({ onExplore, onLearnMore }) {
  return (
    <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-black/[0.08] dark:border-white/[0.08] mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* Left Column: Heading, purpose, actions */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] text-xs font-mono text-[#4b5565] dark:text-[#a3a9b8] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A66C2]" />
            10 engineering career tracks
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-[#111827] dark:text-[#eef0f5] tracking-tight leading-[1.15] mb-4">
            Structured learning paths for software careers
          </h1>

          <p className="text-base text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed max-w-xl mb-6">
            Sequential phases, verified free resources, and realistic time commitments.
            Built to guide self-directed developers from fundamentals to production readiness.
          </p>

          <div className="flex items-center gap-3 flex-wrap mb-8">
            <button
              onClick={onExplore}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors"
            >
              Browse roadmaps
              <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>

            {onLearnMore && (
              <button
                onClick={onLearnMore}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-[#111827] dark:text-[#eef0f5] bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.06] transition-colors"
              >
                Curation principles
              </button>
            )}
          </div>

          {/* Metric row */}
          <div className="flex items-center gap-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] text-xs font-mono text-[#6b7487] dark:text-[#7a8296]">
            <div>
              <span className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums block">
                10
              </span>
              Tracks
            </div>
            <div className="h-4 w-px bg-black/[0.08] dark:bg-white/[0.08]" />
            <div>
              <span className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums block">
                41
              </span>
              Phases
            </div>
            <div className="h-4 w-px bg-black/[0.08] dark:bg-white/[0.08]" />
            <div>
              <span className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums block">
                160+
              </span>
              Curated links
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Product Preview (Drafted Roadmap Slice) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 shadow-sm">
            {/* Preview header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
                  <FieldIcon fieldId="frontend" className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5]">
                    Frontend Dev
                  </div>
                  <div className="text-[11px] font-mono text-[#6b7487] dark:text-[#7a8296]">
                    Phase 01 · 3–5 weeks
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Beginner
              </span>
            </div>

            {/* Preview Milestone Items */}
            <div className="space-y-2 mb-4">
              <div className="text-xs font-medium text-[#4b5565] dark:text-[#a3a9b8] mb-1.5">
                Core milestones
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.03]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                <div className="text-xs">
                  <span className="font-medium text-[#111827] dark:text-[#eef0f5]">HTML semantics</span>
                  <span className="text-[#6b7487] dark:text-[#7a8296] block text-[11px]">Forms, aria labels, and SEO basics</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.03]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                <div className="text-xs">
                  <span className="font-medium text-[#111827] dark:text-[#eef0f5]">CSS box model & layout</span>
                  <span className="text-[#6b7487] dark:text-[#7a8296] block text-[11px]">Flexbox and Grid systems</span>
                </div>
              </div>
            </div>

            {/* Preview Verified Resource */}
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center justify-between text-[11px] text-[#6b7487] dark:text-[#7a8296]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#4b5565] dark:text-[#a3a9b8]">
                  <PlayCircle className="h-3.5 w-3.5 text-[#0A66C2]" strokeWidth={1.75} />
                  freeCodeCamp · HTML Full Course
                </span>
                <span className="font-mono">Free</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
