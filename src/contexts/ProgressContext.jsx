import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { loadProgress, saveProgress } from '../lib/progressStorage'
import { getTopicId } from '../lib/topicId'
import { FIELDS } from '../data/fields'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState(() => new Set())
  const [lastVisitedFieldId, setLastVisitedFieldId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from storage on mount
  useEffect(() => {
    let mounted = true
    loadProgress().then((data) => {
      if (mounted) {
        setCompleted(new Set(data.completedTopicIds || []))
        setLastVisitedFieldId(data.lastVisitedFieldId || null)
        setIsLoaded(true)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  // Helper to persist current state
  const persist = useCallback((newCompletedSet, newLastVisited) => {
    saveProgress({
      completedTopicIds: Array.from(newCompletedSet),
      lastVisitedFieldId: newLastVisited,
    })
  }, [])

  // Toggle a single topic by ID
  const toggleTopic = useCallback(
    (topicId) => {
      if (!topicId) return
      setCompleted((prev) => {
        const next = new Set(prev)
        if (next.has(topicId)) {
          next.delete(topicId)
        } else {
          next.add(topicId)
        }
        persist(next, lastVisitedFieldId)
        return next
      })
    },
    [lastVisitedFieldId, persist]
  )

  // Set the most recently viewed or progressed field
  const setLastVisited = useCallback(
    (fieldId) => {
      if (!fieldId) return
      setLastVisitedFieldId((prev) => {
        if (prev === fieldId) return prev
        persist(completed, fieldId)
        return fieldId
      })
    },
    [completed, persist]
  )

  // Calculate progress for a specific phase
  const getPhaseProgress = useCallback(
    (phase) => {
      if (!phase || !Array.isArray(phase.topics)) {
        return { done: 0, total: 0, percent: 0 }
      }
      const total = phase.topics.length
      if (total === 0) {
        return { done: 0, total: 0, percent: 0 }
      }
      let done = 0
      for (const topic of phase.topics) {
        const id = getTopicId(phase.id, topic.name)
        if (completed.has(id)) {
          done += 1
        }
      }
      const percent = Math.round((done / total) * 100)
      return { done, total, percent }
    },
    [completed]
  )

  // Calculate progress for an entire field
  const getFieldProgress = useCallback(
    (field) => {
      if (!field || !Array.isArray(field.phases)) {
        return { done: 0, total: 0, percent: 0 }
      }
      let total = 0
      let done = 0
      for (const phase of field.phases) {
        const res = getPhaseProgress(phase)
        total += res.total
        done += res.done
      }
      const percent = total > 0 ? Math.round((done / total) * 100) : 0
      return { done, total, percent }
    },
    [getPhaseProgress]
  )

  // Reset progress for a single field
  const resetField = useCallback(
    (fieldId) => {
      const field = FIELDS.find((f) => f.id === fieldId)
      if (!field || !Array.isArray(field.phases)) return

      // Collect all topic IDs belonging to this field
      const fieldTopicIds = new Set()
      for (const phase of field.phases) {
        for (const topic of phase.topics || []) {
          fieldTopicIds.add(getTopicId(phase.id, topic.name))
        }
      }

      setCompleted((prev) => {
        const next = new Set(prev)
        for (const id of fieldTopicIds) {
          next.delete(id)
        }
        persist(next, lastVisitedFieldId)
        return next
      })
    },
    [lastVisitedFieldId, persist]
  )

  // Reset all progress across all fields
  const resetAll = useCallback(() => {
    const next = new Set()
    setCompleted(next)
    persist(next, null)
    setLastVisitedFieldId(null)
  }, [persist])

  const value = useMemo(
    () => ({
      completed,
      isLoaded,
      lastVisitedFieldId,
      toggleTopic,
      getPhaseProgress,
      getFieldProgress,
      resetField,
      resetAll,
      setLastVisited,
    }),
    [
      completed,
      isLoaded,
      lastVisitedFieldId,
      toggleTopic,
      getPhaseProgress,
      getFieldProgress,
      resetField,
      resetAll,
      setLastVisited,
    ]
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

