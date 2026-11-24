import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'

const _m = motion

const FAQS = [
  {
    q: 'Is PathForge completely free?',
    a: 'Yes. PathForge is 100% free and open source under the MIT license. Every track, roadmap, and linked tutorial/documentation resource is free to access. There are no paywalls, hidden premium tiers, or paid courses.',
  },
  {
    q: 'Do I need to create an account to use it?',
    a: 'No. You can start exploring roadmaps, check off completed topics, and take the quiz immediately as a guest. All your data is saved in your browser via localStorage. Sign in with Google only if you want to sync your progress across different devices.',
  },
  {
    q: 'How is the personalized roadmap generated? Is it an AI/LLM?',
    a: 'No, it is not an LLM. PathForge uses deterministic, testable scoring logic. When you take the concept skill check, each question tests a specific concept area. If you score 4/5 or 5/5, that phase is marked "mastered" and skipped; lower scores flag the phase for "review" with real calendar milestones.',
  },
  {
    q: 'Can I switch or explore multiple engineering tracks?',
    a: 'Yes. You can explore all 10 tracks simultaneously (Frontend, Backend, Full Stack, DevOps, Mobile, Data Science, AI/ML, Cyber Security, Cloud, and System Design) and switch between them anytime from the catalog.',
  },
  {
    q: 'What happens to my guest progress when I sign in?',
    a: 'Your guest progress is automatically and seamlessly merged into your account on your first sign-in. You never lose any checked topics or quiz results.',
  },
  {
    q: 'Are there resources available in Hindi?',
    a: 'Yes. PathForge features an optional resource language filter allowing you to toggle or combine high-quality verified Hindi video tutorials with official English documentation.',
  },
  {
    q: 'How does The Forge map view work?',
    a: 'The Forge is an interactive left-to-right node tree with smooth pan and zoom (0.4x to 1.6x), a minimap, and keyboard navigation. Phase hubs connect along a central trunk rail, while topics branch above and below with cubic-bezier curves that reflect their Cold, Heating, or Forged state.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  const id = q.toLowerCase().replace(/\W+/g, '-')

  return (
    <div className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`faq-${id}`}
        className="w-full flex items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] rounded group"
      >
        <span className="text-sm font-semibold text-[var(--forge-ink)] group-hover:text-[var(--forge-accent)] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--forge-muted)] shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-[var(--forge-accent)]' : ''
          }`}
          strokeWidth={1.75}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${id}`}
            key="answer"
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="pb-4 text-xs sm:text-sm text-[var(--forge-muted)] leading-relaxed pr-6">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 px-4 sm:px-6 bg-[var(--forge-canvas)] border-t border-black/[0.08] dark:border-white/[0.08]"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs text-[var(--forge-accent)] uppercase tracking-widest mb-2 font-semibold">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-4xl font-bold text-[var(--forge-ink)] tracking-tight"
          >
            Frequently answered questions
          </h2>
        </div>
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[var(--forge-card)] divide-y divide-black/[0.06] dark:divide-white/[0.06] px-5 sm:px-7 shadow-sm">
          {FAQS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
