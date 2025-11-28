const { analyzeText } = require("../services/textAnalysis.js");

const handleTextPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Text prompt is required." });
    }

    const result = await analyzeText(prompt);

    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to process text." });
  }
};

module.exports = { handleTextPrompt };