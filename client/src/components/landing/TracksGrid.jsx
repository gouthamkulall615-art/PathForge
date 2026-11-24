import { useNavigate } from 'react-router-dom'
import { FIELDS } from '../../data/fields'
import FieldIcon from '../FieldIcon'
import { ArrowRight } from 'lucide-react'

export default function TracksGrid() {
  const navigate = useNavigate()

  const handleTrack = (fieldId) => {
    navigate(`/app?field=${fieldId}`)
  }

  return (
    <section
      id="tracks"
      aria-labelledby="tracks-heading"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto"
    >
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-[var(--forge-accent)] uppercase tracking-widest mb-2 font-semibold">
            Curriculum Catalog
          </p>
          <h2
            id="tracks-heading"
            className="text-2xl sm:text-4xl font-bold text-[var(--forge-ink)] tracking-tight"
          >
            Ten engineering disciplines
          </h2>
          <p className="mt-2 text-sm text-[var(--forge-muted)] max-w-lg leading-relaxed">
            Each track is decomposed into progressive phases with curated, verified free resources.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--forge-accent)] hover:underline shrink-0"
        >
          <span>OPEN IN APP CATALOG</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>

      {/* Dense 2-column list rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FIELDS.map((field) => {
          const phaseCount = field.phases.length
          const topicCount = field.phases.reduce(
            (s, p) => s + (p.topics?.length || 0),
            0
          )
          const firstDuration = field.phases[0]?.duration || ''
          const durationRange = firstDuration ? `${firstDuration} baseline` : ''

          return (
            <button
              key={field.id}
              type="button"
              onClick={() => handleTrack(field.id)}
              className="group text-left p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] hover:border-[#0A66C2]/40 transition-all duration-200 flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
            >
              <div className="p-2 rounded-lg bg-[var(--forge-raised)] group-hover:bg-[#0A66C2]/10 transition-colors shrink-0">
                <FieldIcon
                  fieldId={field.id}
                  className="w-5 h-5 text-[var(--forge-muted)] group-hover:text-[var(--forge-accent)] transition-colors"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-[var(--forge-ink)] group-hover:text-[var(--forge-accent)] transition-colors truncate">
                    {field.name}
                  </h3>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-transparent group-hover:text-[var(--forge-accent)] transition-colors shrink-0"
                    strokeWidth={2}
                  />
                </div>
                <p className="text-xs text-[var(--forge-muted)] line-clamp-2 leading-relaxed mb-2.5">
                  {field.desc}
                </p>
                <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--forge-muted)]">
                  <span>{phaseCount} phases</span>
                  <span className="w-px h-2.5 bg-black/10 dark:bg-white/10" />
                  <span>{topicCount} topics</span>
                  {durationRange && (
                    <>
                      <span className="w-px h-2.5 bg-black/10 dark:bg-white/10" />
                      <span className="truncate">{durationRange}</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
