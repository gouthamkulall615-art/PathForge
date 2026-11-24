import { Link } from 'react-router-dom'
import { GitBranch } from 'lucide-react'

const LINKS = [
  { label: 'Tracks', href: '#tracks' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'The Heat', href: '#heat-title' },
  { label: 'Calibrator', href: '#calibrator' },
  { label: 'Features', href: '#features' },
  { label: 'Open Source', href: '#open-source' },
  { label: 'FAQ', href: '#faq' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      className="border-t border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Version Info */}
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <Link to="/" className="flex items-center gap-2 group" aria-label="PathForge home">
            <div className="w-6 h-6 rounded-md bg-[#0A66C2] flex items-center justify-center group-hover:bg-[#004182] transition-colors">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 12L7 2L12 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 8.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[var(--forge-ink)]">PathForge</span>
          </Link>
          <p className="font-mono text-[10px] text-[var(--forge-muted)]">
            &copy; {year} PathForge · MIT License · <span className="text-[var(--forge-accent)]">v1.0.0</span> · SHA c4b91f0
          </p>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs" role="list">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[var(--forge-muted)] hover:text-[var(--forge-ink)] transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/yourusername/pathforge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="text-[var(--forge-muted)] hover:text-[var(--forge-ink)] transition-colors inline-flex items-center gap-1"
              >
                <GitBranch className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>GitHub</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
