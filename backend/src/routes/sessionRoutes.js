const express = require("express");
const router = express.Router();
const {
  getSessions,
  getStressTrend,
} = require("../controllers/sessionController");

router.get("/", getSessions);
router.get("/trend", getStressTrend);

module.exports = router; 
