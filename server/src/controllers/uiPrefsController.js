import { UiPrefs } from '../models/UiPrefs.js'
import { isDbConnected } from '../config/db.js'

/**
 * Loads UI preferences for the authenticated user.
 * GET /api/uiprefs
 */
export async function getUiPrefs(req, res, next) {
  try {
    const userId = req.user.id

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: { viewMode: 'map', focusMode: true },
      })
    }

    const doc = await UiPrefs.findOne({ userId })
    return res.status(200).json({
      success: true,
      data: {
        viewMode: doc?.viewMode || 'map',
        focusMode: typeof doc?.focusMode === 'boolean' ? doc.focusMode : true,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Saves UI preferences for the authenticated user.
 * PUT /api/uiprefs
 */
export async function saveUiPrefs(req, res, next) {
  try {
    const userId = req.user.id
    const { viewMode, focusMode } = req.body

    const update = {}
    if (viewMode === 'map' || viewMode === 'list') update.viewMode = viewMode
    if (typeof focusMode === 'boolean') update.focusMode = focusMode

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: update,
      })
    }

    const doc = await UiPrefs.findOneAndUpdate(
      { userId },
      { userId, ...update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return res.status(200).json({
      success: true,
      data: {
        viewMode: doc.viewMode,
        focusMode: doc.focusMode,
      },
    })
  } catch (err) {
    next(err)
  }
}

