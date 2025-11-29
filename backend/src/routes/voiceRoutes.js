const express = require('express');
const router = express.Router();
const multer = require("multer");
const { handleVoiceUpload } = require('../controllers/voiceController');

// store audio in /uploads
const upload = multer({ storage: multer.memoryStorage() }); // store in memory

router.post('/analyze', upload.single("voice"), handleVoiceUpload);

module.exports = router;

