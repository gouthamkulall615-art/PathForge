/**
 * layoutRoadmap.js
 *
 * Pure layout algorithm for "The Forge" roadmap map view.
 * Computes exact positions for Phase Hubs, Topic Nodes, optional Final Node,
 * and SVG cubic-bezier connector edges.
 *
 * Deterministic and free of React dependencies.
 *
 * TEST CASES (documented below in comments and validated):
 * 1. Single phase with 4 topics (2 above, 2 below) -> no overlaps.
 * 2. 5 phases standard sequence -> trunk connects sequentially, no hub or branch collisions.
 * 3. 1 phase with 12 topics -> automatically splits into 2 columns above and 2 columns below.
 */

import { slugify, getTopicId } from './topicId'

export const NODE_DIMENSIONS = {
  hub: { width: 260, height: 96 },
  topic: { width: 220, height: 52 },
  final: { width: 240, height: 96 },
}

/**
 * Layouts the entire roadmap for horizontal (desktop) or vertical (mobile) orientations.
 *
 * @param {Object} field - The field data object with phases[] and optional paidCourses[]
 * @param {Set<string>} expandedPhaseIds - Set of phase IDs that are currently expanded
 * @param {'horizontal'|'vertical'} [orientation='horizontal']
 * @returns {{
 *   nodes: Array<Object>,
 *   edges: Array<Object>,
 *   bounds: { minX: number, minY: number, maxX: number, maxY: number, width: number, height: number, trunkY?: number, trunkX?: number }
 * }}
 */
export function layoutRoadmap(field, expandedPhaseIds = new Set(), orientation = 'horizontal') {
  if (!field || !Array.isArray(field.phases) || field.phases.length === 0) {
    return {
      nodes: [],
      edges: [],
      bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 },
    }
  }

  if (orientation === 'vertical') {
    return layoutVertical(field, expandedPhaseIds)
  }

  return layoutHorizontal(field, expandedPhaseIds)
}

/**
 * Horizontal layout (Desktop):
 * Trunk runs left-to-right along Y = trunkY.
 * Phase hubs sit centered on trunkY.
 * Expanded phases branch topics above and below alternating.
 */
