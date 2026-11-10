import { Router } from 'express'
import {
  getProfile,
  saveProfile,
  clearProfile,
} from '../controllers/profileController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

// All profile routes require authentication
router.use(requireAuth)

router.get('/', getProfile)
router.put('/', saveProfile)
router.delete('/', clearProfile)

export default router

