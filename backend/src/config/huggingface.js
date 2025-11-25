const axios = require("axios");

const HF_API_KEY = process.env.HF_API_KEY;

const hfClient = axios.create({
  baseURL: "https://api-inference.huggingface.co/models",
  headers: { Authorization: `Bearer ${HF_API_KEY}` }
});

module.exports = hfClient;
