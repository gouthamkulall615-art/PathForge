/**
 * nodeState.js
 *
 * Resolves node status and heat states for Phase Hubs and Topic Nodes.
 * Follows "The Forge" metaphor:
 * - Cold: not started, muted steel tone
 * - Heating: phase in active progress, warm subtle outline
 * - Forged: completed, filled accent with soft glow
 */

import { getTopicId } from './topicId'

/**
 * Computes phase progress metrics and heat state.
 *
 * @param {Object} phase - Phase definition
 * @param {Set<string>} completedSet - Set of completed topic IDs
 * @param {Object|null} [personalizedPhase] - Personalized phase from ProfileContext
 * @returns {{
 *   done: number,
 *   total: number,
 *   percent: number,
 *   isComplete: boolean,
 *   hasProgress: boolean,
 *   heatState: 'cold'|'heating'|'forged',
 *   status: 'learn'|'review'|'mastered'|null,
 *   isMastered: boolean,
 *   isReview: boolean,
 * }}
 */
export function getPhaseState(phase, completedSet, personalizedPhase = null) {
  const topics = phase?.topics || []
  const total = topics.length
  let done = 0

  topics.forEach((t) => {
    const tid = getTopicId(phase.id, t.name)
    if (completedSet.has(tid)) done += 1
  })

  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const isComplete = total > 0 && done === total
  const hasProgress = done > 0 && done < total

  let heatState = 'cold'
  if (isComplete) {
    heatState = 'forged'
  } else if (done > 0) {
    heatState = 'heating'
  }

  const status = personalizedPhase?.status || null
  const isMastered = status === 'mastered'
  const isReview = status === 'review'

  return {
    done,
    total,
    percent,
    isComplete,
    hasProgress,
    heatState,
    status,
    isMastered,
    isReview,
  }
}

/**
 * Computes individual topic node heat state.
 *
 * @param {string} topicId
 * @param {Object} phase
 * @param {Set<string>} completedSet
 * @param {Object|null} [personalizedPhase]
 * @returns {{
 *   isDone: boolean,
 *   heatState: 'cold'|'heating'|'forged',
 *   phaseProgress: { done: number, total: number, percent: number },
 *   isMastered: boolean,
 * }}
 */
export function getTopicState(topicId, phase, completedSet, personalizedPhase = null) {
  const phaseState = getPhaseState(phase, completedSet, personalizedPhase)
  const isDone = completedSet.has(topicId)

  let heatState = 'cold'
  if (isDone) {
    heatState = 'forged'
  } else if (phaseState.hasProgress || phaseState.isComplete) {
    heatState = 'heating'
  }

  return {
    isDone,
    heatState,
    phaseProgress: {
      done: phaseState.done,
      total: phaseState.total,
      percent: phaseState.percent,
    },
    isMastered: phaseState.isMastered,
  }
}

