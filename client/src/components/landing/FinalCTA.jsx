import { useNavigate } from 'react-router-dom'
import Magnet from '../reactbits/Magnet'
import DotGrid from '../reactbits/DotGrid'
import { ArrowRight, GitBranch } from 'lucide-react'

export default function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section
      id="final-cta"
      aria-labelledby="cta-heading"
      className="relative py-28 px-4 sm:px-6 overflow-hidden border-t border-black/[0.08] dark:border-white/[0.08]"
    >
      <DotGrid dotColor="#0A66C2" gap={28} radius={1} opacity={0.06} />

      {/* Blueprint grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 blueprint-grid"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <span className="font-mono text-xs text-[#0A66C2] uppercase tracking-widest font-semibold px-3 py-1 rounded bg-[#0A66C2]/10 border border-[#0A66C2]/20">
          ENGINEER YOUR FUTURE
        </span>
        
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] dark:text-[#eef0f5] tracking-tight leading-tight"
        >
          Stop collecting bookmarks.
          <br />
          <span className="text-[#0A66C2]">Start forging.</span>
        </h2>

        <p className="text-base text-[#4b5565] dark:text-[#a3a9b8] max-w-md leading-relaxed">
          Zero subscriptions. Zero tracking. Pick an engineering track, verify your current skills,
          and track your road to technical mastery today.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Magnet strength={0.25}>
            <button
              onClick={() => navigate('/app')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A66C2] focus-visible:outline-offset-2 shadow-sm"
            >
              Start forging your path
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </Magnet>
          <a
            href="https://github.com/yourusername/pathforge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-sm font-medium text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
          >
            <GitBranch className="w-4 h-4" strokeWidth={1.5} />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
