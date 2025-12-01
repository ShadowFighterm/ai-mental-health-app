const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "face", "voice"],
    required: true
  },

  // AI output fields
  primaryEmotion: {
    type: String,
    required: true
  },

  stressScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },

  title:{
    type: String,
    required: true
  },

  // for displaying "Today, 10:15 AM"
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", sessionSchema);
