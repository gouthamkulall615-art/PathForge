import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'
import { googleLogout } from '@react-oauth/google'
import { setActiveUser, mergeGuestProgressIntoUser } from '../lib/progressStorage'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const AUTH_STORAGE_KEY = 'pathforge:auth:v1'

const AuthContext = createContext(null)

/**
 * Loads and validates stored authentication state from localStorage.
 * Automatically checks token expiration.
 */
function loadStoredAuth() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const { user, expiresAt } = parsed
    if (!user || typeof user !== 'object' || !user.id) return null

    // Check if token has expired
    if (typeof expiresAt === 'number' && expiresAt <= Date.now()) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    return { user, expiresAt }
  } catch (err) {
    console.warn('[AuthContext] Failed to load stored auth from localStorage:', err)
    return null
  }
}

export function AuthProvider({ children }) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const isGoogleConfigured = Boolean(googleClientId && googleClientId.trim().length > 0)

  const [user, setUser] = useState(() => {
    const stored = loadStoredAuth()
    if (stored?.user?.id) {
      setActiveUser(stored.user.id)
      return stored.user
    }
    setActiveUser(null)
    return null
  })

  const [expiresAt, setExpiresAt] = useState(() => {
    const stored = loadStoredAuth()
    return stored?.expiresAt || null
  })

  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Show a toast notification (auto-dismisses after 4 seconds)
  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast])

  // Logout handler
  const logout = useCallback(
    (reason) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } catch (err) {
        console.warn('[AuthContext] Error removing auth storage:', err)
      }

      setUser(null)
      setExpiresAt(null)
      setActiveUser(null)

      try {
        googleLogout()
      } catch {
        // Ignore Google logout cleanup errors
      }

      if (reason === 'expired') {
        showToast('Your session has expired. Please sign in again.', 'info')
      } else {
        showToast('Signed out of PathForge.', 'info')
      }
    },
    [showToast]
  )

  // Login handler accepting the credential response from @react-oauth/google
  const login = useCallback(
    async (credentialResponse) => {
      setIsLoading(true)
      try {
        if (!credentialResponse?.credential) {
          throw new Error('No credential received from Google.')
        }

        // Check if offline
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          throw new Error('You appear to be offline. Please check your internet connection.')
        }

        // Decode the Google ID token JWT
        const decoded = jwtDecode(credentialResponse.credential)

        if (!decoded || !decoded.sub) {
          throw new Error('Invalid token structure.')
        }

        // Validate expiration
        const tokenExpiresAt = decoded.exp ? decoded.exp * 1000 : Date.now() + 3600 * 1000
        if (tokenExpiresAt <= Date.now()) {
          throw new Error('Google credential token is already expired.')
        }

        // Construct clean user profile
        const userProfile = {
          id: decoded.sub,
          name: decoded.name || decoded.given_name || 'Engineer',
          email: decoded.email || '',
          picture: decoded.picture || '',
        }

        // Persist to localStorage
        try {
          const authPayload = {
            user: userProfile,
            expiresAt: tokenExpiresAt,
            // Keep credential token so future backend requests can forward it
            token: credentialResponse.credential,
            updatedAt: new Date().toISOString(),
          }
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload))
        } catch (storageErr) {
          console.warn('[AuthContext] Could not persist auth session to localStorage:', storageErr)
        }

        // TODO: Send ID token to Express + MongoDB backend for server-side verification:
        // const response = await fetch('/api/auth/google', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ credential: credentialResponse.credential }),
        // })
        // const backendData = await response.json()

        // Set active user in progressStorage layer
        setActiveUser(userProfile.id)

        // Merge guest progress into user if guest had progress and user has none (or union)
        const mergeResult = await mergeGuestProgressIntoUser(userProfile.id)

        setUser(userProfile)
        setExpiresAt(tokenExpiresAt)

        if (mergeResult.merged) {
          showToast(
            `Welcome, ${userProfile.name}! Your offline progress has been saved to your account.`,
            'success'
          )
        } else {
          showToast(`Welcome, ${userProfile.name}!`, 'success')
        }

        return userProfile
      } catch (err) {
        console.error('[AuthContext] Login error:', err)
        showToast(err.message || 'Google sign-in failed. Please try again.', 'error')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [showToast]
  )

  // Auto-logout when token expires
  useEffect(() => {
    if (!user || !expiresAt) return

    const timeUntilExpiry = Math.max(0, expiresAt - Date.now())
    const timer = setTimeout(() => {
      logout('expired')
    }, timeUntilExpiry)

    return () => clearTimeout(timer)
  }, [user, expiresAt, logout])

  // Multi-tab synchronization: listen to the "storage" event on window
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === AUTH_STORAGE_KEY) {
        const stored = loadStoredAuth()
        if (stored?.user?.id) {
          setActiveUser(stored.user.id)
          setUser(stored.user)
          setExpiresAt(stored.expiresAt)
        } else {
          setActiveUser(null)
          setUser(null)
          setExpiresAt(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isGoogleConfigured,
      login,
      logout,
      showToast,
    }),
    [user, isLoading, isGoogleConfigured, login, logout, showToast]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Floating Accessible Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#11141c] border border-black/[0.08] dark:border-white/[0.08] shadow-lg text-xs">
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              {toast.type === 'info' && (
                <Info className="h-4 w-4 text-[#0A66C2]" />
              )}
            </div>

            <div className="flex-1 text-[#111827] dark:text-[#eef0f5] leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => setToast(null)}
              className="p-0.5 text-[#6b7487] dark:text-[#7a8296] hover:text-[#111827] dark:hover:text-[#eef0f5] rounded"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
