const Session = require("../models/Session");

const saveSession = async (sessionData) => {
  const session = new Session(sessionData);
  return await session.save();
};

async function getAllSessions() {
  return await Session.find().sort({ createdAt: -1 });
}

async function getStressTrend() {
  return await Session.find({}, { createdAt: 1, stressScore: 1 })
    .sort({ createdAt: 1 });
}

module.exports = { saveSession, getAllSessions, getStressTrend };
