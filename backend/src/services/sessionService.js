const Session = require("../models/Session.js");

// Save a new session
async function saveSession({ type, input, analysis, notes = "" }) {
  const session = new Session({
    type,
    input,
    analysis,
    notes,
  });

  await session.save();
  return session;
}

// Fetch recent sessions
async function getRecentSessions(limit = 10) {
  return Session.find().sort({ createdAt: -1 }).limit(limit);
}

module.exports = { saveSession, getRecentSessions };
