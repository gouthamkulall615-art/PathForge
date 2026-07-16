import { ArrowRight } from 'lucide-react'

const PHASE_COUNT_LABEL = (count) => `${count} phase${count !== 1 ? 's' : ''}`

export default function FieldCard({ field, onClick }) {
  const phaseCount = field.phases?.length || 0

  return (
    <button
      onClick={() => onClick?.(field)}
      className="group w-full text-left bg-white dark:bg-gray-900 rounded-xl
        border border-gray-200 dark:border-gray-800
        overflow-hidden transition-all duration-200
        hover:shadow-md hover:border-[#0A66C2]/40 dark:hover:border-[#0A66C2]/40
        hover:-translate-y-0.5"
    >
      <div className="p-5 sm:p-6">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between mb-4">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg
            bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 text-xl">
            {field.icon}
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full
            text-[10px] font-semibold uppercase tracking-wider
            bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {PHASE_COUNT_LABEL(phaseCount)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {field.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          {field.desc}
        </p>

        {/* CTA row */}
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0A66C2]">
          View Roadmap
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  )
}
