import { Router } from 'express'
import { googleLogin, getMe } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Public: authenticate with Google credential token
router.post('/google', googleLogin)

// Protected: fetch current verified user
router.get('/me', requireAuth, getMe)

export default router

