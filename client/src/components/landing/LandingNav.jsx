import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { useProgress } from '../../contexts/ProgressContext'
import { Menu, X, Moon, Sun, GitBranch } from 'lucide-react'

const _m = motion

const NAV_LINKS = [
  { label: 'Tracks', href: '#tracks' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'The Heat', href: '#heat-title' },
  { label: 'Calibrator', href: '#calibrator' },
  { label: 'Features', href: '#features' },
  { label: 'FAQ', href: '#faq' },
]

export default function LandingNav() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { completed } = useProgress()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const hasProgress = Boolean(user?.id || (completed && completed.size > 0))
  const ctaText = hasProgress ? 'Continue your path' : 'Start forging'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [mobileOpen])

  const handleAnchor = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0A66C2] focus:text-white focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[var(--forge-canvas)]/90 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.08]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="PathForge home"
          >
            <div className="w-7 h-7 rounded-lg bg-[#0A66C2] flex items-center justify-center shrink-0 group-hover:bg-[#004182] transition-colors shadow-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 12L7 2L12 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 8.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[var(--forge-ink)] tracking-tight">
              PathForge
            </span>
          </Link>

          {/* Desktop nav anchors */}
          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchor(e, link.href)}
                    className="text-[var(--forge-muted)] hover:text-[var(--forge-ink)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://github.com/yourusername/pathforge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PathForge on GitHub"
              className="p-2 rounded-lg text-[var(--forge-muted)] hover:text-[var(--forge-ink)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
            >
              <GitBranch className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-[var(--forge-muted)] hover:text-[var(--forge-ink)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
            </button>
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="ml-1 px-4 py-1.5 text-xs font-medium rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
            >
              {ctaText}
            </button>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-[var(--forge-muted)]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="p-2 rounded-lg text-[var(--forge-muted)]"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 bg-[var(--forge-canvas)] border-l border-black/[0.08] dark:border-white/[0.08] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-black/[0.08] dark:border-white/[0.08]">
                <span className="text-sm font-semibold text-[var(--forge-ink)]">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-[var(--forge-muted)]"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleAnchor(e, link.href)}
                    className="px-3 py-2.5 rounded-lg text-sm text-[var(--forge-muted)] hover:text-[var(--forge-ink)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-4 pt-4 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col gap-2">
                  <a
                    href="https://github.com/yourusername/pathforge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--forge-muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <GitBranch className="w-4 h-4" strokeWidth={1.5} />
                    GitHub
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      navigate('/app')
                    }}
                    className="mt-1 w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors"
                  >
                    {ctaText}
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
