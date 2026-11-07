import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, Menu, X, Route } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Roadmaps', id: 'roadmaps' },
  { label: 'About', id: 'about' },
]

export default function Navbar({ activeSection, onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

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
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'font-medium text-[#111827] dark:text-[#eef0f5] bg-black/[0.04] dark:bg-white/[0.06]'
                        : 'font-normal text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    {link.label}
                  </button>
                )
              })}
            </nav>

            {/* Right: Theme switcher */}
            <div className="flex items-center gap-2">
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

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          <div
            className="absolute top-0 left-0 h-full w-72 bg-white dark:bg-[#12151e] border-r border-black/[0.08] dark:border-white/[0.08] shadow-lg flex flex-col"
          >
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

            <nav className="flex-1 px-3 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate?.(link.id)
                    setMobileOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === link.id
                      ? 'font-medium text-[#111827] dark:text-[#eef0f5] bg-black/[0.04] dark:bg-white/[0.06]'
                      : 'text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="px-3 py-3 border-t border-black/[0.08] dark:border-white/[0.08]">
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
