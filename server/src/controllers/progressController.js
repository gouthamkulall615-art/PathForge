import { Progress } from '../models/Progress.js'
import { isDbConnected } from '../config/db.js'

/**
 * Loads progress for the authenticated user.
 * GET /api/progress
 */
export async function getProgress(req, res, next) {
  try {
    const userId = req.user.id

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: { completedTopicIds: [], lastVisitedFieldId: null },
      })
    }

    const doc = await Progress.findOne({ userId })
    return res.status(200).json({
      success: true,
      data: {
        completedTopicIds: doc?.completedTopicIds || [],
        lastVisitedFieldId: doc?.lastVisitedFieldId || null,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Saves progress for the authenticated user.
 * PUT /api/progress
 */
export async function saveProgress(req, res, next) {
  try {
    const userId = req.user.id
    const { completedTopicIds, lastVisitedFieldId } = req.body

    const cleanTopics = Array.isArray(completedTopicIds)
      ? completedTopicIds.filter((id) => typeof id === 'string')
      : []

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Saved (in-memory mode).',
        data: { completedTopicIds: cleanTopics, lastVisitedFieldId },
      })
    }

    const doc = await Progress.findOneAndUpdate(
      { userId },
      {
        userId,
        completedTopicIds: cleanTopics,
        lastVisitedFieldId: lastVisitedFieldId || null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return res.status(200).json({
      success: true,
      data: {
        completedTopicIds: doc.completedTopicIds,
        lastVisitedFieldId: doc.lastVisitedFieldId,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Merges guest progress (union of completed topics) into user's account.
 * POST /api/progress/merge-guest
 */
export async function mergeGuestProgress(req, res, next) {
  try {
    const userId = req.user.id
    const { guestCompletedTopicIds = [] } = req.body

    if (!Array.isArray(guestCompletedTopicIds) || guestCompletedTopicIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No guest topics to merge.',
      })
    }

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Merged (in-memory mode).',
      })
    }

    const doc = await Progress.findOne({ userId })
    const existingTopics = new Set(doc?.completedTopicIds || [])
    guestCompletedTopicIds.forEach((id) => {
      if (typeof id === 'string' && id.trim()) existingTopics.add(id.trim())
    })

    const mergedTopics = Array.from(existingTopics)
    const updated = await Progress.findOneAndUpdate(
      { userId },
      { completedTopicIds: mergedTopics },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Guest progress successfully merged.',
      data: {
        completedTopicIds: updated.completedTopicIds,
        lastVisitedFieldId: updated.lastVisitedFieldId,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Resets progress for user (or a specific field).
 * DELETE /api/progress
 */
export async function resetProgress(req, res, next) {
  try {
    const userId = req.user.id
    const { fieldId } = req.query

    if (!isDbConnected()) {
      return res.status(200).json({ success: true, message: 'Progress reset.' })
    }

    if (fieldId) {
      // Remove only topics belonging to this field
      const doc = await Progress.findOne({ userId })
      if (doc) {
        doc.completedTopicIds = doc.completedTopicIds.filter(
          (id) => !id.startsWith(`${fieldId}_`)
        )
        await doc.save()
      }
    } else {
      // Clear all
      await Progress.findOneAndUpdate(
        { userId },
        { completedTopicIds: [], lastVisitedFieldId: null }
      )
    }

    return res.status(200).json({
      success: true,
      message: 'Progress reset successfully.',
    })
  } catch (err) {
    next(err)
  }
}

