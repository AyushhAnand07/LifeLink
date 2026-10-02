const express = require("express");
const { createRequest, getMatches } = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/:id/matches", getMatches);

module.exports = router;
