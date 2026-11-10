import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'dotenv/config'

import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import uiPrefsRoutes from './routes/uiPrefsRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// Connect to MongoDB
connectDB()

// Global Security & Utility Middleware
app.use(helmet())
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
)
app.use(express.json({ limit: '2mb' }))

// Request Logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'PathForge API',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/uiprefs', uiPrefsRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  })
})

// Central Error Handler
app.use(errorHandler)

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[PathForge Server] Listening on http://localhost:${PORT}`)
  console.log(`[PathForge Server] Accepting requests from: ${CLIENT_URL}`)
})

// Graceful Shutdown
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

function shutdown() {
  console.log('\n[PathForge Server] Shutting down gracefully...')
  server.close(() => {
    console.log('[PathForge Server] HTTP server closed.')
    process.exit(0)
  })
}

export default app

