import { OAuth2Client } from 'google-auth-library'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(googleClientId)

/**
 * Requires a valid Google OAuth ID token in the Authorization header.
 * Header format: `Authorization: Bearer <id_token>`
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No Bearer token provided.',
      })
    }

    const token = authHeader.split(' ')[1]
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google authentication token.',
      })
    }

    // Attach verified user payload
    req.user = {
      id: payload.sub,
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    }

    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired.',
      error: err.message,
    })
  }
}

/**
 * Optional authentication: if a valid token is provided, attaches `req.user`.
 * If no token is provided, proceeds as guest without failing.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null
      return next()
    }

    const token = authHeader.split(' ')[1]
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (payload?.sub) {
      req.user = {
        id: payload.sub,
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      }
    }
  } catch {
    // Treat invalid token as unauthenticated guest
    req.user = null
  }

  next()
}

