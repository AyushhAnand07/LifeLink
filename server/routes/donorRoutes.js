const express = require("express");
const { createDonorProfile, getDonors } = require("../controllers/donorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDonorProfile);
router.get("/", protect, getDonors);

module.exports = router;
