const BASE_KEY = 'pathforge:progress:v1'
const GUEST_KEY = `${BASE_KEY}:guest`

const BASE_PROFILE_KEY = 'pathforge:profile:v1'
const GUEST_PROFILE_KEY = `${BASE_PROFILE_KEY}:guest`

const DEFAULT_STATE = {
  completedTopicIds: [],
  lastVisitedFieldId: null,
}

// In-memory reference to the current active user ID (null for guest)
let currentActiveUserId = null

/**
 * Sets the active user context for progress storage.
 * @param {string|null} userId
 */
export function setActiveUser(userId) {
  currentActiveUserId = typeof userId === 'string' && userId.trim() ? userId.trim() : null
}

/**
 * Gets the current active user ID (null for guest).
 * @returns {string|null}
 */
export function getActiveUser() {
  return currentActiveUserId
}

/**
 * Returns the localStorage key for a specific user ID or the active context.
 * @param {string|null} [userId]
 * @returns {string}
 */
function resolveStorageKey(userId) {
  const targetId = userId !== undefined ? userId : currentActiveUserId
  if (targetId && targetId !== 'guest') {
    return `${BASE_KEY}:${targetId}`
  }
  return GUEST_KEY
}

/**
 * Loads progress data from persistent storage for a user (or active user / guest).
 * Wrapped in try/catch with schema validation and fallback to empty state.
 *
 * TODO (Express + MongoDB Backend):
 * In a future update, swap this localStorage read for an authorized API call:
 * const response = await fetch('/api/progress', {
 *   headers: { Authorization: `Bearer ${authToken}` }
 * })
 * return await response.json()
 *
 * @param {string|null} [userId] - Optional specific user ID (defaults to active user / guest)
 * @returns {Promise<{ completedTopicIds: string[], lastVisitedFieldId: string|null }>}
 */
export async function loadProgress(userId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_STATE }
    }

    const key = resolveStorageKey(userId)
    let raw = window.localStorage.getItem(key)

    // Backward-compatibility: if reading guest progress and GUEST_KEY is missing,
    // check for legacy unversioned/un-suffixed BASE_KEY and migrate it.
    if (!raw && key === GUEST_KEY) {
      const legacyRaw = window.localStorage.getItem(BASE_KEY)
      if (legacyRaw) {
        raw = legacyRaw
        window.localStorage.setItem(GUEST_KEY, legacyRaw)
      }
    }

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
 * Saves progress data to persistent storage for a user (or active user / guest).
 *
 * TODO (Express + MongoDB Backend):
 * In a future update, swap this localStorage write for an authorized API call:
 * await fetch('/api/progress', {
 *   method: 'PUT',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     Authorization: `Bearer ${authToken}`
 *   },
 *   body: JSON.stringify(payload)
 * })
 *
 * @param {{ completedTopicIds: string[], lastVisitedFieldId?: string|null }} data
 * @param {string|null} [userId] - Optional specific user ID (defaults to active user / guest)
 * @returns {Promise<void>}
 */
export async function saveProgress(data, userId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const key = resolveStorageKey(userId)
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

    window.localStorage.setItem(key, JSON.stringify(payload))
  } catch (err) {
    console.warn('[progressStorage] Failed to save progress to localStorage:', err)
  }
}

/**
 * On login, if the guest has progress and the user has none, merge guest progress
 * into the user's storage key as a union of completed topics.
 *
 * @param {string} userId - The authenticated user ID (Google "sub")
 * @returns {Promise<{ merged: boolean, totalCompleted: number }>}
 */
