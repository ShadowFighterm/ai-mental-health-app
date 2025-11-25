const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.warn('MONGO_URI not set in environment; skipping DB connection.');
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.error('DB connection error:', err));
}

module.exports = mongoose;
