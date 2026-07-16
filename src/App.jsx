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
    }
  }

  const handleFieldClick = (field) => {
    setSelectedField(field)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto">
        {selectedField ? (
          <RoadmapView
            field={selectedField}
            onBack={() => {
              setSelectedField(null)
              setActiveSection('roadmaps')
            }}
          />
        ) : activeSection === 'about' ? (
          <AboutSection />
        ) : (
          <>
            <HeroSection onExplore={() => {
              gridRef.current?.scrollIntoView({ behavior: 'smooth' })
            }} />

            {/* Field grid */}
            <div ref={gridRef} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Choose Your Path
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {FIELDS.length} expert-curated roadmaps across tech disciplines
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} PathForge. Expert-curated learning paths for tech careers.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              All roadmaps are community-curated and regularly updated.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
          About PathForge
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Structured, expert-curated career roadmaps for aspiring tech professionals.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            What is PathForge?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            PathForge provides carefully structured learning paths for popular tech career
            tracks. Each roadmap is broken into phases that build on each other, with curated
            free resources (video tutorials, documentation, and tools) to guide you from
            beginner to advanced.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Our roadmaps cover Frontend Development, Backend Development, Machine Learning,
            DevOps, Cybersecurity, UX/UI Design, Data Science, Mobile Development, Cloud
            Engineering, and Blockchain/Web3.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            How are roadmaps created?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Every roadmap is hand-curated by practitioners and regularly reviewed. We select
            high-quality, freely available resources — primarily from YouTube channels and
            open documentation — so you can learn without any financial barrier. No AI generation,
            no auto-scraped content. Just proven paths vetted by people who've walked them.
          </p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/40
          rounded-lg p-6">
          <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-2">
            Completely Free
          </h2>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
            PathForge is free and always will be. Every linked resource is freely available.
            We believe career guidance shouldn't cost anything.
          </p>
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
