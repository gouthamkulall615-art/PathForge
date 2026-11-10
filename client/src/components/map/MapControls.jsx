/**
 * MapControls.jsx
 *
 * Floating canvas control overlay (+, -, fit to screen, reset, focus mode toggle).
 */

import { memo } from 'react'
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Target } from 'lucide-react'

function MapControlsComponent({
  zoom,
  focusMode,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onReset,
  onToggleFocusMode,
}) {
  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-[#11141c]/90 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.08] shadow-md select-none">
      {/* Zoom in */}
      <button
        type="button"
        onClick={onZoomIn}
        className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
        title="Zoom in (+)"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {/* Zoom display */}
      <span className="font-mono text-[11px] px-1 text-neutral-500 min-w-[34px] text-center tabular-nums">
        {Math.round(zoom * 100)}%
      </span>

      {/* Zoom out */}
      <button
        type="button"
        onClick={onZoomOut}
        className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
        title="Zoom out (-)"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" strokeWidth={1.5} />
      </button>

      <div className="w-[1px] h-4 bg-black/[0.08] dark:border-white/[0.08]" />

      {/* Fit to screen */}
      <button
        type="button"
        onClick={onFitToScreen}
        className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
        title="Fit whole map to screen (0)"
        aria-label="Fit to screen"
      >
        <Maximize className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
        title="Reset zoom to 100%"
        aria-label="Reset zoom"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
      </button>

      <div className="w-[1px] h-4 bg-black/[0.08] dark:border-white/[0.08]" />

      {/* Focus mode toggle */}
      <button
        type="button"
        onClick={onToggleFocusMode}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-colors ${
          focusMode
            ? 'bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20 font-medium'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
        }`}
        title="Focus mode (F): auto-expand only the current incomplete phase"
        aria-label={`Toggle focus mode, currently ${focusMode ? 'on' : 'off'}`}
      >
        <Target className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="hidden sm:inline">Focus</span>
      </button>
    </div>
  )
}

export const MapControls = memo(MapControlsComponent)

