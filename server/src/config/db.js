import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathforge'

  try {
    const conn = await mongoose.connect(uri)
    isConnected = true
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`)

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Runtime error:', err.message)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected from server')
      isConnected = false
    })
  } catch (err) {
    console.warn(`[MongoDB] Connection warning: Unable to connect to MongoDB at "${uri}".`)
    console.warn('[MongoDB] The server will still run, but database persistence routes will require a running MongoDB instance.')
    isConnected = false
  }
}

export function isDbConnected() {
  return isConnected
}

