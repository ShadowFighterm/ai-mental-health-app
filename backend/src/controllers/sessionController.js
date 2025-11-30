const Session = require("../models/Session");
const sessionService = require("../services/sessionService");

exports.getSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAllSessions();

    res.status(200).json({
      success: true,
      data: sessions
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /sessions/trend (For stress chart)
exports.getStressTrend = async (req, res) => {
  try {
    const trend = await sessionService.getStressTrend();

    // Format for chart
    const formatted = trend.map(s => ({
      time: new Date(s.createdAt).toLocaleTimeString([], { hour: "numeric" }),
      stress: s.stressScore,
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


