const Donor = require("../models/Donor");

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /api/donors  (create/update donor profile of logged-in user)
const createDonorProfile = async (req, res) => {
  try {
    const { bloodType, city, available } = req.body;

    if (!BLOOD_TYPES.includes(bloodType) || !city || String(city).length > 60) {
      return res.status(400).json({ message: "Valid blood type and city are required" });
    }

    const donor = await Donor.findOneAndUpdate(
      { user: req.user.id },
      { user: req.user.id, bloodType, city: String(city).trim(), available: Boolean(available) },
      { new: true, upsert: true }
    );

    res.status(201).json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/donors  (list all donors, optional ?city=&bloodType=)
const getDonors = async (req, res) => {
  try {
    const { city, bloodType } = req.query;
    const filter = { available: true };
    if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, "i");
    if (BLOOD_TYPES.includes(bloodType)) filter.bloodType = bloodType;

    const donors = await Donor.find(filter).populate("user", "name email");
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createDonorProfile, getDonors };