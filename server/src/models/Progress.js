import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    completedTopicIds: {
      type: [String],
      default: [],
    },
    lastVisitedFieldId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const Progress = mongoose.model('Progress', progressSchema)

