const express = require("express");
const { handleTextPrompt } = require("../controllers/textController.js");

const router = express.Router();

router.post("/analyze", handleTextPrompt);

module.exports = router;

