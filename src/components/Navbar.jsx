import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { Sun, Moon, Menu, X, Route, LogIn, LogOut } from 'lucide-react'
import AuthModal from './AuthModal'

const NAV_LINKS = [
  { label: 'Roadmaps', id: 'roadmaps' },
  { label: 'About', id: 'about' },
]

function getInitials(name) {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Navbar({ activeSection, onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout, isGoogleConfigured } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [failedAvatarUrl, setFailedAvatarUrl] = useState(null)
  const userMenuRef = useRef(null)

  // Declarative avatar fallback check without synchronous effect setState
  const isAvatarValid = Boolean(user?.picture && failedAvatarUrl !== user.picture)

  // Dismiss dropdown on outside click or Escape key
  useEffect(() => {
    if (!userMenuOpen) return

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [userMenuOpen])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close drawer on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0d0f14] border-b border-black/[0.08] dark:border-white/[0.08] transition-colors duration-150">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Left: Mobile menu button + Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-1.5 text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-md transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <button
                onClick={() => onNavigate?.('home')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-md bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
                  <Route className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-semibold text-[#111827] dark:text-[#eef0f5] tracking-tight">
                    PathForge
                  </span>
                  <span className="hidden sm:inline-block text-[11px] font-mono text-[#6b7487] dark:text-[#7a8296]">
                    roadmaps
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Desktop links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate?.(link.id)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isActive
                        ? 'font-medium text-[#111827] dark:text-[#eef0f5] bg-black/[0.04] dark:bg-white/[0.06]'
                        : 'font-normal text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                      }`}
                  >
                    {link.label}
                  </button>
                )
              })}
            </nav>

            {/* Right: Auth Profile / Sign-in & Theme toggle */}
            <div className="flex items-center gap-2">
              {user ? (
                /* Authenticated User Avatar + Dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#0A66C2]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] transition-all"
                    aria-label="User account menu"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    {isAvatarValid ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        onError={() => setFailedAvatarUrl(user.picture)}
                        className="w-7 h-7 rounded-full object-cover border border-black/10 dark:border-white/10"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center font-mono text-[11px] font-medium border border-[#0A66C2]/20">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div
                      role="menu"
                      aria-orientation="vertical"
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <div className="px-2.5 py-2">
                        <p className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5] truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] font-mono text-[#6b7487] dark:text-[#7a8296] truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-1" />

                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout('manual')
                        }}
                        role="menuitem"
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#4b5565] dark:text-[#a3a9b8] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : isGoogleConfigured ? (
                /* Unauthenticated Sign In Button */
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-[#111827] dark:text-[#eef0f5] bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-black/[0.08] dark:border-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
                >
                  <LogIn className="h-3.5 w-3.5 text-[#0A66C2]" strokeWidth={1.75} />
                  <span>Sign in</span>
                </button>
              ) : null}

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-1.5 text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-md transition-colors"
                aria-label="Toggle color theme"
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <Moon className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sign-in Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute top-0 left-0 h-full w-72 bg-white dark:bg-[#12151e] border-r border-black/[0.08] dark:border-white/[0.08] shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-black/[0.08] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
                  <Route className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
                <span className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5]">
                  PathForge
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] rounded-md"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 px-3 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate?.(link.id)
                    setMobileOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeSection === link.id
                      ? 'font-medium text-[#111827] dark:text-[#eef0f5] bg-black/[0.04] dark:bg-white/[0.06]'
                      : 'text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5]'
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Mobile Auth & Theme section */}
            <div className="px-3 py-3 border-t border-black/[0.08] dark:border-white/[0.08] space-y-2">
              {user ? (
                <div className="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04] space-y-2">
                  <div className="flex items-center gap-2.5">
                    {isAvatarValid ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        onError={() => setFailedAvatarUrl(user.picture)}
                        className="w-8 h-8 rounded-full object-cover border border-black/10 dark:border-white/10"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center font-mono text-xs font-medium border border-[#0A66C2]/20">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] font-mono text-[#6b7487] dark:text-[#7a8296] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      logout('manual')
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : isGoogleConfigured ? (
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    setAuthModalOpen(true)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>Sign in with Google</span>
                </button>
              ) : null}

              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#4b5565] dark:text-[#a3a9b8] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] rounded-md"
              >
                <span>Theme</span>
                <span className="font-mono">{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
