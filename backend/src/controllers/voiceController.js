const { analyzeVoice } = require("../services/voiceAnalysis.js");

const handleVoiceUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const result = await analyzeVoice(req.file.buffer);

    res.json(result);
  } catch (error) {
    console.error("Voice controller error:", error);
    res.status(500).json({ error: "Voice analysis failed", details: error.message });
  }
};

module.exports = { handleVoiceUpload };