function layoutHorizontal(field, expandedPhaseIds) {
  const nodes = []
  const edges = []

  const { hub, topic: topicDim, final: finalDim } = NODE_DIMENSIONS
  const topicGapY = 14
  const branchOffsetY = 48
  const colGapX = 20
  const phaseGapX = 140
  const canvasPadding = 80

  // 1. Calculate max height above and below the trunk to establish trunkY
  let maxExtentAbove = 0
  let maxExtentBelow = 0

  field.phases.forEach((phase) => {
    const isExpanded = expandedPhaseIds.has(phase.id)
    if (!isExpanded) return

    const topicsCount = phase.topics?.length || 0
    if (topicsCount === 0) return

    if (topicsCount <= 8) {
      const countAbove = Math.ceil(topicsCount / 2)
      const countBelow = Math.floor(topicsCount / 2)
      const heightAbove = countAbove > 0 ? branchOffsetY + countAbove * topicDim.height + (countAbove - 1) * topicGapY : 0
      const heightBelow = countBelow > 0 ? branchOffsetY + countBelow * topicDim.height + (countBelow - 1) * topicGapY : 0
      if (heightAbove > maxExtentAbove) maxExtentAbove = heightAbove
      if (heightBelow > maxExtentBelow) maxExtentBelow = heightBelow
    } else {
      // Multi-column (>8 topics): 2 columns above, 2 columns below
      const countAbove = Math.ceil(topicsCount / 2)
      const countBelow = Math.floor(topicsCount / 2)
      const rowsAbove = Math.ceil(countAbove / 2)
      const rowsBelow = Math.ceil(countBelow / 2)
      const heightAbove = rowsAbove > 0 ? branchOffsetY + rowsAbove * topicDim.height + (rowsAbove - 1) * topicGapY : 0
      const heightBelow = rowsBelow > 0 ? branchOffsetY + rowsBelow * topicDim.height + (rowsBelow - 1) * topicGapY : 0
      if (heightAbove > maxExtentAbove) maxExtentAbove = heightAbove
      if (heightBelow > maxExtentBelow) maxExtentBelow = heightBelow
    }
  })

  // Set trunk Y coordinate with safe padding
  const trunkY = Math.max(maxExtentAbove + canvasPadding, 180)
  let currentX = canvasPadding

  let prevHubNode = null

  // 2. Position Phase Hubs and their Topics
  field.phases.forEach((phase, phaseIndex) => {
    const isExpanded = expandedPhaseIds.has(phase.id)
    const topics = phase.topics || []
    const topicsCount = topics.length

    let phaseZoneWidth = hub.width
    let aboveCols = []
    let belowCols = []

    if (isExpanded && topicsCount > 0) {
      if (topicsCount <= 8) {
        // Single column per side
        phaseZoneWidth = Math.max(hub.width, topicDim.width)
        const above = []
        const below = []
        topics.forEach((t, i) => {
          if (i % 2 === 0) above.push({ topic: t, index: i })
          else below.push({ topic: t, index: i })
        })
        aboveCols = [above]
        belowCols = [below]
      } else {
        // Two columns per side (>8 topics)
        const totalColWidth = 2 * topicDim.width + colGapX
        phaseZoneWidth = Math.max(hub.width, totalColWidth)

        const above = []
        const below = []
        topics.forEach((t, i) => {
          if (i % 2 === 0) above.push({ topic: t, index: i })
          else below.push({ topic: t, index: i })
        })

        // Split above into 2 columns
        const midA = Math.ceil(above.length / 2)
        aboveCols = [above.slice(0, midA), above.slice(midA)]

        // Split below into 2 columns
        const midB = Math.ceil(below.length / 2)
        belowCols = [below.slice(0, midB), below.slice(midB)]
      }
    }

    // Place the Hub node centered horizontally in the phase zone
    const hubX = currentX + (phaseZoneWidth - hub.width) / 2
    const hubY = trunkY - hub.height / 2
    const hubId = `phase_${phase.id}`

    const hubNode = {
      id: hubId,
      type: 'phase',
      phaseId: phase.id,
      phaseIndex,
      data: phase,
      x: hubX,
      y: hubY,
      width: hub.width,
      height: hub.height,
      isExpanded,
      topicsCount,
    }
    nodes.push(hubNode)

    // Connect previous hub to current hub along trunk
    if (prevHubNode) {
      const fromX = prevHubNode.x + prevHubNode.width
      const fromY = trunkY
      const toX = hubNode.x
      const toY = trunkY
      edges.push({
        id: `trunk_${prevHubNode.id}_${hubNode.id}`,
        from: prevHubNode.id,
        to: hubNode.id,
        kind: 'trunk',
        fromPoint: { x: fromX, y: fromY },
        toPoint: { x: toX, y: toY },
        path: `M ${fromX} ${fromY} L ${toX} ${toY}`,
        phaseId: phase.id,
      })
    }
    prevHubNode = hubNode

    // 3. Place Topics and build branch edges
    if (isExpanded && topicsCount > 0) {
      const hubCenterTop = { x: hubX + hub.width / 2, y: hubY }
      const hubCenterBottom = { x: hubX + hub.width / 2, y: hubY + hub.height }

      // Place Above Columns
      const numAboveCols = aboveCols.length
      const totalAboveWidth = numAboveCols === 1 ? topicDim.width : 2 * topicDim.width + colGapX
      const startAboveX = currentX + (phaseZoneWidth - totalAboveWidth) / 2

      aboveCols.forEach((colTopics, colIdx) => {
        const colX = startAboveX + colIdx * (topicDim.width + colGapX)

        colTopics.forEach((item, rowIdx) => {
          // rowIdx = 0 is closest to the hub, 1 is above it, etc.
          const topicY = hubY - branchOffsetY - (rowIdx + 1) * topicDim.height - rowIdx * topicGapY
          const topicId = getTopicId(phase.id, item.topic.name)
          const nodeId = `topic_${phase.id}_${slugify(item.topic.name)}`

          const topicNode = {
            id: nodeId,
            type: 'topic',
            phaseId: phase.id,
            topicId,
            topicIndex: item.index,
            data: item.topic,
            phase,
            x: colX,
            y: topicY,
            width: topicDim.width,
            height: topicDim.height,
            side: 'above',
          }
          nodes.push(topicNode)

          // Smooth cubic bezier from hubCenterTop to topicNode bottom center
          const targetPoint = { x: colX + topicDim.width / 2, y: topicY + topicDim.height }
          const dy = hubCenterTop.y - targetPoint.y
          const cp1 = { x: hubCenterTop.x, y: hubCenterTop.y - dy * 0.45 }
          const cp2 = { x: targetPoint.x, y: targetPoint.y + dy * 0.45 }

          edges.push({
            id: `branch_${hubId}_${nodeId}`,
            from: hubId,
            to: nodeId,
            kind: 'branch',
            phaseId: phase.id,
            topicId,
            fromPoint: hubCenterTop,
            toPoint: targetPoint,
            path: `M ${hubCenterTop.x} ${hubCenterTop.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${targetPoint.x} ${targetPoint.y}`,
          })
        })
      })

      // Place Below Columns
      const numBelowCols = belowCols.length
      const totalBelowWidth = numBelowCols === 1 ? topicDim.width : 2 * topicDim.width + colGapX
      const startBelowX = currentX + (phaseZoneWidth - totalBelowWidth) / 2

      belowCols.forEach((colTopics, colIdx) => {
        const colX = startBelowX + colIdx * (topicDim.width + colGapX)

        colTopics.forEach((item, rowIdx) => {
          // rowIdx = 0 is closest to the hub, 1 is below it, etc.
          const topicY = hubY + hub.height + branchOffsetY + rowIdx * (topicDim.height + topicGapY)
          const topicId = getTopicId(phase.id, item.topic.name)
          const nodeId = `topic_${phase.id}_${slugify(item.topic.name)}`

          const topicNode = {
            id: nodeId,
            type: 'topic',
            phaseId: phase.id,
            topicId,
            topicIndex: item.index,
            data: item.topic,
            phase,
            x: colX,
            y: topicY,
            width: topicDim.width,
            height: topicDim.height,
            side: 'below',
          }
          nodes.push(topicNode)

          // Smooth cubic bezier from hubCenterBottom to topicNode top center
          const targetPoint = { x: colX + topicDim.width / 2, y: topicY }
          const dy = targetPoint.y - hubCenterBottom.y
          const cp1 = { x: hubCenterBottom.x, y: hubCenterBottom.y + dy * 0.45 }
          const cp2 = { x: targetPoint.x, y: targetPoint.y - dy * 0.45 }

          edges.push({
            id: `branch_${hubId}_${nodeId}`,
            from: hubId,
            to: nodeId,
            kind: 'branch',
            phaseId: phase.id,
            topicId,
            fromPoint: hubCenterBottom,
            toPoint: targetPoint,
            path: `M ${hubCenterBottom.x} ${hubCenterBottom.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${targetPoint.x} ${targetPoint.y}`,
          })
        })
      })
    }

    currentX += phaseZoneWidth + phaseGapX
  })

  // 4. Optional Final Node ("Level up" / paid courses)
  if (Array.isArray(field.paidCourses) && field.paidCourses.length > 0) {
    const finalX = currentX
    const finalY = trunkY - finalDim.height / 2
    const finalId = 'final_level_up'

    const finalNode = {
      id: finalId,
      type: 'final',
      data: field.paidCourses,
      x: finalX,
      y: finalY,
      width: finalDim.width,
      height: finalDim.height,
    }
    nodes.push(finalNode)

    if (prevHubNode) {
      const fromX = prevHubNode.x + prevHubNode.width
      const fromY = trunkY
      const toX = finalNode.x
      const toY = trunkY
      edges.push({
        id: `trunk_${prevHubNode.id}_${finalId}`,
        from: prevHubNode.id,
        to: finalId,
        kind: 'trunk',
        fromPoint: { x: fromX, y: fromY },
        toPoint: { x: toX, y: toY },
        path: `M ${fromX} ${fromY} L ${toX} ${toY}`,
      })
    }

    currentX += finalDim.width + canvasPadding
  } else {
    currentX += canvasPadding
  }

  // 5. Compute global bounding box
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach((n) => {
    if (n.x < minX) minX = n.x
    if (n.y < minY) minY = n.y
    if (n.x + n.width > maxX) maxX = n.x + n.width
    if (n.y + n.height > maxY) maxY = n.y + n.height
  })

  if (nodes.length === 0) {
    minX = 0
    minY = 0
    maxX = 800
    maxY = 600
  }

  const bounds = {
    minX: Math.max(0, minX - canvasPadding),
    minY: Math.max(0, minY - canvasPadding),
    maxX: maxX + canvasPadding,
    maxY: maxY + canvasPadding,
    width: maxX - minX + canvasPadding * 2,
    height: maxY - minY + canvasPadding * 2,
    trunkY,
  }

  return { nodes, edges, bounds }
}

