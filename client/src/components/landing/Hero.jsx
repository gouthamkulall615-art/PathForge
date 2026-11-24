import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import DotGrid from '../reactbits/DotGrid'
import Magnet from '../reactbits/Magnet'
import SplitText from '../reactbits/SplitText'
import ForgeHeroMap from './ForgeHeroMap'
import { toForgePhases } from '../../lib/forgeLayout'
import { FIELDS } from '../../data/fields'
import { ArrowRight, GitBranch } from 'lucide-react'

export default function Hero() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  // Full Stack track, first 3 phases adapted via toForgePhases
  const fullstackTrack = useMemo(
    () => FIELDS.find((f) => f.id === 'fullstack') || FIELDS[0],
    []
  )
  const forgePhases = useMemo(
    () => toForgePhases(fullstackTrack, 3),
    [fullstackTrack]
  )

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[92svh] flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden bg-[var(--forge-canvas)]"
    >
      {/* Background dot grid with 6% opacity and fade mask */}
      <DotGrid dotColor="#0A66C2" gap={28} radius={1} opacity={0.06} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0A66C2]/[0.05] via-[#0A66C2]/[0.02] to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline, subhead, CTAs */}
        <div className="lg:col-span-5 flex flex-col items-start gap-6 text-left">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)]/80 backdrop-blur-sm">
            <span className="font-mono text-[10px] text-[var(--forge-accent)] tracking-widest uppercase font-semibold">
              OPEN-SOURCE ENGINEERING ROADMAPS
            </span>
            <span className="w-px h-3 bg-black/10 dark:bg-white/10" />
            <span className="font-mono text-[10px] text-[var(--forge-muted)] tracking-wide">
              10 TRACKS · 60+ PHASES
            </span>
          </div>

          {/* H1 with SplitText */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--forge-ink)] leading-[1.1]"
          >
            <SplitText
              text="Forge your engineering path."
              delay={0.1}
              duration={0.65}
              y={20}
            />
          </h1>

          {/* Subhead: deterministic roadmap built from a skill check, not a template */}
          <p className="text-base sm:text-lg text-[var(--forge-muted)] leading-relaxed max-w-md">
            Deterministic, personalized roadmaps generated from an engineering skill check—not a generic template.
            Track every milestone from Cold to Forged with free, verified resources.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Magnet strength={0.25}>
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A66C2] focus-visible:outline-offset-2 shadow-sm"
              >
                Start forging your path
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </Magnet>
            <a
              href="https://github.com/yourusername/pathforge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-sm font-medium text-[var(--forge-muted)] hover:text-[var(--forge-ink)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
            >
              <GitBranch className="w-4 h-4" strokeWidth={1.5} />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Right Column: ForgeHeroMap with engineering drawing annotations */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)]/70 backdrop-blur-md p-4 sm:p-6 shadow-sm">
            {/* Top Drawing Callouts */}
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3 mb-4 font-mono text-[10px] text-[var(--forge-muted)]" aria-hidden="true">
              <span className="text-[var(--forge-accent)] font-semibold uppercase tracking-wider">
                TOPOLOGY · FULL STACK MAP
              </span>
              <span className="tabular-nums">
                EST. DURATION · 18 WEEKS
              </span>
            </div>

            {/* The Hard Animation Core: ForgeHeroMap */}
            <ForgeHeroMap phases={forgePhases} themeKey={theme} />

            {/* Engineering Annotations Callouts */}
            <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] grid grid-cols-3 gap-2 font-mono text-[10px] text-[var(--forge-muted)]" aria-hidden="true">
              <div className="flex flex-col gap-0.5">
                <span className="text-[var(--forge-accent)] font-semibold">PHASE 01</span>
                <span className="truncate">Web Foundations · 4w</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[var(--forge-heat)] font-semibold">PHASE 02</span>
                <span className="truncate">Async JS · 6-8w</span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-[var(--forge-ink)] font-semibold">FINISH DATE</span>
                <span>14 Mar 2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
