import { ArrowRight, CheckCircle2 } from 'lucide-react'
import FieldIcon from './FieldIcon'
import { useProgress } from '../contexts/ProgressContext'
import { HighlightText } from '../lib/highlight'

export default function FieldCard({ field, onClick, searchQuery = '' }) {
  const { getFieldProgress } = useProgress()
  const { done, total, percent } = getFieldProgress(field)
  const isComplete = total > 0 && done === total

  const phaseCount = field.phases?.length || 0
  const matchingPhases = field._matchMeta?.matchingPhaseLabels || []

  return (
    <button
      onClick={() => onClick?.(field)}
      className="group w-full text-left bg-white dark:bg-[#12151e] rounded-xl border border-black/[0.08] dark:border-white/[0.08] p-5 hover:border-black/25 dark:hover:border-white/25 transition-colors duration-150 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
    >
      <div>
        {/* Top: Icon + phase count & completion badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
            <FieldIcon fieldId={field.id} className="h-4.5 w-4.5" />
          </div>

          <div className="flex items-center gap-1.5">
            {isComplete && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
                Done
              </span>
            )}
            <span className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
              {phaseCount} {phaseCount === 1 ? 'phase' : 'phases'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-medium text-[#111827] dark:text-[#eef0f5] mb-1.5">
          <HighlightText text={field.name} query={searchQuery} />
        </h3>

        {/* Description */}
        <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed line-clamp-2 mb-3.5">
          <HighlightText text={field.desc} query={searchQuery} />
        </p>

        {/* Search match badge if matching within sub-phases */}
        {matchingPhases.length > 0 && searchQuery && (
          <div className="mb-3.5 text-[11px] flex items-center gap-1.5 flex-wrap">
            <span className="text-[#6b7487] dark:text-[#7a8296]">Matches in:</span>
            <span className="font-mono text-[#0A66C2] bg-[#0A66C2]/10 px-1.5 py-0.5 rounded">
              {matchingPhases.slice(0, 3).join(', ')}
              {matchingPhases.length > 3 && ` +${matchingPhases.length - 3}`}
            </span>
          </div>
        )}

        {/* Progress Bar & Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 tabular-nums">
            <span
              className={
                percent > 0
                  ? isComplete
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                    : 'text-[#0A66C2] font-medium'
                  : 'text-[#6b7487] dark:text-[#7a8296]'
              }
            >
              {percent}% complete
            </span>
            <span className="text-[#6b7487] dark:text-[#7a8296]">
              {done}/{total} topics
            </span>
          </div>
          <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-[width] duration-300 ease-out motion-reduce:transition-none ${
                isComplete ? 'bg-emerald-500' : 'bg-[#0A66C2]'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer link row */}
      <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs">
        <span className="font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
          {total} topics
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-[#0A66C2]">
          View roadmap
          <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
        </span>
      </div>
    </button>
  )
}
