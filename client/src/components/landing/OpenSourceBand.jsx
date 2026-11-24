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
      className="py-20 px-4 sm:px-6 border-y border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-canvas)]"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-12">
        {/* Copy */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="font-mono text-xs text-[var(--forge-accent)] uppercase tracking-widest font-semibold">
              Open Source &amp; Built in the Open
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h2
            id="oss-heading"
            className="text-xl sm:text-3xl font-bold text-[var(--forge-ink)] tracking-tight mb-2"
          >
            Built for developers, by developers.
          </h2>
          <p className="text-sm text-[var(--forge-muted)] leading-relaxed mb-4 max-w-lg">
            PathForge is completely free under the MIT license. All tracks, curriculum phases, and algorithmic
            node layouts live in public code. Contributions to curricula, resources, and translations are always welcome.
          </p>

          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {TECH.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] px-2 py-1 rounded border border-black/[0.08] dark:border-white/[0.08] text-[var(--forge-muted)] bg-[var(--forge-raised)]"
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
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/[0.02] dark:hover:bg-[#0A66C2]/[0.05] transition-all group shadow-sm"
            aria-label="View PathForge source on GitHub (opens in new tab)"
          >
            <GitBranch className="w-5 h-5 text-[var(--forge-accent)]" strokeWidth={1.75} />
            <div className="text-left">
              <div className="text-sm font-semibold text-[var(--forge-ink)]">Star on GitHub</div>
              <div className="text-xs text-[var(--forge-muted)] font-mono">pathforge / core</div>
            </div>
            <ExternalLink
              className="w-3.5 h-3.5 text-[var(--forge-muted)] group-hover:text-[var(--forge-accent)] transition-colors ml-2"
              strokeWidth={1.75}
            />
          </a>

          <div className="text-center font-mono text-[10px] text-[var(--forge-muted)] flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-[var(--forge-accent)]" fill="currentColor" />
            <span>Contributions welcome via Pull Request</span>
          </div>
        </div>
      </div>
    </section>
  )
}
