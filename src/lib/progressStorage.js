const STORAGE_KEY = 'pathforge:progress:v1'

const DEFAULT_STATE = {
  completedTopicIds: [],
  lastVisitedFieldId: null,
}

/**
 * Loads progress data from persistent storage.
 * Wrapped in try/catch with schema validation and fallback to empty state.
 * @returns {Promise<{ completedTopicIds: string[], lastVisitedFieldId: string|null }>}
 */
export async function loadProgress() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_STATE }
    }

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { ...DEFAULT_STATE }
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_STATE }
    }

    const completedTopicIds = Array.isArray(parsed.completedTopicIds)
      ? parsed.completedTopicIds.filter((id) => typeof id === 'string')
      : []

    const lastVisitedFieldId =
      typeof parsed.lastVisitedFieldId === 'string' && parsed.lastVisitedFieldId.trim().length > 0
        ? parsed.lastVisitedFieldId.trim()
        : null

    return {
      completedTopicIds,
      lastVisitedFieldId,
    }
  } catch (err) {
    console.warn('[progressStorage] Failed to load progress from localStorage:', err)
    return { ...DEFAULT_STATE }
  }
}

/**
 * Saves progress data to persistent storage.
 * @param {{ completedTopicIds: string[], lastVisitedFieldId?: string|null }} data
 * @returns {Promise<void>}
 */
export async function saveProgress(data) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const payload = {
      completedTopicIds: Array.isArray(data?.completedTopicIds)
        ? data.completedTopicIds.filter((id) => typeof id === 'string')
        : [],
      lastVisitedFieldId:
        typeof data?.lastVisitedFieldId === 'string' && data.lastVisitedFieldId.trim().length > 0
          ? data.lastVisitedFieldId.trim()
          : null,
      updatedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (err) {
    console.warn('[progressStorage] Failed to save progress to localStorage:', err)
  }
}

