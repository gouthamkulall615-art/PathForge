import { Router } from 'express'
import { getUiPrefs, saveUiPrefs } from '../controllers/uiPrefsController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

// All UI preferences routes require authentication
router.use(requireAuth)

router.get('/', getUiPrefs)
router.put('/', saveUiPrefs)

export default router

