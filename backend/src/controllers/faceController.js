const { analyzeFaceService } = require('../services/faceAnalysis');

exports.analyzeFace = async (req, res) => {
	try {
		const { image } = req.body;

		if (!image) {
			return res.status(400).json({ error: 'Image input is required' });
		}

		const result = await analyzeFaceService(image);
		res.json(result);
	} catch (err) {
		console.error('Face analysis error:', err);
		res.status(500).json({ error: 'Failed to analyze face' });
	}
};

