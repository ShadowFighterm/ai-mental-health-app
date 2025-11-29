// services/faceAnalysis.js
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { analyzeText } = require("./textAnalysis.js");
const LUXAND_API_KEY = process.env.LUXAND_API_KEY;

async function analyzeFaceImage(filePath) {
	if (!filePath) throw new Error("File path is missing");

	const form = new FormData();
	form.append("photo", fs.createReadStream(filePath)); // send as "photo"

	try {
		const response = await axios.post(
			"https://api.luxand.cloud/photo/emotions",
			form,
			{
				headers: {
					token: LUXAND_API_KEY,
					...form.getHeaders(), // include multipart headers
				},
			}
		);

		// ✅ Extract dominant emotion safely
		const faces = response.data?.faces || [];
		let primaryEmotion = "unknown";

		if (faces.length > 0 && faces[0].dominant_emotion) {
			primaryEmotion = faces[0].dominant_emotion;
		}

		const textAnalysisResult = await analyzeText("Face emotion: " + primaryEmotion, "face");
		return textAnalysisResult;

	} catch (error) {
		console.error("Face analysis error:", error.response?.data || error.message);
		throw error;
	}
}

module.exports = { analyzeFaceImage };