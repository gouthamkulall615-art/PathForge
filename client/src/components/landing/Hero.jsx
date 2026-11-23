import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import DotGrid from '../reactbits/DotGrid'
import Magnet from '../reactbits/Magnet'
import SplitText from '../reactbits/SplitText'
import { ArrowRight, GitBranch } from 'lucide-react'
import { FIELDS } from '../../data/fields'

const _m = motion

gsap.registerPlugin(ScrollTrigger)

/**
 * Interactive SVG Forge Map preview based on Full Stack track
 * Shows 3 phase hubs + branching topic nodes with cubic-bezier curves.
 * Includes desktop (horizontal) and mobile (vertical) topological layout.
 */
function ForgeMapVisual() {
  return (
    <div className="w-full select-none">
      {/* Desktop Map (horizontal trunk) */}
      <svg
        viewBox="0 0 680 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden md:block w-full max-w-[680px] mx-auto overflow-visible"
        aria-hidden="true"
      >
        {/* Rail background lines */}
        <line x1="40" y1="130" x2="640" y2="130" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />

        {/* Dynamic active ember path */}
        <line
          x1="50"
          y1="130"
          x2="300"
          y2="130"
          stroke="#0A66C2"
          strokeWidth="2"
          strokeDasharray="6 4"
          className="animate-ember-flow"
        />

        {/* Phase 01: Forged State */}
        <g className="hero-node-forged">
          {/* Cubic bezier branch curves */}
          <path d="M 120 130 C 120 70, 160 60, 200 60" stroke="#0A66C2" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
          <path d="M 120 130 C 120 190, 160 200, 200 200" stroke="#0A66C2" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />

          {/* Hub 01 */}
          <circle cx="120" cy="130" r="24" fill="#0A66C2" fillOpacity="0.12" stroke="#0A66C2" strokeWidth="1.5" className="forge-completed" />
          <text x="120" y="134" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="#0A66C2">01</text>

          {/* Callout Annotation */}
          <text x="120" y="172" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#6b7487" opacity="0.9">PHASE 01 · FORGED</text>

          {/* Topic 1 Above */}
          <g transform="translate(200, 48)">
            <rect width="130" height="26" rx="6" fill="rgba(10,102,194,0.08)" stroke="#0A66C2" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="12" cy="13" r="3.5" fill="#0A66C2" />
            <text x="24" y="17" fontSize="10" fontWeight="500" fill="currentColor">HTML5 &amp; Semantic DOM</text>
          </g>

          {/* Topic 1 Below */}
          <g transform="translate(200, 188)">
            <rect width="130" height="26" rx="6" fill="rgba(10,102,194,0.08)" stroke="#0A66C2" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="12" cy="13" r="3.5" fill="#0A66C2" />
            <text x="24" y="17" fontSize="10" fontWeight="500" fill="currentColor">CSS Grid &amp; Modern Flex</text>
          </g>
        </g>

        {/* Phase 02: Heating State */}
        <g className="hero-node-heating">
          {/* Connector curves */}
          <path d="M 320 130 C 320 70, 360 60, 400 60" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
          <path d="M 320 130 C 320 190, 360 200, 400 200" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />

          {/* Hub 02 */}
          <circle cx="320" cy="130" r="24" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="320" y="134" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="#f59e0b">02</text>

          {/* Callout Annotation */}
          <text x="320" y="172" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#f59e0b" opacity="0.9">HEATING · 6-8 WEEKS</text>

          {/* Topic 2 Above */}
          <g transform="translate(400, 48)">
            <rect width="130" height="26" rx="6" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="12" cy="13" r="3.5" fill="#f59e0b" />
            <text x="24" y="17" fontSize="10" fontWeight="500" fill="currentColor">Async &amp; Promises</text>
          </g>

          {/* Topic 2 Below */}
          <g transform="translate(400, 188)">
            <rect width="130" height="26" rx="6" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="12" cy="13" r="3.5" fill="#f59e0b" />
            <text x="24" y="17" fontSize="10" fontWeight="500" fill="currentColor">Event Loop &amp; Scopes</text>
          </g>
        </g>

        {/* Phase 03: Cold State */}
        <g className="hero-node-cold">
          {/* Connector curves */}
          <path d="M 520 130 C 520 70, 550 60, 580 60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" fill="none" />
          <path d="M 520 130 C 520 190, 550 200, 580 200" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" fill="none" />

          {/* Hub 03 */}
          <circle cx="520" cy="130" r="24" fill="transparent" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          <text x="520" y="134" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="currentColor" fillOpacity="0.3">03</text>

          {/* Callout Annotation */}
          <text x="520" y="172" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#6b7487" opacity="0.6">COLD · UPCOMING</text>

          {/* Topic 3 Above */}
          <g transform="translate(560, 48)">
            <rect width="110" height="26" rx="6" fill="transparent" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
            <circle cx="12" cy="13" r="3.5" fill="currentColor" fillOpacity="0.2" />
            <text x="24" y="17" fontSize="10" fill="currentColor" fillOpacity="0.4">React 19 &amp; Hooks</text>
          </g>

          {/* Topic 3 Below */}
          <g transform="translate(560, 188)">
            <rect width="110" height="26" rx="6" fill="transparent" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
            <circle cx="12" cy="13" r="3.5" fill="currentColor" fillOpacity="0.2" />
            <text x="24" y="17" fontSize="10" fill="currentColor" fillOpacity="0.4">State Primitives</text>
          </g>
        </g>
      </svg>

      {/* Mobile Map (vertical topology under 768px) */}
      <svg
        viewBox="0 0 340 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block md:hidden w-full max-w-[340px] mx-auto overflow-visible"
        aria-hidden="true"
      >
        <line x1="70" y1="30" x2="70" y2="350" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
        <line x1="70" y1="30" x2="70" y2="180" stroke="#0A66C2" strokeWidth="2" strokeDasharray="6 4" className="animate-ember-flow" />

        {/* Phase 01 */}
        <g>
          <circle cx="70" cy="70" r="20" fill="#0A66C2" fillOpacity="0.12" stroke="#0A66C2" strokeWidth="1.5" />
          <text x="70" y="74" textAnchor="middle" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="#0A66C2">01</text>
          <path d="M 70 70 C 100 70, 110 50, 130 50" stroke="#0A66C2" strokeWidth="1" strokeOpacity="0.5" fill="none" />
          <path d="M 70 70 C 100 70, 110 90, 130 90" stroke="#0A66C2" strokeWidth="1" strokeOpacity="0.5" fill="none" />
          <rect x="130" y="38" width="150" height="24" rx="5" fill="rgba(10,102,194,0.08)" stroke="#0A66C2" strokeWidth="1" strokeOpacity="0.6" />
          <text x="142" y="54" fontSize="10" fill="currentColor">HTML5 &amp; Semantic DOM</text>
          <rect x="130" y="78" width="150" height="24" rx="5" fill="rgba(10,102,194,0.08)" stroke="#0A66C2" strokeWidth="1" strokeOpacity="0.6" />
          <text x="142" y="94" fontSize="10" fill="currentColor">CSS Grid &amp; Modern Flex</text>
        </g>

        {/* Phase 02 */}
        <g>
          <circle cx="70" cy="190" r="20" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="70" y="194" textAnchor="middle" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="#f59e0b">02</text>
          <path d="M 70 190 C 100 190, 110 170, 130 170" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" fill="none" />
          <path d="M 70 190 C 100 190, 110 210, 130 210" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" fill="none" />
          <rect x="130" y="158" width="150" height="24" rx="5" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
          <text x="142" y="174" fontSize="10" fill="currentColor">Async &amp; Event Loop</text>
          <rect x="130" y="198" width="150" height="24" rx="5" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
          <text x="142" y="214" fontSize="10" fill="currentColor">Modern ES2024 Patterns</text>
        </g>

        {/* Phase 03 */}
        <g>
          <circle cx="70" cy="310" r="20" fill="transparent" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
          <text x="70" y="314" textAnchor="middle" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="currentColor" fillOpacity="0.3">03</text>
          <path d="M 70 310 C 100 310, 110 300, 130 300" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" fill="none" />
          <rect x="130" y="288" width="150" height="24" rx="5" fill="transparent" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
          <text x="142" y="304" fontSize="10" fill="currentColor" fillOpacity="0.4">React 19 &amp; Architecture</text>
        </g>
      </svg>
    </div>
  )
}

