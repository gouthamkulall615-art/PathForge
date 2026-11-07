import { ArrowLeft } from 'lucide-react'
import PhaseCard from './PhaseCard'
import FieldIcon from './FieldIcon'

export default function RoadmapView({ field, onBack }) {
  if (!field) return null

  const phaseCount = field.phases?.length || 0
  const topicCount = field.phases?.reduce((sum, p) => sum + (p.topics?.length || 0), 0) || 0
  const resourceCount = field.phases?.reduce((sum, p) => sum + (p.resources?.length || 0), 0) || 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button & Title header */}
      <div className="mb-8 pb-6 border-b border-black/[0.08] dark:border-white/[0.08]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] py-1.5 px-2.5 -ml-2.5 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          All roadmaps
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
            <FieldIcon fieldId={field.id} className="h-5 w-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] dark:text-[#eef0f5] tracking-tight">
            {field.name}
          </h1>
        </div>

        <p className="text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed max-w-2xl mb-4">
          {field.desc}
        </p>

        {/* Quiet Meta Stats */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
          <span>{phaseCount} {phaseCount === 1 ? 'phase' : 'phases'}</span>
          <span className="text-black/20 dark:text-white/20">·</span>
          <span>{topicCount} topics</span>
          <span className="text-black/20 dark:text-white/20">·</span>
          <span>{resourceCount} curated links</span>
        </div>
      </div>

      {/* Phase Timeline with Quiet Blueprint Connector */}
      <div className="relative mb-12">
        <div className="space-y-3">
          {field.phases?.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} />
          ))}
        </div>
      </div>

      {/* Quiet End Note */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] mb-1">
            Self-paced progression
          </h3>
          <p className="text-xs text-[#6b7487] dark:text-[#7a8296] leading-relaxed">
            Begin with Phase 01. Complete milestones sequentially before advancing to subsequent phases.
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-lg text-[#111827] dark:text-[#eef0f5] bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.06] transition-colors flex-shrink-0"
        >
          Explore other tracks
        </button>
      </div>
    </div>
  )
}
