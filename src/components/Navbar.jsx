import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, Menu, X, Map, ArrowRight } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Roadmaps', id: 'roadmaps' },
  { label: 'About', id: 'about' },
]

export default function Navbar({ activeSection, onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useRef(null)

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
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
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900
        border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left: hamburger (mobile) + logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400
                  hover:text-gray-700 dark:hover:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                onClick={() => onNavigate?.('home')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                  bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15">
                  <Map className="h-4 w-4 text-[#0A66C2]" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  PathForge
                </span>
              </button>
            </div>

            {/* Center: desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate?.(link.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${activeSection === link.id
                      ? 'text-[#0A66C2] bg-blue-50 dark:bg-[#0A66C2]/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right: theme toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400
                  hover:text-gray-700 dark:hover:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel — glassmorphism */}
          <div
            ref={drawerRef}
            className="absolute top-0 left-0 h-full w-4/5 max-w-sm
              bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl
              border-r border-white/20 dark:border-gray-700/50
              shadow-2xl flex flex-col
              transition-transform duration-300 ease-in-out"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                  bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15">
                  <Map className="h-4 w-4 text-[#0A66C2]" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  PathForge
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-500 dark:text-gray-400
                  hover:text-gray-700 dark:hover:text-gray-200
                  rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate?.(link.id)
                    setMobileOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${activeSection === link.id
                      ? 'text-[#0A66C2] bg-blue-50 dark:bg-[#0A66C2]/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium
                  text-gray-600 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-white
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  rounded-lg transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
