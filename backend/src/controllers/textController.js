const { analyzeTextService } = require("../services/textAnalysis");

exports.analyzeText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Text is required" });
        }

        const result = await analyzeTextService(text);
        res.json(result);

    } catch (err) {
        console.error("Text analysis error:", err);
        res.status(500).json({ error: "Failed to analyze text" });
    }
};
