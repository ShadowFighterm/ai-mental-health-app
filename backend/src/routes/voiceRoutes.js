const express = require('express');
const router = express.Router();
const { analyzeVoice } = require('../controllers/voiceController');

router.post('/analyze', analyzeVoice);

module.exports = router;

