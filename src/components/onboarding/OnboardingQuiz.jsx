import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  HelpCircle,
  Clock,
  Calendar,
  BookOpen,
  Video,
  Layers,
  Award,
  Zap,
  Target,
  RefreshCw,
} from 'lucide-react'
import { FIELDS } from '../../data/fields'
import { QUIZ_BANK, INTEREST_QUESTIONS } from '../../data/quizBank'
import FieldIcon from '../FieldIcon'

const DRAFT_STORAGE_KEY = 'pathforge:quiz_draft:v1'

const INITIAL_ANSWERS = {
  primaryFieldId: 'frontend',
  secondaryFieldId: null,
  level: 'beginner',
  skillAnswers: {},
  hoursPerWeek: '6-10',
  targetTimeframe: '6m',
  learningStyle: 'mixed',
  motivation: 'career',
}

export default function OnboardingQuiz({ onComplete, onSkip }) {
  // Restore draft if available
  const [answers, setAnswers] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(DRAFT_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          return { ...INITIAL_ANSWERS, ...parsed.answers }
        }
      }
    } catch (err) {
      console.warn('Failed to load quiz draft:', err)
    }
    return INITIAL_ANSWERS
  })

  // Top-level step: 1: tracks, 2: level, 3: skill check, 4: time, 5: style, 6: motivation
  const [step, setStep] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(DRAFT_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          return parsed.step || 1
        }
      }
    } catch {
      // Ignore
    }
    return 1
  })

  // Step 3 sub-question index (0 to 4)
  const [skillQuestionIdx, setSkillQuestionIdx] = useState(0)

  // Interest sub-quiz state
  const [inInterestQuiz, setInInterestQuiz] = useState(false)
  const [interestIdx, setInterestIdx] = useState(0)
  const [interestScores, setInterestScores] = useState({})
  const [recommendedTracks, setRecommendedTracks] = useState(null)

  // Forging animation state
  const [isForging, setIsForging] = useState(false)
  const [forgingPhaseText, setForgingPhaseText] = useState('Analyzing skill proficiencies...')

  // Save draft whenever step or answers change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({ step, answers })
        )
      }
    } catch {
      // Ignore
    }
  }, [step, answers])

  // Get active skill check questions for selected primary track
  const currentSkillQuestions = useMemo(() => {
    return QUIZ_BANK[answers.primaryFieldId] || []
  }, [answers.primaryFieldId])

  // Calculate overall progress percentage
  const progressPercent = useMemo(() => {
    if (inInterestQuiz) return 20
    if (step === 1) return 15
    if (step === 2) return 30
    if (step === 3) {
      const qProgress = (skillQuestionIdx / (currentSkillQuestions.length || 1)) * 25
      return 35 + qProgress
    }
    if (step === 4) return 65
    if (step === 5) return 80
    if (step === 6) return 95
    return 100
  }, [step, skillQuestionIdx, currentSkillQuestions.length, inInterestQuiz])

  // Handle track toggling (up to 2: primary then secondary)
  const toggleTrack = useCallback((fieldId) => {
    setAnswers((prev) => {
      if (prev.primaryFieldId === fieldId) {
        // If secondary exists, promote secondary to primary
        if (prev.secondaryFieldId) {
          return {
            ...prev,
            primaryFieldId: prev.secondaryFieldId,
            secondaryFieldId: null,
            skillAnswers: {}, // reset skill answers on track change
          }
        }
        return prev // keep at least 1 track selected
      }

      if (prev.secondaryFieldId === fieldId) {
        return { ...prev, secondaryFieldId: null }
      }

      if (!prev.primaryFieldId) {
        return { ...prev, primaryFieldId: fieldId, skillAnswers: {} }
      }

      // Add as secondary
      return { ...prev, secondaryFieldId: fieldId }
    })
  }, [])

  // Handle interest quiz answer
  const handleInterestChoice = (weights) => {
    const nextScores = { ...interestScores }
    Object.entries(weights).forEach(([fieldId, pts]) => {
      nextScores[fieldId] = (nextScores[fieldId] || 0) + pts
    })
    setInterestScores(nextScores)

    if (interestIdx < INTEREST_QUESTIONS.length - 1) {
      setInterestIdx((prev) => prev + 1)
    } else {
      // Calculate top 2 tracks
      const sorted = Object.entries(nextScores).sort((a, b) => b[1] - a[1])
      const topPrimary = sorted[0]?.[0] || 'frontend'
      const topSecondary = sorted[1]?.[0] || null
      setRecommendedTracks({
        primary: topPrimary,
        secondary: topSecondary,
      })
    }
  }

  // Apply interest recommendations
  const applyRecommendedTracks = () => {
    if (recommendedTracks) {
      setAnswers((prev) => ({
        ...prev,
        primaryFieldId: recommendedTracks.primary,
        secondaryFieldId: recommendedTracks.secondary,
        skillAnswers: {},
      }))
      setInInterestQuiz(false)
      setStep(2)
    }
  }

  // Handle skill check answer selection
  const selectSkillAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      skillAnswers: {
        ...prev.skillAnswers,
        [questionId]: optionIndex,
      },
    }))
  }

  // Handle finalize and roadmap generation
  const handleFinalize = async () => {
    setIsForging(true)

    // Sequence informative steps during generation
    setTimeout(() => {
      setForgingPhaseText('Calibrating personalized timeline and milestones...')
    }, 450)

    setTimeout(() => {
      setForgingPhaseText('Optimizing resource hierarchy and stretch topics...')
    }, 900)

    setTimeout(async () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(DRAFT_STORAGE_KEY)
        }
      } catch {
        // Ignore
      }

      if (onComplete) {
        await onComplete(answers)
      }
      setIsForging(false)
    }, 1300)
  }

  // Next / Back handlers
  const handleNext = () => {
    if (step === 3) {
      if (skillQuestionIdx < currentSkillQuestions.length - 1) {
        setSkillQuestionIdx((prev) => prev + 1)
        return
      }
    }

    if (step < 6) {
      setStep((prev) => prev + 1)
    } else {
      handleFinalize()
    }
  }

  const handleBack = () => {
    if (inInterestQuiz) {
      if (interestIdx > 0) {
        setInterestIdx((prev) => prev - 1)
      } else {
        setInInterestQuiz(false)
      }
      return
    }

    if (step === 3 && skillQuestionIdx > 0) {
      setSkillQuestionIdx((prev) => prev - 1)
      return
    }

    if (step > 1) {
      setStep((prev) => prev - 1)
    }
  }

  // Keyboard navigation listener (1-4 for options, Enter for next)
  const handlersRef = useRef({})

  useEffect(() => {
    handlersRef.current = {
      handleNext,
      applyRecommendedTracks,
      handleInterestChoice,
      selectSkillAnswer,
      step,
      skillQuestionIdx,
      currentSkillQuestions,
      inInterestQuiz,
      interestIdx,
      recommendedTracks,
      isForging,
    }
  })

  useEffect(() => {
    function handleKeyDown(e) {
      const h = handlersRef.current
      if (h.isForging) return
      const targetTag = e.target.tagName.toLowerCase()
      if (targetTag === 'input' || targetTag === 'textarea') return

      if (e.key === 'Enter') {
        e.preventDefault()
        if (h.inInterestQuiz && h.recommendedTracks) {
          h.applyRecommendedTracks()
        } else if (!h.inInterestQuiz) {
          h.handleNext()
        }
      } else if (e.key === 'Escape' && h.inInterestQuiz) {
        setInInterestQuiz(false)
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIdx = parseInt(e.key, 10) - 1

        if (h.inInterestQuiz && !h.recommendedTracks) {
          const currentQ = INTEREST_QUESTIONS[h.interestIdx]
          if (currentQ?.options[optionIdx]) {
            h.handleInterestChoice(currentQ.options[optionIdx].weights)
          }
        } else if (h.step === 2) {
          const levels = ['beginner', 'basics', 'projects', 'professional']
          if (levels[optionIdx]) {
            setAnswers((prev) => ({ ...prev, level: levels[optionIdx] }))
          }
        } else if (h.step === 3) {
          const currentQ = h.currentSkillQuestions[h.skillQuestionIdx]
          if (currentQ && optionIdx < currentQ.options.length) {
            h.selectSkillAnswer(currentQ.id, optionIdx)
          }
        } else if (h.step === 5) {
          const styles = ['videos', 'docs', 'mixed']
          if (styles[optionIdx]) {
            setAnswers((prev) => ({ ...prev, learningStyle: styles[optionIdx] }))
          }
        } else if (h.step === 6) {
          const motivations = ['career', 'first-job', 'upgrade', 'academic', 'curiosity']
          if (motivations[optionIdx]) {
            setAnswers((prev) => ({ ...prev, motivation: motivations[optionIdx] }))
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Forging Blueprint Screen
  if (isForging) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center animate-fade-in">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-[#0A66C2]">
            <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#0A66C2]"></span>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
          Forging your personalized path...
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-md h-6">
          {forgingPhaseText}
        </p>

        <div className="mt-8 w-64 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#0A66C2] rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#0b0d13] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Quiz Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-black/[0.08] dark:border-white/[0.08] bg-[#f6f8fb]/80 dark:bg-[#0b0d13]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/10 text-[#0A66C2] font-bold">
              <Compass className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight text-sm">PathForge Assessment</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hidden sm:inline">
              Step {step} of 6
            </span>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors px-2 py-1 rounded"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>

        {/* Thin progress bar */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1">
          <div
            className="bg-[#0A66C2] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Assessment Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ========================================================= */}
        {/* INTEREST SUB-QUIZ MODAL / VIEW                           */}
        {/* ========================================================= */}
        {inInterestQuiz ? (
          <div className="space-y-8 animate-fade-in">
            {!recommendedTracks ? (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-[#0A66C2] mb-3">
                    <Sparkles className="h-3.5 w-3.5" />
                    Track Recommendation Quiz ({interestIdx + 1}/4)
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {INTEREST_QUESTIONS[interestIdx]?.prompt}
                  </h2>
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Press 1–4 on your keyboard or click an option below.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {INTEREST_QUESTIONS[interestIdx]?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInterestChoice(opt.weights)}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720] hover:border-[#0A66C2]/60 hover:bg-blue-500/[0.02] dark:hover:bg-blue-500/[0.04] text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400 group-hover:bg-[#0A66C2] group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white font-medium">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center py-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    We found your ideal tracks!
                  </h2>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                    Based on your problem-solving preferences and technical interests:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                  {FIELDS.filter((f) => f.id === recommendedTracks.primary).map((field) => (
                    <div
                      key={field.id}
                      className="p-4 rounded-xl border-2 border-[#0A66C2] bg-blue-500/5 dark:bg-blue-500/10"
                    >
                      <span className="inline-block text-[11px] font-semibold text-[#0A66C2] uppercase tracking-wider mb-2">
                        Primary Track
                      </span>
                      <div className="flex items-center gap-2.5">
                        <FieldIcon fieldId={field.id} className="h-5 w-5 text-[#0A66C2]" />
                        <h3 className="font-semibold text-base">{field.name}</h3>
                      </div>
                      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {field.desc}
                      </p>
                    </div>
                  ))}

                  {recommendedTracks.secondary &&
                    FIELDS.filter((f) => f.id === recommendedTracks.secondary).map((field) => (
                      <div
                        key={field.id}
                        className="p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720]"
                      >
                        <span className="inline-block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                          Secondary Track
                        </span>
                        <div className="flex items-center gap-2.5">
                          <FieldIcon fieldId={field.id} className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                          <h3 className="font-semibold text-base">{field.name}</h3>
                        </div>
                        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                          {field.desc}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={applyRecommendedTracks}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white text-sm font-semibold shadow-sm transition-colors"
                  >
                    Accept & Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInInterestQuiz(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Select Manually
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* STANDARD 6-STEP ONBOARDING WIZARD                         */
          /* ========================================================= */
          <div className="space-y-8 animate-fade-in">
            {/* STEP 1: TRACK SELECTION */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Which track(s) do you want to master?
                  </h1>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Select up to 2 tracks (Primary and optional Secondary). Your personalized curriculum will be built around your primary focus.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {FIELDS.map((field) => {
                    const isPrimary = answers.primaryFieldId === field.id
                    const isSecondary = answers.secondaryFieldId === field.id

                    return (
                      <button
                        key={field.id}
                        type="button"
                        onClick={() => toggleTrack(field.id)}
                        className={`relative p-4 rounded-xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#0A66C2] ${isPrimary
                            ? 'border-[#0A66C2] bg-blue-500/[0.06] dark:bg-blue-500/[0.12] ring-1 ring-[#0A66C2]'
                            : isSecondary
                              ? 'border-neutral-400 dark:border-neutral-600 bg-neutral-100/70 dark:bg-[#1a1f2b]'
                              : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${isPrimary
                                  ? 'bg-[#0A66C2] text-white'
                                  : isSecondary
                                    ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                }`}
                            >
                              <FieldIcon fieldId={field.id} className="h-5 w-5" />
                            </div>
                            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                              {field.name}
                            </span>
                          </div>

                          {isPrimary && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A66C2] text-white tracking-wide uppercase">
                              Primary
                            </span>
                          )}
                          {isSecondary && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 tracking-wide uppercase">
                              Secondary
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                          {field.desc}
                        </p>
                      </button>
                    )
                  })}
                </div>

                {/* "Not sure" trigger */}
                <div className="p-4 rounded-xl border border-dashed border-black/15 dark:border-white/15 bg-white/50 dark:bg-[#131720]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-neutral-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Not sure which discipline fits your goals?
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Take our rapid 4-question interest quiz to get instant recommendations.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInInterestQuiz(true)
                      setInterestIdx(0)
                      setInterestScores({})
                      setRecommendedTracks(null)
                    }}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#0A66C2]" />
                    Help me choose
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EXPERIENCE LEVEL */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    What is your experience level in {FIELDS.find((f) => f.id === answers.primaryFieldId)?.name}?
                  </h1>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Be honest — this helps us calibrate your starting point and skip foundations you have already mastered.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      id: 'beginner',
                      title: 'Complete beginner',
                      desc: 'No prior background in this track. Start from absolute zero with guided foundational milestones.',
                      badge: 'Starts at Phase 1',
                    },
                    {
                      id: 'basics',
                      title: 'Know the basics',
                      desc: 'Understand core syntax and basic terminology, but have not built full production systems yet.',
                      badge: 'Quick review mode',
                    },
                    {
                      id: 'projects',
                      title: 'Have built projects',
                      desc: 'Have built personal applications, resolved practical bugs, and understand common workflows.',
                      badge: 'Tests out of foundations',
                    },
                    {
                      id: 'professional',
                      title: 'Working professional',
                      desc: 'Currently or previously working in tech. Looking for specialization, senior depth, and advanced paradigms.',
                      badge: 'Skips straight to advanced',
                    },
                  ].map((lvl, idx) => {
                    const isSelected = answers.level === lvl.id
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, level: lvl.id }))}
                        className={`group p-4 sm:p-5 rounded-xl border text-left transition-all flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] ${isSelected
                            ? 'border-[#0A66C2] bg-blue-500/[0.06] dark:bg-blue-500/[0.12] ring-1 ring-[#0A66C2]'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-md text-xs font-semibold ${isSelected
                              ? 'bg-[#0A66C2] text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
                              {lvl.title}
                            </span>
                            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                              {lvl.badge}
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                            {lvl.desc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: SKILL CHECK QUESTIONS */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0A66C2]">
                      Quick Skill Check
                    </span>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      Question {skillQuestionIdx + 1} of {currentSkillQuestions.length}
                    </span>
                  </div>

                  {currentSkillQuestions[skillQuestionIdx] && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {currentSkillQuestions[skillQuestionIdx].concept}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-500/10 text-[#0A66C2] capitalize">
                          {currentSkillQuestions[skillQuestionIdx].difficulty}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {currentSkillQuestions[skillQuestionIdx].question}
                      </h2>
                    </>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Use numbers 1–4 to pick, or select your answer below.
                  </p>
                </div>

                {currentSkillQuestions[skillQuestionIdx] && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentSkillQuestions[skillQuestionIdx].options.map((optionText, optIdx) => {
                      const currentQId = currentSkillQuestions[skillQuestionIdx].id
                      const isChosen = answers.skillAnswers[currentQId] === optIdx

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => selectSkillAnswer(currentQId, optIdx)}
                          className={`group flex items-start gap-4 p-4 rounded-xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#0A66C2] ${isChosen
                              ? 'border-[#0A66C2] bg-blue-500/[0.06] dark:bg-blue-500/[0.12] ring-1 ring-[#0A66C2]'
                              : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720] hover:border-black/20 dark:hover:border-white/20'
                            }`}
                        >
                          <span
                            className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-md text-xs font-semibold ${isChosen
                                ? 'bg-[#0A66C2] text-white'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-[#0A66C2] group-hover:text-white transition-colors'
                              }`}
                          >
                            {optIdx + 1}
                          </span>
                          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white">
                            {optionText}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: TIME COMMITMENT & TARGET TIMEFRAME */}
            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    How much time can you dedicate?
                  </h1>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    We calculate your exact calendar milestones and completion dates from these parameters.
                  </p>
                </div>

                {/* Sub-section: Weekly Hours */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Weekly Commitment
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: '3-5', label: '3–5 hours / week', desc: 'Casual (~30–45 mins daily)' },
                      { id: '6-10', label: '6–10 hours / week', desc: 'Balanced (~1–1.5 hrs daily)' },
                      { id: '11-20', label: '11–20 hours / week', desc: 'Sprint (~2–3 hrs daily)' },
                      { id: '20+', label: '20+ hours / week', desc: 'Full-time immersion' },
                    ].map((item) => {
                      const isSelected = answers.hoursPerWeek === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, hoursPerWeek: item.id }))}
                          className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${isSelected
                              ? 'border-[#0A66C2] bg-blue-500/[0.06] dark:bg-blue-500/[0.12] ring-1 ring-[#0A66C2]'
                              : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720] hover:border-black/20 dark:hover:border-white/20'
                            }`}
                        >
                          <div>
                            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 block">
                              {item.label}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {item.desc}
                            </span>
                          </div>
                          <Clock className={`h-4 w-4 ${isSelected ? 'text-[#0A66C2]' : 'text-neutral-400'}`} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sub-section: Target Timeframe */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Target Completion Horizon
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: '3m', label: '3 months', sub: 'Aggressive' },
                      { id: '6m', label: '6 months', sub: 'Recommended' },
                      { id: '12m', label: '12 months', sub: 'Comprehensive' },
                      { id: 'flexible', label: 'Flexible', sub: 'Self-paced' },
                    ].map((item) => {
                      const isSelected = answers.targetTimeframe === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, targetTimeframe: item.id }))}
                          className={`p-4 rounded-xl border text-center transition-all ${isSelected
                              ? 'border-[#0A66C2] bg-blue-500/[0.06] dark:bg-blue-500/[0.12] ring-1 ring-[#0A66C2]'
                              : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720] hover:border-black/20 dark:hover:border-white/20'
                            }`}
                        >
                          <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 block">
                            {item.label}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {item.sub}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: LEARNING STYLE */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    How do you absorb technical material best?
                  </h1>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    We sort and prioritize documentation, interactive sandboxes, and video deep-dives based on your preference.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      id: 'videos',
                      icon: Video,
                      title: 'Video-First Learner',
                      desc: 'Prefer curated video lectures, visual walkthroughs, and YouTube deep-dives sorted to the top of each phase.',
                    },
                    {
                      id: 'docs',
                      icon: BookOpen,
                      title: 'Documentation & Reading',
                      desc: 'Prefer official specs, interactive tutorials, architecture docs, and technical articles prioritized first.',
                    },
                    {
                      id: 'mixed',
                      icon: Layers,
                      title: 'Balanced / Mixed',
                      desc: 'A healthy equilibrium between visual tutorials and foundational documentation as originally authored.',
                    },
                  ].map((style, idx) => {
                    const isSelected = answers.learningStyle === style.id
                    const IconComp = style.icon
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, learningStyle: style.id }))}
                        className={`group p-4 sm:p-5 rounded-xl border text-left transition-all flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] ${isSelected
                            ? 'border-[#0A66C2] bg-blue-500/[0.06] dark:bg-blue-500/[0.12] ring-1 ring-[#0A66C2]'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 p-2.5 rounded-lg ${isSelected
                              ? 'bg-[#0A66C2] text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                        >
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-base text-neutral-900 dark:text-neutral-100 block">
                            {idx + 1}. {style.title}
                          </span>
                          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                            {style.desc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: MOTIVATION & GOAL */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    What is your primary motivation?
                  </h1>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    This personalizes study tips, interview preparation milestones, and project emphasis across your path.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'career',
                      icon: Target,
                      title: 'Career Switch',
                      desc: 'Transitioning from non-tech into software engineering.',
                    },
                    {
                      id: 'first-job',
                      icon: Award,
                      title: 'First Tech Role / Internship',
                      desc: 'Breaking into junior roles with standout portfolio artifacts.',
                    },
                    {
                      id: 'upgrade',
                      icon: Zap,
                      title: 'Skill Upgrade & Seniority',
                      desc: 'Modernizing stack knowledge and eliminating blind spots.',
                    },
                    {
                      id: 'academic',
                      icon: BookOpen,
                      title: 'Academic / Capstone',
                      desc: 'Excelling in university courses or research projects.',
                    },
                    {
                      id: 'curiosity',
                      icon: Sparkles,
                      title: 'Curiosity & Fun',
                      desc: 'Tinkering with cutting-edge tools at your own leisure.',
                    },
                  ].map((mot, idx) => {
                    const isSelected = answers.motivation === mot.id
                    const IconComp = mot.icon
                    return (
                      <button
                        key={mot.id}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, motivation: mot.id }))}
                        className={`group p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] ${isSelected
                            ? 'border-[#0A66C2] bg-blue-500/[0.06] dark:bg-blue-500/[0.12] ring-1 ring-[#0A66C2]'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#131720] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 p-2 rounded-lg ${isSelected
                              ? 'bg-[#0A66C2] text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                        >
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 block">
                            {idx + 1}. {mot.title}
                          </span>
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {mot.desc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Bottom Stepper Actions */}
            <div className="pt-8 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 hidden sm:inline">
                  Press Enter ↵
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  {step === 6 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Forge My Path
                    </>
                  ) : step === 3 && skillQuestionIdx < currentSkillQuestions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
