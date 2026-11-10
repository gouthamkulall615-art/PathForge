import { Profile } from '../models/Profile.js'
import { isDbConnected } from '../config/db.js'

/**
 * Loads user quiz profile & generated roadmap.
 * GET /api/profile
 */
export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: null,
      })
    }

    const doc = await Profile.findOne({ userId })
    return res.status(200).json({
      success: true,
      data: doc
        ? {
            answers: doc.answers,
            generatedRoadmap: doc.generatedRoadmap,
            completedAt: doc.completedAt,
          }
        : null,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Saves or updates onboarding quiz profile.
 * PUT /api/profile
 */
export async function saveProfile(req, res, next) {
  try {
    const userId = req.user.id
    const { answers, generatedRoadmap, completedAt } = req.body

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Saved (in-memory mode).',
        data: { answers, generatedRoadmap, completedAt },
      })
    }

    const doc = await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        answers: answers || {},
        generatedRoadmap: generatedRoadmap || null,
        completedAt: completedAt || new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return res.status(200).json({
      success: true,
      data: {
        answers: doc.answers,
        generatedRoadmap: doc.generatedRoadmap,
        completedAt: doc.completedAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Clears user quiz profile (for retaking).
 * DELETE /api/profile
 */
export async function clearProfile(req, res, next) {
  try {
    const userId = req.user.id

    if (isDbConnected()) {
      await Profile.findOneAndDelete({ userId })
    }

    return res.status(200).json({
      success: true,
      message: 'Profile cleared successfully.',
    })
  } catch (err) {
    next(err)
  }
}

