/**
 * Pure function to filter and sort fields based on search query and criteria.
 *
 * @param {Array} fields - Array of field objects from fields.js
 * @param {Object} options
 * @param {string} [options.query] - Case-insensitive query string
 * @param {string} [options.difficulty] - 'all' | 'beginner' | 'intermediate' | 'advanced'
 * @param {string} [options.resourceType] - 'all' | 'yt' | 'docs'
 * @param {string} [options.progressStatus] - 'all' | 'not-started' | 'in-progress' | 'completed'
 * @param {string} [options.sort] - 'default' | 'az' | 'phases' | 'progress'
 * @param {Function} [options.getFieldProgress] - (field) => { done, total, percent }
 * @returns {Array} Filtered and sorted fields with attached `_matchMeta`
 */
export function searchAndFilterFields(fields, options = {}) {
  if (!Array.isArray(fields)) return []

  const {
    query = '',
    difficulty = 'all',
    resourceType = 'all',
    progressStatus = 'all',
    sort = 'default',
    getFieldProgress = null,
  } = options

  const trimmedQuery = typeof query === 'string' ? query.trim().toLowerCase() : ''
  const hasQuery = trimmedQuery.length > 0

  const filtered = []

  for (let fieldIdx = 0; fieldIdx < fields.length; fieldIdx++) {
    const field = fields[fieldIdx]
    const phases = Array.isArray(field.phases) ? field.phases : []

    // 1. Difficulty filter (must have at least one phase matching level)
    if (difficulty && difficulty !== 'all') {
      const hasLevel = phases.some(
        (p) => String(p.level || '').toLowerCase() === difficulty.toLowerCase()
      )
      if (!hasLevel) continue
    }

    // 2. Resource type filter (must contain at least one resource of this type)
    if (resourceType && resourceType !== 'all') {
      const hasResType = phases.some((p) =>
        Array.isArray(p.resources) &&
        p.resources.some((r) => String(r.type || '').toLowerCase() === resourceType.toLowerCase())
      )
      if (!hasResType) continue
    }

    // 3. Progress status filter
    if (progressStatus && progressStatus !== 'all' && typeof getFieldProgress === 'function') {
      const { percent } = getFieldProgress(field)
      if (progressStatus === 'not-started' && percent !== 0) continue
      if (progressStatus === 'in-progress' && (percent === 0 || percent === 100)) continue
      if (progressStatus === 'completed' && percent !== 100) continue
    }

    // 4. Search query matching
    const matchMeta = {
      matches: false,
      matchingPhaseLabels: [],
      matchingPhaseIds: new Set(),
      totalMatches: 0,
      originalIndex: fieldIdx,
    }

    if (!hasQuery) {
      matchMeta.matches = true
      filtered.push({ ...field, _matchMeta: matchMeta })
      continue
    }

    // Check field level matches
    let fieldMatched = false
    if (field.name && field.name.toLowerCase().includes(trimmedQuery)) {
      matchMeta.totalMatches += 1
      fieldMatched = true
    }
    if (field.desc && field.desc.toLowerCase().includes(trimmedQuery)) {
      matchMeta.totalMatches += 1
      fieldMatched = true
    }

    // Check phases, topics, resources
    phases.forEach((phase, pIdx) => {
      let phaseMatched = false
      const phaseLabel = phase.label || `Phase ${pIdx + 1}`

      if (phase.name && phase.name.toLowerCase().includes(trimmedQuery)) {
        matchMeta.totalMatches += 1
        phaseMatched = true
      }
      if (phase.desc && phase.desc.toLowerCase().includes(trimmedQuery)) {
        matchMeta.totalMatches += 1
        phaseMatched = true
      }

      // Check topics
      if (Array.isArray(phase.topics)) {
        for (const topic of phase.topics) {
          if (topic.name && topic.name.toLowerCase().includes(trimmedQuery)) {
            matchMeta.totalMatches += 1
            phaseMatched = true
          }
          if (topic.detail && topic.detail.toLowerCase().includes(trimmedQuery)) {
            matchMeta.totalMatches += 1
            phaseMatched = true
          }
        }
      }

      // Check resources
      if (Array.isArray(phase.resources)) {
        for (const res of phase.resources) {
          if (res.label && res.label.toLowerCase().includes(trimmedQuery)) {
            matchMeta.totalMatches += 1
            phaseMatched = true
          }
        }
      }

      if (phaseMatched) {
        if (!matchMeta.matchingPhaseLabels.includes(phaseLabel)) {
          matchMeta.matchingPhaseLabels.push(phaseLabel)
        }
        if (phase.id) {
          matchMeta.matchingPhaseIds.add(phase.id)
        }
      }
    })

    if (fieldMatched || matchMeta.matchingPhaseLabels.length > 0) {
      matchMeta.matches = true
      filtered.push({ ...field, _matchMeta: matchMeta })
    }
  }

  // 5. Sorting
  return filtered.sort((a, b) => {
    if (sort === 'az') {
      return a.name.localeCompare(b.name)
    }
    if (sort === 'phases') {
      const diff = (b.phases?.length || 0) - (a.phases?.length || 0)
      return diff !== 0 ? diff : a._matchMeta.originalIndex - b._matchMeta.originalIndex
    }
    if (sort === 'progress' && typeof getFieldProgress === 'function') {
      const progA = getFieldProgress(a)?.percent || 0
      const progB = getFieldProgress(b)?.percent || 0
      const diff = progB - progA
      return diff !== 0 ? diff : a._matchMeta.originalIndex - b._matchMeta.originalIndex
    }
    // Default sort preserves original catalogue order
    return a._matchMeta.originalIndex - b._matchMeta.originalIndex
  })
}

