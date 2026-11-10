import { OAuth2Client } from 'google-auth-library'
import { User } from '../models/User.js'
import { isDbConnected } from '../config/db.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 * Verifies Google ID token, creates or updates user in DB, and returns user profile.
 * POST /api/auth/google
 */
export async function googleLogin(req, res, next) {
  try {
    const { credential } = req.body
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Missing credential (Google ID token).',
      })
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.sub) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential token.',
      })
    }

    const { sub: googleId, email, name, picture } = payload

    let user = {
      id: googleId,
      googleId,
      email,
      name,
      picture,
    }

    // Persist in MongoDB if database is connected
    if (isDbConnected()) {
      const dbUser = await User.findOneAndUpdate(
        { googleId },
        {
          googleId,
          email,
          name,
          picture,
          lastLoginAt: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      user = {
        id: dbUser.googleId,
        googleId: dbUser.googleId,
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.picture,
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      user,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Returns current authenticated user info.
 * GET /api/auth/me
 */
export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user,
  })
}

