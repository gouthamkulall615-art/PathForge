import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  HelpCircle,
  Clock,
  Calendar,
  BookOpen,
  Video,
  Layers,
  Award,
  Zap,
  Target,
  RotateCcw,
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 border border-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center mb-6">
          <Compass className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
          Calibrating personalized path
        </h2>
        <p className="mt-2 text-xs font-mono text-[#6b7487] dark:text-[#7a8296] max-w-sm h-5">
          {forgingPhaseText}
        </p>

        <div className="mt-6 w-56 h-1 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
          <div className="h-full bg-[#0A66C2] rounded-full transition-all duration-300 w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-[#0b0d14] text-[#111827] dark:text-[#eef0f5] transition-colors duration-150">
      {/* Quiz Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-black/[0.08] dark:border-white/[0.08] bg-[#f5f7fa]/90 dark:bg-[#0b0d14]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 text-[#0A66C2]">
              <Compass className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="font-semibold tracking-tight text-sm text-[#111827] dark:text-[#eef0f5]">
              PathForge Assessment
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296] hidden sm:inline tabular-nums">
              Step {step} of 6
            </span>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-xs font-medium text-[#6b7487] hover:text-[#111827] dark:text-[#7a8296] dark:hover:text-[#eef0f5] transition-colors px-2.5 py-1 rounded-md"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>

        {/* Thin progress bar */}
        <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-0.5">
          <div
            className="bg-[#0A66C2] h-full transition-[width] duration-300 ease-out"
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
          <div className="space-y-6">
            {!recommendedTracks ? (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#0A66C2]/10 text-[#0A66C2] mb-3 border border-[#0A66C2]/20">
                    Track discovery ({interestIdx + 1}/4)
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                    {INTEREST_QUESTIONS[interestIdx]?.prompt}
                  </h2>
                  <p className="mt-1.5 text-xs text-[#6b7487] dark:text-[#7a8296] font-mono">
                    Press 1–4 on your keyboard or select below.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {INTEREST_QUESTIONS[interestIdx]?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInterestChoice(opt.weights)}
                      className="group flex items-start gap-3.5 p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-black/20 dark:hover:border-white/20 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-md bg-black/[0.04] dark:bg-[#1a1e28] text-xs font-mono font-medium text-[#6b7487] dark:text-[#7a8296] group-hover:bg-[#0A66C2] group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-[#111827] dark:text-[#eef0f5] font-medium leading-relaxed">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center py-6">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto">
                  <Check className="h-5 w-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                    Recommended career tracks
                  </h2>
                  <p className="mt-1.5 text-xs text-[#6b7487] dark:text-[#7a8296] max-w-md mx-auto">
                    Matched from your engineering preferences and technical interests.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                  {FIELDS.filter((f) => f.id === recommendedTracks.primary).map((field) => (
                    <div
                      key={field.id}
                      className="p-4 rounded-xl border border-[#0A66C2] bg-black/[0.02] dark:bg-[#1a1e28]"
                    >
                      <span className="inline-block text-[11px] font-mono font-medium text-[#0A66C2] uppercase tracking-wider mb-2">
                        Primary Track
                      </span>
                      <div className="flex items-center gap-2.5">
                        <FieldIcon fieldId={field.id} className="h-5 w-5 text-[#0A66C2]" />
                        <h3 className="font-medium text-base text-[#111827] dark:text-[#eef0f5]">{field.name}</h3>
                      </div>
                      <p className="mt-2 text-xs text-[#6b7487] dark:text-[#7a8296] line-clamp-2">
                        {field.desc}
                      </p>
                    </div>
                  ))}

                  {recommendedTracks.secondary &&
                    FIELDS.filter((f) => f.id === recommendedTracks.secondary).map((field) => (
                      <div
                        key={field.id}
                        className="p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c]"
                      >
                        <span className="inline-block text-[11px] font-mono font-medium text-[#6b7487] dark:text-[#7a8296] uppercase tracking-wider mb-2">
                          Secondary Track
                        </span>
                        <div className="flex items-center gap-2.5">
                          <FieldIcon fieldId={field.id} className="h-5 w-5 text-[#6b7487] dark:text-[#7a8296]" />
                          <h3 className="font-medium text-base text-[#111827] dark:text-[#eef0f5]">{field.name}</h3>
                        </div>
                        <p className="mt-2 text-xs text-[#6b7487] dark:text-[#7a8296] line-clamp-2">
                          {field.desc}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={applyRecommendedTracks}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-medium transition-colors"
                  >
                    Accept tracks
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInInterestQuiz(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs font-medium text-[#4b5565] dark:text-[#a3a9b8] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    Select manually
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* STANDARD 6-STEP ONBOARDING WIZARD                         */
          /* ========================================================= */
          <div className="space-y-8">
            {/* STEP 1: TRACK SELECTION */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                    Select career track
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8]">
                    Choose up to 2 tracks (Primary and optional Secondary). Your personalized roadmap is calibrated around your primary track.
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
                        className={`relative p-4 rounded-xl border text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
                          isPrimary
                            ? 'border-[#0A66C2] bg-black/[0.02] dark:bg-[#1a1e28]'
                            : isSecondary
                            ? 'border-black/20 dark:border-white/20 bg-black/[0.01] dark:bg-[#141822]'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-black/20 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`p-2 rounded-lg ${
                                isPrimary
                                  ? 'bg-[#0A66C2] text-white'
                                  : isSecondary
                                  ? 'bg-black/[0.06] dark:bg-[#1a1e28] text-[#111827] dark:text-[#eef0f5]'
                                  : 'bg-black/[0.04] dark:bg-[#1a1e28] text-[#6b7487] dark:text-[#7a8296]'
                              }`}
                            >
                              <FieldIcon fieldId={field.id} className="h-4.5 w-4.5" />
                            </div>
                            <span className="font-medium text-sm text-[#111827] dark:text-[#eef0f5]">
                              {field.name}
                            </span>
                          </div>

                          {isPrimary && (
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-[#0A66C2] text-white uppercase tracking-wider">
                              Primary
                            </span>
                          )}
                          {isSecondary && (
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-black/[0.06] dark:bg-[#1a1e28] text-[#4b5565] dark:text-[#a3a9b8] uppercase tracking-wider">
                              Secondary
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-[#4b5565] dark:text-[#a3a9b8] line-clamp-2 leading-relaxed">
                          {field.desc}
                        </p>
                      </button>
                    )
                  })}
                </div>

                {/* "Not sure" trigger */}
                <div className="p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-[#6b7487] dark:text-[#7a8296] flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-semibold text-[#111827] dark:text-[#eef0f5]">
                        Not sure which track fits your career goals?
                      </p>
                      <p className="text-[11px] text-[#6b7487] dark:text-[#7a8296]">
                        Answer 4 quick problem-solving questions to calculate your optimal match.
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
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-xs font-medium text-[#111827] dark:text-[#eef0f5] transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5 text-[#0A66C2]" strokeWidth={1.5} />
                    Help me choose
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EXPERIENCE LEVEL */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                    Current experience in {FIELDS.find((f) => f.id === answers.primaryFieldId)?.name}
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8]">
                    This calibrates your roadmap starting point and tests out of foundations you already know.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
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
                        className={`group p-4 sm:p-5 rounded-xl border text-left transition-colors duration-150 flex items-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
                          isSelected
                            ? 'border-[#0A66C2] bg-black/[0.02] dark:bg-[#1a1e28]'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-black/20 dark:hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-md font-mono text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#0A66C2] text-white'
                              : 'bg-black/[0.04] dark:bg-[#1a1e28] text-[#6b7487] dark:text-[#7a8296]'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-base text-[#111827] dark:text-[#eef0f5]">
                              {lvl.title}
                            </span>
                            <span className="text-[11px] font-mono text-[#6b7487] dark:text-[#7a8296]">
                              {lvl.badge}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
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
                    <span className="text-xs font-mono font-medium text-[#0A66C2] uppercase tracking-wider">
                      Quick Skill Check
                    </span>
                    <span className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296] tabular-nums">
                      Question {skillQuestionIdx + 1} of {currentSkillQuestions.length}
                    </span>
                  </div>

                  {currentSkillQuestions[skillQuestionIdx] && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-[#1a1e28] text-[#4b5565] dark:text-[#a3a9b8] border border-black/[0.04] dark:border-white/[0.04]">
                          {currentSkillQuestions[skillQuestionIdx].concept}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#0A66C2]/10 text-[#0A66C2] capitalize border border-[#0A66C2]/20">
                          {currentSkillQuestions[skillQuestionIdx].difficulty}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                        {currentSkillQuestions[skillQuestionIdx].question}
                      </h2>
                    </>
                  )}
                  <p className="mt-1.5 text-xs font-mono text-[#6b7487] dark:text-[#7a8296]">
                    Press 1–4 on your keyboard or select your answer below.
                  </p>
                </div>

                {currentSkillQuestions[skillQuestionIdx] && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentSkillQuestions[skillQuestionIdx].options.map((optionText, optIdx) => {
                      const currentQId = currentSkillQuestions[skillQuestionIdx].id
                      const isChosen = answers.skillAnswers[currentQId] === optIdx

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => selectSkillAnswer(currentQId, optIdx)}
                          className={`group flex items-start gap-3.5 p-4 rounded-xl border text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
                            isChosen
                              ? 'border-[#0A66C2] bg-black/[0.02] dark:bg-[#1a1e28]'
                              : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-md font-mono text-xs font-medium transition-colors ${
                              isChosen
                                ? 'bg-[#0A66C2] text-white'
                                : 'bg-black/[0.04] dark:bg-[#1a1e28] text-[#6b7487] dark:text-[#7a8296] group-hover:bg-[#0A66C2] group-hover:text-white'
                            }`}
                          >
                            {optIdx + 1}
                          </span>
                          <span className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] leading-relaxed">
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
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                    Time dedication
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8]">
                    We calculate exact calendar milestones and target completion dates from these parameters.
                  </p>
                </div>

                {/* Sub-section: Weekly Hours */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-medium uppercase tracking-wider text-[#6b7487] dark:text-[#7a8296]">
                    Weekly commitment
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
                          className={`p-4 rounded-xl border text-left transition-colors duration-150 flex items-center justify-between ${
                            isSelected
                              ? 'border-[#0A66C2] bg-black/[0.02] dark:bg-[#1a1e28]'
                              : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                        >
                          <div>
                            <span className="font-medium text-sm text-[#111827] dark:text-[#eef0f5] block">
                              {item.label}
                            </span>
                            <span className="text-xs text-[#6b7487] dark:text-[#7a8296]">
                              {item.desc}
                            </span>
                          </div>
                          <Clock className={`h-4 w-4 ${isSelected ? 'text-[#0A66C2]' : 'text-[#6b7487] dark:text-[#7a8296]'}`} strokeWidth={1.5} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sub-section: Target Timeframe */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-medium uppercase tracking-wider text-[#6b7487] dark:text-[#7a8296]">
                    Target completion horizon
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: '3m', label: '3 months', sub: 'Aggressive' },
                      { id: '6m', label: '6 months', sub: 'Balanced' },
                      { id: '12m', label: '12 months', sub: 'Comprehensive' },
                      { id: 'flexible', label: 'Flexible', sub: 'Self-paced' },
                    ].map((item) => {
                      const isSelected = answers.targetTimeframe === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, targetTimeframe: item.id }))}
                          className={`p-4 rounded-xl border text-center transition-colors duration-150 ${
                            isSelected
                              ? 'border-[#0A66C2] bg-black/[0.02] dark:bg-[#1a1e28]'
                              : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-black/20 dark:hover:border-white/20'
                          }`}
                        >
                          <span className="font-medium text-sm text-[#111827] dark:text-[#eef0f5] block">
                            {item.label}
                          </span>
                          <span className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296]">
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
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                    Learning format preference
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8]">
                    We sort documentation, interactive specs, and video deep-dives based on your preference.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    {
                      id: 'videos',
                      icon: Video,
                      title: 'Video-First Learner',
                      desc: 'Curated video lectures, visual walkthroughs, and YouTube deep-dives sorted to the top of each phase.',
                    },
                    {
                      id: 'docs',
                      icon: BookOpen,
                      title: 'Documentation & Reading',
                      desc: 'Official specifications, interactive sandboxes, architecture docs, and technical articles prioritized first.',
                    },
                    {
                      id: 'mixed',
                      icon: Layers,
                      title: 'Balanced / Mixed',
                      desc: 'Equilibrium between video tutorials and technical documentation as originally authored.',
                    },
                  ].map((style, idx) => {
                    const isSelected = answers.learningStyle === style.id
                    const IconComp = style.icon
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, learningStyle: style.id }))}
                        className={`group p-4 sm:p-5 rounded-xl border text-left transition-colors duration-150 flex items-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
                          isSelected
                            ? 'border-[#0A66C2] bg-black/[0.02] dark:bg-[#1a1e28]'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-black/20 dark:hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 p-2.5 rounded-lg ${
                            isSelected
                              ? 'bg-[#0A66C2] text-white'
                              : 'bg-black/[0.04] dark:bg-[#1a1e28] text-[#6b7487] dark:text-[#7a8296]'
                          }`}
                        >
                          <IconComp className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-base text-[#111827] dark:text-[#eef0f5] block">
                            {idx + 1}. {style.title}
                          </span>
                          <p className="mt-1 text-xs text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed">
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
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                    Primary objective
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#4b5565] dark:text-[#a3a9b8]">
                    This personalizes study tips, interview preparation milestones, and project emphasis across your path.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                      icon: Compass,
                      title: 'Curiosity & Exploration',
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
                        className={`group p-4 rounded-xl border text-left transition-colors duration-150 flex items-start gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] ${
                          isSelected
                            ? 'border-[#0A66C2] bg-black/[0.02] dark:bg-[#1a1e28]'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-black/20 dark:hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 p-2 rounded-lg ${
                            isSelected
                              ? 'bg-[#0A66C2] text-white'
                              : 'bg-black/[0.04] dark:bg-[#1a1e28] text-[#6b7487] dark:text-[#7a8296]'
                          }`}
                        >
                          <IconComp className="h-4 w-4" strokeWidth={1.5} />
                        </div>
                        <div>
                          <span className="font-medium text-sm text-[#111827] dark:text-[#eef0f5] block">
                            {idx + 1}. {mot.title}
                          </span>
                          <p className="mt-1 text-xs text-[#4b5565] dark:text-[#a3a9b8]">
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
            <div className="pt-6 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs font-medium text-[#4b5565] dark:text-[#a3a9b8] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                Back
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#6b7487] dark:text-[#7a8296] hidden sm:inline">
                  Press Enter ↵
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-medium shadow-sm transition-colors"
                >
                  {step === 6 ? (
                    <>
                      Create personalized path
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </>
                  ) : step === 3 && skillQuestionIdx < currentSkillQuestions.length - 1 ? (
                    <>
                      Next question
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </>
                  ) : (
                    <>
                      Next step
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
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
