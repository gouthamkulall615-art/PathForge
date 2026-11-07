import { useState, useRef } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FieldCard from './components/FieldCard'
import RoadmapView from './components/RoadmapView'
import { FIELDS } from './data/fields'

function AppContent() {
  const [selectedField, setSelectedField] = useState(null)
  const [activeSection, setActiveSection] = useState('roadmaps')
  const gridRef = useRef(null)

  const handleNavigate = (section) => {
    if (section === 'home') {
      setSelectedField(null)
      setActiveSection('roadmaps')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (section === 'roadmaps') {
      setSelectedField(null)
      setActiveSection('roadmaps')
      gridRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else if (section === 'about') {
      setActiveSection('about')
      setSelectedField(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFieldClick = (field) => {
    setSelectedField(field)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#0b0d13] text-[#111827] dark:text-[#eef0f5] transition-colors duration-150">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="px-4 sm:px-6 max-w-6xl mx-auto py-6 sm:py-8">
        {selectedField ? (
          <RoadmapView
            field={selectedField}
            onBack={() => {
              setSelectedField(null)
              setActiveSection('roadmaps')
            }}
          />
        ) : activeSection === 'about' ? (
          <AboutSection onBrowse={() => handleNavigate('roadmaps')} />
        ) : (
          <>
            <HeroSection
              onExplore={() => {
                gridRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
              onLearnMore={() => handleNavigate('about')}
            />

            {/* Field Catalog Grid */}
            <div ref={gridRef} className="scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-[#111827] dark:text-[#eef0f5] tracking-tight">
                    Career tracks
                  </h2>
                  <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] mt-0.5">
                    Select a path to inspect phased milestones and free study materials
                  </p>
                </div>
                <div className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
                  {FIELDS.length} tracks available
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FIELDS.map((field) => (
                  <FieldCard
                    key={field.id}
                    field={field}
                    onClick={handleFieldClick}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0d0f14] transition-colors duration-150">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6b7487] dark:text-[#7a8296]">
          <p>
            © {new Date().getFullYear()} PathForge. Structured engineering roadmaps.
          </p>
          <p className="font-mono">
            All linked resources are freely accessible.
          </p>
        </div>
      </footer>
    </div>
  )
}

function AboutSection({ onBrowse }) {
  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="mb-8 pb-6 border-b border-black/[0.08] dark:border-white/[0.08]">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] dark:text-[#eef0f5] tracking-tight mb-2">
          About PathForge
        </h1>
        <p className="text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
          Sequential, vetted study paths designed to navigate software engineering disciplines without commercial paywalls.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5] mb-2">
            Structure & methodology
          </h2>
          <p className="text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed mb-3">
            Each roadmap is partitioned into progressive phases that build directly upon prior concepts.
            Beginners start with foundational principles before transitioning to tooling, frameworks, and architecture.
          </p>
          <p className="text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
            Every phase lists specific conceptual milestones alongside verified free learning resources from trusted community educators and official documentation.
          </p>
        </div>

        <div className="bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5] mb-2">
            Curated, not generated
          </h2>
          <p className="text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
            Content is hand-curated and periodically reviewed against current industry requirements.
            Links prioritize open documentation, official specifications, and comprehensive video tutorials from verified practitioners.
          </p>
        </div>

        <div className="bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5] mb-1">
              Zero cost, completely open
            </h2>
            <p className="text-xs text-[#6b7487] dark:text-[#7a8296] leading-relaxed">
              PathForge requires no subscriptions, signups, or tracking.
            </p>
          </div>
          {onBrowse && (
            <button
              onClick={onBrowse}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-lg text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors flex-shrink-0"
            >
              Explore roadmaps
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
