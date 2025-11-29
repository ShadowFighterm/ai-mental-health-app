const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "face", "voice"],
    required: true
  },

  // Raw input
  input: {
    type: mongoose.Schema.Types.Mixed,  // { text: "..."} or { image: "..."} etc.
    required: true
  },

  // AI output fields
  analysis: {
    confidence: Number,
    primaryEmotion: String,
    textEmotion: String,
    faceEmotion: String,
    stressLevel: String,       // "low" | "medium" | "high"
    stressScore: Number,       // e.g. 1 → 10
    quote: String,
    tips: [String],            // array of tips
  },

  // Optional user notes (if you add journaling)
  notes: {
    type: String,
    default: ""
  },

  // for displaying "Today, 10:15 AM"
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", sessionSchema);
