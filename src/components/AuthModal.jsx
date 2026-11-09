import { useEffect, useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { X, Route, ShieldCheck, WifiOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function AuthModal({ isOpen, onClose }) {
  const { login, showToast } = useAuth()
  const { theme } = useTheme()
  const modalRef = useRef(null)

  // Focus trap and Escape key listener
  useEffect(() => {
    if (!isOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus close button initially
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable && focusable.length > 0) {
      focusable[0].focus()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  const handleSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse)
      onClose()
    } catch {
      // AuthContext handles error toast
    }
  }

  const handleError = () => {
    showToast('Sign-in cancelled or popup closed.', 'error')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-desc"
        className="w-full max-w-sm rounded-xl bg-white dark:bg-[#11141c] border border-black/[0.08] dark:border-white/[0.08] p-6 transition-colors shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with logo icon and close button */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
            <Route className="h-4 w-4" strokeWidth={1.5} />
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#6b7487] dark:text-[#7a8296] hover:text-[#111827] dark:hover:text-[#eef0f5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
            aria-label="Close sign in dialog"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal copy */}
        <div className="mb-6">
          <h2
            id="auth-modal-title"
            className="text-base font-semibold text-[#111827] dark:text-[#eef0f5] tracking-tight mb-1"
          >
            Sign in to PathForge
          </h2>
          <p
            id="auth-modal-desc"
            className="text-xs text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed"
          >
            Save your progress across sessions and synchronize completed milestones.
          </p>
        </div>

        {/* Offline indicator if disconnected */}
        {isOffline ? (
          <div className="p-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <WifiOff className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            <span>You appear to be offline. Reconnect to sign in.</span>
          </div>
        ) : (
          /* Google Login Button Container */
          <div className="flex flex-col items-center justify-center py-2 min-h-[44px]">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
              shape="pill"
              size="large"
              text="continue_with"
              width="280"
            />
          </div>
        )}

        {/* Quiet footer reassurance */}
        <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center gap-1.5 text-[11px] text-[#6b7487] dark:text-[#7a8296]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#0A66C2]" strokeWidth={1.5} />
          <span>Local and cloud progress synced</span>
        </div>
      </div>
    </div>
  )
}

