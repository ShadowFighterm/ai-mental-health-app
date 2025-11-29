// routes/faceRoutes.js
const express = require("express");
const multer = require("multer");
const { handleFaceUpload } = require("../controllers/faceController");

const router = express.Router();

// Always overwrite with the same filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, "face.jpg"); // ✅ always overwrite the same file
  },
});

const upload = multer({ storage });

// The key 'face' must match Postman key
router.post("/analyze", upload.single("face"), handleFaceUpload);

module.exports = router;