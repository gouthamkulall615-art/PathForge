import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProgressProvider, useProgress } from './contexts/ProgressContext'
import { ProfileProvider, useProfile } from './contexts/ProfileContext'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FieldCard from './components/FieldCard'
import RoadmapView from './components/RoadmapView'
import SearchFilters from './components/SearchFilters'
import FieldIcon from './components/FieldIcon'
import OnboardingQuiz from './components/onboarding/OnboardingQuiz'
import MyPath from './components/MyPath'
import { searchAndFilterFields } from './lib/searchFields'
import { FIELDS } from './data/fields'
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react'

// Read initial filter values from URL query parameters
function getInitialParams() {
  if (typeof window === 'undefined') {
    return {
      query: '',
      difficulty: 'all',
      resourceType: 'all',
      progressStatus: 'all',
      sort: 'default',
    }
  }
  const params = new URLSearchParams(window.location.search)
  return {
    query: params.get('q') || '',
    difficulty: params.get('difficulty') || 'all',
    resourceType: params.get('resourceType') || 'all',
    progressStatus: params.get('status') || 'all',
    sort: params.get('sort') || 'default',
  }
}

function AppContent() {
  const { user } = useAuth()
  const { getFieldProgress, lastVisitedFieldId } = useProgress()
  const { hasProfile, isLoading: profileLoading, saveQuizAnswers } = useProfile()

  const [selectedField, setSelectedField] = useState(null)
  const [activeSection, setActiveSection] = useState('roadmaps')
  const gridRef = useRef(null)
  const autoRedirectedRef = useRef(false)

  // Automatic onboarding redirect:
  // When a user signs in for the first time without a saved quiz profile,
  // redirect them to the full-page onboarding quiz (unless skipped in this session).
  useEffect(() => {
    if (profileLoading) return
    if (user?.id && !hasProfile && !autoRedirectedRef.current) {
      autoRedirectedRef.current = true
      const skipped =
        typeof window !== 'undefined' &&
        window.sessionStorage.getItem('pathforge:quiz_skipped') === 'true'
      if (!skipped) {
        const timer = setTimeout(() => {
          setActiveSection('quiz')
          setSelectedField(null)
        }, 0)
        return () => clearTimeout(timer)
      }
    }
  }, [user?.id, hasProfile, profileLoading])

  // Filter and search states
  const initial = useMemo(() => getInitialParams(), [])
  const [query, setQuery] = useState(initial.query)
  const [difficulty, setDifficulty] = useState(initial.difficulty)
  const [resourceType, setResourceType] = useState(initial.resourceType)
  const [progressStatus, setProgressStatus] = useState(initial.progressStatus)
  const [sort, setSort] = useState(initial.sort)

  // Sync state to URL search parameters without page reload
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (difficulty !== 'all') params.set('difficulty', difficulty)
    if (resourceType !== 'all') params.set('resourceType', resourceType)
    if (progressStatus !== 'all') params.set('status', progressStatus)
    if (sort !== 'default') params.set('sort', sort)

    const qs = params.toString()
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [query, difficulty, resourceType, progressStatus, sort])

  // Clear all filters callback
  const handleClearAll = useCallback(() => {
    setQuery('')
    setDifficulty('all')
    setResourceType('all')
    setProgressStatus('all')
    setSort('default')
  }, [])

  // Calculate filtered fields using the pure function
  const filteredFields = useMemo(() => {
    return searchAndFilterFields(FIELDS, {
      query,
      difficulty,
      resourceType,
      progressStatus,
      sort,
      getFieldProgress,
    })
  }, [query, difficulty, resourceType, progressStatus, sort, getFieldProgress])

  // Find the last visited field object (if any)
  const lastVisitedField = useMemo(() => {
    if (!lastVisitedFieldId) return null
    return FIELDS.find((f) => f.id === lastVisitedFieldId) || null
  }, [lastVisitedFieldId])

  const lastVisitedProgress = useMemo(() => {
    if (!lastVisitedField) return null
    return getFieldProgress(lastVisitedField)
  }, [lastVisitedField, getFieldProgress])

  const handleNavigate = (section) => {
    if (section === 'home') {
      setSelectedField(null)
      setActiveSection(hasProfile ? 'mypath' : 'roadmaps')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (section === 'mypath') {
      setSelectedField(null)
      setActiveSection('mypath')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (section === 'quiz') {
      setSelectedField(null)
      setActiveSection('quiz')
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

  const handleQuizComplete = async (answers) => {
    await saveQuizAnswers(answers)
    setActiveSection('mypath')
    setSelectedField(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleQuizSkip = () => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('pathforge:quiz_skipped', 'true')
      }
    } catch {
      // Ignore
    }
    setActiveSection('roadmaps')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#0b0d13] text-[#111827] dark:text-[#eef0f5] transition-colors duration-150">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="px-4 sm:px-6 max-w-6xl mx-auto py-6 sm:py-8">
        {activeSection === 'quiz' ? (
          <OnboardingQuiz
            onComplete={handleQuizComplete}
            onSkip={handleQuizSkip}
          />
        ) : selectedField ? (
          <RoadmapView
            field={selectedField}
            searchQuery={query}
            onBack={() => {
              setSelectedField(null)
              setActiveSection(hasProfile ? 'mypath' : 'roadmaps')
            }}
          />
        ) : activeSection === 'mypath' ? (
          <MyPath
            onRetakeQuiz={() => {
              setSelectedField(null)
              setActiveSection('quiz')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onViewStandardRoadmap={(fieldId) => {
              const field = FIELDS.find((f) => f.id === fieldId)
              if (field) handleFieldClick(field)
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
              {/* Personalized Path CTA banner if user has no profile */}
              {!hasProfile ? (
                <div className="mb-6 p-4 rounded-xl bg-blue-500/[0.04] dark:bg-blue-500/[0.08] border border-[#0A66C2]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5]">
                        Looking for a personalized learning roadmap?
                      </p>
                      <p className="text-[11px] text-[#6b7487] dark:text-[#7a8296]">
                        Take our 3-minute technical assessment to skip foundations you already know and get calendar milestone dates.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigate('quiz')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors flex-shrink-0"
                  >
                    Take Assessment
                    <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-3.5 rounded-xl bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-blue-500/10 text-[#0A66C2] flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium text-[#111827] dark:text-[#eef0f5]">
                      Your personalized roadmap is active.
                    </span>
                  </div>
                  <button
                    onClick={() => handleNavigate('mypath')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#0A66C2] hover:underline"
                  >
                    View My Path
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Optional "Continue where you left off" banner */}
              {lastVisitedField && (
                <div className="mb-6 p-4 rounded-xl bg-white dark:bg-[#12151e] border border-[#0A66C2]/30 dark:border-[#0A66C2]/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2] flex-shrink-0">
                      <FieldIcon fieldId={lastVisitedField.id} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-[#6b7487] dark:text-[#7a8296] font-mono">
                        Continue where you left off
                      </div>
                      <div className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] truncate">
                        {lastVisitedField.name} ·{' '}
                        <span className="text-[#0A66C2] font-mono">
                          {lastVisitedProgress?.percent || 0}% completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFieldClick(lastVisitedField)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors flex-shrink-0"
                  >
                    Resume
                    <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
                  </button>
                </div>
              )}

              {/* Search Bar & Filter Controls */}
              <SearchFilters
                query={query}
                onQueryChange={setQuery}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                resourceType={resourceType}
                onResourceTypeChange={setResourceType}
                progressStatus={progressStatus}
                onProgressStatusChange={setProgressStatus}
                sort={sort}
                onSortChange={setSort}
                totalCount={FIELDS.length}
                filteredCount={filteredFields.length}
                onClearAll={handleClearAll}
              />

              {/* Grid or Empty Results State */}
              {filteredFields.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] my-6">
                  <p className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] mb-1">
                    No tracks match your search
                  </p>
                  <p className="text-xs text-[#6b7487] dark:text-[#7a8296] max-w-sm mx-auto mb-4">
                    {query
                      ? `No roadmaps, topics, or resources found matching "${query}".`
                      : 'No roadmaps match the selected filter combination.'}
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-lg text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFields.map((field) => (
                    <FieldCard
                      key={field.id}
                      field={field}
                      onClick={handleFieldClick}
                      searchQuery={query}
                    />
                  ))}
                </div>
              )}
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
  const { resetAll, completed } = useProgress()
  const [confirmingAll, setConfirmingAll] = useState(false)

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

        {/* Data & Privacy notice with optional Reset All button */}
        <div className="bg-white dark:bg-[#12151e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5] mb-1">
              Local progress & privacy
            </h2>
            <p className="text-xs text-[#6b7487] dark:text-[#7a8296] leading-relaxed">
              Your study checklist progress is stored privately on this device.
            </p>
          </div>

          {completed.size > 0 && (
            <div className="flex-shrink-0">
              {confirmingAll ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 dark:text-red-400">Clear all?</span>
                  <button
                    onClick={() => {
                      resetAll()
                      setConfirmingAll(false)
                    }}
                    className="text-xs font-medium px-2.5 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmingAll(false)}
                    className="text-xs px-2 py-1 rounded text-[#4b5565] dark:text-[#a3a9b8]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingAll(true)}
                  className="inline-flex items-center gap-1 text-xs text-[#6b7487] dark:text-[#7a8296] hover:text-red-600 dark:hover:text-red-400 py-1.5 px-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08]"
                >
                  <RotateCcw className="h-3 w-3" strokeWidth={1.75} />
                  Reset all progress
                </button>
              )}
            </div>
          )}
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
      <AuthProvider>
        <ProgressProvider>
          <ProfileProvider>
            <AppContent />
          </ProfileProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
