const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const textRoutes = require('./routes/textRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const faceRoutes = require('./routes/faceRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.use('/api/text', textRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/face', faceRoutes);

module.exports = app;
