// controllers/faceController.js
const { analyzeFaceImage } = require("../services/faceAnalysis");

async function handleFaceUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path; // multer provides this
    const analysis = await analyzeFaceImage(filePath);

    res.json({message: analysis});
  } catch (err) {
    console.error("Face analysis error:", err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { handleFaceUpload };