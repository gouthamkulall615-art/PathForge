/**
 * Centralized error handler middleware.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err)

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred on the server.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
}

