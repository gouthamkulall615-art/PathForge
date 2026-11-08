/**
 * Generates a stable URL/ID-friendly slug from text.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generates a stable, unique ID for a topic within a phase.
 * Format: `${phase.id}:${slugify(topic.name)}`
 * @param {string} phaseId
 * @param {string} topicName
 * @returns {string}
 */
export function getTopicId(phaseId, topicName) {
  return `${phaseId}:${slugify(topicName)}`
}

