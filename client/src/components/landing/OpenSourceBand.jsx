import { GitBranch, ExternalLink, Heart } from 'lucide-react'

const TECH = [
  'React 19',
  'Vite 8',
  'Tailwind CSS 4',
  'Express',
  'MongoDB',
  'GSAP ScrollTrigger',
  'Motion',
]

export default function OpenSourceBand() {
  return (
    <section
      id="open-source"
      aria-labelledby="oss-heading"
      className="py-16 px-4 sm:px-6 border-y border-black/[0.08] dark:border-white/[0.08]"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-12">
        {/* Copy */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="font-mono text-xs text-[#0A66C2] uppercase tracking-widest font-semibold">
              Open Source &amp; Built in the Open
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h2
            id="oss-heading"
            className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-[#eef0f5] tracking-tight mb-2"
          >
            Built for developers, by developers.
          </h2>
          <p className="text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed mb-4 max-w-lg">
            PathForge is completely free under the MIT license. All tracks, curriculum phases, and algorithmic
            node layouts live in public code. Contributions to curricula, resources, and translations are always welcome.
          </p>

          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {TECH.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] px-2 py-1 rounded border border-black/[0.08] dark:border-white/[0.08] text-[#6b7487] dark:text-[#7a8296] bg-[#f5f7fa] dark:bg-[#1a1e28]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* GitHub Action Card */}
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href="https://github.com/yourusername/pathforge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/[0.02] dark:hover:bg-[#0A66C2]/[0.05] transition-all group shadow-sm"
            aria-label="View PathForge source on GitHub (opens in new tab)"
          >
            <GitBranch className="w-5 h-5 text-[#0A66C2]" strokeWidth={1.75} />
            <div className="text-left">
              <div className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5]">Star on GitHub</div>
              <div className="text-xs text-[#6b7487] dark:text-[#7a8296] font-mono">pathforge / core</div>
            </div>
            <ExternalLink
              className="w-3.5 h-3.5 text-[#9ca3af] dark:text-[#5a6177] group-hover:text-[#0A66C2] transition-colors ml-2"
              strokeWidth={1.75}
            />
          </a>

          <div className="text-center font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296] flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-[#0A66C2]" fill="currentColor" />
            <span>Contributions welcome via Pull Request</span>
          </div>
        </div>
      </div>
    </section>
  )
}
