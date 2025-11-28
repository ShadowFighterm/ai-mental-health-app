const genAI = require("../config/gemini.js");

const analyzeText = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      systemInstruction: `
You are an emotional wellness analysis model for a mental health mobile app.

Your task:
- Analyze the user's message for emotional state, stress level, and confidence.
- Generate supportive tips and a positive motivational quote.
- Always reply ONLY with a JSON object — no commentary, no markdown.

Return the response using exactly this JSON format:

{
  "stressScore": <0-10 number>,
  "stressLevel": "low" | "medium" | "high",
  "primaryEmotion": "<one emotion word>",
  "confidence": <0-100>,
  "textEmotion": "<emotion detected from user text>",
  "faceEmotion": "unknown",
  "tips": ["tip1", "tip2", "tip3"],
  "quote": "short motivational quote"
}

Rules:
- Keep JSON valid at all times.
- Tips must be short, helpful, actionable, and relevant to the user's message.
- Quote must be encouraging but simple.
- Do NOT return any text outside the JSON.
      `
    });

    const result = await model.generateContent(userMessage);
    const response = result.response;

    return response.text();

  } catch (error) {
    console.error("Gemini text analysis error:", error);
    throw error;
  }
};

module.exports = { analyzeText };
