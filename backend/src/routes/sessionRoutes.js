const express = require("express");
const router = express.Router();
const {
  saveSession,
  getSessions,
} = require("../controllers/sessionController");

router.post("/save", saveSession);
router.get("/list", getSessions);

module.exports = router; 
