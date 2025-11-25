const hf = require("../config/huggingface");

exports.analyzeTextService = async (text) => {
    const model = "SamLowe/roberta-base-go_emotions";

    const response = await hf.post(`/${model}`, {
        inputs: text
    });

    // HuggingFace returns an array of emotions with scores
    const data = response.data[0];

    // Pick highest scoring emotion
    const topEmotion = data.reduce((max, obj) =>
        obj.score > max.score ? obj : max
    );

    return {
        emotion: topEmotion.label,
        confidence: Math.round(topEmotion.score * 100),
        raw: data
    };
};
