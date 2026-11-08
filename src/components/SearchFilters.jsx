import { useState, useEffect, useRef } from 'react'
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

export default function SearchFilters({
  query,
  onQueryChange,
  difficulty,
  onDifficultyChange,
  resourceType,
  onResourceTypeChange,
  progressStatus,
  onProgressStatusChange,
  sort,
  onSortChange,
  totalCount,
  filteredCount,
  onClearAll,
}) {
  const inputRef = useRef(null)
  const [localQuery, setLocalQuery] = useState(query || '')
  const [prevQuery, setPrevQuery] = useState(query)

  // Adjust state during render when prop changes (React recommended pattern)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setLocalQuery(query || '')
  }

  // Debounce input updates to parent by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== query) {
        onQueryChange(localQuery)
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [localQuery, query, onQueryChange])

  // Keyboard shortcut: press "/" to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName
      const isInputActive =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT' ||
        document.activeElement?.isContentEditable

      if (e.key === '/' && !isInputActive) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Calculate active filter count
  const activeFilterCount =
    (query ? 1 : 0) +
    (difficulty !== 'all' ? 1 : 0) +
    (resourceType !== 'all' ? 1 : 0) +
    (progressStatus !== 'all' ? 1 : 0) +
    (sort !== 'default' ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className="mb-6 space-y-3.5">
      {/* Search Input Bar */}
      <div className="relative">
        <label htmlFor="catalog-search" className="sr-only">
          Search career tracks, topics, or resources
        </label>
        <div className="relative flex items-center">
          <Search
            className="absolute left-3.5 h-4 w-4 text-[#6b7487] dark:text-[#7a8296] pointer-events-none"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="catalog-search"
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search tracks, topics, or tools (e.g., React, Docker, SQL)..."
            className="w-full pl-10 pr-20 py-2.5 text-sm bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-[#111827] dark:text-[#eef0f5] placeholder-[#6b7487] dark:placeholder-[#7a8296] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {localQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('')
                  onQueryChange('')
                  inputRef.current?.focus()
                }}
                className="p-1 text-[#6b7487] dark:text-[#7a8296] hover:text-[#111827] dark:hover:text-[#eef0f5] rounded-md transition-colors"
                aria-label="Clear search text"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            )}

            {/* "/" Keyboard hint badge */}
            <kbd
              className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-mono text-[#6b7487] dark:text-[#7a8296] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] rounded select-none pointer-events-none"
              title="Press / to focus search"
            >
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Filter Row (Responsive with horizontal scrolling on mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#6b7487] dark:text-[#7a8296] mr-1 flex-shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Filters:</span>
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            aria-label="Filter by difficulty level"
            className="text-xs py-1.5 pl-2.5 pr-7 rounded-lg bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] text-[#111827] dark:text-[#eef0f5] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors flex-shrink-0"
          >
            <option value="all">Difficulty: All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Resource Type Filter */}
          <select
            value={resourceType}
            onChange={(e) => onResourceTypeChange(e.target.value)}
            aria-label="Filter by resource type"
            className="text-xs py-1.5 pl-2.5 pr-7 rounded-lg bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] text-[#111827] dark:text-[#eef0f5] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors flex-shrink-0"
          >
            <option value="all">Resources: All</option>
            <option value="yt">Videos (YT)</option>
            <option value="docs">Documentation</option>
          </select>

          {/* Progress Status Filter */}
          <select
            value={progressStatus}
            onChange={(e) => onProgressStatusChange(e.target.value)}
            aria-label="Filter by study progress"
            className="text-xs py-1.5 pl-2.5 pr-7 rounded-lg bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] text-[#111827] dark:text-[#eef0f5] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors flex-shrink-0"
          >
            <option value="all">Status: All</option>
            <option value="not-started">Not started</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort Filter */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <ArrowUpDown className="h-3 w-3 text-[#6b7487] dark:text-[#7a8296] ml-1" strokeWidth={1.5} />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort tracks"
              className="text-xs py-1.5 pl-2.5 pr-7 rounded-lg bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] text-[#111827] dark:text-[#eef0f5] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] transition-colors"
            >
              <option value="default">Sort: Default</option>
              <option value="az">A to Z</option>
              <option value="phases">Most phases</option>
              <option value="progress">Most progress</option>
            </select>
          </div>

          {/* Clear All button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs px-2.5 py-1.5 rounded-lg text-[#0A66C2] hover:bg-[#0A66C2]/10 font-medium transition-colors whitespace-nowrap flex-shrink-0"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Results Counter with aria-live for screen readers */}
        <div
          className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums whitespace-nowrap flex-shrink-0"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing {filteredCount} of {totalCount} tracks
        </div>
      </div>
    </div>
  )
}