export default function Hero() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const mapRef = useRef(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const tl = gsap.timeline({ delay: 0.15 })
    tl.fromTo(
      subRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        mapRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )

    // GSAP sequential heat transitions across map nodes
    const forgedNodes = mapRef.current?.querySelectorAll('.hero-node-forged')
    const heatingNodes = mapRef.current?.querySelectorAll('.hero-node-heating')
    if (forgedNodes?.length) {
      tl.fromTo(
        forgedNodes,
        { scale: 0.95, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      )
    }
    if (heatingNodes?.length) {
      tl.fromTo(
        heatingNodes,
        { scale: 0.95, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      )
    }
  }, { scope: sectionRef })

  const totalPhases = FIELDS.reduce((s, f) => s + f.phases.length, 0)

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[92svh] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background dot grid with 6% opacity */}
      <DotGrid dotColor="#0A66C2" gap={28} radius={1} opacity={0.06} />

      {/* Top vertical fade mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0A66C2]/[0.05] via-[#0A66C2]/[0.02] to-transparent"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-[#11141c]/70 backdrop-blur-sm"
        >
          <span className="font-mono text-[10px] text-[#0A66C2] tracking-widest uppercase font-semibold">
            OPEN-SOURCE ENGINEERING ROADMAPS
          </span>
          <span className="w-px h-3 bg-black/10 dark:bg-white/10" />
          <span className="font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296] tracking-wide">
            {FIELDS.length} TRACKS · {totalPhases} PHASES
          </span>
        </motion.div>

        {/* H1 with SplitText character animation */}
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] dark:text-[#eef0f5] leading-[1.1]"
        >
          <SplitText
            text="Forge your engineering path."
            delay={0.1}
            duration={0.65}
            y={20}
          />
        </h1>

        {/* Subhead: deterministic, personalized roadmaps built from a skill check, not a template */}
        <p
          ref={subRef}
          className="max-w-xl text-base sm:text-lg text-[#4b5565] dark:text-[#a3a9b8] leading-relaxed opacity-0"
        >
          Deterministic, personalized roadmaps generated from an engineering skill check—not a generic template.
          Track every milestone from Cold to Forged with free, verified resources.
        </p>

        {/* CTAs with Magnet on primary */}
        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center gap-3 opacity-0"
        >
          <Magnet strength={0.25}>
            <button
              onClick={() => navigate('/app')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A66C2] focus-visible:outline-offset-2 shadow-sm"
            >
              Start forging your path
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </Magnet>
          <a
            href="https://github.com/yourusername/pathforge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-sm font-medium text-[#4b5565] dark:text-[#a3a9b8] hover:text-[#111827] dark:hover:text-[#eef0f5] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
          >
            <GitBranch className="w-4 h-4" strokeWidth={1.5} />
            View on GitHub
          </a>
        </div>

        {/* Blueprint Map Container with Callouts */}
        <div
          ref={mapRef}
          className="mt-4 w-full opacity-0 text-[#111827] dark:text-[#eef0f5]"
        >
          <div className="relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-[#11141c]/60 backdrop-blur-md px-4 sm:px-8 py-6 sm:py-8 shadow-sm">
            {/* Engineering drawing header callouts */}
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3 mb-4" aria-hidden="true">
              <span className="font-mono text-[10px] text-[#0A66C2] uppercase tracking-wider font-semibold">
                MAP 01 · FULL STACK ENGINEER
              </span>
              <span className="font-mono text-[10px] text-[#6b7487] dark:text-[#7a8296] uppercase tracking-wider">
                TOPOLOGY: LEFT-TO-RIGHT NODE TREE
              </span>
            </div>

            {/* Render Map */}
            <ForgeMapVisual />

            {/* Bottom drawing legend */}
            <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-wrap items-center justify-between text-[10px] font-mono text-[#6b7487] dark:text-[#7a8296]" aria-hidden="true">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0A66C2]" />
                  FORGED
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  HEATING
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full border border-current" />
                  COLD
                </span>
              </div>
              <span>SCALE: 1.0x · PAN/ZOOM ENABLED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
