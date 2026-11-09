import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { loadProfile, saveProfile, clearProfile, adoptGuestProfile } from '../lib/progressStorage'
import { generateRoadmap } from '../lib/generateRoadmap'
import { FIELDS } from '../data/fields'
import { useAuth } from './AuthContext'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load profile whenever user changes (login, logout, or initial load)
  useEffect(() => {
    let mounted = true
    const currentUid = user?.id || 'guest'

    async function initProfile() {
      if (user?.id) {
        // If logged in, attempt adopting guest profile if user has none
        await adoptGuestProfile(user.id)
      }

      const loaded = await loadProfile(currentUid)
      if (mounted) {
        setProfile(loaded)
        setIsLoading(false)
      }
    }

    initProfile()

    return () => {
      mounted = false
    }
  }, [user?.id])

  // Multi-tab synchronization via window 'storage' event
  useEffect(() => {
    function handleStorageChange(event) {
      if (!event.key || event.key.startsWith('pathforge:profile:v1')) {
        const currentUid = user?.id || 'guest'
        loadProfile(currentUid).then((refreshed) => {
          setProfile(refreshed)
        })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [user?.id])

  // Save new quiz answers, generate roadmap, and persist
  const saveQuizAnswers = useCallback(
    async (answers) => {
      const generated = generateRoadmap(answers, FIELDS)
      const currentUid = user?.id || 'guest'
      const payload = {
        answers,
        generatedRoadmap: generated,
        completedAt: new Date().toISOString(),
        version: 1,
      }

      await saveProfile(payload, currentUid)
      setProfile(payload)
      return generated
    },
    [user?.id]
  )

  // Update schedule preferences (hours/week or target timeframe) on the fly
  const updatePreferences = useCallback(
    async ({ hoursPerWeek, targetTimeframe }) => {
      if (!profile || !profile.answers) return null

      const updatedAnswers = {
        ...profile.answers,
        hoursPerWeek: hoursPerWeek !== undefined ? hoursPerWeek : profile.answers.hoursPerWeek,
        targetTimeframe: targetTimeframe !== undefined ? targetTimeframe : profile.answers.targetTimeframe,
      }

      const regenerated = generateRoadmap(updatedAnswers, FIELDS)
      const currentUid = user?.id || 'guest'
      const payload = {
        ...profile,
        answers: updatedAnswers,
        generatedRoadmap: regenerated,
        updatedAt: new Date().toISOString(),
      }

      await saveProfile(payload, currentUid)
      setProfile(payload)
      return regenerated
    },
    [profile, user?.id]
  )

  // Reset or clear profile
  const resetProfile = useCallback(async () => {
    const currentUid = user?.id || 'guest'
    await clearProfile(currentUid)
    setProfile(null)
  }, [user?.id])

  const hasProfile = Boolean(profile?.generatedRoadmap)

  const value = useMemo(
    () => ({
      profile,
      hasProfile,
      isLoading,
      roadmap: profile?.generatedRoadmap || null,
      saveQuizAnswers,
      updatePreferences,
      resetProfile,
    }),
    [profile, hasProfile, isLoading, saveQuizAnswers, updatePreferences, resetProfile]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
