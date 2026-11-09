import { parseDuration } from './parseDuration.js'
import { QUIZ_BANK } from '../data/quizBank.js'

/**
 * Curated stretch and specialization topics for advanced learners
 * who demonstrate high proficiency in their primary track.
 */
const STRETCH_TOPICS_BY_FIELD = {
  frontend: [
    { name: 'WebAssembly (WASM) & Rust in the browser', detail: 'Compiling high-performance algorithms to WASM and executing via JS interop' },
    { name: 'Micro-frontends & Module Federation', detail: 'Decentralized frontend architecture and runtime module sharing with Webpack 5' },
    { name: 'AST transforms & Babel / SWC plugins', detail: 'Parsing code to Abstract Syntax Trees and writing custom compiler optimizations' },
    { name: 'Web Workers & OffscreenCanvas', detail: 'Multi-threaded client computing for heavy data manipulation and 60fps rendering' },
  ],
  backend: [
    { name: 'Event Sourcing & CQRS architecture', detail: 'Separating read and write models with append-only event logs using Kafka' },
    { name: 'Raft consensus & distributed locks', detail: 'Leader election, quorum consistency, and distributed coordination with etcd/Redis' },
    { name: 'Zero-copy I/O & kernel bypass', detail: 'Optimizing high-throughput network daemons with epoll and memory-mapped files' },
    { name: 'High-performance gRPC streaming', detail: 'Bidirectional binary streaming protocols with Protocol Buffers' },
  ],
  ml: [
    { name: 'Quantization & TensorRT model serving', detail: 'INT8/FP16 quantization, vLLM inference engines, and low-latency deployment' },
    { name: 'LoRA & PEFT fine-tuning', detail: 'Parameter-efficient fine-tuning for large language and vision foundation models' },
    { name: 'Distributed training across GPUs', detail: 'DataParallel, DeepSpeed ZeRO, and FSDP distributed gradients across nodes' },
  ],
  devops: [
    { name: 'eBPF kernel observability', detail: 'Writing non-intrusive Linux kernel probes for deep network tracing and security' },
    { name: 'GitOps with ArgoCD & Progressive Delivery', detail: 'Automated blue-green and canary rollouts driven entirely by Git commits' },
    { name: 'Service Mesh internals (Istio / Cilium)', detail: 'mTLS encryption, L7 traffic routing, and decentralized service discovery' },
  ],
  cyber: [
    { name: 'Advanced Binary Exploitation & ROP', detail: 'Return-Oriented Programming chains, ASLR bypass, and heap manipulation' },
    { name: 'Kernel Rootkit Analysis & Detection', detail: 'Hooking syscall tables, kernel memory forensics, and Volatility profiling' },
    { name: 'Zero-Trust Architecture Implementation', detail: 'Continuous behavioral authentication and microsegmentation policies' },
  ],
  uxdesign: [
    { name: 'Design Systems engineering & tokens', detail: 'Multi-brand design tokens synced automatically between Figma and codebases' },
    { name: 'Micro-interaction physics & Framer Motion', detail: 'Spring physics, spatial gesture modeling, and delightful tactile feedback' },
    { name: 'Cognitive load analysis & eye-tracking', detail: 'Quantitative heuristic auditing through gaze tracking and heatmaps' },
  ],
  datascience: [
    { name: 'Streaming data pipelines with Apache Flink', detail: 'Real-time stateful event stream processing with exactly-once guarantees' },
    { name: 'Vector databases & hybrid retrieval', detail: 'Approximate nearest neighbor search with HNSW indexing and semantic reranking' },
    { name: 'Causal Inference & Synthetic Controls', detail: 'Estimating causal treatment effects beyond standard correlation in messy data' },
  ],
  mobile: [
    { name: 'JNI & C++ native modules', detail: 'Bridging native platform libraries for hardware acceleration and crypto' },
    { name: 'Offline-first sync engines (WatermelonDB / CRDTs)', detail: 'Conflict-free replicated data types for collaborative offline editing' },
    { name: 'Metal / Vulkan shader rendering', detail: 'Low-level GPU pipelines on iOS and Android for custom visual effects' },
  ],
  cloud: [
    { name: 'Multi-region active-active databases', detail: 'Spanner / DynamoDB global tables with conflict resolution strategies' },
    { name: 'Zero-downtime database migrations', detail: 'Dual-write patterns, shadow tables, and rolling schema transformations' },
    { name: 'FinOps cost telemetry & spot automation', detail: 'Programmatic resource reclamation and predictive spot instance arbitrage' },
  ],
  blockchain: [
    { name: 'Zero-Knowledge Proofs (ZK-SNARKs / Circom)', detail: 'Writing and proving cryptographic circuits for privacy and rollup scaling' },
    { name: 'MEV extraction & searcher bot design', detail: 'Flashbots bundles, mempool arbitrage, and transaction ordering optimization' },
    { name: 'EVM bytecode reversing & gas optimization', detail: 'Assembly (Yul), stack manipulation, and gas refund mechanics' },
  ],
}

