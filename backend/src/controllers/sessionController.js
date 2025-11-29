const Session = require("../models/Session");

// Save a session after user completes all 3 analyses
exports.saveSession = async (req, res) => {
  try {
    const {
      userId,
      text,
      voice,
      face,
      overallStress,
      summary,
    } = req.body;

    const session = await Session.create({
      userId,
      text,
      voice,
      face,
      overallStress,
      summary,
    });

    res.status(201).json({
      message: "Session saved successfully",
      session,
    });
  } catch (error) {
    console.error("Save session error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get session history
exports.getSessions = async (req, res) => {
  try {
    const { userId } = req.query;

    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });

    res.json({ sessions });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: error.message });
  }
};
