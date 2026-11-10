import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    generatedRoadmap: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export const Profile = mongoose.model('Profile', profileSchema)

