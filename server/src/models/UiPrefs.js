import mongoose from 'mongoose'

const uiPrefsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    viewMode: {
      type: String,
      enum: ['map', 'list'],
      default: 'map',
    },
    focusMode: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const UiPrefs = mongoose.model('UiPrefs', uiPrefsSchema)

