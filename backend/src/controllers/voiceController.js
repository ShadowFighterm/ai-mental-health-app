const { analyzeVoiceService } = require('../services/voiceAnalysis');

exports.analyzeVoice = async (req, res) => {
	try {
		const { audio } = req.body;

		if (!audio) {
			return res.status(400).json({ error: 'Audio input is required' });
		}

		const result = await analyzeVoiceService(audio);
		res.json(result);
	} catch (err) {
		console.error('Voice analysis error:', err);
		res.status(500).json({ error: 'Failed to analyze voice' });
	}
};

