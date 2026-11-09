/**
 * usePanZoom.js
 *
 * High-performance pan & zoom hook for SVG/canvas viewports.
 * Uses direct CSS transforms through refs and requestAnimationFrame during active gestures
 * to keep canvas interactions smooth at 60fps without re-rendering React components on every pixel.
 */

import { useRef, useState, useCallback, useEffect } from 'react'

const MIN_ZOOM = 0.4
const MAX_ZOOM = 1.6
const ZOOM_STEP = 0.15

export function usePanZoom({
  initialZoom = 1,
  initialX = 0,
  initialY = 0,
  minZoom = MIN_ZOOM,
  maxZoom = MAX_ZOOM,
} = {}) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  // Mutable values for rapid RAF updates
  const transformRef = useRef({
    x: initialX,
    y: initialY,
    zoom: initialZoom,
  })

  // Synchronized state for components that need read access (MiniMap, toolbar)
  const [transformState, setTransformState] = useState({
    x: initialX,
    y: initialY,
    zoom: initialZoom,
  })

  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const activePointersRef = useRef(new Map())
  const prevPinchDistRef = useRef(null)
  const rafIdRef = useRef(null)

  // Direct DOM transform application
  const applyTransform = useCallback((x, y, zoom) => {
    if (!contentRef.current) return
    contentRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`
    contentRef.current.style.transformOrigin = '0 0'
  }, [])

  // Commit transform update to React state (debounced/batched)
  const syncState = useCallback(() => {
    setTransformState({
      x: transformRef.current.x,
      y: transformRef.current.y,
      zoom: transformRef.current.zoom,
    })
  }, [])

  // Programmatic setTransform with optional smooth CSS animation
  const setTransform = useCallback(
    (newX, newY, newZoom, smooth = false) => {
      const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom)
      transformRef.current = { x: newX, y: newY, zoom: clampedZoom }

      if (contentRef.current) {
        if (smooth) {
          contentRef.current.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)'
          const onTransitionEnd = () => {
            if (contentRef.current) {
              contentRef.current.style.transition = ''
            }
          }
          contentRef.current.addEventListener('transitionend', onTransitionEnd, { once: true })
        } else {
          contentRef.current.style.transition = ''
        }
        applyTransform(newX, newY, clampedZoom)
      }
      syncState()
    },
    [applyTransform, syncState, minZoom, maxZoom]
  )

  // Center viewport on specific world coordinates (x, y)
  const centerOn = useCallback(
    (worldX, worldY, targetZoom = 1, smooth = true) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newZoom = Math.min(Math.max(targetZoom, minZoom), maxZoom)
      const newX = rect.width / 2 - worldX * newZoom
      const newY = rect.height / 2 - worldY * newZoom
      setTransform(newX, newY, newZoom, smooth)
    },
    [setTransform, minZoom, maxZoom]
  )

  // Fit entire bounding box into viewport
  const fitToScreen = useCallback(
    (bounds, smooth = true) => {
      if (!containerRef.current || !bounds) return
      const rect = containerRef.current.getBoundingClientRect()
      const availableWidth = rect.width - 64
      const availableHeight = rect.height - 64

      if (availableWidth <= 0 || availableHeight <= 0) return

      const scaleX = availableWidth / bounds.width
      const scaleY = availableHeight / bounds.height
      let fitZoom = Math.min(scaleX, scaleY)
      fitZoom = Math.min(Math.max(fitZoom, minZoom), 1.1)

      const centerX = bounds.minX + bounds.width / 2
      const centerY = bounds.minY + bounds.height / 2

      const newX = rect.width / 2 - centerX * fitZoom
      const newY = rect.height / 2 - centerY * fitZoom

      setTransform(newX, newY, fitZoom, smooth)
    },
    [setTransform, minZoom]
  )

  // Zoom at an arbitrary screen point (e.g. mouse cursor)
  const zoomAtPoint = useCallback(
    (screenX, screenY, zoomDelta) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const current = transformRef.current

      const newZoom = Math.min(Math.max(current.zoom + zoomDelta, minZoom), maxZoom)
      if (newZoom === current.zoom) return

      // World point under cursor
      const cursorX = screenX - rect.left
      const cursorY = screenY - rect.top
      const worldX = (cursorX - current.x) / current.zoom
      const worldY = (cursorY - current.y) / current.zoom

      // New translate to keep world point under cursor
      const newX = cursorX - worldX * newZoom
      const newY = cursorY - worldY * newZoom

      setTransform(newX, newY, newZoom, false)
    },
    [setTransform, minZoom, maxZoom]
  )

  const zoomIn = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, ZOOM_STEP)
  }, [zoomAtPoint])

  const zoomOut = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, -ZOOM_STEP)
  }, [zoomAtPoint])

  const reset = useCallback(() => {
    setTransform(0, 0, 1, true)
  }, [setTransform])

  // Mouse Wheel / Trackpad pinch handler
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e) => {
      e.preventDefault()

      // Ctrl + wheel or trackpad pinch
      if (e.ctrlKey || e.metaKey) {
        const delta = -e.deltaY * 0.005
        zoomAtPoint(e.clientX, e.clientY, delta)
      } else {
        // Direct canvas panning with wheel/trackpad
        const current = transformRef.current
        const newX = current.x - e.deltaX
        const newY = current.y - e.deltaY
        transformRef.current.x = newX
        transformRef.current.y = newY
        applyTransform(newX, newY, current.zoom)

        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = requestAnimationFrame(syncState)
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [zoomAtPoint, applyTransform, syncState])

  // Pointer events: Pan & pinch-to-zoom
  const onPointerDown = useCallback((e) => {
    // Only drag on left mouse button or touch/pen
    if (e.button !== 0 && e.pointerType === 'mouse') return

    // Don't drag if clicking an interactive element (button, link, input)
    if (e.target.closest('button, a, input, [role="button"], .no-pan')) {
      return
    }

    const container = containerRef.current
    if (container) {
      container.setPointerCapture(e.pointerId)
    }

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (activePointersRef.current.size === 1) {
      isDraggingRef.current = true
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: transformRef.current.x,
        initialY: transformRef.current.y,
      }
    } else if (activePointersRef.current.size === 2) {
      // Begin pinch
      isDraggingRef.current = false
      const pts = Array.from(activePointersRef.current.values())
      prevPinchDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
    }
  }, [])

  const onPointerMove = useCallback(
    (e) => {
      if (!activePointersRef.current.has(e.pointerId)) return
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (activePointersRef.current.size === 1 && isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.startX
        const dy = e.clientY - dragStartRef.current.startY
        const newX = dragStartRef.current.initialX + dx
        const newY = dragStartRef.current.initialY + dy

        transformRef.current.x = newX
        transformRef.current.y = newY
        applyTransform(newX, newY, transformRef.current.zoom)
      } else if (activePointersRef.current.size === 2) {
        // Pinch zoom
        const pts = Array.from(activePointersRef.current.values())
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)

        if (prevPinchDistRef.current) {
          const delta = (dist - prevPinchDistRef.current) * 0.005
          const midX = (pts[0].x + pts[1].x) / 2
          const midY = (pts[0].y + pts[1].y) / 2
          zoomAtPoint(midX, midY, delta)
        }
        prevPinchDistRef.current = dist
      }
    },
    [applyTransform, zoomAtPoint]
  )

  const onPointerUp = useCallback(
    (e) => {
      if (activePointersRef.current.has(e.pointerId)) {
        activePointersRef.current.delete(e.pointerId)
      }

      if (activePointersRef.current.size < 2) {
        prevPinchDistRef.current = null
      }

      if (activePointersRef.current.size === 0) {
        isDraggingRef.current = false
        syncState()
      }
    },
    [syncState]
  )

  // Double-click to zoom in
  const onDoubleClick = useCallback(
    (e) => {
      if (e.target.closest('button, a, input, [role="button"], .no-pan')) return
      zoomAtPoint(e.clientX, e.clientY, ZOOM_STEP * 2)
    },
    [zoomAtPoint]
  )

  // Initial transform application
  useEffect(() => {
    applyTransform(initialX, initialY, initialZoom)
  }, [applyTransform, initialX, initialY, initialZoom])

  return {
    containerRef,
    contentRef,
    transform: transformState,
    setTransform,
    zoomIn,
    zoomOut,
    fitToScreen,
    centerOn,
    reset,
    zoomAtPoint,
    events: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onDoubleClick,
    },
  }
}