const MOTIVATION_COPY = {
  career: {
    badge: 'Career Switch',
    tip: 'Focused on high-leverage production patterns, portfolio artifacts, and interview-ready architecture.',
  },
  'first-job': {
    badge: 'First Tech Role',
    tip: 'Structured to get you building resume-ready capstone projects and passing technical entry screenings.',
  },
  upgrade: {
    badge: 'Skill Upgrade',
    tip: 'Targeted to bridge modern best practices, eliminate knowledge blindspots, and unlock senior-level depth.',
  },
  academic: {
    badge: 'Academic / Research',
    tip: 'Balances rigorous conceptual fundamentals with hands-on labs suitable for capstone projects.',
  },
  curiosity: {
    badge: 'Self-Directed Exploration',
    tip: 'Optimized for fun, hands-on experiments and rapid discovery across milestones.',
  },
}

/**
 * Normalizes user-reported weekly hours into a numeric baseline.
 */
export function normalizeHoursPerWeek(hours) {
  if (typeof hours === 'number' && !isNaN(hours) && hours > 0) return hours
  if (typeof hours === 'string') {
    if (hours.includes('3-5') || hours === '4') return 4
    if (hours.includes('6-10') || hours === '8') return 8
    if (hours.includes('11-20') || hours === '15') return 15
    if (hours.includes('20+') || hours === '25') return 25
    const parsed = parseInt(hours, 10)
    if (!isNaN(parsed) && parsed > 0) return parsed
  }
  return 8 // standard default
}

/**
 * Converts target timeframe selection to total available weeks.
 */
export function parseTargetWeeks(timeframe) {
  if (timeframe === '3m' || timeframe === 3) return 13 // ~3 months
  if (timeframe === '6m' || timeframe === 6) return 26 // ~6 months
  if (timeframe === '12m' || timeframe === 12) return 52 // ~1 year
  return Infinity // 'flexible'
}

/**
 * Pure helper to advance a date by a given number of days.
 */
function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/**
 * Generates a deterministic, personalized learning roadmap from quiz responses.
 *
 * @param {Object} answers - User quiz answers
 * @param {string} answers.primaryFieldId - ID of primary track (e.g. 'frontend')
 * @param {string} [answers.secondaryFieldId] - Optional secondary track ID
 * @param {'beginner'|'basics'|'projects'|'professional'} answers.level - Self-reported experience
 * @param {Record<string, number>} [answers.skillAnswers] - Map of question ID to chosen option index
 * @param {number|string} [answers.hoursPerWeek] - Weekly commitment
 * @param {'3m'|'6m'|'12m'|'flexible'} [answers.targetTimeframe] - Goal timeframe
 * @param {'videos'|'docs'|'mixed'} [answers.learningStyle] - Resource format preference
 * @param {'career'|'first-job'|'upgrade'|'academic'|'curiosity'} [answers.motivation]
 * @param {string} [answers.startDate] - ISO date string (defaults to today)
 * @param {Array} fields - Complete FIELDS array from fields.js
 *
 * @returns {Object} Personalized roadmap
 */
