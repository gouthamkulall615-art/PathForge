import { ArrowLeft } from 'lucide-react'
import PhaseCard from './PhaseCard'

export default function RoadmapView({ field, onBack }) {
  if (!field) return null

  return (
    <div>
      {/* Back button + header */}
      <div className="mb-8 sm:mb-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium
            text-gray-600 dark:text-gray-400
            hover:text-gray-900 dark:hover:text-white
            hover:bg-gray-100 dark:hover:bg-gray-800
            rounded-lg transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          All Roadmaps
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg
            bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 text-xl">
            {field.icon}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {field.name}
          </h1>
        </div>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl">
          {field.desc}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border
            bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
            border-gray-200 dark:border-gray-700">
            {field.phases?.length || 0} Phases
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border
            bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
            border-gray-200 dark:border-gray-700">
            {field.phases?.reduce((sum, p) => sum + (p.topics?.length || 0), 0)} Topics
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border
            bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
            border-gray-200 dark:border-gray-700">
            {field.phases?.reduce((sum, p) => sum + (p.resources?.length || 0), 0)} Curated Resources
          </span>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[29px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800
          hidden sm:block" />

        <div className="space-y-4">
          {field.phases?.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 p-6 sm:p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
        rounded-2xl text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Ready to start?
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Begin with Phase 1 and work through each phase at your own pace.
          These roadmaps are designed to build on each other.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold
            text-[#0A66C2] border border-[#0A66C2]/30 rounded-xl
            hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 transition-colors"
        >
          Explore Other Roadmaps
        </button>
      </div>
    </div>
  )
}
