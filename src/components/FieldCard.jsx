import { ArrowRight } from 'lucide-react'
import FieldIcon from './FieldIcon'

export default function FieldCard({ field, onClick }) {
  const phaseCount = field.phases?.length || 0
  const topicCount = field.phases?.reduce((sum, p) => sum + (p.topics?.length || 0), 0) || 0

  return (
    <button
      onClick={() => onClick?.(field)}
      className="group w-full text-left bg-white dark:bg-[#12151e] rounded-xl border border-black/[0.08] dark:border-white/[0.08] p-5 hover:border-black/20 dark:hover:border-white/20 transition-colors duration-150 flex flex-col justify-between"
    >
      <div>
        {/* Top: Icon + phase meta */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
            <FieldIcon fieldId={field.id} className="h-4.5 w-4.5" />
          </div>
          <span className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
            {phaseCount} {phaseCount === 1 ? 'phase' : 'phases'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-medium text-[#111827] dark:text-[#eef0f5] mb-1.5">
          {field.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed line-clamp-2 mb-4">
          {field.desc}
        </p>
      </div>

      {/* Footer link row */}
      <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs">
        <span className="font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
          {topicCount} topics
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-[#0A66C2]">
          View roadmap
          <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
        </span>
      </div>
    </button>
  )
}