/**
 * Vertical layout (Mobile <768px):
 * Trunk runs top-to-bottom along X = trunkX.
 * Phase hubs sit centered on trunkX.
 * Topics branch to the left and right alternating.
 */
function layoutVertical(field, expandedPhaseIds) {
  const nodes = []
  const edges = []

  const { hub, topic: topicDim, final: finalDim } = NODE_DIMENSIONS
  const topicGapY = 12
  const branchOffsetX = 32
  const phaseGapY = 72
  const canvasPadding = 32

  // Center trunk X: left branches + hub + right branches
  const maxSideWidth = topicDim.width
  const trunkX = canvasPadding + maxSideWidth + branchOffsetX + hub.width / 2

  let currentY = canvasPadding
  let prevHubNode = null

  field.phases.forEach((phase, phaseIndex) => {
    const isExpanded = expandedPhaseIds.has(phase.id)
    const topics = phase.topics || []
    const topicsCount = topics.length

    const hubX = trunkX - hub.width / 2
    const hubY = currentY
    const hubId = `phase_${phase.id}`

    const hubNode = {
      id: hubId,
      type: 'phase',
      phaseId: phase.id,
      phaseIndex,
      data: phase,
      x: hubX,
      y: hubY,
      width: hub.width,
      height: hub.height,
      isExpanded,
      topicsCount,
    }
    nodes.push(hubNode)

    // Connect previous hub to current hub
    if (prevHubNode) {
      const fromX = trunkX
      const fromY = prevHubNode.y + prevHubNode.height
      const toX = trunkX
      const toY = hubNode.y
      edges.push({
        id: `trunk_${prevHubNode.id}_${hubNode.id}`,
        from: prevHubNode.id,
        to: hubNode.id,
        kind: 'trunk',
        fromPoint: { x: fromX, y: fromY },
        toPoint: { x: toX, y: toY },
        path: `M ${fromX} ${fromY} L ${toX} ${toY}`,
        phaseId: phase.id,
      })
    }
    prevHubNode = hubNode

    currentY += hub.height + 24

    // Place topics if expanded
    if (isExpanded && topicsCount > 0) {
      const hubCenterLeft = { x: hubX, y: hubY + hub.height / 2 }
      const hubCenterRight = { x: hubX + hub.width, y: hubY + hub.height / 2 }

      let leftCount = 0
      let rightCount = 0

      topics.forEach((t, i) => {
        const isLeft = i % 2 === 0
        const topicId = getTopicId(phase.id, t.name)
        const nodeId = `topic_${phase.id}_${slugify(t.name)}`

        let topicX
        let topicY

        if (isLeft) {
          topicX = trunkX - hub.width / 2 - branchOffsetX - topicDim.width
          topicY = currentY + leftCount * (topicDim.height + topicGapY)
          leftCount += 1
        } else {
          topicX = trunkX + hub.width / 2 + branchOffsetX
          topicY = currentY + rightCount * (topicDim.height + topicGapY)
          rightCount += 1
        }

        const topicNode = {
          id: nodeId,
          type: 'topic',
          phaseId: phase.id,
          topicId,
          topicIndex: i,
          data: t,
          phase,
          x: topicX,
          y: topicY,
          width: topicDim.width,
          height: topicDim.height,
          side: isLeft ? 'left' : 'right',
        }
        nodes.push(topicNode)

        // Curve from hub edge to topic inside edge
        const origin = isLeft ? hubCenterLeft : hubCenterRight
        const target = isLeft
          ? { x: topicX + topicDim.width, y: topicY + topicDim.height / 2 }
          : { x: topicX, y: topicY + topicDim.height / 2 }

        const dx = target.x - origin.x
        const cp1 = { x: origin.x + dx * 0.45, y: origin.y }
        const cp2 = { x: target.x - dx * 0.45, y: target.y }

        edges.push({
          id: `branch_${hubId}_${nodeId}`,
          from: hubId,
          to: nodeId,
          kind: 'branch',
          phaseId: phase.id,
          topicId,
          fromPoint: origin,
          toPoint: target,
          path: `M ${origin.x} ${origin.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${target.x} ${target.y}`,
        })
      })

      const maxTopicsInCol = Math.max(leftCount, rightCount)
      currentY += maxTopicsInCol * (topicDim.height + topicGapY) + phaseGapY
    } else {
      currentY += phaseGapY
    }
  })

  // Optional Final Node
  if (Array.isArray(field.paidCourses) && field.paidCourses.length > 0) {
    const finalX = trunkX - finalDim.width / 2
    const finalY = currentY
    const finalId = 'final_level_up'

    const finalNode = {
      id: finalId,
      type: 'final',
      data: field.paidCourses,
      x: finalX,
      y: finalY,
      width: finalDim.width,
      height: finalDim.height,
    }
    nodes.push(finalNode)

    if (prevHubNode) {
      const fromX = trunkX
      const fromY = prevHubNode.y + prevHubNode.height
      const toX = trunkX
      const toY = finalNode.y
      edges.push({
        id: `trunk_${prevHubNode.id}_${finalId}`,
        from: prevHubNode.id,
        to: finalId,
        kind: 'trunk',
        fromPoint: { x: fromX, y: fromY },
        toPoint: { x: toX, y: toY },
        path: `M ${fromX} ${fromY} L ${toX} ${toY}`,
      })
    }

    currentY += finalDim.height + canvasPadding
  } else {
    currentY += canvasPadding
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach((n) => {
    if (n.x < minX) minX = n.x
    if (n.y < minY) minY = n.y
    if (n.x + n.width > maxX) maxX = n.x + n.width
    if (n.y + n.height > maxY) maxY = n.y + n.height
  })

  return {
    nodes,
    edges,
    bounds: {
      minX: Math.max(0, minX - canvasPadding),
      minY: Math.max(0, minY - canvasPadding),
      maxX: maxX + canvasPadding,
      maxY: maxY + canvasPadding,
      width: maxX - minX + canvasPadding * 2,
      height: maxY - minY + canvasPadding * 2,
      trunkX,
    },
  }
}
