import { Sparkles, ArrowRight } from 'lucide-react'

export default function HeroSection({ onExplore }) {
  return (
    <div className="text-center mb-8 sm:mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
        bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 mb-6">
        <Sparkles className="h-8 w-8 text-[#0A66C2]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
        Expert-Curated Career Roadmaps
      </h1>

      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-6">
        Structured learning paths to guide your tech career — no fluff, just proven steps
        curated by industry practitioners.
      </p>

      <button
        onClick={onExplore}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
          text-white bg-[#0A66C2] rounded-xl hover:bg-[#004182] transition-colors"
      >
        Explore Roadmaps
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
