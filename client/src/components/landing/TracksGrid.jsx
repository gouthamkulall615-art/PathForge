import { motion } from 'motion/react'

const _m = motion

import { useNavigate } from 'react-router-dom'
import FieldIcon from '../FieldIcon'
import { FIELDS } from '../../data/fields'
import { ArrowRight } from 'lucide-react'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function TracksGrid() {
  const navigate = useNavigate()

  const handleTrack = (fieldId) => {
    navigate(`/app?field=${fieldId}`)
  }

  return (
    <section
      id="tracks"
      aria-labelledby="tracks-heading"
      className="py-20 px-4 sm:px-6 max-w-6xl mx-auto"
    >
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-[#0A66C2] uppercase tracking-widest mb-2">Tracks</p>
          <h2
            id="tracks-heading"
            className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#eef0f5] tracking-tight"
          >
            Ten engineering disciplines
          </h2>
          <p className="mt-2 text-sm text-[#4b5565] dark:text-[#a3a9b8] max-w-md">
            Each track is broken into progressive phases with curated topics and free resources.
          </p>
        </div>
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0A66C2] hover:text-[#004182] transition-colors flex-shrink-0"
          aria-label="View all tracks in the app"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {FIELDS.map((field) => {
          const phaseCount = field.phases.length
          const topicCount = field.phases.reduce(
            (s, p) => s + (p.topics?.length || 0),
            0
          )
          return (
            <motion.button
              key={field.id}
              variants={item}
              onClick={() => handleTrack(field.id)}
              className="group text-left p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] hover:border-[#0A66C2]/30 dark:hover:border-[#0A66C2]/30 hover:shadow-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A66C2]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-[#f5f7fa] dark:bg-[#1a1e28] group-hover:bg-[#0A66C2]/[0.06] dark:group-hover:bg-[#0A66C2]/[0.08] transition-colors">
                  <FieldIcon
                    fieldId={field.id}
                    className="w-5 h-5 text-[#4b5565] dark:text-[#a3a9b8] group-hover:text-[#0A66C2] transition-colors"
                    strokeWidth={1.5}
                  />
                </div>
                <ArrowRight
                  className="w-3.5 h-3.5 text-transparent group-hover:text-[#0A66C2] transition-colors mt-1"
                  strokeWidth={2}
                />
              </div>
              <h3 className="text-sm font-semibold text-[#111827] dark:text-[#eef0f5] mb-1">
                {field.name}
              </h3>
              <p className="text-xs text-[#6b7487] dark:text-[#7a8296] line-clamp-2 leading-relaxed mb-3">
                {field.desc}
              </p>
              <div className="flex items-center gap-3 font-mono text-[10px] text-[#9ca3af] dark:text-[#5a6177]">
                <span>{phaseCount} phases</span>
                <span className="w-px h-3 bg-current opacity-30" />
                <span>{topicCount} topics</span>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}
