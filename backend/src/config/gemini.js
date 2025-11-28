const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ModelServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = genAI;




