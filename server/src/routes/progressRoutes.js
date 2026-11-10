import { Router } from 'express'
import {
  getProgress,
  saveProgress,
  mergeGuestProgress,
  resetProgress,
} from '../controllers/progressController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

// All progress routes require authentication
router.use(requireAuth)

router.get('/', getProgress)
router.put('/', saveProgress)
router.post('/merge-guest', mergeGuestProgress)
router.delete('/', resetProgress)

export default router

