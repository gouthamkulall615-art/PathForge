import CountUp from '../reactbits/CountUp'
import { FIELDS } from '../../data/fields'

const totalPhases = FIELDS.reduce((s, f) => s + f.phases.length, 0)
const totalTopics = FIELDS.reduce(
  (s, f) => s + f.phases.reduce((ps, p) => ps + (p.topics?.length || 0), 0),
  0
)
const totalResources = FIELDS.reduce(
  (s, f) => s + f.phases.reduce((ps, p) => ps + (p.resources?.length || 0), 0),
  0
)

const STATS = [
  { end: FIELDS.length, suffix: '', label: 'Engineering tracks' },
  { end: totalPhases, suffix: '', label: 'Structured phases' },
  { end: totalTopics, suffix: '+', label: 'Curated topics' },
  { end: totalResources, suffix: '+', label: 'Free resources' },
]

export default function StatsStrip() {
  return (
    <section
      aria-label="Platform statistics"
      className="border-y border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-black/[0.08] dark:divide-white/[0.08]">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 text-center md:px-8">
            <span className="text-3xl font-bold text-[var(--forge-ink)] font-mono tabular-nums">
              <CountUp end={s.end} suffix={s.suffix} duration={1600} />
            </span>
            <span className="text-xs text-[var(--forge-muted)] tracking-wide">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