export async function mergeGuestProgressIntoUser(userId) {
  if (!userId) return { merged: false, totalCompleted: 0 }

  try {
    const guestProgress = await loadProgress('guest')
    const userProgress = await loadProgress(userId)

    // Only merge if guest has progress
    if (guestProgress.completedTopicIds.length > 0) {
      const unionSet = new Set([
        ...userProgress.completedTopicIds,
        ...guestProgress.completedTopicIds,
      ])
      const mergedTopics = Array.from(unionSet)
      const mergedLastVisited =
        userProgress.lastVisitedFieldId || guestProgress.lastVisitedFieldId || null

      await saveProgress(
        {
          completedTopicIds: mergedTopics,
          lastVisitedFieldId: mergedLastVisited,
        },
        userId
      )

      return { merged: true, totalCompleted: mergedTopics.length }
    }

    return { merged: false, totalCompleted: userProgress.completedTopicIds.length }
  } catch (err) {
    console.warn('[progressStorage] Error merging guest progress into user:', err)
    return { merged: false, totalCompleted: 0 }
  }
}

/**
 * Returns the localStorage key for a user's quiz profile.
 * @param {string|null} [userId]
 * @returns {string}
 */
function resolveProfileKey(userId) {
  const targetId = userId !== undefined ? userId : currentActiveUserId
  if (targetId && targetId !== 'guest') {
    return `${BASE_PROFILE_KEY}:${targetId}`
  }
  return GUEST_PROFILE_KEY
}

/**
 * Loads the user's quiz profile and personalized roadmap.
 *
 * TODO (Express + MongoDB Backend):
 * In a future update, swap this localStorage read for an authorized API call:
 * const response = await fetch('/api/profile', {
 *   headers: { Authorization: `Bearer ${authToken}` }
 * })
 * return await response.json()
 *
 * @param {string|null} [userId]
 * @returns {Promise<{ answers: Object, generatedRoadmap: Object, completedAt: string, version: number }|null>}
 */
export async function loadProfile(userId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    const key = resolveProfileKey(userId)
    const raw = window.localStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.answers || !parsed.generatedRoadmap) {
      return null
    }

    return parsed
  } catch (err) {
    console.warn('[progressStorage] Failed to load profile from localStorage:', err)
    return null
  }
}

/**
 * Saves the user's quiz profile and personalized roadmap.
 *
 * TODO (Express + MongoDB Backend):
 * In a future update, swap this localStorage write for an authorized API call:
 * await fetch('/api/profile', {
 *   method: 'PUT',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     Authorization: `Bearer ${authToken}`
 *   },
 *   body: JSON.stringify(profileData)
 * })
 *
 * @param {{ answers: Object, generatedRoadmap: Object }} profileData
 * @param {string|null} [userId]
 * @returns {Promise<void>}
 */
export async function saveProfile(profileData, userId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const key = resolveProfileKey(userId)
    const payload = {
      answers: profileData?.answers || {},
      generatedRoadmap: profileData?.generatedRoadmap || null,
      completedAt: profileData?.completedAt || new Date().toISOString(),
      version: 1,
    }

    window.localStorage.setItem(key, JSON.stringify(payload))
  } catch (err) {
    console.warn('[progressStorage] Failed to save profile to localStorage:', err)
  }
}

/**
 * Clears the user's profile from storage (used when resetting or retaking).
 * @param {string|null} [userId]
 * @returns {Promise<void>}
 */
export async function clearProfile(userId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    const key = resolveProfileKey(userId)
    window.localStorage.removeItem(key)
  } catch (err) {
    console.warn('[progressStorage] Failed to clear profile from localStorage:', err)
  }
}

/**
 * Adopts a guest quiz profile upon initial sign-in if the user does not yet have one.
 * @param {string} userId
 * @returns {Promise<boolean>} whether a guest profile was adopted
 */
export async function adoptGuestProfile(userId) {
  if (!userId) return false
  try {
    const existingUserProfile = await loadProfile(userId)
    if (existingUserProfile) {
      return false // User already has their own saved profile
    }

    const guestProfile = await loadProfile('guest')
    if (guestProfile) {
      await saveProfile(guestProfile, userId)
      return true
    }

    return false
  } catch (err) {
    console.warn('[progressStorage] Failed to adopt guest profile:', err)
    return false
  }
}

