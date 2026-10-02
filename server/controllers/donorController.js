const Donor = require("../models/Donor");

// POST /api/donors  (create/update donor profile of logged-in user)
const createDonorProfile = async (req, res) => {
  try {
    const { bloodType, city, available } = req.body;

    const donor = await Donor.findOneAndUpdate(
      { user: req.user.id },
      { user: req.user.id, bloodType, city, available },
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
    if (city) filter.city = new RegExp(`^${city}$`, "i");
    if (bloodType) filter.bloodType = bloodType;

    const donors = await Donor.find(filter).populate("user", "name email");
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createDonorProfile, getDonors };
