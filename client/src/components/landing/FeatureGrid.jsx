import SpotlightCard from '../reactbits/SpotlightCard'
import {
  Map,
  Focus,
  Keyboard,
  Globe,
  Share2,
  BookOpen,
} from 'lucide-react'

export default function FeatureGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-24 px-4 sm:px-6 bg-[var(--forge-canvas)] border-y border-black/[0.08] dark:border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <p className="font-mono text-xs text-[var(--forge-accent)] uppercase tracking-widest mb-2 font-semibold">
            System Capabilities
          </p>
          <h2
            id="features-heading"
            className="text-2xl sm:text-4xl font-bold text-[var(--forge-ink)] tracking-tight"
          >
            Built for focused, technical learning
          </h2>
        </div>

        {/* Bento Grid Layout with Uneven Spans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* Card 1: Interactive Canvas Engine with Minimap (wide span) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <SpotlightCard className="h-full p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                    <Map className="w-4 h-4 text-[var(--forge-accent)]" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[10px] text-[var(--forge-muted)] uppercase tracking-wider">
                    CANVAS ENGINE · PAN &amp; ZOOM
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--forge-ink)] mb-1">
                  Infinite canvas with real-time minimap
                </h3>
                <p className="text-xs text-[var(--forge-muted)] leading-relaxed max-w-lg">
                  Navigate large curricula with mouse drag, trackpad pan, or pinch zoom from 0.4x to 1.6x.
                  The corner minimap maintains viewport context at all scales.
                </p>
              </div>

              {/* Minimap UI Fragment */}
              <div className="p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-[var(--forge-raised)] flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--forge-accent)] animate-pulse" />
                  <span className="text-[var(--forge-ink)]">Viewport: X=240, Y=120</span>
                </div>
                <span className="text-[var(--forge-muted)]">Scale: 1.00x</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 2: Keyboard-first Navigation */}
          <div>
            <SpotlightCard className="h-full p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                    <Keyboard className="w-4 h-4 text-[var(--forge-accent)]" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[10px] text-[var(--forge-muted)] uppercase tracking-wider">
                    INPUT
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--forge-ink)] mb-1">
                  Full keyboard control
                </h3>
                <p className="text-xs text-[var(--forge-muted)] leading-relaxed">
                  Operate the map without touching the mouse.
                </p>
              </div>

              {/* Keyboard Legend UI Snippet */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.06] text-[var(--forge-ink)] font-semibold">X</span>
                  <span className="text-[var(--forge-muted)]">Toggle Done</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.06] text-[var(--forge-ink)] font-semibold">F</span>
                  <span className="text-[var(--forge-muted)]">Focus Mode</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.06] text-[var(--forge-ink)] font-semibold">+ / -</span>
                  <span className="text-[var(--forge-muted)]">Zoom Level</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.06] text-[var(--forge-ink)] font-semibold">Arrows</span>
                  <span className="text-[var(--forge-muted)]">Pan Canvas</span>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 3: Focus Mode */}
          <div>
            <SpotlightCard className="h-full p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                    <Focus className="w-4 h-4 text-[var(--forge-accent)]" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[10px] text-[var(--forge-muted)] uppercase tracking-wider">
                    DISTRACTION-FREE
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--forge-ink)] mb-1">
                  Phase focus mode
                </h3>
                <p className="text-xs text-[var(--forge-muted)] leading-relaxed">
                  Dim all surrounding tracks and branches to concentrate exclusively on the current active phase.
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-[var(--forge-raised)] font-mono text-[10px] text-[var(--forge-accent)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--forge-accent)]" />
                <span>Focus: Phase 02 (Async JavaScript)</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 4: Guest Merge & Cloud Sync */}
          <div>
            <SpotlightCard className="h-full p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-[var(--forge-accent)]" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[10px] text-[var(--forge-muted)] uppercase tracking-wider">
                    PERSISTENCE
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--forge-ink)] mb-1">
                  Guest merge on sign-in
                </h3>
                <p className="text-xs text-[var(--forge-muted)] leading-relaxed">
                  Start anonymously with zero friction. Connect Google OAuth whenever you want to sync across devices.
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-[var(--forge-raised)] font-mono text-[10px] text-[var(--forge-muted)] flex items-center justify-between">
                <span>Guest LocalStorage</span>
                <span className="text-[var(--forge-accent)]">→ Merged to Account</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 5: English & Hindi Language Filter */}
          <div>
            <SpotlightCard className="h-full p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-[var(--forge-accent)]" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[10px] text-[var(--forge-muted)] uppercase tracking-wider">
                    LOCALIZATION
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--forge-ink)] mb-1">
                  EN / HI resource filter
                </h3>
                <p className="text-xs text-[var(--forge-muted)] leading-relaxed">
                  Switch or combine official English specifications with trusted Hindi video tutorials from top educators.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="px-2 py-1 rounded bg-[#0A66C2] text-white">English (Docs)</span>
                <span className="px-2 py-1 rounded border border-black/[0.08] dark:border-white/[0.08] text-[var(--forge-muted)]">हिन्दी (Videos)</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 6: Zero Paywalls Integrity (wide span on lg) */}
          <div className="sm:col-span-2 lg:col-span-3">
            <SpotlightCard className="h-full p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-[var(--forge-accent)]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--forge-ink)] mb-1">
                    100% Free &amp; Open Curation
                  </h3>
                  <p className="text-xs text-[var(--forge-muted)] leading-relaxed max-w-xl">
                    Every resource is verified to be freely accessible without credit cards, subscriptions, or paywalls.
                    Maintained openly on GitHub by working practitioners.
                  </p>
                </div>
              </div>

              <div className="shrink-0 font-mono text-xs text-[var(--forge-accent)] px-3 py-1.5 rounded-lg border border-[var(--forge-accent)]/30 bg-[var(--forge-accent)]/10">
                0 Paywalls · 0 Ads · 100% Free
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  )
}