export function generateRoadmap(answers = {}, fields = []) {
  const primaryFieldId = answers.primaryFieldId || 'frontend'
  const secondaryFieldId = answers.secondaryFieldId || null
  const level = answers.level || 'beginner'
  const skillAnswers = answers.skillAnswers || {}
  const userHoursPerWeek = normalizeHoursPerWeek(answers.hoursPerWeek)
  const targetTimeframe = answers.targetTimeframe || '6m'
  const targetWeeks = parseTargetWeeks(targetTimeframe)
  const learningStyle = answers.learningStyle || 'mixed'
  const motivation = answers.motivation || 'career'
  const startDate = answers.startDate || new Date().toISOString().slice(0, 10)

  const primaryField = fields.find((f) => f.id === primaryFieldId) || fields[0] || { id: primaryFieldId, phases: [] }
  const secondaryField = secondaryFieldId ? fields.find((f) => f.id === secondaryFieldId) : null

  // 1. Evaluate skill check performance for primary field
  const questionsForPrimary = QUIZ_BANK[primaryFieldId] || []
  let totalQuestionsAnswered = 0
  let totalCorrect = 0

  // Map phase ID -> { total: number, correct: number }
  const phaseScores = {}
  questionsForPrimary.forEach((q) => {
    if (!phaseScores[q.phaseId]) {
      phaseScores[q.phaseId] = { total: 0, correct: 0 }
    }
    phaseScores[q.phaseId].total += 1

    const selectedOption = skillAnswers[q.id]
    if (selectedOption !== undefined) {
      totalQuestionsAnswered += 1
      if (selectedOption === q.correctIndex) {
        phaseScores[q.phaseId].correct += 1
        totalCorrect += 1
      }
    }
  })

  const isHighProficiency =
    level === 'professional' ||
    (totalQuestionsAnswered >= 4 && totalCorrect >= 4) ||
    (level === 'projects' && totalCorrect >= 3)

  // 2. Process primary field phases
  const processedPhases = []
  let calendarCursor = startDate

  primaryField.phases.forEach((phase, index) => {
    const isPhaseOne = index === 0
    const durationInfo = parseDuration(phase.duration)
    const baseHours = durationInfo.baseHours

    // Determine status
    let status = 'learn'
    const score = phaseScores[phase.id]

    if (level === 'beginner') {
      // Rule: Never skip phase 1 for complete beginners
      status = 'learn'
    } else if (score && score.total > 0) {
      if (score.correct === score.total) {
        // Mastered all questions for this phase
        if (isPhaseOne && level === 'beginner') {
          status = 'learn'
        } else {
          status = 'mastered'
        }
      } else if (score.correct > 0) {
        // Partially correct
        status = 'review'
      } else {
        // None correct
        status = 'learn'
      }
    } else {
      // Phase without specific test questions
      if (level === 'professional' && index < 2) {
        status = 'mastered'
      } else if (level === 'professional') {
        status = 'review'
      } else if (level === 'projects' && index === 0) {
        status = 'review'
      } else {
        status = 'learn'
      }
    }

    // Calculate hours & calendar weeks based on status
    let estimatedHours = 0
    let calendarWeeks = 0
    let phaseStart = null
    let phaseFinish = null

    if (status === 'mastered') {
      estimatedHours = 0
      calendarWeeks = 0
      // Mastered phases are already achieved; no active calendar block
    } else if (status === 'review') {
      estimatedHours = Math.max(4, Math.round(baseHours * 0.5))
      calendarWeeks = Math.max(1, Math.ceil(estimatedHours / userHoursPerWeek))
      phaseStart = calendarCursor
      phaseFinish = addDays(calendarCursor, calendarWeeks * 7)
      calendarCursor = phaseFinish
    } else {
      // 'learn'
      estimatedHours = baseHours
      calendarWeeks = Math.max(1, Math.ceil(estimatedHours / userHoursPerWeek))
      phaseStart = calendarCursor
      phaseFinish = addDays(calendarCursor, calendarWeeks * 7)
      calendarCursor = phaseFinish
    }

    // Sort resources according to learningStyle preference
    const sortedResources = [...(phase.resources || [])].sort((a, b) => {
      if (learningStyle === 'videos') {
        if (a.type === 'yt' && b.type !== 'yt') return -1
        if (a.type !== 'yt' && b.type === 'yt') return 1
      } else if (learningStyle === 'docs') {
        if (a.type === 'docs' && b.type !== 'docs') return -1
        if (a.type !== 'docs' && b.type === 'docs') return 1
      }
      return 0
    })

    // Attach stretch topics to the final two phases if high proficiency
    let stretchTopics = []
    const isLatePhase = index >= Math.max(1, primaryField.phases.length - 2)
    if (isHighProficiency && isLatePhase) {
      stretchTopics = STRETCH_TOPICS_BY_FIELD[primaryFieldId] || []
    }

    processedPhases.push({
      fieldId: primaryField.id,
      fieldName: primaryField.name,
      phaseId: phase.id,
      name: phase.name,
      label: phase.label,
      level: phase.level,
      desc: phase.desc,
      duration: phase.duration,
      status,
      estimatedHours,
      calendarWeeks,
      startDate: phaseStart,
      finishDate: phaseFinish,
      topics: phase.topics || [],
      resources: sortedResources,
      stretchTopics,
    })
  })

  // 3. Process secondary track if selected
  if (secondaryField && secondaryField.id !== primaryFieldId) {
    // Append the first 1-2 foundational phases of the secondary track
    const secondaryPhasesToInclude = (secondaryField.phases || []).slice(0, 2)

    secondaryPhasesToInclude.forEach((phase) => {
      const durationInfo = parseDuration(phase.duration)
      const baseHours = durationInfo.baseHours
      const status = 'learn'
      const estimatedHours = baseHours
      const calendarWeeks = Math.max(1, Math.ceil(estimatedHours / userHoursPerWeek))
      const phaseStart = calendarCursor
      const phaseFinish = addDays(calendarCursor, calendarWeeks * 7)
      calendarCursor = phaseFinish

      const sortedResources = [...(phase.resources || [])].sort((a, b) => {
        if (learningStyle === 'videos') {
          if (a.type === 'yt' && b.type !== 'yt') return -1
          if (a.type !== 'yt' && b.type === 'yt') return 1
        } else if (learningStyle === 'docs') {
          if (a.type === 'docs' && b.type !== 'docs') return -1
          if (a.type !== 'docs' && b.type === 'docs') return 1
        }
        return 0
      })

      processedPhases.push({
        fieldId: secondaryField.id,
        fieldName: secondaryField.name,
        phaseId: phase.id,
        name: phase.name,
        label: `${secondaryField.name} – ${phase.label}`,
        level: phase.level,
        desc: phase.desc,
        duration: phase.duration,
        status,
        estimatedHours,
        calendarWeeks,
        startDate: phaseStart,
        finishDate: phaseFinish,
        topics: phase.topics || [],
        resources: sortedResources,
        stretchTopics: [],
        isSecondary: true,
      })
    })
  }

  // 4. Totals and Projected Completion
  const totalEstimatedHours = processedPhases.reduce((acc, p) => acc + p.estimatedHours, 0)
  const totalCalendarWeeks = processedPhases.reduce((acc, p) => acc + p.calendarWeeks, 0)
  const projectedFinishDate = addDays(startDate, totalCalendarWeeks * 7)

  // 5. Compare with target timeframe
  const fitsTimeframe = totalCalendarWeeks <= targetWeeks
  let warning = null
  const suggestions = []

  if (!fitsTimeframe && targetWeeks !== Infinity) {
    const timeframeLabels = {
      '3m': '3 months (13 weeks)',
      '6m': '6 months (26 weeks)',
      '12m': '12 months (52 weeks)',
    }
    const targetLabel = timeframeLabels[targetTimeframe] || `${targetWeeks} weeks`
    warning = `Your estimated curriculum spans ${totalCalendarWeeks} weeks, which exceeds your target of ${targetLabel}.`

    const neededHours = Math.ceil(totalEstimatedHours / targetWeeks)
    suggestions.push(`Increase study commitment to ~${neededHours} hours/week to finish within ${targetLabel}.`)

    if (secondaryField) {
      suggestions.push(`Defer the secondary track (${secondaryField.name}) to focus 100% on ${primaryField.name} first.`)
    }

    const reviewPhases = processedPhases.filter((p) => p.status === 'review')
    if (reviewPhases.length > 0) {
      const reviewHours = reviewPhases.reduce((acc, p) => acc + p.estimatedHours, 0)
      suggestions.push(`Test out or fast-track your ${reviewPhases.length} review phase(s) to shave off ~${reviewHours} hours.`)
    }
  }

  // Find first actionable phase ("Start here")
  const startHerePhaseId = (processedPhases.find((p) => p.status !== 'mastered') || processedPhases[0])?.phaseId

  const motivationInfo = MOTIVATION_COPY[motivation] || MOTIVATION_COPY.career

  return {
    primaryFieldId,
    primaryFieldName: primaryField.name,
    secondaryFieldId,
    secondaryFieldName: secondaryField?.name || null,
    profileSummary: {
      level,
      hoursPerWeek: userHoursPerWeek,
      targetTimeframe,
      learningStyle,
      motivation,
      motivationBadge: motivationInfo.badge,
      motivationTip: motivationInfo.tip,
    },
    phases: processedPhases,
    startHerePhaseId,
    totalEstimatedHours,
    totalCalendarWeeks,
    startDate,
    projectedFinishDate,
    fitsTimeframe,
    warning,
    suggestions,
    scoreSummary: {
      totalAnswered: totalQuestionsAnswered,
      totalCorrect,
      isHighProficiency,
    },
  }
}
