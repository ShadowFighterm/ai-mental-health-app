const axios = require("axios");
const { analyzeText } = require("./textAnalysis.js");

// Replace with your AssemblyAI API key
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

const analyzeVoice = async (audioBuffer) => {
  try {
    // 1. Upload audio to AssemblyAI
    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      audioBuffer,
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          "content-type": "application/octet-stream",
        },
      }
    );

    const audioUrl = uploadResponse.data.upload_url;

    // 2. Request transcription
    const transcriptionResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: audioUrl },
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    const transcriptId = transcriptionResponse.data.id;

    // 3. Poll until transcription is completed
    let transcriptionResult;
    while (true) {
      const poll = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: ASSEMBLYAI_API_KEY } }
      );

      if (poll.data.status === "completed") {
        transcriptionResult = poll.data.text;
        break;
      } else if (poll.data.status === "failed") {
        throw new Error("Transcription failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds
    }

    // 4. Use the existing text analysis pipeline to analyze the transcription.
    // This keeps analysis logic centralized in `textAnalysis.js`.
	console.log("Transcription Result:", transcriptionResult);
    const textAnalysisResult = await analyzeText(transcriptionResult, "voice");

    // `analyzeText` returns the model text (JSON string). Parse if needed.
    let parsed;
    try {
      parsed = typeof textAnalysisResult === "string" ? JSON.parse(textAnalysisResult) : textAnalysisResult;
    } catch (err) {
      // If parsing fails, throw an informative error
      console.error("Failed to parse text analysis result:", err, textAnalysisResult);
      throw err;
    }

    // Augment the parsed analysis with the original transcription and a voiceEmotion field
    const voiceAnalysis = {
      transcription: transcriptionResult,
      // prefer a direct voiceEmotion if provided; fall back to textEmotion or primaryEmotion
      voiceEmotion: parsed.voiceEmotion || parsed.textEmotion || parsed.primaryEmotion || "unknown",
      ...parsed,
    };

    return voiceAnalysis;
  } catch (error) {
    console.error("Voice analysis error:", error);
    throw error;
  }
};

module.exports = { analyzeVoice };