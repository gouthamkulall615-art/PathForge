/**
 * FinalNode.jsx
 *
 * Terminal node in "The Forge" map layout.
 * Rendered at the end of the trunk when field.paidCourses is provided.
 * Opens the courses side panel on click.
 */

import { memo } from 'react'
import { GraduationCap, ArrowRight } from 'lucide-react'

function FinalNodeComponent({ node, isSelected, isDimmed, onSelect }) {
  const { data: courses, width, height } = node
  const courseCount = Array.isArray(courses) ? courses.length : 0

  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(node)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      aria-label={`Level up: ${courseCount} advanced and paid courses`}
      className={`absolute z-10 text-left rounded-xl p-3.5 bg-white dark:bg-[#11141c] border border-black/[0.08] dark:border-white/[0.08] transition-all duration-150 cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
        isSelected ? 'ring-2 ring-[#0A66C2] border-[#0A66C2]' : ''
      } ${isDimmed ? 'opacity-35 scale-[0.98]' : 'opacity-100'}`}
    >
      <div className="flex items-center gap-3 h-full">
        <div className="w-10 h-10 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center flex-shrink-0">
          <GraduationCap className="h-5 w-5" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              Next level
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-[#0A66C2] transition-colors">
            Advanced Certifications
          </h3>
          <p className="text-[11px] font-mono text-neutral-500">
            {courseCount} curated courses
          </p>
        </div>

        <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-[#0A66C2] transition-colors flex-shrink-0" />
      </div>
    </button>
  )
}

export const FinalNode = memo(FinalNodeComponent)

